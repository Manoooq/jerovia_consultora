import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import { fetchGistJsonFile, saveGistFiles } from "./cloudPersistence";

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action:
    | "LOGIN"
    | "LOGOUT"
    | "CREATE_USER"
    | "UPDATE_USER"
    | "TOGGLE_USER"
    | "RESET_PASSWORD"
    | "CREATE_VISITA"
    | "UPDATE_VISITA"
    | "DELETE_VISITA"
    | "EXPORT_PPTX";
  detail: string;
  ip?: string;
}

const TMP_DIR = path.join(os.tmpdir(), "jerovia_data_v4");
const TMP_AUDIT_FILE = path.join(TMP_DIR, "auditoria.json");
const REPO_AUDIT_FILE = path.join(process.cwd(), "data", "auditoria.json");

let auditCache: AuditEntry[] = [];
let persistAuditTimer: ReturnType<typeof setTimeout> | null = null;
let auditSyncPromise: Promise<void> | null = null;

function seedInitialAudit() {
  auditCache = [
    {
      id: "aud_01",
      timestamp: "2026-10-01T08:30:00.000Z",
      userId: "usr_admin_01",
      userName: "Lic. Michelle Romero",
      userRole: "admin",
      action: "LOGIN",
      detail: "Inicio de sesión en el panel de Jerovia Consultora.",
      ip: "127.0.0.1",
    },
  ];
}

function loadLocalAudit() {
  try {
    seedInitialAudit();
    if (fs.existsSync(REPO_AUDIT_FILE)) {
      const content = fs.readFileSync(REPO_AUDIT_FILE, "utf-8");
      if (content.trim()) {
        const list: AuditEntry[] = JSON.parse(content);
        if (Array.isArray(list) && list.length > 0) auditCache = list;
      }
    }
    if (fs.existsSync(TMP_AUDIT_FILE)) {
      const content = fs.readFileSync(TMP_AUDIT_FILE, "utf-8");
      if (content.trim()) {
        const list: AuditEntry[] = JSON.parse(content);
        if (Array.isArray(list) && list.length > 0) auditCache = list;
      }
    }
  } catch {}
}

export async function syncAuditFromCloud(): Promise<void> {
  if (auditSyncPromise) return auditSyncPromise;
  auditSyncPromise = (async () => {
    try {
      const cloudLogs = await fetchGistJsonFile<AuditEntry[]>("_audit.json");
      if (Array.isArray(cloudLogs) && cloudLogs.length > 0) {
        const idSet = new Set(auditCache.map((e) => e.id));
        for (const item of cloudLogs) {
          if (item && item.id && !idSet.has(item.id)) {
            auditCache.push(item);
            idSet.add(item.id);
          }
        }
        auditCache.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        if (auditCache.length > 300) auditCache.length = 300;
        saveAuditLocalTmp();
      }
    } catch {} finally {
      auditSyncPromise = null;
    }
  })();
  return auditSyncPromise;
}

function saveAuditLocalTmp() {
  try {
    fs.mkdirSync(TMP_DIR, { recursive: true });
    const trimmed = auditCache.slice(0, 300);
    fs.writeFileSync(TMP_AUDIT_FILE, JSON.stringify(trimmed, null, 2), "utf-8");
  } catch {}
  try {
    const trimmed = auditCache.slice(0, 300);
    fs.writeFileSync(REPO_AUDIT_FILE, JSON.stringify(trimmed, null, 2), "utf-8");
  } catch {}
}

function persistAuditCloud() {
  if (persistAuditTimer) clearTimeout(persistAuditTimer);
  persistAuditTimer = setTimeout(async () => {
    saveAuditLocalTmp();
    const trimmed = auditCache.slice(0, 300);
    await saveGistFiles({
      "_audit.json": { content: JSON.stringify(trimmed, null, 2) },
    });
  }, 100);
}

loadLocalAudit();
void syncAuditFromCloud();

export function registrarEventoAuditoria(
  evento: Omit<AuditEntry, "id" | "timestamp">
) {
  if (auditCache.length === 0) loadLocalAudit();

  const nuevaEntrada: AuditEntry = {
    id: `aud_${crypto.randomUUID().slice(0, 8)}`,
    timestamp: new Date().toISOString(),
    ...evento,
  };

  auditCache.unshift(nuevaEntrada);
  if (auditCache.length > 300) {
    auditCache.length = 300;
  }
  persistAuditCloud();
  return nuevaEntrada;
}

export function listarEventosAuditoria(limite = 50): AuditEntry[] {
  if (auditCache.length === 0) loadLocalAudit();
  return auditCache.slice(0, limite);
}
