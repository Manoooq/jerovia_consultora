import { cookies } from "next/headers";
import type { SafeUser, UserRole } from "@/lib/users";

export const AUTH_COOKIE = "jerovia_session";
const SECRET =
  process.env.AUTH_SECRET || "jerovia_secret_key_prod_2026_super_secure";
const MAX_SESSION_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 días máximo

export interface SessionPayload {
  userId: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: number;
}

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

export async function signAuthToken(
  payload: Record<string, unknown>
): Promise<string> {
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
    b64Sig = btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  const b64Payload = toBase64Url(jsonStr);
  return `${b64Payload}.${b64Sig}`;
}

export async function verifyAuthToken(
  token: string
): Promise<SessionPayload | null> {
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
    const parsed = JSON.parse(payloadStr) as SessionPayload;

    // Verificar expiración temporal del token
    if (
      !parsed.createdAt ||
      Date.now() - parsed.createdAt > MAX_SESSION_AGE_MS
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function createSession(user: SafeUser, remember = false) {
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 1;
  const payload: SessionPayload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: Date.now(),
  };

  const token = await signAuthToken(
    payload as unknown as Record<string, unknown>
  );

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function createAdminSession(email: string, remember = false) {
  return createSession(
    {
      id: "usr_admin_01",
      username: "admin",
      email,
      name: "Lic. Michelle Romero",
      role: "admin",
      activo: true,
      creadoEn: new Date().toISOString(),
    },
    remember
  );
}

export async function removeSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export const removeAdminSession = removeSession;

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) return null;
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

export const getAdminSession = getSession;
