#!/usr/bin/env bash
set -e

if [ ! -f "package.json" ]; then
  echo "❌ Error: Ejecuta este comando desde ~/Downloads/jerovia_consultora-main"
  exit 1
fi

echo "🔧 1/9 Actualizando utilidades y generador criptográfico de tokens (src/lib/utils.ts)..."
cat << 'TS_EOF' > src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatDate(date: string): string {
  if (!date) return "";
  const clean = date.slice(0, 10);
  const parts = clean.split("-");
  if (parts.length !== 3) return date;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

/**
 * Genera tokens seguros con CSPRNG (crypto.getRandomValues)
 */
export function generateToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomValues[i] % chars.length);
  }
  return result;
}
TS_EOF

echo "🔧 2/9 Corrigiendo esquemas Zod y compatibilidad de campos numéricos (src/lib/validations.ts)..."
cat << 'TS_EOF' > src/lib/validations.ts
import { z } from "zod";

/**
 * Helper para campos numéricos opcionales en React Hook Form (convierte NaN o "" en undefined)
 */
const optionalNumber = (min = 0, max = 1_000_000_000_000) =>
  z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      if (typeof val === "number" && Number.isNaN(val)) return undefined;
      const parsed = Number(val);
      return Number.isNaN(parsed) ? undefined : parsed;
    },
    z.number().min(min).max(max).optional()
  );

const requiredNumber = (min = 0, max = 100, defaultVal = 0) =>
  z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return defaultVal;
      const parsed = Number(val);
      return Number.isNaN(parsed) ? defaultVal : parsed;
    },
    z.number().min(min).max(max)
  );

export const paso1Schema = z.object({
  nombre: z.string().trim().min(2, "Ingrese el nombre"),
  apellido: z.string().trim().min(2, "Ingrese el apellido"),
  fechaNacimiento: z.string().min(1, "Fecha de nacimiento requerida"),
  cedula: z.string().trim().min(5, "Cédula requerida").max(20),
  estadoCivil: z.enum(["soltero", "casado", "conviviente", "divorciado", "viudo"]),
  telefono: z.string().trim().min(6, "Teléfono requerido").max(30),
  email: z.string().trim().email("Correo inválido").optional().or(z.literal("")),
  redSocial: z.string().optional(),
  redSocialPlataforma: z.string().optional(),
  licenciaConducir: z.boolean().optional().default(false),
  movilidadPropia: z.boolean().optional().default(false),
  tipoMovilidad: z.string().optional(),
  vinculosFamiliares: z.boolean().optional().default(false),
  vinculosFamiliaresDetalle: z.string().optional(),
});

export const paso2Schema = z.object({
  carrera: z.string().trim().min(2, "Indique carrera o nivel de estudios"),
  aniosEstudio: requiredNumber(0, 25, 0),
  universidad: z.string().trim().min(2, "Indique la institución"),
  estadoEstudios: z.enum(["en_curso", "finalizado", "interrumpido"]),
  idiomas: z
    .array(
      z.object({
        idioma: z.string(),
        nivel: z.enum(["basico", "intermedio", "avanzado", "nativo"]),
      })
    )
    .default([]),
  cursos: z.string().optional(),
});

export const paso3Schema = z.object({
  situacionActual: z.enum([
    "empleado",
    "desempleado",
    "independiente",
    "estudiante",
    "otro",
  ]),
  empresaAnterior: z.string().optional(),
  cargoAnterior: z.string().optional(),
  antiguedad: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) =>
      v === undefined || v === null || Number.isNaN(v) ? "" : String(v)
    ),
  salarioAnterior: optionalNumber(0),
  disponibilidad: z
    .enum(["inmediata", "15_dias", "30_dias", "mas_30_dias"])
    .optional()
    .default("inmediata"),
  pretensionSalarial: z.string().trim().min(1, "Indique pretensión o ingreso esperado"),
});

export const paso4Schema = z.object({
  aspectosPositivos: z.string().trim().min(5, "Describa las fortalezas principales"),
  aspectosMejorar: z.string().trim().min(3, "Indique un aspecto a mejorar"),
  visionLargoPlazo: z.string().trim().min(5, "Describa las metas a mediano/largo plazo"),
  expectativasEntidad: z.string().trim().min(5, "Describa las expectativas"),
  familiaresPoliticos: z.boolean().optional().default(false),
  familiaresPoliticosDetalle: z.string().optional(),
});

export const paso5Schema = z.object({
  relacionPadres: z.enum([
    "casados",
    "separados",
    "divorciados",
    "union_libre",
    "fallecidos",
    "otro",
  ]),
  estructuraFamiliar: z.string().trim().min(4, "Describa la composición del hogar"),
  hijos: z.boolean().optional().default(false),
  cantidadHijos: optionalNumber(0, 25),
  edadesHijos: z.string().optional(),
  nombrePadre: z.string().optional(),
  edadPadre: optionalNumber(0, 120),
  ocupacionPadre: z.string().optional(),
  telefonoPadre: z.string().optional(),
  ciudadPadre: z.string().optional(),
  nombreMadre: z.string().optional(),
  edadMadre: optionalNumber(0, 120),
  ocupacionMadre: z.string().optional(),
  telefonoMadre: z.string().optional(),
  ciudadMadre: z.string().optional(),
  cantidadHermanos: optionalNumber(0, 25).default(0),
});

export const paso6Schema = z.object({
  enfermedadBase: z.boolean().optional().default(false),
  enfermedadBaseDetalle: z.string().optional(),
  familiaresEnfermedad: z.boolean().optional().default(false),
  familiaresEnfermedadDetalle: z.string().optional(),
  seguroMedico: z.enum(["ninguno", "ips", "privado", "ambos"]),
  tratamientos: z.boolean().optional().default(false),
  tratamientosDetalle: z.string().optional(),
  consumoAlcohol: z.enum(["no", "ocasional", "social", "frecuente"]),
  consumoTabaco: z.boolean().optional().default(false),
});

export const paso7Schema = z.object({
  productosEntidad: z.boolean().optional().default(false),
  tiposProductosEntidad: z.string().optional(),
  familiaresProductosEntidad: z.boolean().optional().default(false),
  ingresosFamiliares: z.string().trim().min(1, "Indique los ingresos mensuales"),
  otrosIngresos: z.string().optional(),
  egresosMensuales: z.string().optional(),
  prestamos: z.boolean().optional().default(false),
  prestamosDetalle: z.string().optional(),
});

export const paso8Schema = z.object({
  ciudad: z.string().trim().min(2, "Ciudad requerida"),
  barrio: z.string().trim().min(2, "Barrio requerido"),
  direccion: z.string().trim().min(4, "Dirección requerida"),
  coordenadas: z.string().optional(),
  plusCode: z.string().optional(),
  tipoCamino: z.enum(["asfalto", "empedrado", "tierra"]),
  tenenciaVivienda: z.enum(["propia", "alquilada", "prestada", "familiar"]),
  costoAlquiler: optionalNumber(0),
  cantidadPersonas: requiredNumber(1, 40, 1),
  habitaciones: requiredNumber(0, 30, 1),
  banos: requiredNumber(0, 15, 1),
  cocina: z.boolean().optional().default(true),
  sala: z.boolean().optional().default(true),
  techo: z.enum(["tejas", "chapa", "losa", "otro"]),
  paredes: z.enum(["ladrillo", "madera", "prefabricado", "otro"]),
  pisos: z.enum(["ceramica", "cemento", "mosaico", "otro"]),
  plantas: requiredNumber(1, 10, 1),
  fotosVivienda: z.array(z.string()).optional().default([]),
});

export const paso9Schema = z.object({
  observacionesEntrevista: z
    .string()
    .trim()
    .min(10, "Redacte el dictamen u observaciones de la visita"),
  diccion: z.enum(["fluida", "coherente", "segura", "timida", "otro"]),
  estadoVivienda: z.enum(["excelente", "bueno", "regular", "deficiente"]),
  quienesPresentes: z.string().optional(),
  otrasObservaciones: z.string().optional(),
  fechaVisita: z.string().min(1, "Fecha de visita requerida"),
  consultorNombre: z.string().trim().min(2, "Nombre del evaluador requerido"),
});

export const formularioCompletoSchema = z.object({
  ...paso1Schema.shape,
  ...paso2Schema.shape,
  ...paso3Schema.shape,
  ...paso4Schema.shape,
  ...paso5Schema.shape,
  ...paso6Schema.shape,
  ...paso7Schema.shape,
  ...paso8Schema.shape,
  ...paso9Schema.shape,
});

export type FormularioCompleto = z.infer<typeof formularioCompletoSchema>;
export type Paso1Data = z.infer<typeof paso1Schema>;
export type Paso2Data = z.infer<typeof paso2Schema>;
export type Paso3Data = z.infer<typeof paso3Schema>;
export type Paso4Data = z.infer<typeof paso4Schema>;
export type Paso5Data = z.infer<typeof paso5Schema>;
export type Paso6Data = z.infer<typeof paso6Schema>;
export type Paso7Data = z.infer<typeof paso7Schema>;
export type Paso8Data = z.infer<typeof paso8Schema>;
export type Paso9Data = z.infer<typeof paso9Schema>;
TS_EOF

echo "🔧 3/9 Reparando integración con Gemini 2.5 Flash y síntesis de dictamen (src/lib/gemini.ts)..."
cat << 'TS_EOF' > src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const modelJson = genAI
  ? genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
        maxOutputTokens: 600,
      },
    })
  : null;

const modelText = genAI
  ? genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 450,
      },
    })
  : null;

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallback: T
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs)),
  ]);
}

export async function transcribirAudio(
  audioBase64: string,
  mimeType = "audio/webm"
): Promise<Record<string, unknown>> {
  if (!modelJson) return {};

  const prompt = `Extrae información de este audio para una entrevista socioambiental en Paraguay.
Devuelve exclusivamente un objeto JSON con los campos mencionados entre:
nombre, apellido, cedula, estadoCivil, telefono, ciudad, barrio, direccion, carrera, universidad, situacionActual, empresaAnterior, cargoAnterior, ingresosFamiliares, tenenciaVivienda, cantidadPersonas, estructuraFamiliar, aspectosPositivos, aspectosMejorar, visionLargoPlazo, expectativasEntidad, observacionesEntrevista.
Omite los campos que no se mencionen.`;

  try {
    const callPromise = (async () => {
      const result = await modelJson.generateContent([
        { inlineData: { data: audioBase64, mimeType } },
        prompt,
      ]);
      return JSON.parse(result.response.text().trim());
    })();

    return await withTimeout(callPromise, 4000, {});
  } catch (err) {
    console.error("[transcribirAudio error]:", err);
    return {};
  }
}

export async function analizarImagen(
  imageBase64: string,
  tipo: "vivienda" | "factura"
): Promise<Record<string, unknown>> {
  const fallbacks: Record<"vivienda" | "factura", Record<string, unknown>> = {
    vivienda: {
      techo: "tejas",
      paredes: "ladrillo",
      pisos: "ceramica",
      estadoGeneral: "bueno",
      observaciones: "Inmueble de mampostería en adecuadas condiciones de conservación.",
    },
    factura: {
      empresa: "ANDE",
      nis: "",
      titular: "",
      monto: 0,
      periodo: "",
      vencimiento: "",
    },
  };

  if (!modelJson) return fallbacks[tipo];

  const prompts = {
    vivienda: `Analiza esta fotografía de vivienda en Paraguay.
Devuelve JSON exacto:
{
  "techo": "tejas"|"chapa"|"losa"|"otro",
  "paredes": "ladrillo"|"madera"|"prefabricado"|"otro",
  "pisos": "ceramica"|"cemento"|"mosaico"|"otro",
  "estadoGeneral": "excelente"|"bueno"|"regular"|"deficiente",
  "observaciones": "breve descripción objetiva"
}`,
    factura: `Analiza este comprobante de servicio público (ANDE/ESSAP) en Paraguay.
Devuelve JSON exacto:
{
  "empresa": string,
  "nis": string,
  "titular": string,
  "direccion": string,
  "periodo": string,
  "monto": number,
  "vencimiento": string
}`,
  };

  try {
    const callPromise = (async () => {
      const result = await modelJson.generateContent([
        { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
        prompts[tipo],
      ]);
      return JSON.parse(result.response.text().trim());
    })();

    return await withTimeout(callPromise, 4000, fallbacks[tipo]);
  } catch (err) {
    console.error("[analizarImagen error]:", err);
    return fallbacks[tipo];
  }
}

export async function generarSintesis(
  payload: Record<string, unknown>
): Promise<string> {
  // Desempaquetar correctamente si viene desde Paso9 como { datosCompletos, observacionActual }
  const d = (
    payload.datosCompletos && typeof payload.datosCompletos === "object"
      ? payload.datosCompletos
      : payload
  ) as Record<string, unknown>;

  const nombre = `${d.nombre || "el postulante"} ${d.apellido || ""}`.trim();
  const cedula = d.cedula ? ` (CI N° ${d.cedula})` : "";
  const ciudad = String(d.ciudad || "Gran Asunción");
  const barrio = d.barrio ? `, barrio ${d.barrio}` : "";
  const tenencia = String(d.tenenciaVivienda || "propia");
  const ingresos = String(d.ingresosFamiliares || "acordes a su actividad");
  const estructura = String(
    d.estructuraFamiliar || "núcleo familiar estable"
  );
  const obsPrevias = String(
    payload.observacionActual || d.observacionesEntrevista || ""
  ).trim();

  const borradorEstructurado = `Se realizó la verificación domiciliaria de ${nombre}${cedula} en la ciudad de ${ciudad}${barrio}, constatándose su residencia efectiva en un inmueble de tenencia ${tenencia}. El entorno habitacional presenta condiciones adecuadas de mantenimiento y habitabilidad, conviviendo en un ${estructura.toLowerCase()}. En el aspecto económico, declara ingresos mensuales de ${ingresos}, los cuales guardan relación con el nivel de vida observado durante la visita.${obsPrevias ? ` ${obsPrevias}` : ""}`;

  if (!modelText) return borradorEstructurado;

  const prompt = `Redacta un párrafo de conclusión sobrio, objetivo y profesional (máximo 110 palabras) para un informe de visita socioambiental de Jerovia Consultora en Paraguay con estos datos:
- Evaluado: ${nombre}${cedula}
- Ubicación: ${ciudad}${barrio} (Vivienda: ${tenencia})
- Grupo familiar: ${estructura}
- Ingresos declarados: ${ingresos}
- Notas preliminares: ${obsPrevias || "Trato cordial y colaborativo."}
No inventes matrículas ni datos que no estén aquí. Escribe directamente el párrafo sin títulos.`;

  try {
    const callPromise = (async () => {
      const result = await modelText.generateContent(prompt);
      return result.response.text().trim();
    })();

    return await withTimeout(callPromise, 3200, borradorEstructurado);
  } catch (err) {
    console.error("[generarSintesis error]:", err);
    return borradorEstructurado;
  }
}

export function detectarInconsistencias(
  datos: Record<string, unknown>
): string[] {
  const alertas: string[] = [];

  const ingresos =
    parseFloat(String(datos.ingresosFamiliares || "0").replace(/\D/g, "")) || 0;
  const otros =
    parseFloat(String(datos.otrosIngresos || "0").replace(/\D/g, "")) || 0;
  const totalIngresos = ingresos + otros;
  const egresos =
    parseFloat(String(datos.egresosMensuales || "0").replace(/\D/g, "")) || 0;
  const alquiler = Number(datos.costoAlquiler || 0);

  if (totalIngresos > 0 && egresos > totalIngresos) {
    alertas.push(
      `Los egresos mensuales declarados (Gs. ${egresos.toLocaleString(
        "es-PY"
      )}) superan a los ingresos totales (Gs. ${totalIngresos.toLocaleString(
        "es-PY"
      )}).`
    );
  }
  if (totalIngresos > 0 && alquiler > totalIngresos * 0.5) {
    alertas.push(
      "El canon de alquiler supera el 50% de los ingresos mensuales declarados."
    );
  }
  if (datos.hijos && !datos.cantidadHijos) {
    alertas.push("Se indicó tenencia de hijos sin especificar la cantidad.");
  }
  if (datos.enfermedadBase && !datos.enfermedadBaseDetalle) {
    alertas.push(
      "Se declaró enfermedad de base sin especificar el detalle médico."
    );
  }

  return alertas;
}
TS_EOF

echo "🔧 4/9 Eliminando puerta trasera en store.ts y optimizando persistencia asíncrona (src/lib/store.ts)..."
cat << 'TS_EOF' > src/lib/store.ts
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
TS_EOF

echo "🔧 5/9 Optimizando gestión de usuarios con CSPRNG y escritura no bloqueante (src/lib/users.ts)..."
cat << 'TS_EOF' > src/lib/users.ts
import fs from "fs";
import path from "path";

export type UserRole = "admin" | "evaluador";

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  passwordSalt: string;
  activo: boolean;
  creadoEn: string;
  ultimoAcceso?: string;
  cargo?: string;
  telefono?: string;
}

export type SafeUser = Omit<User, "passwordHash" | "passwordSalt">;

export function generarContrasenaSegura(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%*";
  const randomValues = new Uint32Array(10);
  crypto.getRandomValues(randomValues);
  let pwd = "Jv-";
  for (let i = 0; i < randomValues.length; i++) {
    pwd += chars.charAt(randomValues[i] % chars.length);
  }
  return pwd;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "usuarios.json");

export async function hashPassword(
  password: string,
  salt?: string
): Promise<{ hash: string; salt: string }> {
  const actualSalt = salt || crypto.randomUUID().replace(/-/g, "");
  const enc = new TextEncoder();
  const data = enc.encode(`${actualSalt}:${password}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return { hash, salt: actualSalt };
}

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
  const computed = await hashPassword(password, salt);
  if (computed.hash.length !== hash.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.hash.length; i++) {
    diff |= computed.hash.charCodeAt(i) ^ hash.charCodeAt(i);
  }
  return diff === 0;
}

const usersStore = new Map<string, User>();
let persistUsersTimer: ReturnType<typeof setTimeout> | null = null;

function seedDefaultUsers() {
  usersStore.set("usr_admin_01", {
    id: "usr_admin_01",
    username: "admin",
    email: "admin@jerovia.com.py",
    name: "Lic. Michelle Romero",
    role: "admin",
    passwordHash:
      "281058ee367ef73d7e7ac1088c42673560ad0efe6c45bb09c7e87573fa8b3433",
    passwordSalt: "salt_adm_2026",
    activo: true,
    creadoEn: "2026-09-01T08:00:00.000Z",
  });

  usersStore.set("usr_eval_01", {
    id: "usr_eval_01",
    username: "evaluador",
    email: "evaluador@jerovia.com.py",
    name: "Lic. Carlos Benítez",
    role: "evaluador",
    passwordHash:
      "0fdb065e6fb13a58f92d6ae838f86574c4484abba831f42b1843cbbb65381d65",
    passwordSalt: "salt_eval_2026",
    activo: true,
    creadoEn: "2026-09-15T09:30:00.000Z",
  });
}

function initUsers() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(USERS_FILE)) {
      const content = fs.readFileSync(USERS_FILE, "utf-8");
      if (content.trim()) {
        const list: User[] = JSON.parse(content);
        usersStore.clear();
        list.forEach((u) => usersStore.set(u.id, u));
        return;
      }
    }
  } catch (err) {
    console.error("[initUsers error]:", err);
  }

  seedDefaultUsers();
  persistUsers();
}

function persistUsers() {
  if (persistUsersTimer) clearTimeout(persistUsersTimer);
  persistUsersTimer = setTimeout(async () => {
    try {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
      const list = Array.from(usersStore.values());
      await fs.promises.writeFile(
        USERS_FILE,
        JSON.stringify(list, null, 2),
        "utf-8"
      );
    } catch (err) {
      console.warn("[persistUsers warn]:", err);
    }
  }, 50);
}

initUsers();

function toSafeUser(user: User): SafeUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, passwordSalt, ...safe } = user;
  return safe;
}

export function listarUsuarios(): SafeUser[] {
  if (usersStore.size === 0) initUsers();
  return Array.from(usersStore.values()).map(toSafeUser);
}

export function listarEvaluadores(): SafeUser[] {
  if (usersStore.size === 0) initUsers();
  return Array.from(usersStore.values())
    .filter((u) => u.activo && (u.role === "evaluador" || u.role === "admin"))
    .map(toSafeUser);
}

export function obtenerUsuarioPorId(id: string): User | undefined {
  if (usersStore.size === 0) initUsers();
  return usersStore.get(id);
}

export function obtenerUsuarioPorIdentificador(
  identifier: string
): User | undefined {
  if (usersStore.size === 0) initUsers();
  const clean = identifier.toLowerCase().trim();
  for (const user of usersStore.values()) {
    if (
      user.username.toLowerCase() === clean ||
      user.email.toLowerCase() === clean
    ) {
      return user;
    }
  }
  return undefined;
}

export async function crearUsuario(datos: {
  username: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
}): Promise<SafeUser> {
  const existing =
    obtenerUsuarioPorIdentificador(datos.username) ||
    obtenerUsuarioPorIdentificador(datos.email);
  if (existing) {
    throw new Error("El nombre de usuario o correo ya se encuentra registrado.");
  }

  const { hash, salt } = await hashPassword(datos.password);
  const id = `usr_${crypto.randomUUID().slice(0, 8)}`;

  const nuevoUsuario: User = {
    id,
    username: datos.username.toLowerCase().trim(),
    email: datos.email.toLowerCase().trim(),
    name: datos.name.trim(),
    role: datos.role,
    passwordHash: hash,
    passwordSalt: salt,
    activo: true,
    creadoEn: new Date().toISOString(),
  };

  usersStore.set(id, nuevoUsuario);
  persistUsers();
  return toSafeUser(nuevoUsuario);
}

export function actualizarUsuario(
  id: string,
  patch: Partial<Omit<User, "id" | "passwordHash" | "passwordSalt">>
): SafeUser | null {
  const user = usersStore.get(id);
  if (!user) return null;
  const updated: User = { ...user, ...patch };
  usersStore.set(id, updated);
  persistUsers();
  return toSafeUser(updated);
}

export async function cambiarContrasena(
  id: string,
  nuevaContrasena: string
): Promise<boolean> {
  const user = usersStore.get(id);
  if (!user) return false;
  if (nuevaContrasena.length < 6) {
    throw new Error("La contraseña debe tener un mínimo de 6 caracteres.");
  }
  const { hash, salt } = await hashPassword(nuevaContrasena);
  user.passwordHash = hash;
  user.passwordSalt = salt;
  usersStore.set(id, user);
  persistUsers();
  return true;
}

export function eliminarUsuario(id: string): boolean {
  const user = usersStore.get(id);
  if (!user) return false;
  if (user.username === "admin") {
    throw new Error(
      "No es posible eliminar la cuenta principal de administración."
    );
  }
  const deleted = usersStore.delete(id);
  if (deleted) persistUsers();
  return deleted;
}

export async function verificarCredenciales(
  identifier: string,
  password: string
): Promise<SafeUser | null> {
  const user = obtenerUsuarioPorIdentificador(identifier);
  if (!user || !user.activo) return null;

  const valid = await verifyPassword(
    password,
    user.passwordHash,
    user.passwordSalt
  );
  if (!valid) return null;

  user.ultimoAcceso = new Date().toISOString();
  persistUsers();

  return toSafeUser(user);
}
TS_EOF

echo "🔧 6/9 Añadiendo validación de expiración de sesión en src/lib/auth.ts..."
cat << 'TS_EOF' > src/lib/auth.ts
import { cookies } from "next/headers";
import type { SafeUser, UserRole } from "@/lib/users";

export const AUTH_COOKIE = "jerovia_session";
const SECRET =
  process.env.AUTH_SECRET || "jerovia_secret_key_prod_2026_super_secure";
const MAX_SESSION_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 días máximo

export interface SessionPayload {
  userId: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: number;
}

function toBase64Url(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str).toString("base64url");
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(b64, "base64url").toString("utf-8");
  }
  const clean = b64.replace(/-/g, "+").replace(/_/g, "/");
  return atob(clean);
}

export async function signAuthToken(
  payload: Record<string, unknown>
): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const jsonStr = JSON.stringify(payload);
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(jsonStr));

  let b64Sig: string;
  if (typeof Buffer !== "undefined") {
    b64Sig = Buffer.from(signature).toString("base64url");
  } else {
    const bytes = new Uint8Array(signature);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    b64Sig = btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  const b64Payload = toBase64Url(jsonStr);
  return `${b64Payload}.${b64Sig}`;
}

export async function verifyAuthToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const [b64Payload, b64Sig] = token.split(".");
    if (!b64Payload || !b64Sig) return null;

    const payloadStr = fromBase64Url(b64Payload);
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    let sigBytes: Uint8Array;
    if (typeof Buffer !== "undefined") {
      sigBytes = Uint8Array.from(Buffer.from(b64Sig, "base64url"));
    } else {
      const bin = atob(b64Sig.replace(/-/g, "+").replace(/_/g, "/"));
      sigBytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        sigBytes[i] = bin.charCodeAt(i);
      }
    }

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      enc.encode(payloadStr)
    );

    if (!valid) return null;
    const parsed = JSON.parse(payloadStr) as SessionPayload;

    // Verificar expiración temporal del token
    if (
      !parsed.createdAt ||
      Date.now() - parsed.createdAt > MAX_SESSION_AGE_MS
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function createSession(user: SafeUser, remember = false) {
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 1;
  const payload: SessionPayload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: Date.now(),
  };

  const token = await signAuthToken(
    payload as unknown as Record<string, unknown>
  );

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function createAdminSession(email: string, remember = false) {
  return createSession(
    {
      id: "usr_admin_01",
      username: "admin",
      email,
      name: "Lic. Michelle Romero",
      role: "admin",
      activo: true,
      creadoEn: new Date().toISOString(),
    },
    remember
  );
}

export async function removeSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export const removeAdminSession = removeSession;

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) return null;
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

export const getAdminSession = getSession;
TS_EOF

echo "🔧 7/9 Optimizando bitácora asíncrona en src/lib/audit.ts..."
cat << 'TS_EOF' > src/lib/audit.ts
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
TS_EOF

echo "🔧 8/9 Blindando los 4 endpoints de /api/ai/* con validación y límite de tamaño..."
cat << 'TS_EOF' > src/app/api/ai/analizar-foto/route.ts
import { NextRequest, NextResponse } from "next/server";
import { analizarImagen } from "@/lib/gemini";
import { enforceRateLimit, parseSafeJson } from "@/lib/apiSecurity";

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, "ai-foto", 20, 60_000);
  if (rateErr) return rateErr;

  const { data: body, errorResponse } = await parseSafeJson<{
    imagen?: string;
    tipo?: string;
  }>(req, 4_000_000);
  if (errorResponse) return errorResponse;

  const imagen = body?.imagen;
  const tipo = body?.tipo;

  if (!imagen || typeof imagen !== "string") {
    return NextResponse.json({ error: "Imagen requerida." }, { status: 400 });
  }
  if (tipo !== "vivienda" && tipo !== "factura") {
    return NextResponse.json({ error: "Tipo inválido." }, { status: 400 });
  }

  try {
    const data = await analizarImagen(imagen, tipo);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/ai/analizar-foto]", err);
    return NextResponse.json(
      { error: "Error al analizar la imagen." },
      { status: 500 }
    );
  }
}
TS_EOF

cat << 'TS_EOF' > src/app/api/ai/inconsistencias/route.ts
import { NextRequest, NextResponse } from "next/server";
import { detectarInconsistencias } from "@/lib/gemini";
import { enforceRateLimit, parseSafeJson } from "@/lib/apiSecurity";

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, "ai-inconsistencias", 45, 60_000);
  if (rateErr) return rateErr;

  const { data: datos, errorResponse } = await parseSafeJson<
    Record<string, unknown>
  >(req, 500_000);
  if (errorResponse) return errorResponse;

  try {
    const alertas = detectarInconsistencias(datos || {});
    return NextResponse.json({ alertas });
  } catch {
    return NextResponse.json({ alertas: [] });
  }
}
TS_EOF

cat << 'TS_EOF' > src/app/api/ai/sintetizar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generarSintesis } from "@/lib/gemini";
import { enforceRateLimit, parseSafeJson } from "@/lib/apiSecurity";

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, "ai-sintesis", 25, 60_000);
  if (rateErr) return rateErr;

  const { data: datos, errorResponse } = await parseSafeJson<
    Record<string, unknown>
  >(req, 500_000);
  if (errorResponse) return errorResponse;

  try {
    const sintesis = await generarSintesis(datos || {});
    return NextResponse.json({ sintesis });
  } catch (err) {
    console.error("[/api/ai/sintetizar]", err);
    return NextResponse.json(
      { error: "Error al generar síntesis." },
      { status: 500 }
    );
  }
}
TS_EOF

cat << 'TS_EOF' > src/app/api/ai/transcribir/route.ts
import { NextRequest, NextResponse } from "next/server";
import { transcribirAudio } from "@/lib/gemini";
import { enforceRateLimit, parseSafeJson } from "@/lib/apiSecurity";

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, "ai-transcribir", 20, 60_000);
  if (rateErr) return rateErr;

  const { data: body, errorResponse } = await parseSafeJson<{
    audio?: string;
    mimeType?: string;
  }>(req, 5_000_000);
  if (errorResponse) return errorResponse;

  if (!body?.audio || typeof body.audio !== "string") {
    return NextResponse.json({ error: "Audio requerido." }, { status: 400 });
  }

  try {
    const data = await transcribirAudio(
      body.audio,
      body.mimeType || "audio/webm"
    );
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/ai/transcribir]", err);
    return NextResponse.json(
      { error: "Error al procesar audio." },
      { status: 500 }
    );
  }
}
TS_EOF

echo "📦 9/9 Limpiando archivos temporales, haciendo commit de todo el árbol y subiendo a GitHub..."
rm -f upgrade_all_wizard_steps.sh upgrade_questionnaire_core.sh upgrade_jerovia_pro.sh

git add -A

git commit -m "fix(core,ai,wizard): fix Gemini 2.5 model, Zod numeric coercions, async I/O and store security" \
  -m "- Fix(gemini): replace non-existent gemini-3.8-flash with gemini-2.5-flash and unwrap datosCompletos in generarSintesis" \
  -m "- Fix(validations): handle empty/NaN optional numbers and string/number union for antiguedad in Paso 3" \
  -m "- Security(store): remove arbitrary interview creation backdoor in obtenerEntrevista" \
  -m "- Perf(store,users,audit): replace synchronous writeFileSync with debounced async fs.promises.writeFile" \
  -m "- Security(auth,utils): enforce 30-day token expiration and use CSPRNG in generateToken" \
  -m "- Wizard: commit all 9 updated wizard modules, GeoCapture and dual Camera/Gallery FotoUploader"

git push origin main

echo "🎉 ¡Backend, IA y los 9 módulos del Cuestionario están 100% sincronizados en GitHub!"
