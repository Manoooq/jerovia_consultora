import { z } from "zod";

const safeNum = (defaultVal = 0) =>
  z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return defaultVal;
    const n = Number(val);
    return Number.isNaN(n) ? defaultVal : n;
  }, z.number().min(0).default(defaultVal));

const safeStr = (defaultVal = "") =>
  z.preprocess(
    (val) => (val === null || val === undefined ? defaultVal : String(val)),
    z.string().default(defaultVal)
  );

export const hermanoItemSchema = z.object({
  nombre: safeStr(""),
  edad: safeStr(""),
  ocupacion: safeStr(""),
  empresa: safeStr(""),
  domicilio: safeStr(""),
});

export const egresoItemSchema = z.object({
  empresa: safeStr(""),
  monto: safeStr(""),
});

export const prestamoItemSchema = z.object({
  entidad: safeStr(""),
  cuota: safeStr(""),
});

export const paso1Schema = z.object({
  nombre: z.string().trim().min(2, "Ingrese nombres"),
  apellido: z.string().trim().min(2, "Ingrese apellidos"),
  fotoCandidato: safeStr(""),
  fechaNacimiento: safeStr(""),
  cedula: z.string().trim().min(3, "Ingrese número de cédula"),
  estadoCivil: safeStr("soltero"),
  telefono: z.string().trim().min(5, "Ingrese número de teléfono"),
  email: safeStr(""),
  hijos: z.boolean().optional().default(false),
  cantidadHijos: safeNum(0),
  edadesHijos: safeStr(""),
  licenciaConducir: z.boolean().optional().default(false),
  tenenciaMovilidad: safeStr("no"), // "no" | "propia" | "familiar"
  movilidadPropia: z.boolean().optional().default(false),
  tipoMovilidad: safeStr(""),
  medioTransporteSucursal: safeStr(""),
  tiempoViajeSucursal: safeStr(""),
  tieneTatuajes: safeStr("no"),
  tatuajesVisibles: safeStr("no_visibles"),
  zonaTatuada: safeStr(""),
  redSocialPlataforma: safeStr("Instagram"),
  redSocial: safeStr(""),
  vinculosFamiliares: z.boolean().optional().default(false),
  vinculosFamiliaresDetalle: safeStr(""),
});

export const paso2Schema = z.object({
  profesion: safeStr("Estudiante"), // "Estudiante" | "Aspirante a estudiar" | "Profesional / Graduado"
  carrera: safeStr(""),
  cursoActual: safeStr(""),
  aniosEstudio: safeNum(0),
  universidad: safeStr(""),
  estadoEstudios: safeStr("en_curso"),
  idiomasTexto: safeStr(""),
  idiomas: z
    .array(
      z.object({
        idioma: safeStr(""),
        nivel: safeStr("intermedio"),
      })
    )
    .optional()
    .default([]),
  cursos: safeStr(""),
});

export const paso3Schema = z.object({
  situacionActual: safeStr("empleado"), // "empleado" | "desempleado" | "pasantia" | "primera_experiencia"
  empresaAnterior: safeStr(""),
  motivoSalida: safeStr(""),
  cargoAnterior: safeStr(""),
  antiguedad: safeStr(""),
  antiguedadAnterior: safeStr(""),
  salarioBruto: safeStr(""),
  salarioNeto: safeStr(""),
  salarioAnterior: safeNum(0),
  aportesDescuentos: safeStr(""),
  cargoPostula: safeStr(""),
  disponibilidad: safeStr("inmediata"),
  pretensionSalarial: safeStr(""),
  motivoEleccionEntidad: safeStr(""),
  objetivosProfesionales: safeStr(""),
  ambienteLaboralIdeal: safeStr(""),
  familiarEnEntidad: z.boolean().optional().default(false),
  familiarEnEntidadDetalle: safeStr(""),
});

export const paso4Schema = z.object({
  aspectosPositivos: safeStr(""),
  aspectosMejorar: safeStr(""),
  visionLargoPlazo: safeStr(""),
  expectativasEntidad: safeStr(""),
  familiaresPoliticos: z.boolean().optional().default(false),
  familiaresPoliticosDetalle: safeStr(""),
});

export const paso5Schema = z.object({
  relacionPadres: safeStr("casados"),
  estructuraFamiliar: safeStr(""),
  nombreMadre: safeStr(""),
  edadMadre: safeNum(0),
  ocupacionMadre: safeStr(""),
  empresaMadre: safeStr(""),
  salarioMadre: safeStr(""),
  ciudadMadre: safeStr(""),
  telefonoMadre: safeStr(""),
  nombrePadre: safeStr(""),
  edadPadre: safeNum(0),
  ocupacionPadre: safeStr(""),
  empresaPadre: safeStr(""),
  salarioPadre: safeStr(""),
  ciudadPadre: safeStr(""),
  telefonoPadre: safeStr(""),
  parejaPadreMadreViveCasa: z.boolean().optional().default(false),
  nombrePareja: safeStr(""),
  edadPareja: safeNum(0),
  ocupacionPareja: safeStr(""),
  empresaPareja: safeStr(""),
  salarioPareja: safeStr(""),
  ciudadPareja: safeStr(""),
  telefonoPareja: safeStr(""),
  tieneHermanos: z.boolean().optional().default(false),
  cantidadHermanos: safeNum(0),
  listaHermanos: z.array(hermanoItemSchema).optional().default([]),
  familiaresProductosEntidad: z.boolean().optional().default(false),
  familiarConProductosDetalle: safeStr(""),
});

export const paso6Schema = z.object({
  enfermedadBase: z.boolean().optional().default(false),
  enfermedadBaseDetalle: safeStr(""),
  consumeMedicamentos: z.boolean().optional().default(false),
  consumeMedicamentosDetalle: safeStr(""),
  tieneFobias: z.boolean().optional().default(false),
  tieneFobiasDetalle: safeStr(""),
  seguroMedico: safeStr("ninguno"),
  seguroMedicoDetalle: safeStr(""),
  consumoAlcohol: safeStr("no"),
  consumoTabaco: z.boolean().optional().default(false),
  familiaresEnfermedad: z.boolean().optional().default(false),
  familiaresEnfermedadDetalle: safeStr(""),
  condicionDiferenteVivienda: safeStr("Ninguno"),
  tratamientos: z.boolean().optional().default(false),
  tratamientosDetalle: safeStr(""),
});

export const paso7Schema = z.object({
  productosEntidad: z.boolean().optional().default(false),
  tiposProductosEntidad: safeStr(""),
  ingresosCubrenDeudas: z.boolean().optional().default(true),
  tieneDependientesEconomicos: z.boolean().optional().default(false),
  dependientesEconomicosDetalle: safeStr(""),
  ingresosFamiliares: safeStr(""),
  otrosIngresos: safeStr(""),
  egresosMensuales: safeStr(""),
  cantidadEgresos: safeNum(0),
  listaEgresos: z.array(egresoItemSchema).optional().default([]),
  prestamos: z.boolean().optional().default(false),
  cantidadPrestamos: safeNum(0),
  listaPrestamos: z.array(prestamoItemSchema).optional().default([]),
  prestamosDetalle: safeStr(""),
});

export const paso8Schema = z.object({
  ciudad: safeStr(""),
  barrio: safeStr(""),
  direccion: safeStr(""),
  coordenadas: safeStr(""),
  plusCode: safeStr(""),
  tipoCamino: safeStr("asfalto"),
  tenenciaVivienda: safeStr("propia"),
  costoAlquiler: safeNum(0),
  cantidadPersonas: safeNum(1),
  quienesVivenCasa: safeStr(""),
  habitaciones: safeNum(1),
  salaCantidad: safeNum(1),
  banos: safeNum(1),
  cocinaCantidad: safeNum(1),
  cocina: z.boolean().optional().default(true),
  sala: z.boolean().optional().default(true),
  plantas: safeNum(1),
  paredes: safeStr("ladrillo"),
  paredesDetalle: safeStr(""),
  techo: safeStr("tejas"),
  techoDetalle: safeStr(""),
  pisos: safeStr("ceramica"),
  pisosDetalle: safeStr(""),
  fotosVivienda: z.array(z.string()).optional().default([]),
});

export const paso9Schema = z.object({
  limpiezaOrdenVivienda: safeStr("Ordenada y limpia"),
  quienesPresentes: safeStr("Ninguno"),
  vocabularioEntrevistado: safeStr("Respetuoso y acorde a la situación"),
  zonaFacilAcceso: z.boolean().optional().default(true),
  observacionesEntrevista: safeStr(""),
  diccion: safeStr("fluida"),
  estadoVivienda: safeStr("bueno"),
  otrasObservaciones: safeStr("Ninguna"),
  entrevistadorNombre: safeStr(""),
  fechaVisita: safeStr(new Date().toISOString().slice(0, 10)),
  horaVisita: safeStr(""),
  consultorNombre: safeStr("Lic. Michelle Romero"),
  firmaEvaluador: safeStr(""),
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
