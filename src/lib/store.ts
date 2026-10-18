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

interface CloudIndexPayload {
  version: number;
  shards: Record<string, string>;
  deletedTokens: string[];
  summaries: Record<string, EntrevistaRecord>;
  updatedAt: number;
}

const TMP_DATA_DIR = path.join(os.tmpdir(), "jerovia_data_v2");
const TMP_FILE = path.join(TMP_DATA_DIR, "entrevistas.json");
const TMP_DELETED_FILE = path.join(TMP_DATA_DIR, "deleted.json");

const INDEX_CLOUD_URL =
  process.env.JEROVIA_CLOUD_STORE_URL ||
  (cloudConfig as { jsonBlobUrl?: string }).jsonBlobUrl ||
  "";

const store = new Map<string, EntrevistaRecord>();
const deletedSet = new Set<string>();
const shardUrls = new Map<string, string>();

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
          if (r.shardUrl) shardUrls.set(r.token, r.shardUrl);
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

function mergeRecords(
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
    estadoRank[incoming.estado] >= estadoRank[existing.estado]
      ? incoming.estado
      : existing.estado;

  const bestPaso = Math.max(existing.pasoActual || 1, incoming.pasoActual || 1);
  const latestTime =
    new Date(incoming.actualizadoEn || 0).getTime() >=
    new Date(existing.actualizadoEn || 0).getTime()
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
    shardUrl: incoming.shardUrl || existing.shardUrl,
    estado: bestEstado,
    pasoActual: bestPaso,
    datos: mergedDatos,
    camposPrellenados: incoming.camposPrellenados?.length
      ? incoming.camposPrellenados
      : existing.camposPrellenados,
    actualizadoEn: latestTime,
  };
}

async function saveRecordShardToCloud(
  record: EntrevistaRecord
): Promise<string | undefined> {
  let shardUrl = record.shardUrl || shardUrls.get(record.token);
  try {
    if (shardUrl) {
      const res = await fetch(shardUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(record),
      });
      if (res.ok) return shardUrl;
    }

    const createRes = await fetch("https://jsonblob.com/api/jsonBlob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(record),
    });
    const loc =
      createRes.headers.get("location") ||
      createRes.headers.get("Location") ||
      "";
    if (loc) {
      shardUrl = loc.startsWith("http")
        ? loc.replace("http://", "https://")
        : `https://jsonblob.com${loc}`;
      shardUrls.set(record.token, shardUrl);
      record.shardUrl = shardUrl;
      return shardUrl;
    }
  } catch {}
  return shardUrl;
}

function toLightSummary(record: EntrevistaRecord): EntrevistaRecord {
  const lightDatos: Record<string, unknown> = { ...record.datos };
  delete lightDatos.fotoCandidato;
  delete lightDatos.fotosVivienda;
  delete lightDatos.firmaEvaluador;
  return {
    ...record,
    datos: lightDatos as Partial<FormularioCompleto>,
  };
}

export async function syncStoreFromCloud(targetToken?: string): Promise<void> {
  if (!INDEX_CLOUD_URL) return;
  try {
    const res = await fetch(INDEX_CLOUD_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store",
      },
      cache: "no-store",
    });

    if (!res.ok) return;
    const indexData = (await res.json()) as Partial<CloudIndexPayload>;

    if (Array.isArray(indexData.deletedTokens)) {
      for (const delTok of indexData.deletedTokens) {
        deletedSet.add(delTok);
        store.delete(delTok);
        shardUrls.delete(delTok);
      }
    }

    if (indexData.shards && typeof indexData.shards === "object") {
      for (const [tok, url] of Object.entries(indexData.shards)) {
        if (!deletedSet.has(tok) && url) {
          shardUrls.set(tok, url);
        }
      }
    }

    if (indexData.summaries && typeof indexData.summaries === "object") {
      for (const [tok, sumRecord] of Object.entries(indexData.summaries)) {
        if (deletedSet.has(tok) || !sumRecord) continue;
        const loc = store.get(tok);
        if (!loc) {
          store.set(tok, sumRecord);
        } else {
          store.set(tok, mergeRecords(loc, sumRecord));
        }
      }
    }

    if (targetToken && !deletedSet.has(targetToken)) {
      const sUrl =
        shardUrls.get(targetToken) || store.get(targetToken)?.shardUrl;
      if (sUrl) {
        const shardRes = await fetch(sUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache, no-store",
          },
          cache: "no-store",
        }).catch(() => null);
        if (shardRes && shardRes.ok) {
          const fullRecord = (await shardRes.json()) as EntrevistaRecord;
          if (fullRecord && fullRecord.token) {
            const existing = store.get(targetToken);
            store.set(
              targetToken,
              existing ? mergeRecords(existing, fullRecord) : fullRecord
            );
          }
        }
      }
    }

    saveLocalTmp();
  } catch {}
}

export async function syncStoreToCloud(changedToken?: string): Promise<void> {
  saveLocalTmp();
  if (!INDEX_CLOUD_URL) return;

  try {
    if (changedToken && !deletedSet.has(changedToken)) {
      const rec = store.get(changedToken);
      if (rec && rec.token !== "demo") {
        await saveRecordShardToCloud(rec);
      }
    }

    const getRes = await fetch(INDEX_CLOUD_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store",
      },
      cache: "no-store",
    }).catch(() => null);

    if (getRes && getRes.ok) {
      const remoteIndex = (await getRes
        .json()
        .catch(() => null)) as Partial<CloudIndexPayload> | null;
      if (remoteIndex) {
        if (Array.isArray(remoteIndex.deletedTokens)) {
          for (const dt of remoteIndex.deletedTokens) {
            deletedSet.add(dt);
            store.delete(dt);
            shardUrls.delete(dt);
          }
        }
        if (remoteIndex.shards) {
          for (const [t, u] of Object.entries(remoteIndex.shards)) {
            if (!deletedSet.has(t) && u && !shardUrls.has(t)) {
              shardUrls.set(t, u);
            }
          }
        }
        if (remoteIndex.summaries) {
          for (const [t, sr] of Object.entries(remoteIndex.summaries)) {
            if (deletedSet.has(t) || !sr) continue;
            const localRec = store.get(t);
            if (!localRec) {
              store.set(t, sr);
            } else {
              store.set(t, mergeRecords(localRec, sr));
            }
          }
        }
      }
    }

    const summariesObj: Record<string, EntrevistaRecord> = {};
    const shardsObj: Record<string, string> = {};

    for (const [tok, rec] of store.entries()) {
      if (tok === "demo" || deletedSet.has(tok)) continue;
      summariesObj[tok] = toLightSummary(rec);
      const sUrl = rec.shardUrl || shardUrls.get(tok);
      if (sUrl) shardsObj[tok] = sUrl;
    }

    const payload: CloudIndexPayload = {
      version: 2,
      shards: shardsObj,
      deletedTokens: Array.from(deletedSet),
      summaries: summariesObj,
      updatedAt: Date.now(),
    };

    await fetch(INDEX_CLOUD_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

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

  const mergedDatos: Partial<FormularioCompleto> = {
    ...record.datos,
    ...(patch.datos || {}),
  };

  for (const [k, val] of Object.entries(record.datos || {})) {
    const nextVal = (patch.datos as Record<string, unknown> | undefined)?.[k];
    const isNextEmpty =
      nextVal === undefined ||
      nextVal === null ||
      nextVal === "" ||
      (Array.isArray(nextVal) && nextVal.length === 0);
    const isOldFilled =
      val !== undefined &&
      val !== null &&
      val !== "" &&
      (!Array.isArray(val) || val.length > 0);
    if (isNextEmpty && isOldFilled) {
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
  saveLocalTmp();
  return updated;
}

export function eliminarEntrevista(token: string): boolean {
  deletedSet.add(token);
  shardUrls.delete(token);
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
