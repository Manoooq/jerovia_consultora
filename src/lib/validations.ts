import { z } from "zod";

const safeNum = (defaultVal = 0): z.ZodType<number, number> =>
  z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return defaultVal;
    const n = Number(val);
    return Number.isNaN(n) ? defaultVal : n;
  }, z.number().min(0).default(defaultVal)) as unknown as z.ZodType<number, number>;

const safeStr = (defaultVal = ""): z.ZodType<string, string> =>
  z.preprocess(
    (val) => (val === null || val === undefined ? defaultVal : String(val)),
    z.string().default(defaultVal)
  ) as unknown as z.ZodType<string, string>;

const reqStr = (msg: string, minLen = 2): z.ZodType<string, string> =>
  z.preprocess(
    (val) => (val === null || val === undefined ? "" : String(val)),
    z.string().trim().min(minLen, msg)
  ) as unknown as z.ZodType<string, string>;

const safeBool = (defaultVal = false): z.ZodType<boolean, boolean> =>
  z.preprocess(
    (val) => (val === null || val === undefined ? defaultVal : Boolean(val)),
    z.boolean().default(defaultVal)
  ) as unknown as z.ZodType<boolean, boolean>;

const safeArr = <T>(itemSchema: z.ZodType<T, T>): z.ZodType<T[], T[]> =>
  z.preprocess(
    (val) => (Array.isArray(val) ? val : []),
    z.array(itemSchema).default([])
  ) as unknown as z.ZodType<T[], T[]>;

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

export const idiomaItemSchema = z.object({
  idioma: safeStr(""),
  nivel: safeStr("intermedio"),
});

export const paso1Schema = z.object({
  nombre: reqStr("Ingrese sus nombres", 2),
  apellido: reqStr("Ingrese sus apellidos", 2),
  fotoCandidato: safeStr(""),
  fechaNacimiento: reqStr("Seleccione su fecha de nacimiento", 4),
  cedula: reqStr("Ingrese su número de cédula", 4),
  estadoCivil: reqStr("Seleccione su estado civil", 2),
  telefono: reqStr("Ingrese su número de teléfono", 6),
  email: safeStr(""),
  hijos: safeBool(false),
  cantidadHijos: safeNum(0),
  edadesHijos: safeStr(""),
  licenciaConducir: safeBool(false),
  tenenciaMovilidad: safeStr("no"),
  movilidadPropia: safeBool(false),
  tipoMovilidad: safeStr(""),
  medioTransporteSucursal: reqStr(
    "Indique con qué medio irá a la sucursal asignada",
    2
  ),
  tiempoViajeSucursal: reqStr(
    "Indique cuánto tiempo le toma llegar a la sucursal",
    2
  ),
  tieneTatuajes: safeStr("no"),
  tatuajesVisibles: safeStr("no_visibles"),
  zonaTatuada: safeStr(""),
  redSocialPlataforma: safeStr("Instagram"),
  redSocial: safeStr(""),
  vinculosFamiliares: safeBool(false),
  vinculosFamiliaresDetalle: safeStr(""),
});

export const paso2Schema = z.object({
  profesion: reqStr("Seleccione su situación académica", 2),
  carrera: reqStr("Indique su carrera o nivel de estudios", 2),
  cursoActual: reqStr("Indique el año o curso actual", 1),
  aniosEstudio: safeNum(0),
  universidad: reqStr("Indique la institución o universidad", 2),
  estadoEstudios: safeStr("en_curso"),
  idiomasTexto: reqStr("Seleccione o escriba al menos un idioma que maneja", 2),
  idiomas: safeArr(idiomaItemSchema),
  cursos: safeStr(""),
});

export const paso3Schema = z.object({
  situacionActual: reqStr("Seleccione su condición ocupacional", 2),
  empresaAnterior: safeStr(""),
  motivoSalida: safeStr(""),
  cargoAnterior: safeStr(""),
  antiguedad: safeStr(""),
  antiguedadAnterior: safeStr(""),
  salarioBruto: safeStr(""),
  salarioNeto: safeStr(""),
  salarioAnterior: safeNum(0),
  aportesDescuentos: safeStr(""),
  cargoPostula: reqStr("Indique el cargo al que postula", 2),
  disponibilidad: safeStr("inmediata"),
  pretensionSalarial: reqStr("Indique su pretensión salarial", 2),
  motivoEleccionEntidad: reqStr(
    "Indique por qué eligió este Banco para trabajar",
    3
  ),
  objetivosProfesionales: reqStr(
    "Indique sus objetivos profesionales si se incorpora",
    3
  ),
  ambienteLaboralIdeal: reqStr(
    "Describa cómo sería su ambiente laboral ideal",
    3
  ),
  familiarEnEntidad: safeBool(false),
  familiarEnEntidadDetalle: safeStr(""),
});

export const paso4Schema = z.object({
  aspectosPositivos: reqStr("Describa sus aspectos positivos como persona", 3),
  aspectosMejorar: reqStr("Indique una actitud o aspecto a mejorar", 3),
  visionLargoPlazo: reqStr(
    "Indique los logros personales que espera cumplir",
    3
  ),
  expectativasEntidad: safeStr(""),
  familiaresPoliticos: safeBool(false),
  familiaresPoliticosDetalle: safeStr(""),
});

export const paso5Schema = z.object({
  relacionPadres: reqStr("Seleccione la relación de sus padres", 2),
  estructuraFamiliar: safeStr(""),
  nombreMadre: reqStr("Ingrese el nombre y apellido de su madre", 2),
  edadMadre: safeNum(0),
  ocupacionMadre: reqStr("Indique la ocupación de su madre", 2),
  empresaMadre: safeStr(""),
  salarioMadre: safeStr(""),
  ciudadMadre: safeStr(""),
  telefonoMadre: safeStr(""),
  nombrePadre: reqStr("Ingrese el nombre y apellido de su padre", 2),
  edadPadre: safeNum(0),
  ocupacionPadre: reqStr("Indique la ocupación de su padre", 2),
  empresaPadre: safeStr(""),
  salarioPadre: safeStr(""),
  ciudadPadre: safeStr(""),
  telefonoPadre: safeStr(""),
  parejaPadreMadreViveCasa: safeBool(false),
  nombrePareja: safeStr(""),
  edadPareja: safeNum(0),
  ocupacionPareja: safeStr(""),
  empresaPareja: safeStr(""),
  salarioPareja: safeStr(""),
  ciudadPareja: safeStr(""),
  telefonoPareja: safeStr(""),
  tieneHermanos: safeBool(false),
  cantidadHermanos: safeNum(0),
  listaHermanos: safeArr(hermanoItemSchema),
  familiaresProductosEntidad: safeBool(false),
  familiarConProductosDetalle: safeStr(""),
});

export const paso6Schema = z.object({
  enfermedadBase: safeBool(false),
  enfermedadBaseDetalle: safeStr(""),
  consumeMedicamentos: safeBool(false),
  consumeMedicamentosDetalle: safeStr(""),
  tieneFobias: safeBool(false),
  tieneFobiasDetalle: safeStr(""),
  seguroMedico: reqStr("Seleccione si posee seguro médico", 2),
  seguroMedicoDetalle: safeStr(""),
  consumoAlcohol: reqStr("Seleccione una opción", 2),
  consumoTabaco: safeBool(false),
  familiaresEnfermedad: safeBool(false),
  familiaresEnfermedadDetalle: safeStr(""),
  condicionDiferenteVivienda: safeStr("Ninguno"),
  tratamientos: safeBool(false),
  tratamientosDetalle: safeStr(""),
});

export const paso7Schema = z.object({
  productosEntidad: safeBool(false),
  tiposProductosEntidad: safeStr(""),
  ingresosCubrenDeudas: safeBool(true),
  tieneDependientesEconomicos: safeBool(false),
  dependientesEconomicosDetalle: safeStr(""),
  ingresosFamiliares: safeStr(""),
  otrosIngresos: safeStr(""),
  egresosMensuales: safeStr(""),
  cantidadEgresos: safeNum(0),
  listaEgresos: safeArr(egresoItemSchema),
  prestamos: safeBool(false),
  cantidadPrestamos: safeNum(0),
  listaPrestamos: safeArr(prestamoItemSchema),
  prestamosDetalle: safeStr(""),
});

export const paso8Schema = z.object({
  ciudad: reqStr("Ingrese su ciudad", 2),
  barrio: reqStr("Ingrese su barrio", 2),
  direccion: reqStr("Ingrese su dirección", 3),
  coordenadas: safeStr(""),
  plusCode: safeStr(""),
  tipoCamino: reqStr("Seleccione el tipo de trayecto", 2),
  tenenciaVivienda: reqStr("Seleccione la propiedad de la vivienda", 2),
  costoAlquiler: safeNum(0),
  cantidadPersonas: safeNum(1),
  quienesVivenCasa: reqStr(
    "Indique quiénes viven en la casa junto a usted",
    2
  ),
  habitaciones: safeNum(1),
  salaCantidad: safeNum(1),
  banos: safeNum(1),
  cocinaCantidad: safeNum(1),
  cocina: safeBool(true),
  sala: safeBool(true),
  plantas: safeNum(1),
  paredes: safeStr("ladrillo"),
  paredesDetalle: reqStr("Indique el material de las paredes", 2),
  techo: safeStr("tejas"),
  techoDetalle: reqStr("Indique el material del techo", 2),
  pisos: safeStr("ceramica"),
  pisosDetalle: reqStr("Indique el material del piso", 2),
  fotosVivienda: safeArr(safeStr("")),
});

export const paso9Schema = z.object({
  limpiezaOrdenVivienda: safeStr("Ordenada y limpia"),
  quienesPresentes: safeStr("Ninguno"),
  vocabularioEntrevistado: safeStr("Respetuoso y acorde a la situación"),
  zonaFacilAcceso: safeBool(true),
  observacionesEntrevista: reqStr("Redacte las observaciones de la visita", 3),
  diccion: safeStr("fluida"),
  estadoVivienda: safeStr("bueno"),
  otrasObservaciones: safeStr("Ninguna"),
  entrevistadorNombre: safeStr(""),
  fechaVisita: reqStr("Fecha de visita requerida", 4),
  horaVisita: safeStr(""),
  consultorNombre: reqStr("Nombre del licenciado/a firmante requerido", 2),
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
