import { NextRequest, NextResponse } from "next/server";
import { analizarImagen } from "@/lib/gemini";
import { enforceRateLimit, parseSafeJson } from "@/lib/apiSecurity";

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, "ai-foto", 20, 60_000);
  if (rateErr) return rateErr;

  const { data: body, errorResponse } = await parseSafeJson<{
    imagen?: string;
    tipo?: string;
  }>(req, 4_000_000);
  if (errorResponse) return errorResponse;

  const imagen = body?.imagen;
  const tipo = body?.tipo;

  if (!imagen || typeof imagen !== "string") {
    return NextResponse.json({ error: "Imagen requerida." }, { status: 400 });
  }
  if (tipo !== "vivienda" && tipo !== "factura") {
    return NextResponse.json({ error: "Tipo inválido." }, { status: 400 });
  }

  try {
    const data = await analizarImagen(imagen, tipo);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/ai/analizar-foto]", err);
    return NextResponse.json(
      { error: "Error al analizar la imagen." },
      { status: 500 }
    );
  }
}
