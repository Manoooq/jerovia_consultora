import { NextRequest, NextResponse } from "next/server";
import { analizarImagen } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "localhost";
    const rateCheck = checkRateLimit(`ai_foto_${ip}`, 20, 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Límite de solicitudes alcanzado. Reintente en ${rateCheck.retryAfterSec} segundos.` },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSec) } }
      );
    }

    const { imagen, tipo } = await req.json();
    if (!imagen || !tipo) return NextResponse.json({ error: "Imagen y tipo requeridos" }, { status: 400 });
    if (!["vivienda", "factura"].includes(tipo)) return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });

    const data = await analizarImagen(imagen, tipo);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/ai/analizar-foto]", err);
    return NextResponse.json({ error: "Error al analizar imagen" }, { status: 500 });
  }
}
