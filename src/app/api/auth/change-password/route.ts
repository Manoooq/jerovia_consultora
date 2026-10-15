import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  cambiarContrasena,
  obtenerUsuarioPorId,
  verifyPassword,
} from "@/lib/users";
import { registrarEventoAuditoria } from "@/lib/audit";
import { enforceRateLimit, getClientIp, parseSafeJson } from "@/lib/apiSecurity";

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, "auth-change-pwd", 10, 60_000);
  if (rateErr) return rateErr;

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { data: body, errorResponse } = await parseSafeJson<{
    passwordActual?: string;
    nuevaPassword?: string;
  }>(req, 16_384);
  if (errorResponse) return errorResponse;

  try {
    const passwordActual = body?.passwordActual || "";
    const nuevaPassword = body?.nuevaPassword || "";

    if (!passwordActual || !nuevaPassword) {
      return NextResponse.json(
        { error: "Debe ingresar su contraseña actual y la nueva contraseña." },
        { status: 400 }
      );
    }

    if (nuevaPassword.length < 6 || nuevaPassword.length > 128) {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener entre 6 y 128 caracteres." },
        { status: 400 }
      );
    }

    const user = obtenerUsuarioPorId(session.userId);
    if (!user || !user.activo) {
      return NextResponse.json(
        { error: "Usuario no válido." },
        { status: 404 }
      );
    }

    const esValida = await verifyPassword(
      passwordActual,
      user.passwordHash,
      user.passwordSalt
    );
    if (!esValida) {
      return NextResponse.json(
        {
          error:
            "La contraseña actual no coincide. Verifíquela e intente nuevamente.",
        },
        { status: 400 }
      );
    }

    await cambiarContrasena(user.id, nuevaPassword);

    registrarEventoAuditoria({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "RESET_PASSWORD",
      detail: `Actualización de contraseña propia (@${user.username}).`,
      ip: getClientIp(req),
    });

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada exitosamente.",
    });
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Error al cambiar contraseña.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
