import { NextRequest, NextResponse } from "next/server";
import { crearEntrevista } from "@/lib/store";
import { generateToken } from "@/lib/utils";
import { listarEntrevistas } from "@/lib/store";

export async function GET() {
  return NextResponse.json(listarEntrevistas());
}

export async function POST(req: NextRequest) {
  const { entidadSolicitante } = await req.json();
  if (!entidadSolicitante) {
    return NextResponse.json({ error: "entidadSolicitante requerida" }, { status: 400 });
  }
  const token = generateToken();
  const entrevista = crearEntrevista(entidadSolicitante, token);
  return NextResponse.json(entrevista, { status: 201 });
}
