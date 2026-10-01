import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { cambiarContrasena, obtenerUsuarioPorId } from "@/lib/users";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado: solo administradores." }, { status: 403 });
  }

  const { id } = await params;
  const user = obtenerUsuarioPorId(id);

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
  }

  try {
    const { password } = await req.json();
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    await cambiarContrasena(id, password);

    return NextResponse.json({ success: true, message: `Contraseña de ${user.name} actualizada.` });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error al cambiar contraseña.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
