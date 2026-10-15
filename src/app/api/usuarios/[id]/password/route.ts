import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { cambiarContrasena, obtenerUsuarioPorId } from "@/lib/users";
import { enforceRateLimit, parseSafeJson } from "@/lib/apiSecurity";

const PasswordSchema = z.object({
  password: z
    .string()
    .min(6, "La nueva contraseña debe tener al menos 6 caracteres.")
    .max(128, "La contraseña excede la longitud máxima."),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateErr = enforceRateLimit(req, "user-pwd-reset", 15, 60_000);
  if (rateErr) return rateErr;

  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: "Acceso denegado: solo administradores." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const user = obtenerUsuarioPorId(id);
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
  }

  const { data: rawBody, errorResponse } = await parseSafeJson(req, 16_384);
  if (errorResponse) return errorResponse;

  const parsed = PasswordSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Contraseña inválida." },
      { status: 400 }
    );
  }

  try {
    await cambiarContrasena(id, parsed.data.password);
    return NextResponse.json({
      success: true,
      message: `Contraseña de ${user.name} actualizada.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error al cambiar contraseña.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
