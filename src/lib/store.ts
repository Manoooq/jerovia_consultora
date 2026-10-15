import fs from "fs";
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
  alertas: string[];
  creadoEn: string;
  actualizadoEn: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "entrevistas.json");

const store = new Map<string, EntrevistaRecord>();
let persistTimer: ReturnType<typeof setTimeout> | null = null;

function initStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      if (content.trim()) {
        const records: EntrevistaRecord[] = JSON.parse(content);
        store.clear();
        records.forEach((r) => store.set(r.token, r));
        return;
      }
    }
  } catch (err) {
    console.error("[initStore error]:", err);
  }

  seedInitial();
}

function persistStore() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(async () => {
    try {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
      const records = Array.from(store.values());
      await fs.promises.writeFile(
        DATA_FILE,
        JSON.stringify(records, null, 2),
        "utf-8"
      );
    } catch (err) {
      console.warn("[persistStore warn]:", err);
    }
  }, 50);
}

function seedInitial() {
  const semillas: EntrevistaRecord[] = [
    {
      id: "ent_01",
      token: "tok_visita_01",
      entidadSolicitante: "Banco Continental",
      candidatoNombre: "Rodrigo Benítez Martínez",
      cedula: "4.892.150",
      telefono: "0981 774890",
      ciudad: "Luque",
      evaluadorAsignado: "Lic. Michelle Romero",
      creadoPor: "admin",
      estado: "completado",
      pasoActual: 9,
      datos: {
        nombre: "Rodrigo",
        apellido: "Benítez Martínez",
        cedula: "4.892.150",
        telefono: "0981 774890",
        ciudad: "Luque",
        consultorNombre: "Lic. Michelle Romero",
        observacionesEntrevista:
          "Verificación domiciliaria favorable. Condiciones habitacionales adecuadas y coherencia socioeconómica verificada.",
      },
      alertas: [],
      creadoEn: "2026-09-28T10:00:00.000Z",
      actualizadoEn: "2026-09-30T16:30:00.000Z",
    },
    {
      id: "ent_02",
      token: "tok_visita_02",
      entidadSolicitante: "Cooperativa Universitaria",
      candidatoNombre: "Andrea Carolina Gómez",
      cedula: "5.120.340",
      telefono: "0971 445210",
      ciudad: "San Lorenzo",
      evaluadorAsignado: "Lic. Carlos Benítez",
      creadoPor: "admin",
      estado: "en_progreso",
      pasoActual: 5,
      datos: {
        nombre: "Andrea Carolina",
        apellido: "Gómez",
        cedula: "5.120.340",
        telefono: "0971 445210",
        ciudad: "San Lorenzo",
        consultorNombre: "Lic. Carlos Benítez",
      },
      alertas: [],
      creadoEn: "2026-09-29T14:20:00.000Z",
      actualizadoEn: "2026-09-30T18:15:00.000Z",
    },
  ];

  store.clear();
  semillas.forEach((s) => store.set(s.token, s));
  persistStore();
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

  // Solo auto-aprovisionar el entorno "demo"
  if (!record && token === "demo") {
    record = {
      id: "ent_demo",
      token: "demo",
      entidadSolicitante: "Banco Continental (Demo)",
      candidatoNombre: "Rodrigo Benítez Martínez",
      cedula: "4.892.150",
      telefono: "0981 774890",
      ciudad: "Luque",
      evaluadorAsignado: "Lic. Michelle Romero",
      creadoPor: "admin",
      estado: "en_progreso",
      pasoActual: 1,
      datos: {
        nombre: "Rodrigo",
        apellido: "Benítez Martínez",
        fechaNacimiento: "1991-06-14",
        cedula: "4.892.150",
        estadoCivil: "casado",
        telefono: "0981 774890",
        email: "rodrigo.benitez@empresa.com.py",
        licenciaConducir: true,
        movilidadPropia: true,
        tipoMovilidad: "Automóvil Toyota Allion 2014",
        carrera: "Licenciatura en Administración de Empresas",
        aniosEstudio: 5,
        universidad: "Universidad Nacional de Asunción (UNA)",
        estadoEstudios: "finalizado",
        idiomas: [
          { idioma: "Español", nivel: "nativo" },
          { idioma: "Guaraní", nivel: "avanzado" },
        ],
        situacionActual: "empleado",
        empresaAnterior: "Manufactura de Pilar S.A.",
        cargoAnterior: "Encargado de Logística",
        antiguedad: "48",
        salarioAnterior: 7500000,
        disponibilidad: "inmediata",
        pretensionSalarial: "8.500.000",
        aspectosPositivos: "Compromiso operativo, trabajo en equipo y puntualidad.",
        aspectosMejorar: "Profundizar herramientas de análisis de datos.",
        visionLargoPlazo: "Consolidación profesional y patrimonial.",
        expectativasEntidad: "Estabilidad y desarrollo de carrera.",
        relacionPadres: "casados",
        estructuraFamiliar: "Convive con su cónyuge y un hijo de 4 años.",
        hijos: true,
        cantidadHijos: 1,
        edadesHijos: "4 años",
        seguroMedico: "ips",
        consumoAlcohol: "social",
        consumoTabaco: false,
        ingresosFamiliares: "11.000.000",
        otrosIngresos: "1.500.000",
        egresosMensuales: "5.800.000",
        prestamos: true,
        prestamosDetalle: "Cuota vehicular al día",
        ciudad: "Luque",
        barrio: "Cuarto Barrio",
        direccion: "Dr. Fernando de la Mora c/ Rosario",
        coordenadas: "-25.269932, -57.489012",
        plusCode: "6867+XQ PY",
        tipoCamino: "asfalto",
        tenenciaVivienda: "propia",
        costoAlquiler: 0,
        cantidadPersonas: 3,
        habitaciones: 3,
        banos: 2,
        cocina: true,
        sala: true,
        techo: "tejas",
        paredes: "ladrillo",
        pisos: "ceramica",
        plantas: 1,
        observacionesEntrevista:
          "Residencia verificada en adecuadas condiciones de mantenimiento. Coherencia entre ingresos declarados y calidad de vida observada.",
        diccion: "fluida",
        estadoVivienda: "bueno",
        quienesPresentes: "El titular y su cónyuge",
        fechaVisita: "2026-10-14",
        consultorNombre: "Lic. Michelle Romero",
      },
      alertas: [],
      creadoEn: "2026-10-01T08:00:00.000Z",
      actualizadoEn: "2026-10-14T15:30:00.000Z",
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
  const record = store.get(token);
  if (!record) return null;
  const updated: EntrevistaRecord = {
    ...record,
    ...patch,
    datos: {
      ...record.datos,
      ...(patch.datos || {}),
    },
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
  return Array.from(store.values()).sort(
    (a, b) =>
      new Date(b.actualizadoEn).getTime() - new Date(a.actualizadoEn).getTime()
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
