import fs from "fs";
import os from "os";
import path from "path";
import { FormularioCompleto } from "./validations";
import cloudConfig from "./cloudConfig.json";

export interface EntrevistaRecord {
  id: string;
  token: string;
  entidadSolicitante: string;
  candidatoNombre?: string;
  cedula?: string;
  telefono?: string;
  ciudad?: string;
  evaluadorAsignado?: string;
  creadoPor?: string;
  estado: "pendiente" | "en_progreso" | "completado";
  pasoActual: number;
  datos: Partial<FormularioCompleto>;
  camposPrellenados?: string[];
  alertas: string[];
  creadoEn: string;
  actualizadoEn: string;
}

const REPO_DATA_DIR = path.join(process.cwd(), "data");
const TMP_DATA_DIR = path.join(os.tmpdir(), "jerovia_data");
const CLOUD_URL =
  process.env.JEROVIA_CLOUD_STORE_URL ||
  (cloudConfig as { jsonBlobUrl?: string }).jsonBlobUrl ||
  "";

function getReadableFile(): string | null {
  const tmpFile = path.join(TMP_DATA_DIR, "entrevistas.json");
  const repoFile = path.join(REPO_DATA_DIR, "entrevistas.json");
  if (fs.existsSync(tmpFile)) return tmpFile;
  if (fs.existsSync(repoFile)) return repoFile;
  return null;
}

const store = new Map<string, EntrevistaRecord>();

function countFilledFields(datos?: Partial<FormularioCompleto>): number {
  if (!datos) return 0;
  return Object.entries(datos).filter(([, val]) => {
    if (val === undefined || val === null || val === "" || val === false) return false;
    if (Array.isArray(val)) return val.length > 0;
    return true;
  }).length;
}

/**
 * Fusiona dos versiones del mismo expediente conservando siempre el que tenga
 * más avance, más respuestas cargadas y estado más avanzado.
 */
function mergeRecords(
  existing: EntrevistaRecord,
  incoming: EntrevistaRecord
): EntrevistaRecord {
  const mergedDatos: Partial<FormularioCompleto> = {
    ...existing.datos,
    ...incoming.datos,
  };

  // No permitir que un campo vacío sobrescriba un dato ya rellenado por el postulante
  for (const [k, val] of Object.entries(existing.datos || {})) {
    const incVal = (incoming.datos as Record<string, unknown> | undefined)?.[k];
    const isIncEmpty =
      incVal === undefined ||
      incVal === null ||
      incVal === "" ||
      (Array.isArray(incVal) && incVal.length === 0);
    if (isIncEmpty && val !== undefined && val !== null && val !== "") {
      (mergedDatos as Record<string, unknown>)[k] = val;
    }
  }

  const estadoRank = { pendiente: 0, en_progreso: 1, completado: 2 };
  const bestEstado =
    estadoRank[incoming.estado] >= estadoRank[existing.estado]
      ? incoming.estado
      : existing.estado;

  const bestPaso = Math.max(existing.pasoActual || 1, incoming.pasoActual || 1);
  const latestTime =
    new Date(incoming.actualizadoEn).getTime() >=
    new Date(existing.actualizadoEn).getTime()
      ? incoming.actualizadoEn
      : existing.actualizadoEn;

  return {
    ...existing,
    ...incoming,
    candidatoNombre: incoming.candidatoNombre || existing.candidatoNombre,
    cedula: incoming.cedula || existing.cedula || (mergedDatos.cedula as string),
    telefono:
      incoming.telefono || existing.telefono || (mergedDatos.telefono as string),
    ciudad: incoming.ciudad || existing.ciudad || (mergedDatos.ciudad as string),
    estado: bestEstado,
    pasoActual: bestPaso,
    datos: mergedDatos,
    camposPrellenados:
      incoming.camposPrellenados?.length
        ? incoming.camposPrellenados
        : existing.camposPrellenados,
    actualizadoEn: latestTime,
  };
}

export async function syncStoreFromCloud(): Promise<void> {
  if (!CLOUD_URL) return;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(CLOUD_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store",
      },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      const cloudRecords: EntrevistaRecord[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.records)
        ? data.records
        : [];

      for (const cr of cloudRecords) {
        if (!cr || !cr.token) continue;
        const local = store.get(cr.token);
        if (!local) {
          store.set(cr.token, cr);
        } else {
          store.set(cr.token, mergeRecords(local, cr));
        }
      }
      persistLocalDisk();
    }
  } catch {}
}

export async function syncStoreToCloud(): Promise<void> {
  persistLocalDisk();
  if (!CLOUD_URL) return;
  try {
    // Primero traer cualquier cambio de otros dispositivos para no pisarlo
    const controllerGet = new AbortController();
    const timerGet = setTimeout(() => controllerGet.abort(), 2500);
    const getRes = await fetch(CLOUD_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store",
      },
      cache: "no-store",
      signal: controllerGet.signal,
    }).catch(() => null);
    clearTimeout(timerGet);

    if (getRes && getRes.ok) {
      const remoteData = await getRes.json().catch(() => null);
      const remoteList: EntrevistaRecord[] = Array.isArray(remoteData?.records)
        ? remoteData.records
        : [];
      for (const rr of remoteList) {
        if (!rr || !rr.token) continue;
        const loc = store.get(rr.token);
        if (!loc) {
          store.set(rr.token, rr);
        } else {
          store.set(rr.token, mergeRecords(loc, rr));
        }
      }
    }

    const allRecords = Array.from(store.values()).filter(
      (r) => r.token !== "demo"
    );

    const controllerPut = new AbortController();
    const timerPut = setTimeout(() => controllerPut.abort(), 3500);
    await fetch(CLOUD_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        records: allRecords,
        updatedAt: Date.now(),
      }),
      signal: controllerPut.signal,
    });
    clearTimeout(timerPut);
  } catch {}
}

function persistLocalDisk() {
  const records = Array.from(store.values());
  const payload = JSON.stringify(records, null, 2);
  try {
    fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(TMP_DATA_DIR, "entrevistas.json"),
      payload,
      "utf-8"
    );
  } catch {}
  try {
    fs.mkdirSync(REPO_DATA_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(REPO_DATA_DIR, "entrevistas.json"),
      payload,
      "utf-8"
    );
  } catch {}
}

export function encodeSmartToken(meta: {
  e: string;
  n?: string;
  c?: string;
  t?: string;
  l?: string;
  v?: string;
  d?: Partial<FormularioCompleto>;
  p?: string[];
}): string {
  try {
    const json = JSON.stringify(meta);
    const b64 = Buffer.from(json, "utf-8").toString("base64url");
    const rand = crypto.randomUUID().slice(0, 6);
    return `jv_${b64}_${rand}`;
  } catch {
    return `tok_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  }
}

function decodeSmartToken(token: string): {
  entidadSolicitante: string;
  candidatoNombre?: string;
  cedula?: string;
  telefono?: string;
  ciudad?: string;
  evaluadorAsignado?: string;
  datos: Partial<FormularioCompleto>;
  camposPrellenados: string[];
} | null {
  if (!token.startsWith("jv_")) return null;
  try {
    const parts = token.split("_");
    if (parts.length < 3) return null;
    const b64 = parts.slice(1, -1).join("_");
    const parsed = JSON.parse(Buffer.from(b64, "base64url").toString("utf-8"));
    return {
      entidadSolicitante: parsed.e || "Entidad Solicitante",
      candidatoNombre: parsed.n || undefined,
      cedula: parsed.c || undefined,
      telefono: parsed.t || undefined,
      ciudad: parsed.l || undefined,
      evaluadorAsignado: parsed.v || "Lic. Michelle Romero",
      datos: parsed.d || {},
      camposPrellenados: Array.isArray(parsed.p) ? parsed.p : [],
    };
  } catch {
    return null;
  }
}

function initStore() {
  try {
    const file = getReadableFile();
    if (file) {
      const content = fs.readFileSync(file, "utf-8");
      if (content.trim()) {
        const records: EntrevistaRecord[] = JSON.parse(content);
        records.forEach((r) => store.set(r.token, r));
      }
    }
  } catch {}
}

initStore();

export function crearEntrevista(
  entidadSolicitante: string,
  token: string,
  evaluadorAsignado = "Lic. Michelle Romero",
  creadoPor = "admin"
): EntrevistaRecord {
  const existing = store.get(token);
  if (existing && countFilledFields(existing.datos) > 0) {
    return existing;
  }

  const record: EntrevistaRecord = {
    id: `ent_${crypto.randomUUID().slice(0, 8)}`,
    token,
    entidadSolicitante,
    evaluadorAsignado,
    creadoPor,
    estado: "pendiente",
    pasoActual: 1,
    datos: {},
    camposPrellenados: [],
    alertas: [],
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  store.set(token, record);
  persistLocalDisk();
  return record;
}

export function obtenerEntrevista(token: string): EntrevistaRecord | undefined {
  if (store.size === 0) initStore();

  let record = store.get(token);

  if (!record && token === "demo") {
    record = {
      id: "ent_demo",
      token: "demo",
      entidadSolicitante: "Banco Continental",
      evaluadorAsignado: "Lic. Michelle Romero",
      creadoPor: "admin",
      estado: "en_progreso",
      pasoActual: 1,
      datos: {},
      camposPrellenados: [],
      alertas: [],
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    };
    store.set(token, record);
    return record;
  }

  if (
    !record &&
    (token.startsWith("jv_") || token.startsWith("tok_") || token.length >= 8)
  ) {
    const decoded = decodeSmartToken(token);
    record = {
      id: `ent_${token.slice(-8)}`,
      token,
      entidadSolicitante: decoded?.entidadSolicitante || "Banco Continental",
      candidatoNombre: decoded?.candidatoNombre,
      cedula: decoded?.cedula,
      telefono: decoded?.telefono,
      ciudad: decoded?.ciudad,
      evaluadorAsignado: decoded?.evaluadorAsignado || "Lic. Michelle Romero",
      creadoPor: "admin",
      estado: "en_progreso",
      pasoActual: 1,
      datos: {
        ...(decoded?.datos || {}),
      },
      camposPrellenados: decoded?.camposPrellenados || [],
      alertas: [],
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    };
    store.set(token, record);
    persistLocalDisk();
  }

  return record;
}

export function actualizarEntrevista(
  token: string,
  patch: Partial<EntrevistaRecord>
): EntrevistaRecord | null {
  let record = store.get(token);
  if (!record) {
    record = obtenerEntrevista(token);
  }
  if (!record) return null;

  const mergedDatos: Partial<FormularioCompleto> = {
    ...record.datos,
    ...(patch.datos || {}),
  };

  for (const [k, val] of Object.entries(record.datos || {})) {
    const nextVal = (patch.datos as Record<string, unknown> | undefined)?.[k];
    if (
      (nextVal === undefined || nextVal === null || nextVal === "") &&
      val !== undefined &&
      val !== null &&
      val !== ""
    ) {
      (mergedDatos as Record<string, unknown>)[k] = val;
    }
  }

  const updated: EntrevistaRecord = {
    ...record,
    ...patch,
    datos: mergedDatos,
    pasoActual: Math.max(record.pasoActual || 1, patch.pasoActual || 1),
    estado:
      record.estado === "completado"
        ? "completado"
        : patch.estado || record.estado,
    camposPrellenados:
      patch.camposPrellenados !== undefined
        ? patch.camposPrellenados
        : record.camposPrellenados,
    actualizadoEn: new Date().toISOString(),
  };

  store.set(token, updated);
  persistLocalDisk();
  return updated;
}

export function eliminarEntrevista(token: string): boolean {
  const exists = store.has(token);
  if (!exists) return false;
  store.delete(token);
  persistLocalDisk();
  return true;
}

export function listarEntrevistas(): EntrevistaRecord[] {
  if (store.size === 0) initStore();
  return Array.from(store.values())
    .filter((r) => r.token !== "demo")
    .sort(
      (a, b) =>
        new Date(b.actualizadoEn).getTime() -
        new Date(a.actualizadoEn).getTime()
    );
}

export function listarEntrevistasPorEvaluador(
  evaluadorNombre: string
): EntrevistaRecord[] {
  const clean = evaluadorNombre.toLowerCase().trim();
  return listarEntrevistas().filter(
    (e) => (e.evaluadorAsignado || "").toLowerCase().trim() === clean
  );
}
