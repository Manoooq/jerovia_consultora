import { NextRequest, NextResponse } from "next/server";
import { obtenerEntrevista, actualizarEntrevista } from "@/lib/store";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const entrevista = obtenerEntrevista(token);
  if (!entrevista) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(entrevista);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const body = await req.json();
  const updated = actualizarEntrevista(token, body);
  if (!updated) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(updated);
}
