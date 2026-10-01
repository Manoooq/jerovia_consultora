import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { crearEntrevista, listarEntrevistas, listarEntrevistasPorEvaluador } from "@/lib/store";
import { generateToken } from "@/lib/utils";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado. Inicie sesión para ver las visitas." }, { status: 401 });
  }

  // Si es administrador, tiene acceso completo a todas las visitas y formularios
  if (session.role === "admin") {
    return NextResponse.json(listarEntrevistas());
  }

  // Si es evaluador, solo ve las visitas asignadas a su nombre
  const asignadas = listarEntrevistasPorEvaluador(session.name);
  return NextResponse.json(asignadas);
}

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  // REGLA CRÍTICA: Solo administradores pueden generar nuevos enlaces de visitas
  if (session.role !== "admin") {
    return NextResponse.json(
      { error: "Acceso denegado: solo los usuarios administradores pueden generar enlaces de evaluación." },
      { status: 403 }
    );
  }

  try {
    const { entidadSolicitante, evaluadorAsignado } = await req.json();
    if (!entidadSolicitante) {
      return NextResponse.json({ error: "La entidad solicitante es requerida." }, { status: 400 });
    }

    const token = generateToken();
    const entrevista = crearEntrevista(
      entidadSolicitante,
      token,
      evaluadorAsignado || session.name,
      session.username
    );

    return NextResponse.json(entrevista, { status: 201 });
  } catch (err) {
    console.error("[POST /api/entrevista error]:", err);
    return NextResponse.json({ error: "Error interno al crear visita." }, { status: 500 });
  }
}
