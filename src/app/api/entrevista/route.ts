import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  crearEntrevista,
  actualizarEntrevista,
  listarEntrevistas,
  listarEntrevistasPorEvaluador,
  encodeSmartToken,
  syncStoreFromCloud,
  syncStoreToCloud,
} from "@/lib/store";
import { registrarEventoAuditoria } from "@/lib/audit";
import { enforceRateLimit, getClientIp, parseSafeJson } from "@/lib/apiSecurity";
import type { FormularioCompleto } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  await syncStoreFromCloud();

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

  await syncStoreFromCloud();

  const { data: body, errorResponse } = await parseSafeJson<{
    entidadSolicitante?: string;
    candidatoNombre?: string;
    cedula?: string;
    telefono?: string;
    ciudad?: string;
    evaluadorAsignado?: string;
    datosAdicionales?: Partial<FormularioCompleto>;
  }>(req, 64_000);
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
  const ciudad = (body?.ciudad || "").trim();
  const evaluador = (body?.evaluadorAsignado || session.name).trim();

  const parts = candidato.split(/\s+/);
  const nombre = parts.slice(0, Math.max(1, parts.length - 1)).join(" ");
  const apellido = parts.length > 1 ? parts.slice(-1).join(" ") : "";

  const datosIniciales: Partial<FormularioCompleto> = {
    ...(body?.datosAdicionales || {}),
  };
  if (nombre) datosIniciales.nombre = nombre;
  if (apellido) datosIniciales.apellido = apellido;
  if (cedula) datosIniciales.cedula = cedula;
  if (telefono) datosIniciales.telefono = telefono;
  if (ciudad) datosIniciales.ciudad = ciudad;

  const camposPrellenados = Object.entries(datosIniciales)
    .filter(
      ([, val]) =>
        val !== undefined && val !== null && String(val).trim() !== ""
    )
    .map(([key]) => key);

  datosIniciales.entrevistadorNombre = evaluador;
  datosIniciales.consultorNombre = evaluador;

  const token = encodeSmartToken({
    e: entidad,
    n: candidato,
    c: cedula,
    t: telefono,
    l: ciudad,
    v: evaluador,
    d: datosIniciales,
    p: camposPrellenados,
  });

  crearEntrevista(entidad, token, evaluador, session.username);

  const updated = actualizarEntrevista(token, {
    candidatoNombre: candidato,
    cedula: cedula || undefined,
    telefono: telefono || undefined,
    ciudad: ciudad || undefined,
    evaluadorAsignado: evaluador,
    datos: datosIniciales,
    camposPrellenados,
  });

  await syncStoreToCloud();

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
