import fs from "fs";
import os from "os";
import path from "path";
import { FormularioCompleto } from "./validations";

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

function getReadableFile(): string | null {
  const tmpFile = path.join(TMP_DATA_DIR, "entrevistas.json");
  const repoFile = path.join(REPO_DATA_DIR, "entrevistas.json");
  if (fs.existsSync(tmpFile)) return tmpFile;
  if (fs.existsSync(repoFile)) return repoFile;
  return null;
}

const store = new Map<string, EntrevistaRecord>();
let persistTimer: ReturnType<typeof setTimeout> | null = null;

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
        store.clear();
        records.forEach((r) => store.set(r.token, r));
      }
    }
  } catch (err) {
    console.warn("[initStore warn]:", err);
  }
}

function persistStore() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(async () => {
    const records = Array.from(store.values());
    const payload = JSON.stringify(records, null, 2);
    try {
      await fs.promises.mkdir(TMP_DATA_DIR, { recursive: true });
      await fs.promises.writeFile(
        path.join(TMP_DATA_DIR, "entrevistas.json"),
        payload,
        "utf-8"
      );
    } catch {}
    try {
      await fs.promises.mkdir(REPO_DATA_DIR, { recursive: true });
      await fs.promises.writeFile(
        path.join(REPO_DATA_DIR, "entrevistas.json"),
        payload,
        "utf-8"
      );
    } catch {}
  }, 40);
}

initStore();

export function crearEntrevista(
  entidadSolicitante: string,
  token: string,
  evaluadorAsignado = "Lic. Michelle Romero",
  creadoPor = "admin"
): EntrevistaRecord {
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
  persistStore();
  return record;
}

export function obtenerEntrevista(token: string): EntrevistaRecord | undefined {
  if (store.size === 0) initStore();

  let record = store.get(token);

  if (!record && token === "demo") {
    record = {
      id: "ent_demo",
      token: "demo",
      entidadSolicitante: "Entidad Financiera",
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
      entidadSolicitante: decoded?.entidadSolicitante || "Entidad Solicitante",
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
    persistStore();
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

  const updated: EntrevistaRecord = {
    ...record,
    ...patch,
    datos: {
      ...record.datos,
      ...(patch.datos || {}),
    },
    camposPrellenados:
      patch.camposPrellenados !== undefined
        ? patch.camposPrellenados
        : record.camposPrellenados,
    actualizadoEn: new Date().toISOString(),
  };
  store.set(token, updated);
  persistStore();
  return updated;
}

export function eliminarEntrevista(token: string): boolean {
  const exists = store.has(token);
  if (!exists) return false;
  store.delete(token);
  persistStore();
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
