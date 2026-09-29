import { NextRequest, NextResponse } from "next/server";
import { generarSintesis } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const datos = await req.json();
    const sintesis = await generarSintesis(datos);
    return NextResponse.json({ sintesis });
  } catch (err) {
    console.error("[/api/ai/sintetizar]", err);
    return NextResponse.json({ error: "Error al generar síntesis" }, { status: 500 });
  }
}
