import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { cambiarContrasena, obtenerUsuarioPorId, verifyPassword } from "@/lib/users";

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { passwordActual, nuevaPassword } = await req.json();

    if (!passwordActual || !nuevaPassword) {
      return NextResponse.json(
        { error: "Debe ingresar su contraseña actual y la nueva contraseña." },
        { status: 400 }
      );
    }

    if (nuevaPassword.length < 6) {
      return NextResponse.json(
        { error: "La nueva contraseña debe contener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    const user = obtenerUsuarioPorId(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }

    const esValida = await verifyPassword(passwordActual, user.passwordHash, user.passwordSalt);
    if (!esValida) {
      return NextResponse.json(
        { error: "La contraseña actual no coincide. Verifíquela e intente nuevamente." },
        { status: 400 }
      );
    }

    await cambiarContrasena(user.id, nuevaPassword);

    return NextResponse.json({ success: true, message: "Contraseña actualizada exitosamente." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error al cambiar contraseña.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
