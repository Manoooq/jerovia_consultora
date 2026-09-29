import { z } from "zod";

export const paso1Schema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  apellido: z.string().min(2, "Apellido requerido"),
  fechaNacimiento: z.string().min(1, "Fecha de nacimiento requerida"),
  cedula: z.string().min(5, "CI requerido").max(12),
  estadoCivil: z.enum(["soltero", "casado", "conviviente", "divorciado", "viudo"]),
  telefono: z.string().min(7, "Teléfono requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  redSocial: z.string().optional(),
  redSocialPlataforma: z.string().optional(),
  licenciaConducir: z.boolean().optional().default(false),
  movilidadPropia: z.boolean().optional().default(false),
  tipoMovilidad: z.string().optional(),
  vinculosFamiliares: z.boolean().optional().default(false),
  vinculosFamiliaresDetalle: z.string().optional(),
});

export const paso2Schema = z.object({
  carrera: z.string().min(2, "Carrera requerida"),
  aniosEstudio: z.coerce.number().min(0).max(10),
  universidad: z.string().min(2, "Universidad requerida"),
  estadoEstudios: z.enum(["en_curso", "finalizado", "interrumpido"]),
  idiomas: z.array(z.object({
    idioma: z.string(),
    nivel: z.enum(["basico", "intermedio", "avanzado", "nativo"]),
  })).default([]),
  cursos: z.string().optional(),
});

export const paso3Schema = z.object({
  situacionActual: z.enum(["empleado", "desempleado", "independiente", "estudiante", "otro"]),
  empresaAnterior: z.string().optional(),
  cargoAnterior: z.string().optional(),
  antiguedad: z.string().optional(),
  salarioAnterior: z.coerce.number().min(0).optional(),
  disponibilidad: z.enum(["inmediata", "15_dias", "30_dias", "mas_30_dias"]),
  pretensionSalarial: z.string().min(1, "Pretensión salarial requerida"),
});

export const paso4Schema = z.object({
  aspectosPositivos: z.string().min(10, "Describe al menos una fortaleza"),
  aspectosMejorar: z.string().min(5, "Describe un área de mejora"),
  visionLargoPlazo: z.string().min(10, "Describe tu visión"),
  expectativasEntidad: z.string().min(10, "Describe tus expectativas"),
  familiaresPoliticos: z.boolean().optional().default(false),
  familiaresPoliticosDetalle: z.string().optional(),
});

export const paso5Schema = z.object({
  relacionPadres: z.enum(["casados", "separados", "divorciados", "union_libre", "fallecidos", "otro"]),
  estructuraFamiliar: z.string().min(5, "Describe con quiénes vives"),
  hijos: z.boolean().optional().default(false),
  cantidadHijos: z.coerce.number().min(0).max(20).optional(),
  edadesHijos: z.string().optional(),
  nombrePadre: z.string().optional(),
  edadPadre: z.coerce.number().min(0).max(120).optional(),
  ocupacionPadre: z.string().optional(),
  telefonoPadre: z.string().optional(),
  ciudadPadre: z.string().optional(),
  nombreMadre: z.string().optional(),
  edadMadre: z.coerce.number().min(0).max(120).optional(),
  ocupacionMadre: z.string().optional(),
  telefonoMadre: z.string().optional(),
  ciudadMadre: z.string().optional(),
  cantidadHermanos: z.coerce.number().min(0).max(20).optional().default(0),
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
  ingresosFamiliares: z.string().min(1, "Ingresos requeridos"),
  otrosIngresos: z.string().optional(),
  egresosMensuales: z.string().optional(),
  prestamos: z.boolean().optional().default(false),
  prestamosDetalle: z.string().optional(),
});

export const paso8Schema = z.object({
  ciudad: z.string().min(2, "Ciudad requerida"),
  barrio: z.string().min(2, "Barrio requerido"),
  direccion: z.string().min(5, "Dirección requerida"),
  coordenadas: z.string().optional(),
  plusCode: z.string().optional(),
  tipoCamino: z.enum(["asfalto", "empedrado", "tierra"]),
  tenenciaVivienda: z.enum(["propia", "alquilada", "prestada", "familiar"]),
  costoAlquiler: z.coerce.number().min(0).optional(),
  cantidadPersonas: z.coerce.number().min(1).max(30),
  habitaciones: z.coerce.number().min(0).max(20),
  banos: z.coerce.number().min(0).max(10),
  cocina: z.boolean().optional().default(true),
  sala: z.boolean().optional().default(true),
  techo: z.enum(["tejas", "chapa", "losa", "otro"]),
  paredes: z.enum(["ladrillo", "madera", "prefabricado", "otro"]),
  pisos: z.enum(["ceramica", "cemento", "mosaico", "otro"]),
  plantas: z.coerce.number().min(1).max(5).default(1),
  fotosVivienda: z.array(z.string()).optional().default([]),
});

export const paso9Schema = z.object({
  observacionesEntrevista: z.string().min(10, "Describe las observaciones"),
  diccion: z.enum(["fluida", "coherente", "segura", "timida", "otro"]),
  estadoVivienda: z.enum(["excelente", "bueno", "regular", "deficiente"]),
  quienesPresentes: z.string().optional(),
  otrasObservaciones: z.string().optional(),
  fechaVisita: z.string().min(1, "Fecha de visita requerida"),
  consultorNombre: z.string().min(2, "Nombre del consultor requerido"),
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
