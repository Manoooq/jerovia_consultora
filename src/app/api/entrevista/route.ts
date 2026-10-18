import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  crearEntrevista,
  actualizarEntrevista,
  listarEntrevistas,
  listarEntrevistasPorEvaluador,
  encodeSmartToken,
} from "@/lib/store";
import { registrarEventoAuditoria } from "@/lib/audit";
import { enforceRateLimit, getClientIp, parseSafeJson } from "@/lib/apiSecurity";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  if (session.role === "admin") {
    return NextResponse.json(listarEntrevistas());
  }
  return NextResponse.json(listarEntrevistasPorEvaluador(session.name));
}

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, "entrevista-create", 25, 60_000);
  if (rateErr) return rateErr;

  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: "Solo los administradores pueden habilitar nuevos expedientes." },
      { status: 403 }
    );
  }

  const { data: body, errorResponse } = await parseSafeJson<{
    entidadSolicitante?: string;
    candidatoNombre?: string;
    cedula?: string;
    telefono?: string;
    ciudad?: string;
    evaluadorAsignado?: string;
  }>(req, 32_768);
  if (errorResponse) return errorResponse;

  const entidad = (body?.entidadSolicitante || "").trim();
  const candidato = (body?.candidatoNombre || "").trim();

  if (!entidad || !candidato) {
    return NextResponse.json(
      { error: "El nombre del postulante y la entidad solicitante son obligatorios." },
      { status: 400 }
    );
  }

  const cedula = (body?.cedula || "").trim();
  const telefono = (body?.telefono || "").trim();
  const ciudad = (body?.ciudad || "Asunción").trim();
  const evaluador = (body?.evaluadorAsignado || session.name).trim();

  const token = encodeSmartToken({
    e: entidad,
    n: candidato,
    c: cedula,
    t: telefono,
    l: ciudad,
    v: evaluador,
  });

  crearEntrevista(entidad, token, evaluador, session.username);

  const parts = candidato.split(/\s+/);
  const nombre = parts.slice(0, Math.max(1, parts.length - 1)).join(" ");
  const apellido = parts.length > 1 ? parts.slice(-1).join(" ") : "";

  const updated = actualizarEntrevista(token, {
    candidatoNombre: candidato,
    cedula,
    telefono,
    ciudad,
    evaluadorAsignado: evaluador,
    datos: {
      nombre,
      apellido,
      cedula,
      telefono,
      ciudad,
      entrevistadorNombre: evaluador,
      consultorNombre: evaluador,
    },
  });

  registrarEventoAuditoria({
    userId: session.userId,
    userName: session.name,
    userRole: session.role,
    action: "CREATE_VISITA",
    detail: `Habilitación de expediente para ${candidato} (${entidad}).`,
    ip: getClientIp(req),
  });

  return NextResponse.json(updated, { status: 201 });
}
