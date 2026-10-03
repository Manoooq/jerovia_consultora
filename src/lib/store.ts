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

// Memoria caché para máxima velocidad
const store = new Map<string, EntrevistaRecord>();

// Inicializar y cargar desde disco si existe
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

  // Si no hay datos en disco, cargar semillas con tokens deterministas fijos
  seedInitial();
}

function persistStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const records = Array.from(store.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), "utf-8");
  } catch (err) {
    // Si el entorno es read-only (ej. edge), mantener en memoria
    console.warn("[persistStore warn]:", err);
  }
}

function seedInitial() {
  const semillas: EntrevistaRecord[] = [
    {
      id: "ent_01",
      token: "tok_visita_01",
      entidadSolicitante: "Entidad Bancaria de Plaza",
      candidatoNombre: "Postulante Confidencial #EXP-801",
      cedula: "5.551.895",
      telefono: "0982 176890",
      ciudad: "Luque",
      evaluadorAsignado: "Lic. Michelle Romero",
      creadoPor: "admin",
      estado: "completado",
      pasoActual: 9,
      datos: {
        nombre: "Postulante",
        apellido: "Confidencial #EXP-801",
        cedula: "5.551.895",
        telefono: "0982 176890",
        ciudad: "Luque",
        consultorNombre: "Lic. Michelle Romero",
        observacionesEntrevista: "Dictamen Favorable. Condiciones habitacionales favorables, entorno vecinal consolidado y coherencia económica verificada.",
      },
      alertas: [],
      creadoEn: "2026-09-28T10:00:00.000Z",
      actualizadoEn: "2026-09-30T16:30:00.000Z",
    },
    {
      id: "ent_02",
      token: "tok_visita_02",
      entidadSolicitante: "Cooperativa de Ahorro y Crédito Tipo A",
      candidatoNombre: "Postulante Confidencial #EXP-802",
      cedula: "4.892.110",
      telefono: "0971 445210",
      ciudad: "San Lorenzo",
      evaluadorAsignado: "Lic. Carlos Benítez",
      creadoPor: "admin",
      estado: "en_progreso",
      pasoActual: 5,
      datos: {
        nombre: "Postulante",
        apellido: "Confidencial #EXP-802",
        cedula: "4.892.110",
        telefono: "0971 445210",
        ciudad: "San Lorenzo",
        consultorNombre: "Lic. Carlos Benítez",
      },
      alertas: [],
      creadoEn: "2026-09-29T14:20:00.000Z",
      actualizadoEn: "2026-09-30T18:15:00.000Z",
    },
    {
      id: "ent_03",
      token: "tok_visita_03",
      entidadSolicitante: "Institución Financiera AAA",
      candidatoNombre: "Postulante Confidencial #EXP-803",
      cedula: "3.921.450",
      telefono: "0981 992341",
      ciudad: "Asunción",
      evaluadorAsignado: "Lic. Michelle Romero",
      creadoPor: "admin",
      estado: "pendiente",
      pasoActual: 1,
      datos: {
        nombre: "Postulante",
        apellido: "Confidencial #EXP-803",
        cedula: "3.921.450",
        telefono: "0981 992341",
        ciudad: "Asunción",
        consultorNombre: "Lic. Michelle Romero",
      },
      alertas: [],
      creadoEn: "2026-09-30T19:00:00.000Z",
      actualizadoEn: "2026-09-30T19:00:00.000Z",
    },
  ];

  store.clear();
  semillas.forEach((s) => store.set(s.token, s));
  persistStore();
}

// Cargar al inicializar el módulo
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

  // Si no se encuentra, pero es 'demo' o un token válido, auto-aprovisionar para prevenir 404
  if (!record && token === "demo") {
    record = {
      id: "ent_demo",
      token: "demo",
      entidadSolicitante: "Banco Continental S.A.E.C.A.",
      candidatoNombre: "Rodrigo Benítez Martínez",
      cedula: "4.892.150",
      telefono: "0981 774890",
      ciudad: "Luque",
      evaluadorAsignado: "Lic. Michelle Romero",
      creadoPor: "admin",
      estado: "en_progreso",
      pasoActual: 8,
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
          { idioma: "Inglés", nivel: "intermedio" },
        ],
        situacionActual: "empleado",
        empresaAnterior: "Manufactura de Pilar S.A.",
        cargoAnterior: "Jefe de Compras y Logística",
        antiguedad: "4 años 6 meses",
        salarioAnterior: 7500000,
        disponibilidad: "inmediata",
        pretensionSalarial: "8.500.000 Gs.",
        aspectosPositivos: "Alto compromiso con metas operativas, liderazgo de equipos y puntualidad.",
        aspectosMejorar: "Perfeccionamiento continuo en sistemas de reportería BI.",
        visionLargoPlazo: "Consolidar posición gerencial en el sector financiero y corporativo.",
        expectativasEntidad: "Estabilidad laboral, proyección de carrera y desarrollo profesional.",
        relacionPadres: "casados",
        estructuraFamiliar: "Convive con su cónyuge y un hijo de 4 años.",
        hijos: true,
        cantidadHijos: 1,
        edadesHijos: "4 años",
        seguroMedico: "ambos",
        consumoAlcohol: "social",
        consumoTabaco: false,
        ingresosFamiliares: "11.000.000 Gs. (titular + cónyuge)",
        otrosIngresos: "1.500.000 Gs. (asesoría logística externa)",
        egresosMensuales: "5.800.000 Gs. (alimentación, servicios, colegio)",
        prestamos: true,
        prestamosDetalle: "Préstamo automotriz Itaú al día, saldo 8 cuotas",
        ciudad: "Luque",
        barrio: "Cuarto Barrio",
        direccion: "Dr. Fernando de la Mora c/ Rosario",
        coordenadas: "-25.269932, -57.489012",
        plusCode: "6867+XQ Luque",
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
        observacionesEntrevista: "Verificación in situ favorable. Residencia consolidada de mampostería, medidor ANDE NIS 2489102 activo y sin derivaciones. Coherencia socioeconómica alta.",
        diccion: "segura",
        estadoVivienda: "excelente",
        quienesPresentes: "El solicitante y su cónyuge",
        fechaVisita: "2026-10-02",
        consultorNombre: "Lic. Michelle Romero",
      },
      alertas: [],
      creadoEn: "2026-10-01T08:00:00.000Z",
      actualizadoEn: "2026-10-02T15:30:00.000Z",
    };
    store.set(token, record);
    persistStore();
  } else if (!record && token.length >= 4) {
    record = crearEntrevista("Evaluación Pericial Confidencial", token, "Lic. Michelle Romero", "admin");
    record.candidatoNombre = "Postulante en Evaluación";
    store.set(token, record);
    persistStore();
  }

  return record;
}

export function actualizarEntrevista(token: string, patch: Partial<EntrevistaRecord>): EntrevistaRecord | null {
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
    (a, b) => new Date(b.actualizadoEn).getTime() - new Date(a.actualizadoEn).getTime()
  );
}

export function listarEntrevistasPorEvaluador(evaluadorNombre: string): EntrevistaRecord[] {
  const clean = evaluadorNombre.toLowerCase().trim();
  return listarEntrevistas().filter((e) => (e.evaluadorAsignado || "").toLowerCase().trim() === clean);
}
