import { NextRequest, NextResponse } from "next/server";
import { detectarInconsistencias } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const datos = await req.json();
    const alertas = await detectarInconsistencias(datos);
    return NextResponse.json({ alertas });
  } catch {
    return NextResponse.json({ alertas: [] });
  }
}
