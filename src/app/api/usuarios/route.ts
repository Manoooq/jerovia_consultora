import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  type UserRole,
} from "@/lib/users";

const CreateUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "El usuario debe tener al menos 3 caracteres.")
    .max(40)
    .regex(/^[a-zA-Z0-9._-]+$/, "El usuario solo puede contener letras, números, puntos y guiones."),
  email: z.string().trim().email("Formato de correo electrónico inválido.").max(120),
  name: z.string().trim().min(2, "El nombre completo es obligatorio.").max(120),
  role: z.enum(["admin", "evaluador"]),
  password: z.string().min(6, "La contraseña debe contener al menos 6 caracteres.").max(128),
  cargo: z.string().trim().max(100).optional(),
  telefono: z.string().trim().max(40).optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: "Acceso denegado: se requieren permisos de administrador." },
      { status: 403 }
    );
  }

  return NextResponse.json(listarUsuarios());
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: "Acceso denegado: solo administradores pueden registrar nuevos usuarios." },
      { status: 403 }
    );
  }

  try {
    const rawBody = await req.json();
    const parsed = CreateUserSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Datos de usuario inválidos." },
        { status: 400 }
      );
    }

    const { username, email, name, role, password, cargo, telefono } = parsed.data;

    let nuevoUsuario = await crearUsuario({
      username,
      email,
      name,
      role: role as UserRole,
      password,
    });

    if (cargo || telefono) {
      const actualizado = actualizarUsuario(
        nuevoUsuario.id,
        { cargo, telefono } as Parameters<typeof actualizarUsuario>[1]
      );
      if (actualizado) nuevoUsuario = actualizado;
    }

    return NextResponse.json(nuevoUsuario, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error al crear usuario.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
