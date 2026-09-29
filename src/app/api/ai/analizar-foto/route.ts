import { NextRequest, NextResponse } from "next/server";
import { analizarImagen } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
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
