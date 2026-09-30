import { cookies } from "next/headers";

export const AUTH_COOKIE = "jerovia_session";
const SECRET = process.env.AUTH_SECRET || "jerovia_secret_key_prod_2026_super_secure";

export const ADMIN_USER = {
  username: process.env.ADMIN_USERNAME || "admin",
  email: process.env.ADMIN_EMAIL || "admin@jerovia.com.py",
  password: process.env.ADMIN_PASSWORD || "jerovia2026",
  name: process.env.ADMIN_NAME || "Lic. Michelle Romero",
  role: "Administrador General",
};

export const DEFAULT_ADMIN = ADMIN_USER;

/**
 * Codificación Base64URL portable para Node y Edge
 */
function toBase64Url(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str).toString("base64url");
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(b64, "base64url").toString("utf-8");
  }
  const clean = b64.replace(/-/g, "+").replace(/_/g, "/");
  return atob(clean);
}

/**
 * Genera un token HMAC firmado usando Web Crypto API (Edge & Node compatible)
 */
export async function signAuthToken(payload: Record<string, unknown>): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const jsonStr = JSON.stringify(payload);
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(jsonStr));
  
  let b64Sig: string;
  if (typeof Buffer !== "undefined") {
    b64Sig = Buffer.from(signature).toString("base64url");
  } else {
    const bytes = new Uint8Array(signature);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    b64Sig = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  const b64Payload = toBase64Url(jsonStr);
  return `${b64Payload}.${b64Sig}`;
}

/**
 * Verifica un token firmado usando Web Crypto API
 */
export async function verifyAuthToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const [b64Payload, b64Sig] = token.split(".");
    if (!b64Payload || !b64Sig) return null;

    const payloadStr = fromBase64Url(b64Payload);
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Decodificar firma de forma compatible con BufferSource
    let sigBytes: Uint8Array;
    if (typeof Buffer !== "undefined") {
      sigBytes = Uint8Array.from(Buffer.from(b64Sig, "base64url"));
    } else {
      const bin = atob(b64Sig.replace(/-/g, "+").replace(/_/g, "/"));
      sigBytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        sigBytes[i] = bin.charCodeAt(i);
      }
    }

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      enc.encode(payloadStr)
    );

    if (!valid) return null;
    return JSON.parse(payloadStr);
  } catch {
    return null;
  }
}

/**
 * Establece la cookie de sesión del administrador
 */
export async function createAdminSession(email: string, remember = false) {
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 1; // 30 días o 24 horas
  const token = await signAuthToken({
    email,
    username: ADMIN_USER.username,
    name: ADMIN_USER.name,
    role: ADMIN_USER.role,
    createdAt: Date.now(),
  });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
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
    const verified = await verifyAuthToken(token);
    return verified;
  } catch {
    return null;
  }
}
