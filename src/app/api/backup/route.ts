import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  listarEntrevistas,
  actualizarEntrevista,
  crearEntrevista,
  syncStoreFromCloud,
  syncStoreToCloud,
} from "@/lib/store";
import { registrarEventoAuditoria } from "@/lib/audit";
import { getClientIp, parseSafeJson } from "@/lib/apiSecurity";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  await syncStoreFromCloud();
  const entrevistas = listarEntrevistas();
  registrarEventoAuditoria({
    userId: session.userId,
    userName: session.name,
    userRole: session.role,
    action: "EXPORT_PPTX",
    detail: `Descarga de respaldo completo JSON (${entrevistas.length} expedientes).`,
    ip: getClientIp(req),
  });

  return new NextResponse(
    JSON.stringify(
      {
        empresa: "Jerovia Consultora",
        exportadoEn: new Date().toISOString(),
        total: entrevistas.length,
        entrevistas,
      },
      null,
      2
    ),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="Jerovia_Respaldo_${new Date()
          .toISOString()
          .slice(0, 10)}.json"`,
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  await syncStoreFromCloud();

  const { data: body, errorResponse } = await parseSafeJson<{
    entrevistas?: Array<{
      token: string;
      entidadSolicitante: string;
      candidatoNombre?: string;
      cedula?: string;
      telefono?: string;
      ciudad?: string;
      evaluadorAsignado?: string;
      estado?: "pendiente" | "en_progreso" | "completado";
      pasoActual?: number;
      datos?: Record<string, unknown>;
    }>;
  }>(req, 10_000_000);
  if (errorResponse) return errorResponse;

  const list = body?.entrevistas;
  if (!Array.isArray(list)) {
    return NextResponse.json(
      { error: "Archivo de respaldo inválido." },
      { status: 400 }
    );
  }

  let restored = 0;
  for (const item of list) {
    if (!item.token || !item.entidadSolicitante) continue;
    crearEntrevista(
      item.entidadSolicitante,
      item.token,
      item.evaluadorAsignado || "Lic. Michelle Romero",
      session.username
    );
    actualizarEntrevista(item.token, {
      candidatoNombre: item.candidatoNombre,
      cedula: item.cedula,
      telefono: item.telefono,
      ciudad: item.ciudad,
      evaluadorAsignado: item.evaluadorAsignado,
      estado: item.estado || "en_progreso",
      pasoActual: item.pasoActual || 1,
      datos: item.datos || {},
    });
    restored++;
  }

  await syncStoreToCloud();

  registrarEventoAuditoria({
    userId: session.userId,
    userName: session.name,
    userRole: session.role,
    action: "CREATE_VISITA",
    detail: `Restauración de base de datos (${restored} expedientes sincronizados).`,
    ip: getClientIp(req),
  });

  return NextResponse.json({ success: true, restored });
}
