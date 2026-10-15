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
