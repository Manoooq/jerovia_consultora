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
  shardUrl?: string;
  alertas: string[];
  creadoEn: string;
  actualizadoEn: string;
}

interface CloudStorePayload {
  version: number;
  deletedTokens: string[];
  records: Record<string, EntrevistaRecord>;
  shards?: Record<string, string>;
  summaries?: Record<string, EntrevistaRecord>;
  updatedAt: number;
}

const TMP_DATA_DIR = path.join(os.tmpdir(), "jerovia_data_v3");
const TMP_FILE = path.join(TMP_DATA_DIR, "entrevistas.json");
const TMP_DELETED_FILE = path.join(TMP_DATA_DIR, "deleted.json");

const PRIMARY_CLOUD_URL =
  process.env.JEROVIA_CLOUD_STORE_URL ||
  (cloudConfig as { jsonBlobUrl?: string }).jsonBlobUrl ||
  "";

const BACKUP_CLOUD_URL =
  (cloudConfig as { backupBlobUrl?: string }).backupBlobUrl || "";

const CLOUD_URLS = [PRIMARY_CLOUD_URL, BACKUP_CLOUD_URL].filter(Boolean);

const BROWSER_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
};

const store = new Map<string, EntrevistaRecord>();
const deletedSet = new Set<string>();

function loadLocalTmp() {
  try {
    if (fs.existsSync(TMP_DELETED_FILE)) {
      const delArr: string[] = JSON.parse(
        fs.readFileSync(TMP_DELETED_FILE, "utf-8")
      );
      delArr.forEach((t) => deletedSet.add(t));
    }
    if (fs.existsSync(TMP_FILE)) {
      const list: EntrevistaRecord[] = JSON.parse(
        fs.readFileSync(TMP_FILE, "utf-8")
      );
      list.forEach((r) => {
        if (r && r.token && !deletedSet.has(r.token)) {
          store.set(r.token, r);
        }
      });
    }
  } catch {}
}

function saveLocalTmp() {
  try {
    fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
    const records = Array.from(store.values()).filter(
      (r) => r.token !== "demo" && !deletedSet.has(r.token)
    );
    fs.writeFileSync(TMP_FILE, JSON.stringify(records, null, 2), "utf-8");
    fs.writeFileSync(
      TMP_DELETED_FILE,
      JSON.stringify(Array.from(deletedSet), null, 2),
      "utf-8"
    );
  } catch {}
}

loadLocalTmp();

export function countFilledFields(datos?: Partial<FormularioCompleto>): number {
  if (!datos || typeof datos !== "object") return 0;
  let count = 0;
  for (const [k, val] of Object.entries(datos)) {
    if (k.startsWith("_")) continue;
    if (val === undefined || val === null || val === "") continue;
    if (Array.isArray(val)) {
      if (val.length > 0) count += val.length;
      continue;
    }
    count++;
  }
  return count;
}

/**
 * Fusiona dos registros del mismo expediente garantizando que NUNCA un dato vacío
 * pise un dato ya completado por el postulante o el evaluador.
 */
export function mergeRecords(
  existing: EntrevistaRecord,
  incoming: EntrevistaRecord
): EntrevistaRecord {
  const mergedDatos: Partial<FormularioCompleto> = {
    ...existing.datos,
    ...incoming.datos,
  };

  for (const [k, val] of Object.entries(existing.datos || {})) {
    const incVal = (incoming.datos as Record<string, unknown> | undefined)?.[k];
    const isIncEmpty =
      incVal === undefined ||
      incVal === null ||
      incVal === "" ||
      (Array.isArray(incVal) && incVal.length === 0);
    const isExistingFilled =
      val !== undefined &&
      val !== null &&
      val !== "" &&
      (!Array.isArray(val) || val.length > 0);

    if (isIncEmpty && isExistingFilled) {
      (mergedDatos as Record<string, unknown>)[k] = val;
    }
  }

  const estadoRank = { pendiente: 0, en_progreso: 1, completado: 2 };
  const bestEstado =
    estadoRank[incoming.estado || "pendiente"] >=
    estadoRank[existing.estado || "pendiente"]
      ? incoming.estado
      : existing.estado;

  const bestPaso = Math.max(
    existing.pasoActual || 1,
    incoming.pasoActual || 1,
    bestEstado === "completado" ? 9 : 1
  );

  const fullNombre = [mergedDatos.nombre, mergedDatos.apellido]
    .filter(Boolean)
    .join(" ")
    .trim();

  const latestTime =
    new Date(incoming.actualizadoEn || 0).getTime() >=
    new Date(existing.actualizadoEn || 0).getTime()
      ? incoming.actualizadoEn
      : existing.actualizadoEn;

  return {
    ...existing,
    ...incoming,
    candidatoNombre:
      incoming.candidatoNombre ||
      existing.candidatoNombre ||
      fullNombre ||
      undefined,
    cedula:
      incoming.cedula || existing.cedula || (mergedDatos.cedula as string),
    telefono:
      incoming.telefono ||
      existing.telefono ||
      (mergedDatos.telefono as string),
    ciudad:
      incoming.ciudad || existing.ciudad || (mergedDatos.ciudad as string),
    estado: bestEstado,
    pasoActual: bestPaso,
    datos: mergedDatos,
    camposPrellenados: incoming.camposPrellenados?.length
      ? incoming.camposPrellenados
      : existing.camposPrellenados,
    actualizadoEn: latestTime || new Date().toISOString(),
  };
}

async function fetchCloudEndpoint(
  baseUrl: string
): Promise<Partial<CloudStorePayload> | null> {
  if (!baseUrl) return null;
  try {
    const sep = baseUrl.includes("?") ? "&" : "?";
    const bustUrl = `${baseUrl}${sep}_t=${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 7)}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(bustUrl, {
      method: "GET",
      headers: BROWSER_HEADERS,
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as Partial<CloudStorePayload>;
  } catch {
    return null;
  }
}

function ingestCloudPayload(payload: Partial<CloudStorePayload> | null) {
  if (!payload || typeof payload !== "object") return;

  if (Array.isArray(payload.deletedTokens)) {
    for (const delTok of payload.deletedTokens) {
      deletedSet.add(delTok);
      store.delete(delTok);
    }
  }

  const incomingMap: Record<string, EntrevistaRecord> = {
    ...(payload.summaries || {}),
    ...(payload.records || {}),
  };

  for (const [tok, rec] of Object.entries(incomingMap)) {
    if (!tok || deletedSet.has(tok) || !rec || typeof rec !== "object") continue;
    const existing = store.get(tok);
    if (!existing) {
      store.set(tok, rec);
    } else {
      store.set(tok, mergeRecords(existing, rec));
    }
  }
}

export async function syncStoreFromCloud(_targetToken?: string): Promise<void> {
  if (CLOUD_URLS.length === 0) return;
  try {
    const results = await Promise.allSettled(
      CLOUD_URLS.map((u) => fetchCloudEndpoint(u))
    );
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        ingestCloudPayload(r.value);
      }
    }
    saveLocalTmp();
  } catch {}
}

export async function syncStoreToCloud(_changedToken?: string): Promise<void> {
  saveLocalTmp();
  if (CLOUD_URLS.length === 0) return;

  try {
    // 1. Primero leer ambos canales para fusionar y jamás pisar expedientes creados en otra instancia
    const results = await Promise.allSettled(
      CLOUD_URLS.map((u) => fetchCloudEndpoint(u))
    );
    let anyReadSuccess = false;
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        anyReadSuccess = true;
        ingestCloudPayload(r.value);
      }
    }

    // Si la lectura falló por microcorte y nuestra instancia está vacía, no sobrescribir la nube
    if (!anyReadSuccess && store.size === 0 && deletedSet.size === 0) {
      return;
    }

    const recordsObj: Record<string, EntrevistaRecord> = {};
    for (const [tok, rec] of store.entries()) {
      if (tok === "demo" || deletedSet.has(tok)) continue;
      recordsObj[tok] = rec;
    }

    const payload: CloudStorePayload = {
      version: 3,
      deletedTokens: Array.from(deletedSet),
      records: recordsObj,
      updatedAt: Date.now(),
    };

    const bodyStr = JSON.stringify(payload);

    await Promise.allSettled(
      CLOUD_URLS.map(async (baseUrl) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        await fetch(baseUrl, {
          method: "PUT",
          headers: BROWSER_HEADERS,
          body: bodyStr,
          cache: "no-store",
          signal: controller.signal,
        });
        clearTimeout(timer);
      })
    );

    saveLocalTmp();
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
    const compact = {
      e: (meta.e || "").slice(0, 40),
      n: (meta.n || "").slice(0, 45),
      c: (meta.c || "").slice(0, 20),
    };
    const b64 = Buffer.from(JSON.stringify(compact), "utf-8").toString(
      "base64url"
    );
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
      entidadSolicitante: parsed.e || "Banco Continental",
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

export function crearEntrevista(
  entidadSolicitante: string,
  token: string,
  evaluadorAsignado = "Lic. Michelle Romero",
  creadoPor = "admin"
): EntrevistaRecord {
  deletedSet.delete(token);
  const existing = store.get(token);
  if (existing) return existing;

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
  saveLocalTmp();
  return record;
}

export function obtenerEntrevista(token: string): EntrevistaRecord | undefined {
  if (deletedSet.has(token)) return undefined;

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
    const fullName = decoded?.candidatoNombre || "";
    const parts = fullName.trim().split(/\s+/);
    const nombre = parts.slice(0, Math.max(1, parts.length - 1)).join(" ");
    const apellido = parts.length > 1 ? parts.slice(-1).join(" ") : "";

    const initialDatos: Partial<FormularioCompleto> = {
      ...(decoded?.datos || {}),
    };
    if (nombre && !initialDatos.nombre) initialDatos.nombre = nombre;
    if (apellido && !initialDatos.apellido) initialDatos.apellido = apellido;
    if (decoded?.cedula && !initialDatos.cedula)
      initialDatos.cedula = decoded.cedula;

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
      datos: initialDatos,
      camposPrellenados: decoded?.camposPrellenados || [],
      alertas: [],
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    };
    store.set(token, record);
    saveLocalTmp();
  }

  return record;
}

export function actualizarEntrevista(
  token: string,
  patch: Partial<EntrevistaRecord>
): EntrevistaRecord | null {
  deletedSet.delete(token);
  let record = store.get(token);
  if (!record) {
    record = obtenerEntrevista(token);
  }
  if (!record) return null;

  const incomingFakeRecord: EntrevistaRecord = {
    ...record,
    ...patch,
    datos: (patch.datos || {}) as Partial<FormularioCompleto>,
    actualizadoEn: new Date().toISOString(),
  };

  const merged = mergeRecords(record, incomingFakeRecord);
  store.set(token, merged);
  saveLocalTmp();
  return merged;
}

export function eliminarEntrevista(token: string): boolean {
  deletedSet.add(token);
  store.delete(token);
  saveLocalTmp();
  return true;
}

export function listarEntrevistas(): EntrevistaRecord[] {
  return Array.from(store.values())
    .filter((r) => r.token !== "demo" && !deletedSet.has(r.token))
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
