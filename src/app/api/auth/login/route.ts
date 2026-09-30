import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_ADMIN, createAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Debe ingresar usuario y contraseña" },
        { status: 400 }
      );
    }

    const emailMatch =
      email.toLowerCase().trim() === DEFAULT_ADMIN.email.toLowerCase() ||
      email.toLowerCase().trim() === "admin";
    const passwordMatch = password === DEFAULT_ADMIN.password;

    if (!emailMatch || !passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales incorrectas. Verifique usuario o contraseña." },
        { status: 401 }
      );
    }

    // Crear sesión autenticada
    await createAdminSession(DEFAULT_ADMIN.email);

    return NextResponse.json({
      success: true,
      user: {
        email: DEFAULT_ADMIN.email,
        name: DEFAULT_ADMIN.name,
        role: DEFAULT_ADMIN.role,
      },
    });
  } catch (err) {
    console.error("[Login error]:", err);
    return NextResponse.json(
      { error: "Error en el servidor de autenticación" },
      { status: 500 }
    );
  }
}
