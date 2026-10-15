import fs from "fs";
import path from "path";

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

const DATA_DIR = path.join(process.cwd(), "data");
const AUDIT_FILE = path.join(DATA_DIR, "auditoria.json");

let auditCache: AuditEntry[] = [];
let persistAuditTimer: ReturnType<typeof setTimeout> | null = null;

function initAudit() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(AUDIT_FILE)) {
      const content = fs.readFileSync(AUDIT_FILE, "utf-8");
      if (content.trim()) {
        auditCache = JSON.parse(content);
        return;
      }
    }
  } catch (err) {
    console.error("[initAudit error]:", err);
  }

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
  persistAudit();
}

function persistAudit() {
  if (persistAuditTimer) clearTimeout(persistAuditTimer);
  persistAuditTimer = setTimeout(async () => {
    try {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
      const trimmed = auditCache.slice(0, 300);
      await fs.promises.writeFile(
        AUDIT_FILE,
        JSON.stringify(trimmed, null, 2),
        "utf-8"
      );
    } catch (err) {
      console.warn("[persistAudit warn]:", err);
    }
  }, 50);
}

initAudit();

export function registrarEventoAuditoria(
  evento: Omit<AuditEntry, "id" | "timestamp">
) {
  if (auditCache.length === 0) initAudit();

  const nuevaEntrada: AuditEntry = {
    id: `aud_${crypto.randomUUID().slice(0, 8)}`,
    timestamp: new Date().toISOString(),
    ...evento,
  };

  auditCache.unshift(nuevaEntrada);
  if (auditCache.length > 300) {
    auditCache.length = 300;
  }
  persistAudit();
  return nuevaEntrada;
}

export function listarEventosAuditoria(limite = 50): AuditEntry[] {
  if (auditCache.length === 0) initAudit();
  return auditCache.slice(0, limite);
}
