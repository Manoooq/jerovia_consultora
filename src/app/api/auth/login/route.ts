import { NextRequest, NextResponse } from "next/server";
import { verificarCredenciales } from "@/lib/users";
import { createSession } from "@/lib/auth";
import { registrarEventoAuditoria } from "@/lib/audit";
import { enforceRateLimit, getClientIp, parseSafeJson } from "@/lib/apiSecurity";

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, "auth-login", 8, 60_000);
  if (rateErr) return rateErr;

  const { data: body, errorResponse } = await parseSafeJson<{
    username?: string;
    password?: string;
    remember?: boolean;
  }>(req, 16_384);
  if (errorResponse) return errorResponse;

  try {
    const identifier = (body?.username || "").trim();
    const password = body?.password || "";

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Debe ingresar su usuario o correo y su contraseña." },
        { status: 400 }
      );
    }

    const user = await verificarCredenciales(identifier, password);
    if (!user) {
      return NextResponse.json(
        {
          error:
            "Credenciales inválidas o cuenta desactivada. Verifique sus datos.",
        },
        { status: 401 }
      );
    }

    await createSession(user, Boolean(body?.remember));

    registrarEventoAuditoria({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "LOGIN",
      detail: `Inicio de sesión exitoso (@${user.username}).`,
      ip: getClientIp(req),
    });

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
