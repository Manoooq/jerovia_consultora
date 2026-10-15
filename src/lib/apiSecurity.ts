import { NextRequest, NextResponse } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Extrae la IP del cliente de forma segura priorizando cabeceras de proxy inverso confiables.
 */
export function getClientIp(req: NextRequest): string {
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 64);

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return "127.0.0.1";
}

/**
 * Control de tasa de peticiones en memoria (ventana fija ligera).
 */
export function enforceRateLimit(
  req: NextRequest,
  scope: string,
  maxRequests = 60,
  windowMs = 60_000
): NextResponse | null {
  const now = Date.now();
  const key = `${scope}:${getClientIp(req)}`;

  // Limpieza oportunista para evitar crecimiento de memoria
  if (buckets.size > 2000) {
    for (const [k, v] of buckets.entries()) {
      if (v.resetAt <= now) buckets.delete(k);
    }
  }

  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  current.count += 1;
  if (current.count > maxRequests) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intente nuevamente en unos segundos." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    );
  }

  return null;
}

/**
 * Lee y valida el tamaño del JSON entrante para evitar ataques DoS por payloads excesivos.
 */
export async function parseSafeJson<T = unknown>(
  req: NextRequest,
  maxBytes = 2_500_000
): Promise<{ data?: T; errorResponse?: NextResponse }> {
  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > maxBytes) {
    return {
      errorResponse: NextResponse.json(
        { error: "El tamaño de los datos enviados excede el límite permitido." },
        { status: 413 }
      ),
    };
  }

  try {
    const text = await req.text();
    if (text.length > maxBytes) {
      return {
        errorResponse: NextResponse.json(
          { error: "El tamaño de los datos enviados excede el límite permitido." },
          { status: 413 }
        ),
      };
    }
    return { data: JSON.parse(text) as T };
  } catch {
    return {
      errorResponse: NextResponse.json(
        { error: "Formato JSON inválido." },
        { status: 400 }
      ),
    };
  }
}
