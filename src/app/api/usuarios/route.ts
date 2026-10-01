import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listarUsuarios, crearUsuario, type UserRole } from "@/lib/users";

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: "Acceso denegado: se requieren permisos de administrador." },
      { status: 403 }
    );
  }

  const usuarios = listarUsuarios();
  return NextResponse.json(usuarios);
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
    const { username, email, name, role, password } = await req.json();

    if (!username || !email || !name || !password || !role) {
      return NextResponse.json(
        { error: "Todos los campos (usuario, correo, nombre, rol y contraseña) son obligatorios." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe contener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    if (role !== "admin" && role !== "evaluador") {
      return NextResponse.json(
        { error: "El rol seleccionado no es válido. Debe ser admin o evaluador." },
        { status: 400 }
      );
    }

    const nuevoUsuario = await crearUsuario({
      username,
      email,
      name,
      role: role as UserRole,
      password,
    });

    return NextResponse.json(nuevoUsuario, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error al crear usuario.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
