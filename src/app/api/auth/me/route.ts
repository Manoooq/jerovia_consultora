import { NextResponse } from "next/server";
import { getSession, removeSession } from "@/lib/auth";
import { obtenerUsuarioPorId } from "@/lib/users";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
  }

  // Verificar que la cuenta siga existiendo y no haya sido bloqueada por un administrador
  const dbUser = obtenerUsuarioPorId(session.userId);
  if (!dbUser || !dbUser.activo) {
    await removeSession();
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      userId: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
    },
  });
}
