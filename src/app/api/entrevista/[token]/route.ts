import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { obtenerEntrevista, actualizarEntrevista, eliminarEntrevista } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const entrevista = obtenerEntrevista(token);
  if (!entrevista) return NextResponse.json({ error: "Visita no encontrada." }, { status: 404 });
  return NextResponse.json(entrevista);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  try {
    const body = await req.json();
    const updated = actualizarEntrevista(token, body);
    if (!updated) return NextResponse.json({ error: "Visita no encontrada." }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error al actualizar visita.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: "Acceso denegado: solo administradores pueden eliminar registros de visitas." },
      { status: 403 }
    );
  }

  const { token } = await params;
  const deleted = eliminarEntrevista(token);
  if (!deleted) {
    return NextResponse.json({ error: "No se encontró el registro para eliminar." }, { status: 404 });
  }

  return NextResponse.json({ success: true, token });
}
