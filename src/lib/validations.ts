import { z } from "zod";

export const hermanoItemSchema = z.object({
  nombre: z.string().default(""),
  edad: z.string().default(""),
  ocupacion: z.string().default(""),
  empresa: z.string().default(""),
  domicilio: z.string().default(""),
});

export const egresoItemSchema = z.object({
  empresa: z.string().default(""),
  monto: z.string().default(""),
});

export const prestamoItemSchema = z.object({
  entidad: z.string().default(""),
  cuota: z.string().default(""),
});

export const paso1Schema = z.object({
  nombre: z.string().trim().min(2, "Ingrese el nombre"),
  apellido: z.string().trim().min(2, "Ingrese el apellido"),
  fotoCandidato: z.string().optional(),
  fechaNacimiento: z.string().min(1, "Fecha de nacimiento requerida"),
  cedula: z.string().trim().min(4, "Cédula requerida").max(25),
  estadoCivil: z.enum(["soltero", "casado", "conviviente", "divorciado", "viudo"]),
  telefono: z.string().trim().min(6, "Teléfono requerido").max(30),
  email: z.string().trim().email("Correo inválido").optional().or(z.literal("")),
  hijos: z.boolean().optional().default(false),
  cantidadHijos: z.coerce.number().min(0).max(25).optional().default(0),
  edadesHijos: z.string().optional(),
  licenciaConducir: z.boolean().optional().default(false),
  movilidadPropia: z.boolean().optional().default(false),
  tipoMovilidad: z.string().optional(),
  medioTransporteSucursal: z.string().optional().default("Ómnibus"),
  tiempoViajeSucursal: z.string().optional().default("30 Minutos"),
  tieneTatuajes: z.enum(["no", "si_no_visibles", "si_visibles"]).optional().default("no"),
  zonaTatuada: z.string().optional(),
  redSocialPlataforma: z.string().optional().default("Instagram"),
  redSocial: z.string().optional(),
  vinculosFamiliares: z.boolean().optional().default(false),
  vinculosFamiliaresDetalle: z.string().optional(),
});

export const paso2Schema = z.object({
  profesion: z.string().optional().default("Estudiante Activo"),
  carrera: z.string().trim().min(2, "Indique carrera o nivel de estudios"),
  cursoActual: z.string().optional().default("2do año"),
  aniosEstudio: z.coerce.number().min(0).max(25).default(2),
  universidad: z.string().trim().min(2, "Indique la institución"),
  estadoEstudios: z.enum(["en_curso", "finalizado", "interrumpido"]).default("en_curso"),
  idiomasTexto: z.string().optional().default("Castellano, Guaraní"),
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
  motivoSalida: z.string().optional(),
  cargoAnterior: z.string().optional(),
  antiguedad: z.coerce.string().optional(),
  antiguedadAnterior: z.string().optional(),
  salarioBruto: z.string().optional(),
  salarioNeto: z.string().optional(),
  salarioAnterior: z.coerce.number().min(0).optional().default(0),
  aportesDescuentos: z.string().optional().default("IPS"),
  cargoPostula: z.string().optional(),
  disponibilidad: z
    .enum(["inmediata", "15_dias", "30_dias", "mas_30_dias"])
    .optional()
    .default("inmediata"),
  pretensionSalarial: z.string().trim().min(1, "Indique pretensión salarial o monto acordado"),
  motivoEleccionEntidad: z.string().optional(),
  objetivosProfesionales: z.string().optional(),
  ambienteLaboralIdeal: z.string().optional(),
  familiarEnEntidad: z.boolean().optional().default(false),
  familiarEnEntidadDetalle: z.string().optional(),
});

export const paso4Schema = z.object({
  aspectosPositivos: z.string().trim().min(3, "Describa los aspectos positivos"),
  aspectosMejorar: z.string().trim().min(3, "Indique la actitud o aspecto a mejorar"),
  visionLargoPlazo: z.string().trim().min(3, "Indique los logros personales que espera cumplir"),
  expectativasEntidad: z.string().optional().default(""),
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
  estructuraFamiliar: z.string().optional().default(""),
  nombreMadre: z.string().optional(),
  edadMadre: z.coerce.number().min(0).max(120).optional().default(0),
  ocupacionMadre: z.string().optional(),
  empresaMadre: z.string().optional(),
  salarioMadre: z.string().optional(),
  ciudadMadre: z.string().optional(),
  telefonoMadre: z.string().optional(),
  nombrePadre: z.string().optional(),
  edadPadre: z.coerce.number().min(0).max(120).optional().default(0),
  ocupacionPadre: z.string().optional(),
  empresaPadre: z.string().optional(),
  salarioPadre: z.string().optional(),
  ciudadPadre: z.string().optional(),
  telefonoPadre: z.string().optional(),
  parejaPadreMadreViveCasa: z.boolean().optional().default(false),
  nombrePareja: z.string().optional(),
  edadPareja: z.coerce.number().min(0).max(120).optional().default(0),
  ocupacionPareja: z.string().optional(),
  empresaPareja: z.string().optional(),
  salarioPareja: z.string().optional(),
  ciudadPareja: z.string().optional(),
  telefonoPareja: z.string().optional(),
  tieneHermanos: z.boolean().optional().default(false),
  cantidadHermanos: z.coerce.number().min(0).max(25).optional().default(0),
  listaHermanos: z.array(hermanoItemSchema).optional().default([]),
  familiaresProductosEntidad: z.boolean().optional().default(false),
  familiarConProductosDetalle: z.string().optional(),
});

export const paso6Schema = z.object({
  enfermedadBase: z.boolean().optional().default(false),
  enfermedadBaseDetalle: z.string().optional(),
  consumeMedicamentos: z.boolean().optional().default(false),
  consumeMedicamentosDetalle: z.string().optional(),
  tieneFobias: z.boolean().optional().default(false),
  tieneFobiasDetalle: z.string().optional(),
  seguroMedico: z.enum(["ninguno", "ips", "privado", "ambos"]),
  consumoAlcohol: z.enum(["no", "ocasional", "social", "frecuente"]),
  consumoTabaco: z.boolean().optional().default(false),
  familiaresEnfermedad: z.boolean().optional().default(false),
  familiaresEnfermedadDetalle: z.string().optional(),
  condicionDiferenteVivienda: z.string().optional().default("Ninguno"),
  tratamientos: z.boolean().optional().default(false),
  tratamientosDetalle: z.string().optional(),
});

export const paso7Schema = z.object({
  productosEntidad: z.boolean().optional().default(false),
  tiposProductosEntidad: z.string().optional(),
  ingresosCubrenDeudas: z.boolean().optional().default(true),
  tieneDependientesEconomicos: z.boolean().optional().default(false),
  dependientesEconomicosDetalle: z.string().optional(),
  ingresosFamiliares: z.string().optional().default(""),
  otrosIngresos: z.string().optional(),
  egresosMensuales: z.string().optional(),
  cantidadEgresos: z.coerce.number().min(0).max(30).optional().default(0),
  listaEgresos: z.array(egresoItemSchema).optional().default([]),
  prestamos: z.boolean().optional().default(false),
  cantidadPrestamos: z.coerce.number().min(0).max(20).optional().default(0),
  listaPrestamos: z.array(prestamoItemSchema).optional().default([]),
  prestamosDetalle: z.string().optional(),
});

export const paso8Schema = z.object({
  ciudad: z.string().trim().min(2, "Ciudad requerida"),
  barrio: z.string().trim().min(2, "Barrio requerido"),
  direccion: z.string().trim().min(3, "Dirección requerida"),
  coordenadas: z.string().optional(),
  plusCode: z.string().optional(),
  tipoCamino: z.enum(["asfalto", "empedrado", "tierra"]),
  tenenciaVivienda: z.enum(["propia", "alquilada", "prestada", "familiar"]),
  costoAlquiler: z.coerce.number().min(0).optional().default(0),
  cantidadPersonas: z.coerce.number().min(1).max(40).default(1),
  quienesVivenCasa: z.string().optional(),
  habitaciones: z.coerce.number().min(0).max(30).default(1),
  salaCantidad: z.coerce.number().min(0).max(10).default(1),
  banos: z.coerce.number().min(0).max(15).default(1),
  cocinaCantidad: z.coerce.number().min(0).max(10).default(1),
  cocina: z.boolean().optional().default(true),
  sala: z.boolean().optional().default(true),
  plantas: z.coerce.number().min(1).max(15).default(1),
  paredes: z.enum(["ladrillo", "madera", "prefabricado", "otro"]).default("ladrillo"),
  paredesDetalle: z.string().optional().default("Ladrillos revocados"),
  techo: z.enum(["tejas", "chapa", "losa", "otro"]).default("tejas"),
  techoDetalle: z.string().optional().default("Teja"),
  pisos: z.enum(["ceramica", "cemento", "mosaico", "otro"]).default("ceramica"),
  pisosDetalle: z.string().optional().default("Baldosa"),
  fotosVivienda: z.array(z.string()).optional().default([]),
});

export const paso9Schema = z.object({
  limpiezaOrdenVivienda: z.string().optional().default("Ordenada y limpia"),
  quienesPresentes: z.string().optional().default("Ninguno"),
  vocabularioEntrevistado: z.string().optional().default("Respetuosa y acorde a la situación"),
  zonaFacilAcceso: z.boolean().optional().default(true),
  observacionesEntrevista: z
    .string()
    .trim()
    .min(3, "Redacte las observaciones de la visita"),
  diccion: z.enum(["fluida", "coherente", "segura", "timida", "otro"]).default("fluida"),
  estadoVivienda: z.enum(["excelente", "bueno", "regular", "deficiente"]).default("bueno"),
  otrasObservaciones: z.string().optional().default("Ninguna"),
  entrevistadorNombre: z.string().optional().default("Michelle Romero"),
  fechaVisita: z.string().min(1, "Fecha de visita requerida"),
  horaVisita: z.string().optional().default("19:00"),
  consultorNombre: z.string().trim().min(2, "Nombre del licenciado/a firmante requerido"),
  firmaEvaluador: z.string().optional(),
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
