import fs from "fs";
import path from "path";

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: "LOGIN" | "LOGOUT" | "CREATE_USER" | "UPDATE_USER" | "TOGGLE_USER" | "RESET_PASSWORD" | "CREATE_VISITA" | "UPDATE_VISITA" | "DELETE_VISITA" | "EXPORT_PPTX";
  detail: string;
  ip?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const AUDIT_FILE = path.join(DATA_DIR, "auditoria.json");

let auditCache: AuditEntry[] = [];

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

  // Registros semilla de auditoría pericial iniciales
  auditCache = [
    {
      id: "aud_01",
      timestamp: "2026-10-01T08:30:00.000Z",
      userId: "usr_admin_01",
      userName: "Lic. Michelle Romero",
      userRole: "admin",
      action: "LOGIN",
      detail: "Inicio de sesión seguro verificado desde terminal central.",
      ip: "190.52.148.12",
    },
    {
      id: "aud_02",
      timestamp: "2026-10-01T09:15:00.000Z",
      userId: "usr_admin_01",
      userName: "Lic. Michelle Romero",
      userRole: "admin",
      action: "CREATE_VISITA",
      detail: "Asignación de peritaje EXP-2026-001 para evaluación bancaria.",
      ip: "190.52.148.12",
    },
    {
      id: "aud_03",
      timestamp: "2026-10-01T11:45:00.000Z",
      userId: "usr_eval_01",
      userName: "Lic. Carlos Benítez",
      userRole: "evaluador",
      action: "UPDATE_VISITA",
      detail: "Carga de relevamiento habitacional y coordenadas GPS en Luque.",
      ip: "181.124.62.90",
    },
  ];
  persistAudit();
}

function persistAudit() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Mantener los últimos 300 eventos de auditoría
    const trimmed = auditCache.slice(-300);
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(trimmed, null, 2), "utf-8");
  } catch (err) {
    console.warn("[persistAudit warn]:", err);
  }
}

initAudit();

export function registrarEventoAuditoria(evento: Omit<AuditEntry, "id" | "timestamp">) {
  if (auditCache.length === 0) initAudit();

  const nuevaEntrada: AuditEntry = {
    id: `aud_${crypto.randomUUID().slice(0, 8)}`,
    timestamp: new Date().toISOString(),
    ...evento,
  };

  auditCache.unshift(nuevaEntrada);
  persistAudit();
  return nuevaEntrada;
}

export function listarEventosAuditoria(limite = 50): AuditEntry[] {
  if (auditCache.length === 0) initAudit();
  return auditCache.slice(0, limite);
}
