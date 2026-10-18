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

export const STEFANIE_DEMO_DATOS: Partial<FormularioCompleto> = {
  nombre: "Stefanie Raquel",
  apellido: "Lovera Ruíz Díaz",
  cedula: "6.260.899",
  fechaNacimiento: "2005-06-18",
  telefono: "0983 603215",
  email: "stefanie.lovera@correo.com.py",
  estadoCivil: "soltero",
  hijos: false,
  cantidadHijos: 0,
  profesion: "Estudiante Activo",
  carrera: "Administración de Empresas",
  cursoActual: "2do año",
  aniosEstudio: 2,
  universidad: "Universidad Autónoma del Paraguay",
  estadoEstudios: "en_curso",
  idiomasTexto: "Castellano, Guaraní",
  idiomas: [
    { idioma: "Castellano", nivel: "nativo" },
    { idioma: "Guaraní", nivel: "avanzado" },
  ],
  aspectosPositivos: "Responsable, puntual y honesta",
  aspectosMejorar: "Autoexigirse demasiado",
  visionLargoPlazo: "Tener una casa y auto propio",
  familiaresPoliticos: false,
  movilidadPropia: false,
  licenciaConducir: false,
  medioTransporteSucursal: "Ómnibus",
  tiempoViajeSucursal: "30 Minutos",
  tieneTatuajes: "si_no_visibles",
  zonaTatuada: "Hombro y antebrazo",
  redSocialPlataforma: "Instagram",
  redSocial: "Stefani-lovera",
  enfermedadBase: false,
  consumeMedicamentos: false,
  tieneFobias: false,
  seguroMedico: "ips",
  consumoAlcohol: "no",
  consumoTabaco: false,
  familiaresEnfermedad: true,
  familiaresEnfermedadDetalle: "Padre con diabetes",
  condicionDiferenteVivienda: "Ninguno",
  tratamientos: false,
  relacionPadres: "separados",
  estructuraFamiliar: "Padre, madrastra y hermanos",
  nombreMadre: "Raquel Ruiz Diaz",
  edadMadre: 42,
  ocupacionMadre: "Enfermera",
  empresaMadre: "Independiente",
  salarioMadre: "4.000.000",
  ciudadMadre: "Villa Elisa",
  telefonoMadre: "0981 661702",
  nombrePadre: "Miguel Lovera",
  edadPadre: 53,
  ocupacionPadre: "Empleado Público",
  empresaPadre: "ANDE",
  salarioPadre: "15.000.000",
  ciudadPadre: "Asunción",
  telefonoPadre: "0981 448401",
  parejaPadreMadreViveCasa: true,
  nombrePareja: "Silvana Rios",
  edadPareja: 44,
  ocupacionPareja: "Abogada",
  empresaPareja: "ANDE",
  salarioPareja: "15.000.000",
  ciudadPareja: "Asunción",
  telefonoPareja: "0981 200456",
  tieneHermanos: true,
  cantidadHermanos: 9,
  listaHermanos: [
    { nombre: "Luciana Ramírez", edad: "9", ocupacion: "Estudiante", empresa: "-", domicilio: "Villa Elisa" },
    { nombre: "Sofia Ruiz Diaz", edad: "6", ocupacion: "Estudiante", empresa: "-", domicilio: "Villa Elisa" },
    { nombre: "Noa Ruiz Diaz", edad: "5", ocupacion: "Estudiante", empresa: "-", domicilio: "Villa Elisa" },
    { nombre: "José Lovera", edad: "23", ocupacion: "Empleado Privado", empresa: "Rubro Electrónica", domicilio: "Asunción" },
    { nombre: "María Lovera", edad: "21", ocupacion: "Mecánica", empresa: "BMW", domicilio: "Asunción" },
    { nombre: "Fabricio Lovera", edad: "16", ocupacion: "Estudiante", empresa: "-", domicilio: "Asunción" },
    { nombre: "Mauricio Lovera", edad: "12", ocupacion: "Estudiante", empresa: "-", domicilio: "Asunción" },
    { nombre: "Alejandra Lovera", edad: "11", ocupacion: "Estudiante", empresa: "-", domicilio: "Asunción" },
    { nombre: "Santino Lovera", edad: "8", ocupacion: "Estudiante", empresa: "-", domicilio: "Asunción" },
  ],
  familiaresProductosEntidad: true,
  familiarConProductosDetalle: "Padre, Madre - Tarjeta de débito",
  ciudad: "Asunción",
  barrio: "Hipódromo",
  direccion: "Calle Encarnación c/ Timbó #1143",
  coordenadas: "-25.3185, -57.5942",
  plusCode: "M9J4+H8 Asunción",
  tipoCamino: "empedrado",
  tenenciaVivienda: "familiar",
  cantidadPersonas: 7,
  quienesVivenCasa: "Padre, madrastra y hermanos",
  habitaciones: 4,
  salaCantidad: 1,
  banos: 4,
  cocinaCantidad: 1,
  cocina: true,
  sala: true,
  plantas: 2,
  paredes: "ladrillo",
  paredesDetalle: "Ladrillos revocados",
  techo: "tejas",
  techoDetalle: "Teja",
  pisos: "ceramica",
  pisosDetalle: "Baldosa",
  productosEntidad: true,
  tiposProductosEntidad: "Tarjeta de débito, Tarjeta de crédito",
  ingresosCubrenDeudas: true,
  tieneDependientesEconomicos: false,
  ingresosFamiliares: "3.044.000",
  egresosMensuales: "1.181.000",
  cantidadEgresos: 4,
  listaEgresos: [
    { empresa: "Facultad", monto: "490.000" },
    { empresa: "Plan Telefonía", monto: "91.000" },
    { empresa: "Bristol", monto: "300.000" },
    { empresa: "Tarjeta de crédito", monto: "300.000" },
  ],
  prestamos: true,
  cantidadPrestamos: 2,
  listaPrestamos: [
    { entidad: "Credimarket", cuota: "500.000" },
    { entidad: "Credimarket", cuota: "259.000" },
  ],
  prestamosDetalle: "Credimarket (Gs. 500.000 y Gs. 259.000)",
  situacionActual: "empleado",
  empresaAnterior: "Negocios y servicios",
  motivoSalida: "Para pasar a formar parte del plantel del Banco",
  cargoAnterior: "Pago de salarios",
  antiguedad: "5 meses",
  antiguedadAnterior: "1 año 7 meses",
  salarioBruto: "3.044.000",
  salarioNeto: "2.770.040",
  salarioAnterior: 3044000,
  aportesDescuentos: "IPS",
  cargoPostula: "Atención al cliente",
  pretensionSalarial: "4.917.731 (salario mínimo bancario)",
  motivoEleccionEntidad: "Por las oportunidades de crecimiento laboral y personal",
  objetivosProfesionales: "Trabajar en el área comercial",
  ambienteLaboralIdeal: "Tranquilo y con buena comunicación",
  familiarEnEntidad: false,
  limpiezaOrdenVivienda: "Ordenada y limpia",
  quienesPresentes: "Ninguno",
  vocabularioEntrevistado: "Respetuosa y acorde a la situación",
  zonaFacilAcceso: true,
  observacionesEntrevista:
    "La postulante se muestra respetuosa, colaboradora y con vocabulario acorde a la situación. La vivienda familiar de 2 plantas se verificó ordenada y limpia, ubicada en zona de fácil acceso.",
  otrasObservaciones: "Ninguna",
  entrevistadorNombre: "Michelle Romero",
  fechaVisita: "2026-10-07",
  horaVisita: "19:03",
  consultorNombre: "Lic. Michelle Romero",
};

/**
 * Codifica metadatos esenciales dentro del propio token para que el enlace
 * funcione en cualquier instancia serverless de Vercel sin dar error 404.
 */
export function encodeSmartToken(meta: {
  e: string; // entidadSolicitante
  n?: string; // candidatoNombre
  c?: string; // cedula
  t?: string; // telefono
  l?: string; // ciudad
  v?: string; // evaluadorAsignado
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

function decodeSmartToken(token: string): Partial<EntrevistaRecord> | null {
  if (!token.startsWith("jv_")) return null;
  try {
    const parts = token.split("_");
    if (parts.length < 3) return null;
    const b64 = parts.slice(1, -1).join("_");
    const parsed = JSON.parse(Buffer.from(b64, "base64url").toString("utf-8"));
    return {
      entidadSolicitante: parsed.e || "Banco Continental",
      candidatoNombre: parsed.n || "",
      cedula: parsed.c || "",
      telefono: parsed.t || "",
      ciudad: parsed.l || "Asunción",
      evaluadorAsignado: parsed.v || "Lic. Michelle Romero",
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

  if (!store.has("tok_stefanie_01")) {
    seedInitial();
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

function seedInitial() {
  const semillas: EntrevistaRecord[] = [
    {
      id: "ent_stefanie",
      token: "tok_stefanie_01",
      entidadSolicitante: "Banco Continental",
      candidatoNombre: "Stefanie Raquel Lovera Ruíz Díaz",
      cedula: "6.260.899",
      telefono: "0983 603215",
      ciudad: "Asunción",
      evaluadorAsignado: "Lic. Michelle Romero",
      creadoPor: "admin",
      estado: "completado",
      pasoActual: 9,
      datos: STEFANIE_DEMO_DATOS,
      alertas: [],
      creadoEn: "2026-10-07T18:00:00.000Z",
      actualizadoEn: "2026-10-07T19:03:00.000Z",
    },
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
        ...STEFANIE_DEMO_DATOS,
        nombre: "Rodrigo",
        apellido: "Benítez Martínez",
        cedula: "4.892.150",
        telefono: "0981 774890",
        ciudad: "Luque",
        barrio: "Cuarto Barrio",
      },
      alertas: [],
      creadoEn: "2026-09-28T10:00:00.000Z",
      actualizadoEn: "2026-09-30T16:30:00.000Z",
    },
  ];

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

  if (!record && token === "demo") {
    record = {
      id: "ent_demo",
      token: "demo",
      entidadSolicitante: "Banco Continental",
      candidatoNombre: "Stefanie Raquel Lovera Ruíz Díaz",
      cedula: "6.260.899",
      telefono: "0983 603215",
      ciudad: "Asunción",
      evaluadorAsignado: "Lic. Michelle Romero",
      creadoPor: "admin",
      estado: "en_progreso",
      pasoActual: 1,
      datos: { ...STEFANIE_DEMO_DATOS },
      alertas: [],
      creadoEn: "2026-10-07T18:00:00.000Z",
      actualizadoEn: new Date().toISOString(),
    };
    store.set(token, record);
    persistStore();
    return record;
  }

  // Si el enlace se abrió en otra instancia serverless de Vercel, reconstruir desde el Smart Token o habilitar automáticamente
  if (!record && (token.startsWith("jv_") || token.startsWith("tok_") || token.length >= 8)) {
    const decoded = decodeSmartToken(token);
    const fullName = decoded?.candidatoNombre || "";
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts.slice(0, Math.max(1, nameParts.length - 1)).join(" ");
    const lastName = nameParts.length > 1 ? nameParts.slice(-1).join(" ") : "";

    record = {
      id: `ent_${token.slice(-8)}`,
      token,
      entidadSolicitante: decoded?.entidadSolicitante || "Banco Continental",
      candidatoNombre: decoded?.candidatoNombre || undefined,
      cedula: decoded?.cedula || undefined,
      telefono: decoded?.telefono || undefined,
      ciudad: decoded?.ciudad || "Asunción",
      evaluadorAsignado: decoded?.evaluadorAsignado || "Lic. Michelle Romero",
      creadoPor: "admin",
      estado: "en_progreso",
      pasoActual: 1,
      datos: {
        nombre: firstName || undefined,
        apellido: lastName || undefined,
        cedula: decoded?.cedula || undefined,
        telefono: decoded?.telefono || undefined,
        ciudad: decoded?.ciudad || "Asunción",
        consultorNombre: decoded?.evaluadorAsignado || "Lic. Michelle Romero",
        entrevistadorNombre: decoded?.evaluadorAsignado || "Lic. Michelle Romero",
      },
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
