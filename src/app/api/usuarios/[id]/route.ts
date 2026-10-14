import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { actualizarUsuario, eliminarUsuario, obtenerUsuarioPorId } from "@/lib/users";

const UpdateUserSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(120).optional(),
  cargo: z.string().trim().max(100).optional(),
  telefono: z.string().trim().max(40).optional(),
  role: z.enum(["admin", "evaluador"]).optional(),
  activo: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado." }, { status: 403 });
  }

  const { id } = await params;
  const target = obtenerUsuarioPorId(id);
  if (!target) {
    return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
  }

  try {
    const rawBody = await req.json();
    const parsed = UpdateUserSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Datos inválidos." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (target.id === session.userId || target.username === "admin") {
      if (data.activo === false) {
        return NextResponse.json(
          { error: "Operación rechazada: no puede bloquear su propia cuenta ni el administrador principal." },
          { status: 400 }
        );
      }
      if (data.role && data.role !== "admin") {
        return NextResponse.json(
          { error: "Operación rechazada: no puede revocar privilegios de administrador de esta cuenta." },
          { status: 400 }
        );
      }
    }

    const updated = actualizarUsuario(id, data as Parameters<typeof actualizarUsuario>[1]);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error al actualizar usuario.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado." }, { status: 403 });
  }

  const { id } = await params;
  const target = obtenerUsuarioPorId(id);
  if (!target) {
    return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
  }

  if (target.id === session.userId || target.username === "admin") {
    return NextResponse.json(
      { error: "No es posible eliminar su propia cuenta o la cuenta principal de administración." },
      { status: 400 }
    );
  }

  try {
    const ok = eliminarUsuario(id);
    if (!ok) {
      return NextResponse.json({ error: "No se pudo eliminar el usuario." }, { status: 400 });
    }
    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error al eliminar usuario.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
