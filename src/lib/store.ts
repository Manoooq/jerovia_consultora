// In-memory store for the prototype. Replace with Supabase/Neon PostgreSQL in production.
import { FormularioCompleto } from "./validations";

export interface EntrevistaRecord {
  id: string;
  token: string;
  entidadSolicitante: string;
  candidatoNombre?: string;
  evaluadorAsignado?: string;
  creadoPor?: string;
  estado: "pendiente" | "en_progreso" | "completado";
  pasoActual: number;
  datos: Partial<FormularioCompleto>;
  alertas: string[];
  creadoEn: string;
  actualizadoEn: string;
}

// Almacenamiento en memoria para el prototipo (sustituir por DB en producción)
const store = new Map<string, EntrevistaRecord>();

export function crearEntrevista(
  entidadSolicitante: string,
  token: string,
  evaluadorAsignado = "Lic. Michelle Romero",
  creadoPor = "admin"
): EntrevistaRecord {
  const record: EntrevistaRecord = {
    id: crypto.randomUUID(),
    token,
    entidadSolicitante,
    evaluadorAsignado,
    creadoPor,
    estado: "pendiente",
    pasoActual: 1,
    datos: {},
    alertas: [],
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  store.set(token, record);
  return record;
}

export function obtenerEntrevista(token: string): EntrevistaRecord | undefined {
  return store.get(token);
}

export function actualizarEntrevista(token: string, patch: Partial<EntrevistaRecord>): EntrevistaRecord | null {
  const record = store.get(token);
  if (!record) return null;
  const updated = { ...record, ...patch, actualizadoEn: new Date().toISOString() };
  store.set(token, updated);
  return updated;
}

export function listarEntrevistas(): EntrevistaRecord[] {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.actualizadoEn).getTime() - new Date(a.actualizadoEn).getTime()
  );
}

export function listarEntrevistasPorEvaluador(evaluadorNombre: string): EntrevistaRecord[] {
  const clean = evaluadorNombre.toLowerCase().trim();
  return listarEntrevistas().filter((e) => (e.evaluadorAsignado || "").toLowerCase().trim() === clean);
}

// Seed con datos de ejemplo para el dashboard
function seedDemo() {
  const ejemplos = [
    {
      nombre: "Tobias Maximiliano Sánchez",
      entidad: "Banco Continental",
      estado: "completado" as const,
      evaluador: "Lic. Michelle Romero",
    },
    {
      nombre: "María Fernanda López",
      entidad: "Banco Continental",
      estado: "en_progreso" as const,
      evaluador: "Lic. Carlos Benítez",
    },
    {
      nombre: "Carlos Rodríguez Vera",
      entidad: "Cooperativa Universitaria",
      estado: "pendiente" as const,
      evaluador: "Lic. Michelle Romero",
    },
  ];
  ejemplos.forEach((e) => {
    const token = Math.random().toString(36).slice(2, 18);
    const record = crearEntrevista(e.entidad, token, e.evaluador, "admin");
    actualizarEntrevista(token, {
      candidatoNombre: e.nombre,
      estado: e.estado,
      pasoActual: e.estado === "completado" ? 9 : e.estado === "en_progreso" ? 5 : 1,
      datos: e.estado !== "pendiente" ? { nombre: e.nombre.split(" ")[0] } : {},
    });
    void record;
  });
}
seedDemo();
