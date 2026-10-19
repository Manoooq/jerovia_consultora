import { NextRequest, NextResponse } from "next/server";
import {
  obtenerEntrevista,
  actualizarEntrevista,
  eliminarEntrevista,
  countFilledFields,
  syncStoreFromCloud,
  syncStoreToCloud,
} from "@/lib/store";
import { detectarInconsistencias } from "@/lib/gemini";
import { getSession } from "@/lib/auth";
import { registrarEventoAuditoria } from "@/lib/audit";
import { getClientIp, parseSafeJson } from "@/lib/apiSecurity";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  let entrevista = obtenerEntrevista(token);
  if (!entrevista) {
    await syncStoreFromCloud(token);
    entrevista = obtenerEntrevista(token);
  }

  if (!entrevista) {
    return NextResponse.json(
      { error: "Expediente no encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json(entrevista, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const { data: body, errorResponse } = await parseSafeJson<
    Record<string, unknown>
  >(req, 10_000_000);
  if (errorResponse) return errorResponse;

  let actual = obtenerEntrevista(token);
  if (!actual) {
    await syncStoreFromCloud(token);
    actual = obtenerEntrevista(token);
  }
  if (!actual) {
    return NextResponse.json(
      { error: "No se pudo inicializar el expediente." },
      { status: 404 }
    );
  }

  // Si es una petición de recuperación de caché (onlyIfMissing) y el servidor ya tiene datos reales, no sobrescribir
  if (body?.onlyIfMissing && countFilledFields(actual.datos) > 5) {
    return NextResponse.json(actual, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  }

  const session = await getSession();
  const isAuthenticatedStaff = Boolean(session);

  const incomingDatos =
    body?.datos && typeof body.datos === "object"
      ? (body.datos as Record<string, unknown>)
      : {};

  const mergedDatos: Record<string, unknown> = {
    ...actual.datos,
    ...incomingDatos,
  };

  const fullNombre = [mergedDatos.nombre, mergedDatos.apellido]
    .filter(Boolean)
    .join(" ")
    .trim();

  const alertas = detectarInconsistencias(mergedDatos);

  const requestedPaso =
    typeof body?.pasoActual === "number" ? body.pasoActual : actual.pasoActual;
  const requestedEstado =
    (body?.estado as "pendiente" | "en_progreso" | "revision" | "completado") ||
    actual.estado;

  const forceEstado = Boolean(
    isAuthenticatedStaff &&
      (body?._forceEstado || typeof body?.enPapelera === "boolean")
  );

  const ultimaActividadCandidato = body?.candidateActive
    ? new Date().toISOString()
    : (body?.ultimaActividadCandidato as string | undefined) ||
      actual.ultimaActividadCandidato;

  const enPapelera =
    typeof body?.enPapelera === "boolean"
      ? body.enPapelera
      : actual.enPapelera;

  const updated = actualizarEntrevista(token, {
    candidatoNombre:
      (body?.candidatoNombre as string) ||
      fullNombre ||
      actual.candidatoNombre,
    cedula:
      (body?.cedula as string) ||
      (mergedDatos.cedula as string) ||
      actual.cedula,
    telefono:
      (body?.telefono as string) ||
      (mergedDatos.telefono as string) ||
      actual.telefono,
    ciudad:
      (body?.ciudad as string) ||
      (mergedDatos.ciudad as string) ||
      actual.ciudad,
    entidadSolicitante:
      (body?.entidadSolicitante as string) || actual.entidadSolicitante,
    evaluadorAsignado:
      (body?.evaluadorAsignado as string) || actual.evaluadorAsignado,
    pasoActual: requestedPaso,
    estado: requestedEstado,
    datos: mergedDatos,
    alertas,
    ultimaActividadCandidato,
    enPapelera,
    _forceEstado: forceEstado,
  });

  await syncStoreToCloud(token);

  return NextResponse.json(updated, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const { token } = await params;
  await syncStoreFromCloud(token);
  const ok = eliminarEntrevista(token);
  if (ok) {
    await syncStoreToCloud(token);
    registrarEventoAuditoria({
      userId: session.userId,
      userName: session.name,
      userRole: session.role,
      action: "DELETE_VISITA",
      detail: `Eliminación permanente del expediente (${token}).`,
      ip: getClientIp(req),
    });
  }

  return NextResponse.json({ success: ok });
}
