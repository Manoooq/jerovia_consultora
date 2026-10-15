import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listarEventosAuditoria } from "@/lib/audit";
import { enforceRateLimit } from "@/lib/apiSecurity";

export async function GET(req: NextRequest) {
  const rateErr = enforceRateLimit(req, "audit-get", 45, 60_000);
  if (rateErr) return rateErr;

  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Acceso denegado. Se requieren permisos de administrador." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const rawLimit = Number(searchParams.get("limit") || "50");
    const safeLimit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(1, Math.floor(rawLimit)), 200)
      : 50;

    const eventos = listarEventosAuditoria(safeLimit);
    return NextResponse.json(eventos);
  } catch (err) {
    console.error("[/api/audit GET]", err);
    return NextResponse.json(
      { error: "Error al obtener registros de auditoría." },
      { status: 500 }
    );
  }
}
