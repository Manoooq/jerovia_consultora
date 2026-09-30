import { cookies } from "next/headers";

const AUTH_COOKIE = "jerovia_session";
const SECRET = process.env.AUTH_SECRET || "jerovia_secret_key_prod_2026_super_secure";

export const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL || "admin@jerovia.com.py",
  password: process.env.ADMIN_PASSWORD || "jerovia2026",
  name: "Lic. Michelle Romero",
  role: "Consultora Administradora",
};

/**
 * Genera un token HMAC firmado usando Web Crypto API (compatible con Edge y Node)
 */
async function signToken(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const b64Sig = Buffer.from(signature).toString("base64url");
  const b64Payload = Buffer.from(payload).toString("base64url");
  return `${b64Payload}.${b64Sig}`;
}

/**
 * Verifica un token firmado
 */
export async function verifyToken(token: string): Promise<string | null> {
  try {
    const [b64Payload, b64Sig] = token.split(".");
    if (!b64Payload || !b64Sig) return null;

    const payload = Buffer.from(b64Payload, "base64url").toString("utf-8");
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      Buffer.from(b64Sig, "base64url"),
      enc.encode(payload)
    );

    return valid ? payload : null;
  } catch {
    return null;
  }
}

/**
 * Establece la cookie de sesión del administrador
 */
export async function createAdminSession(email: string) {
  const token = await signToken(JSON.stringify({ email, timestamp: Date.now() }));
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

/**
 * Elimina la cookie de sesión
 */
export async function removeAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

/**
 * Obtiene la sesión actual desde el servidor
 */
export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) return null;
    const verified = await verifyToken(token);
    if (!verified) return null;
    return JSON.parse(verified) as { email: string; timestamp: number };
  } catch {
    return null;
  }
}
