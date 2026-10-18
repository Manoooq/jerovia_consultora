import cloudConfig from "./cloudConfig.json";

interface CloudConfigShape {
  gistId?: string;
  cipherHex?: string;
  backupObjectUrl?: string;
  jsonBlobUrl?: string;
  backupBlobUrl?: string;
}

interface GistFileEntry {
  filename?: string;
  content?: string;
  truncated?: boolean;
  raw_url?: string;
}

interface GistResponse {
  id?: string;
  files?: Record<string, GistFileEntry>;
}

const XOR_KEY = "JeroviaConsultora_2026_CloudKey_Paraguay_v4";

export function resolveGistAuthToken(): string {
  if (process.env.JEROVIA_GIST_TOKEN) {
    return process.env.JEROVIA_GIST_TOKEN.trim();
  }
  const hex = (cloudConfig as CloudConfigShape).cipherHex || "";
  if (!hex) return "";
  try {
    const cipherBytes = Buffer.from(hex, "hex");
    const keyBytes = Buffer.from(XOR_KEY, "utf-8");
    const out = Buffer.alloc(cipherBytes.length);
    for (let i = 0; i < cipherBytes.length; i++) {
      out[i] = cipherBytes[i] ^ keyBytes[i % keyBytes.length];
    }
    return out.toString("utf-8").trim();
  } catch {
    return "";
  }
}

export const GIST_ID =
  process.env.JEROVIA_GIST_ID || (cloudConfig as CloudConfigShape).gistId || "";
export const GIST_TOKEN = resolveGistAuthToken();

export function getGistHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Jerovia-Consultora-CloudPersistence",
    "Cache-Control": "no-cache, no-store, must-revalidate",
  };
  if (GIST_TOKEN) {
    headers.Authorization = `Bearer ${GIST_TOKEN}`;
  }
  return headers;
}

/**
 * Lee un archivo JSON específico directamente desde el Gist con reintentos y soporte para archivos grandes truncados.
 */
export async function fetchGistJsonFile<T>(filename: string): Promise<T | null> {
  if (!GIST_ID) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(
      `https://api.github.com/gists/${GIST_ID}?_t=${Date.now()}`,
      {
        method: "GET",
        headers: getGistHeaders(),
        cache: "no-store",
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    if (!res.ok) return null;
    const gist = (await res.json()) as GistResponse;
    const entry = gist.files?.[filename];
    if (!entry) return null;

    if (entry.truncated && entry.raw_url) {
      const rawRes = await fetch(`${entry.raw_url}?_t=${Date.now()}`, {
        cache: "no-store",
      });
      if (rawRes.ok) {
        return (await rawRes.json()) as T;
      }
    }

    if (typeof entry.content === "string" && entry.content.trim()) {
      return JSON.parse(entry.content) as T;
    }
  } catch {}
  return null;
}

/**
 * Actualiza uno o más archivos en el Gist atómicamente.
 */
export async function saveGistFiles(
  files: Record<string, { content: string } | null>
): Promise<boolean> {
  if (!GIST_ID || !GIST_TOKEN) return false;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5500);
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: "PATCH",
      headers: getGistHeaders(),
      body: JSON.stringify({ files }),
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}
