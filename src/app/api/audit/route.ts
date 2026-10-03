import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listarEventosAuditoria } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado. Se requieren permisos de superusuario." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || "50");

    const eventos = listarEventosAuditoria(limit);
    return NextResponse.json(eventos);
  } catch (err) {
    console.error("[/api/audit GET]", err);
    return NextResponse.json({ error: "Error al obtener registros de auditoría" }, { status: 500 });
  }
}
