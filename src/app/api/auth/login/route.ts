import { NextRequest, NextResponse } from "next/server";
import { verificarCredenciales } from "@/lib/users";
import { createSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "localhost";
    const rateCheck = checkRateLimit(`login_${ip}`, 8, 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Demasiados intentos fallidos. Por seguridad, intente nuevamente en ${rateCheck.retryAfterSec} segundos.`,
        },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSec) } }
      );
    }

    const { username, password, remember } = await req.json();
    const identifier = (username || "").trim();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Debe ingresar su usuario o correo y su contraseña." },
        { status: 400 }
      );
    }

    const user = await verificarCredenciales(identifier, password);

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas o cuenta desactivada. Verifique sus datos con la administración." },
        { status: 401 }
      );
    }

    // Crear sesión autenticada con rol (admin o evaluador)
    await createSession(user, !!remember);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
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
