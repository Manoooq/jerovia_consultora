import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { actualizarUsuario, eliminarUsuario, obtenerUsuarioPorId } from "@/lib/users";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado." }, { status: 403 });
  }

  const { id } = await params;
  const user = obtenerUsuarioPorId(id);

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
  }

  try {
    const body = await req.json();
    const updated = actualizarUsuario(id, body);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error al actualizar usuario.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(
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
