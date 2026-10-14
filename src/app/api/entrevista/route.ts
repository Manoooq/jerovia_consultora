import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import {
  crearEntrevista,
  actualizarEntrevista,
  listarEntrevistas,
  listarEntrevistasPorEvaluador,
} from "@/lib/store";
import { generateToken } from "@/lib/utils";

const CreateEntrevistaSchema = z.object({
  entidadSolicitante: z.string().trim().min(2, "La entidad solicitante es requerida.").max(120),
  evaluadorAsignado: z.string().trim().max(120).optional(),
  candidatoNombre: z.string().trim().max(140).optional(),
  cedula: z.string().trim().max(30).optional(),
  telefono: z.string().trim().max(40).optional(),
  ciudad: z.string().trim().max(80).optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "No autorizado. Inicie sesión para ver las visitas." },
      { status: 401 }
    );
  }

  if (session.role === "admin") {
    return NextResponse.json(listarEntrevistas());
  }

  return NextResponse.json(listarEntrevistasPorEvaluador(session.name));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { error: "Acceso denegado: solo administradores pueden generar enlaces de evaluación." },
      { status: 403 }
    );
  }

  try {
    const rawBody = await req.json();
    const parsed = CreateEntrevistaSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Datos de entrada inválidos." },
        { status: 400 }
      );
    }

    const { entidadSolicitante, evaluadorAsignado, candidatoNombre, cedula, telefono, ciudad } =
      parsed.data;

    const token = generateToken();
    const perito = evaluadorAsignado || session.name;

    let entrevista = crearEntrevista(entidadSolicitante, token, perito, session.username);

    if (candidatoNombre || cedula || telefono || ciudad) {
      const partesNombre = (candidatoNombre || "").trim().split(/\s+/);
      const patchPayload = {
        candidatoNombre,
        cedula,
        telefono,
        ciudad,
        evaluadorAsignado: perito,
        datos: {
          nombre: partesNombre[0] || "",
          apellido: partesNombre.slice(1).join(" ") || "",
          cedula: cedula || "",
          telefono: telefono || "",
          ciudad: ciudad || "Luque",
          consultorNombre: perito,
        },
      } as Parameters<typeof actualizarEntrevista>[1];

      const updated = actualizarEntrevista(token, patchPayload);
      if (updated) entrevista = updated;
    }

    return NextResponse.json(entrevista, { status: 201 });
  } catch (err) {
    console.error("[POST /api/entrevista error]:", err);
    return NextResponse.json({ error: "Error interno al crear visita." }, { status: 500 });
  }
}
