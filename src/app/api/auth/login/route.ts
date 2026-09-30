import { NextRequest, NextResponse } from "next/server";
import { ADMIN_USER, createAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, remember } = await req.json();
    const identifier = (username || email || "").toLowerCase().trim();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Debe ingresar su usuario o correo y su contraseña." },
        { status: 400 }
      );
    }

    const identifierMatch =
      identifier === ADMIN_USER.username.toLowerCase() ||
      identifier === ADMIN_USER.email.toLowerCase();
    const passwordMatch = password === ADMIN_USER.password;

    if (!identifierMatch || !passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales de administrador inválidas. Verifique sus datos." },
        { status: 401 }
      );
    }

    // Crear sesión autenticada con duración configurable
    await createAdminSession(ADMIN_USER.email, !!remember);

    return NextResponse.json({
      success: true,
      user: {
        username: ADMIN_USER.username,
        email: ADMIN_USER.email,
        name: ADMIN_USER.name,
        role: ADMIN_USER.role,
      },
    });
  } catch (err) {
    console.error("[Login error]:", err);
    return NextResponse.json(
      { error: "Error interno en el servidor de autenticación." },
      { status: 500 }
    );
  }
}
