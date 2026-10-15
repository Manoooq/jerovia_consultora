import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { obtenerEntrevista, actualizarEntrevista, eliminarEntrevista } from "@/lib/store";
import { enforceRateLimit, parseSafeJson } from "@/lib/apiSecurity";

const TokenParamSchema = z.string().trim().min(2).max(128).regex(/^[a-zA-Z0-9_-]+$/);

const PublicPatchSchema = z.object({
  candidatoNombre: z.string().trim().max(140).optional(),
  cedula: z.string().trim().max(30).optional(),
  telefono: z.string().trim().max(40).optional(),
  ciudad: z.string().trim().max(80).optional(),
  pasoActual: z.number().int().min(1).max(9).optional(),
  estado: z.enum(["pendiente", "en_progreso", "completado"]).optional(),
  datos: z.record(z.string(), z.unknown()).optional(),
});

const AdminPatchSchema = PublicPatchSchema.extend({
  entidadSolicitante: z.string().trim().min(2).max(120).optional(),
  evaluadorAsignado: z.string().trim().min(2).max(120).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const rateErr = enforceRateLimit(req, "entrevista-get", 90, 60_000);
  if (rateErr) return rateErr;

  const { token } = await params;
  if (!TokenParamSchema.safeParse(token).success) {
    return NextResponse.json({ error: "Formato de token inválido." }, { status: 400 });
  }

  const entrevista = obtenerEntrevista(token);
  if (!entrevista) {
    return NextResponse.json({ error: "Visita no encontrada." }, { status: 404 });
  }
  return NextResponse.json(entrevista);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const rateErr = enforceRateLimit(req, "entrevista-patch", 60, 60_000);
  if (rateErr) return rateErr;

  const { token } = await params;
  if (!TokenParamSchema.safeParse(token).success) {
    return NextResponse.json({ error: "Formato de token inválido." }, { status: 400 });
  }

  const actual = obtenerEntrevista(token);
  if (!actual) {
    return NextResponse.json({ error: "Visita no encontrada." }, { status: 404 });
  }

  const { data: rawBody, errorResponse } = await parseSafeJson(req, 3_000_000);
  if (errorResponse) return errorResponse;

  try {
    const session = await getSession();
    const isAdmin = session?.role === "admin";

    const parsed = isAdmin
      ? AdminPatchSchema.safeParse(rawBody)
      : PublicPatchSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Datos de actualización inválidos." },
        { status: 400 }
      );
    }

    const updated = actualizarEntrevista(
      token,
      parsed.data as Parameters<typeof actualizarEntrevista>[1]
    );
    if (!updated) {
      return NextResponse.json({ error: "No se pudo actualizar la visita." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/entrevista/[token] error]:", err);
    return NextResponse.json({ error: "Error al actualizar visita." }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const rateErr = enforceRateLimit(req, "entrevista-delete", 20, 60_000);
  if (rateErr) return rateErr;

  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: "Acceso denegado: solo administradores pueden eliminar expedientes." },
      { status: 403 }
    );
  }

  const { token } = await params;
  if (!TokenParamSchema.safeParse(token).success) {
    return NextResponse.json({ error: "Formato de token inválido." }, { status: 400 });
  }

  const ok = eliminarEntrevista(token);
  if (!ok) {
    return NextResponse.json({ error: "Expediente no encontrado." }, { status: 404 });
  }

  return NextResponse.json({ success: true, deletedToken: token });
}
