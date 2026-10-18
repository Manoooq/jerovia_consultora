import crypto from "crypto";
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
  _forceEstado?: boolean;
}

interface CloudConfigShape {
  gistId?: string;
  cipherHex?: string;
  backupObjectUrl?: string;
  jsonBlobUrl?: string;
  backupBlobUrl?: string;
}

interface GistFileEntry {
  filename?: string;
  content?: string;
  truncated?: boolean;
  raw_url?: string;
}

interface GistResponse {
  id?: string;
  files?: Record<string, GistFileEntry>;
}

const REPO_DATA_FILE = path.join(process.cwd(), "data", "entrevistas.json");
const TMP_DATA_DIR = path.join(os.tmpdir(), "jerovia_data_v4");
const TMP_FILE = path.join(TMP_DATA_DIR, "entrevistas.json");
const TMP_DELETED_FILE = path.join(TMP_DATA_DIR, "deleted.json");

const XOR_KEY = "JeroviaConsultora_2026_CloudKey_Paraguay_v4";

function resolveGistAuthToken(): string {
  if (process.env.JEROVIA_GIST_TOKEN) {
    return process.env.JEROVIA_GIST_TOKEN.trim();
  }
  const hex = (cloudConfig as CloudConfigShape).cipherHex || "";
  if (!hex) return "";
  try {
    const cipherBytes = Buffer.from(hex, "hex");
    const keyBytes = Buffer.from(XOR_KEY, "utf-8");
    const out = Buffer.alloc(cipherBytes.length);
    for (let i = 0; i < cipherBytes.length; i++) {
      out[i] = cipherBytes[i] ^ keyBytes[i % keyBytes.length];
    }
    return out.toString("utf-8").trim();
  } catch {
    return "";
  }
}

const GIST_ID =
  process.env.JEROVIA_GIST_ID || (cloudConfig as CloudConfigShape).gistId || "";
const GIST_TOKEN = resolveGistAuthToken();

const store = new Map<string, EntrevistaRecord>();
const deletedSet = new Set<string>();

export function getRecordFileKey(token: string): string {
  const hash = crypto
    .createHash("sha1")
    .update(token)
    .digest("hex")
    .slice(0, 16);
  return `rec_${hash}.json`;
}

function isFilledValue(val: unknown): boolean {
  if (val === undefined || val === null || val === "") return false;
  if (Array.isArray(val)) return val.length > 0;
  return true;
}

export function countFilledFields(datos?: Partial<FormularioCompleto>): number {
  if (!datos || typeof datos !== "object") return 0;
  let count = 0;
  for (const [k, val] of Object.entries(datos)) {
    if (k.startsWith("_")) continue;
    if (!isFilledValue(val)) continue;
    if (Array.isArray(val)) {
      count += val.length;
      continue;
    }
    count++;
  }
  return count;
}

const GENERIC_STEP_DEFAULTS: Record<string, unknown> = {
  tenenciaMovilidad: "no",
  tieneTatuajes: "no",
  tatuajesVisibles: "no_visibles",
  redSocialPlataforma: "Instagram",
  estadoEstudios: "en_curso",
  disponibilidad: "inmediata",
  condicionDiferenteVivienda: "Ninguno",
  paredes: "ladrillo",
  techo: "tejas",
  pisos: "ceramica",
  limpiezaOrdenVivienda: "Ordenada y limpia",
  quienesPresentes: "Ninguno",
  vocabularioEntrevistado: "Respetuoso y acorde a la situación",
  observacionesEntrevista:
    "La persona entrevistada se muestra respetuosa y colaboradora. Vivienda ordenada y limpia.",
  otrasObservaciones: "Ninguna",
  diccion: "fluida",
  estadoVivienda: "bueno",
};

/**
 * Fusiona dos versiones del mismo expediente garantizando que NUNCA un dato vacío
 * o un valor por defecto de un paso anterior pise un dato ya completado por el postulante o el evaluador.
 */
export function mergeRecords(
  existing: EntrevistaRecord,
  incoming: EntrevistaRecord
): EntrevistaRecord {
  const existingCount = countFilledFields(existing.datos);
  const incomingCount = countFilledFields(incoming.datos);

  // El registro con más campos completados o más reciente sirve de base segura
  const incomingIsNewer =
    new Date(incoming.actualizadoEn || 0).getTime() >=
    new Date(existing.actualizadoEn || 0).getTime();

  const mergedDatos: Record<string, unknown> = {
    ...(existing.datos || {}),
  };

  for (const [k, incVal] of Object.entries(incoming.datos || {})) {
    const existVal = mergedDatos[k];
    const incFilled = isFilledValue(incVal);
    const existFilled = isFilledValue(existVal);

    if (!incFilled && existFilled) {
      // Jamás pisar un campo lleno con uno vacío
      continue;
    }

    if (incFilled && existFilled) {
      // Si el valor existente era personalizado y el entrante es un default genérico de un formulario menos avanzado, conservar el personalizado
      const genericDefault = GENERIC_STEP_DEFAULTS[k];
      if (
        genericDefault !== undefined &&
        incVal === genericDefault &&
        existVal !== genericDefault &&
        existingCount > incomingCount
      ) {
        continue;
      }

      // Si incoming viene de una sesión menos avanzada (ej. paso 1) y existing ya tenía muchos más datos, no pisar booleanos/números por defecto (false / 0 / 1)
      if (
        existingCount > incomingCount + 5 &&
        (incVal === false || incVal === 0 || incVal === 1) &&
        existVal !== incVal
      ) {
        continue;
      }
    }

    if (incFilled || !existFilled) {
      mergedDatos[k] = incVal;
    }
  }

  const estadoRank: Record<string, number> = {
    pendiente: 0,
    en_progreso: 1,
    completado: 2,
  };

  let bestEstado: "pendiente" | "en_progreso" | "completado";
  let bestPaso: number;

  if (incoming._forceEstado) {
    bestEstado = incoming.estado || existing.estado || "en_progreso";
    bestPaso = incoming.pasoActual || existing.pasoActual || 1;
  } else {
    const rankIn = estadoRank[incoming.estado || "pendiente"] ?? 0;
    const rankEx = estadoRank[existing.estado || "pendiente"] ?? 0;
    bestEstado =
      rankIn >= rankEx
        ? incoming.estado || "pendiente"
        : existing.estado || "pendiente";

    bestPaso = Math.max(
      existing.pasoActual || 1,
      incoming.pasoActual || 1,
      bestEstado === "completado" ? 9 : 1
    );

    // Si tiene más de 15 campos llenos, al menos está en_progreso (nunca pendiente)
    if (bestEstado === "pendiente" && countFilledFields(mergedDatos) > 10) {
      bestEstado = "en_progreso";
    }
  }

  const fullNombre = [mergedDatos.nombre, mergedDatos.apellido]
    .filter(Boolean)
    .join(" ")
    .trim();

  const latestTime = incomingIsNewer
    ? incoming.actualizadoEn || existing.actualizadoEn
    : existing.actualizadoEn || incoming.actualizadoEn;

  const result: EntrevistaRecord = {
    ...existing,
    ...incoming,
    id: existing.id || incoming.id,
    token: existing.token || incoming.token,
    entidadSolicitante:
      incoming.entidadSolicitante ||
      existing.entidadSolicitante ||
      "Banco Continental",
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
    evaluadorAsignado:
      incoming.evaluadorAsignado ||
      existing.evaluadorAsignado ||
      "Lic. Michelle Romero",
    estado: bestEstado,
    pasoActual: bestPaso,
    datos: mergedDatos as Partial<FormularioCompleto>,
    camposPrellenados: incoming.camposPrellenados?.length
      ? incoming.camposPrellenados
      : existing.camposPrellenados,
    actualizadoEn: latestTime || new Date().toISOString(),
  };

  delete result._forceEstado;
  return result;
}

function loadLocalFiles() {
  // 1. Cargar registros eliminados locales
  try {
    if (fs.existsSync(TMP_DELETED_FILE)) {
      const delArr: string[] = JSON.parse(
        fs.readFileSync(TMP_DELETED_FILE, "utf-8")
      );
      delArr.forEach((t) => deletedSet.add(t));
    }
  } catch {}

  // 2. Cargar semilla consolidada desde data/entrevistas.json del repositorio
  try {
    if (fs.existsSync(REPO_DATA_FILE)) {
      const seedList: EntrevistaRecord[] = JSON.parse(
        fs.readFileSync(REPO_DATA_FILE, "utf-8")
      );
      for (const r of seedList) {
        if (r && r.token && !deletedSet.has(r.token)) {
          const cur = store.get(r.token);
          store.set(r.token, cur ? mergeRecords(cur, r) : r);
        }
      }
    }
  } catch {}

  // 3. Cargar cambios recientes desde /tmp
  try {
    if (fs.existsSync(TMP_FILE)) {
      const tmpList: EntrevistaRecord[] = JSON.parse(
        fs.readFileSync(TMP_FILE, "utf-8")
      );
      for (const r of tmpList) {
        if (r && r.token && !deletedSet.has(r.token)) {
          const cur = store.get(r.token);
          store.set(r.token, cur ? mergeRecords(cur, r) : r);
        }
      }
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

loadLocalFiles();

function getGistHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Jerovia-Consultora-Store",
    "Cache-Control": "no-cache, no-store, must-revalidate",
  };
  if (GIST_TOKEN) {
    headers.Authorization = `Bearer ${GIST_TOKEN}`;
  }
  return headers;
}

async function parseGistFileContent<T>(
  entry: GistFileEntry | undefined
): Promise<T | null> {
  if (!entry) return null;
  try {
    if (entry.truncated && entry.raw_url) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4500);
      const rawRes = await fetch(`${entry.raw_url}?_t=${Date.now()}`, {
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (rawRes.ok) {
        return (await rawRes.json()) as T;
      }
    }
    if (typeof entry.content === "string" && entry.content.trim()) {
      return JSON.parse(entry.content) as T;
    }
  } catch {}
  return null;
}

export async function syncStoreFromCloud(targetToken?: string): Promise<void> {
  if (!GIST_ID) return;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      `https://api.github.com/gists/${GIST_ID}?_t=${Date.now()}`,
      {
        method: "GET",
        headers: getGistHeaders(),
        cache: "no-store",
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    if (!res.ok) return;
    const gist = (await res.json()) as GistResponse;
    const files = gist.files || {};

    // 1. Procesar lista de eliminados
    if (files["_deleted.json"]) {
      const delArr = await parseGistFileContent<string[]>(
        files["_deleted.json"]
      );
      if (Array.isArray(delArr)) {
        for (const delTok of delArr) {
          deletedSet.add(delTok);
          store.delete(delTok);
        }
      }
    }

    // 2. Si se solicitó un token específico, asegurarnos de hidratar ese archivo primero
    if (targetToken && !deletedSet.has(targetToken)) {
      const targetKey = getRecordFileKey(targetToken);
      if (files[targetKey]) {
        const rec = await parseGistFileContent<EntrevistaRecord>(
          files[targetKey]
        );
        if (rec && rec.token && !deletedSet.has(rec.token)) {
          const existing = store.get(rec.token);
          store.set(rec.token, existing ? mergeRecords(existing, rec) : rec);
        }
      }
    }

    // 3. Hidratar todos los demás archivos rec_*.json
    const targetFileKey = targetToken ? getRecordFileKey(targetToken) : "";
    for (const [filename, fileEntry] of Object.entries(files)) {
      if (!filename.startsWith("rec_") || !filename.endsWith(".json")) continue;
      if (filename === targetFileKey) continue;

      const rec = await parseGistFileContent<EntrevistaRecord>(fileEntry);
      if (!rec || !rec.token || deletedSet.has(rec.token)) continue;

      const existing = store.get(rec.token);
      store.set(rec.token, existing ? mergeRecords(existing, rec) : rec);
    }

    saveLocalTmp();
  } catch {}
}

export async function syncStoreToCloud(changedToken?: string): Promise<void> {
  saveLocalTmp();
  if (!GIST_ID || !GIST_TOKEN) return;

  try {
    // 1. Primero sincronizar desde la nube el token afectado para fusionar y jamás pisar avances concurrentes
    await syncStoreFromCloud(changedToken);

    const filesPatch: Record<string, { content: string } | null> = {};

    if (changedToken) {
      if (changedToken === "demo") return;
      const fileKey = getRecordFileKey(changedToken);
      if (deletedSet.has(changedToken)) {
        filesPatch[fileKey] = null;
        filesPatch["_deleted.json"] = {
          content: JSON.stringify(Array.from(deletedSet)),
        };
      } else {
        const rec = store.get(changedToken);
        if (rec) {
          filesPatch[fileKey] = {
            content: JSON.stringify(rec),
          };
        }
      }
    } else {
      // Sincronización completa (ej. restauración de backup)
      filesPatch["_deleted.json"] = {
        content: JSON.stringify(Array.from(deletedSet)),
      };
      for (const [tok, rec] of store.entries()) {
        if (tok === "demo" || deletedSet.has(tok)) continue;
        filesPatch[getRecordFileKey(tok)] = {
          content: JSON.stringify(rec),
        };
      }
    }

    if (Object.keys(filesPatch).length === 0) return;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5500);
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: "PATCH",
      headers: getGistHeaders(),
      body: JSON.stringify({ files: filesPatch }),
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);

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

  // Solo auto-hidratar si es un SmartToken válido de Jerovia (jv_... o tok_...)
  if (!record && (token.startsWith("jv_") || token.startsWith("tok_"))) {
    const decoded = decodeSmartToken(token);
    if (!decoded && token.startsWith("jv_")) return undefined;

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
      estado: "pendiente",
      pasoActual: 1,
      datos: initialDatos,
      camposPrellenados: decoded?.camposPrellenados || [],
      alertas: [],
      creadoEn: "2026-10-18T00:00:00.000Z",
      // Época antigua para que cualquier guardado real del postulante siempre tenga prioridad temporal
      actualizadoEn: "2026-10-18T00:00:00.000Z",
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

  const incomingRecord: EntrevistaRecord = {
    ...record,
    ...patch,
    datos: (patch.datos || {}) as Partial<FormularioCompleto>,
    actualizadoEn: new Date().toISOString(),
  };

  const merged = mergeRecords(record, incomingRecord);
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
