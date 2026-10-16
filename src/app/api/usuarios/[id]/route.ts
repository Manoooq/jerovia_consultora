import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import {
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorId,
} from "@/lib/users";
import { registrarEventoAuditoria } from "@/lib/audit";
import { enforceRateLimit, getClientIp, parseSafeJson } from "@/lib/apiSecurity";

const UpdateUserSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(140).optional(),
  role: z.enum(["admin", "evaluador"]).optional(),
  activo: z.boolean().optional(),
  cargo: z.string().trim().max(100).optional(),
  telefono: z.string().trim().max(40).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateErr = enforceRateLimit(req, "user-patch", 30, 60_000);
  if (rateErr) return rateErr;

  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: "Acceso restringido a administradores." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const target = obtenerUsuarioPorId(id);
  if (!target) {
    return NextResponse.json(
      { error: "Usuario no encontrado." },
      { status: 404 }
    );
  }

  const { data: rawBody, errorResponse } = await parseSafeJson(req, 32_768);
  if (errorResponse) return errorResponse;

  const parsed = UpdateUserSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Datos inválidos." },
      { status: 400 }
    );
  }

  // Prevenir que el administrador principal o el propio usuario en sesión se bloquee a sí mismo
  if (
    (target.username === "admin" || target.id === session.userId) &&
    (parsed.data.activo === false || parsed.data.role === "evaluador")
  ) {
    return NextResponse.json(
      {
        error:
          "Por seguridad, no puede desactivar ni quitar permisos de administrador a su propia cuenta activa.",
      },
      { status: 400 }
    );
  }

  const updated = actualizarUsuario(id, parsed.data);
  if (!updated) {
    return NextResponse.json(
      { error: "No se pudo actualizar el usuario." },
      { status: 400 }
    );
  }

  registrarEventoAuditoria({
    userId: session.userId,
    userName: session.name,
    userRole: session.role,
    action: parsed.data.activo !== undefined ? "TOGGLE_USER" : "UPDATE_USER",
    detail: `Actualización de usuario ${updated.name} (@${updated.username}).`,
    ip: getClientIp(req),
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateErr = enforceRateLimit(req, "user-delete", 15, 60_000);
  if (rateErr) return rateErr;

  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: "Acceso restringido a administradores." },
      { status: 403 }
    );
  }

  const { id } = await params;
  if (id === session.userId) {
    return NextResponse.json(
      { error: "No puede eliminar su propia cuenta en sesión." },
      { status: 400 }
    );
  }

  try {
    const target = obtenerUsuarioPorId(id);
    const ok = eliminarUsuario(id);
    if (!ok) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    registrarEventoAuditoria({
      userId: session.userId,
      userName: session.name,
      userRole: session.role,
      action: "TOGGLE_USER",
      detail: `Eliminación de cuenta @${target?.username || id}.`,
      ip: getClientIp(req),
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error al eliminar.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
