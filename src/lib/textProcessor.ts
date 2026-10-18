/**
 * Motor de corrección ortográfica automática (Español / Paraguay) y
 * conversión gramatical de primera persona a tercera persona pericial para informes.
 */

const WORD_REPLACEMENTS: Array<[RegExp, string]> = [
  // Ciudades y localidades de Paraguay
  [/\basuncion\b/gi, "Asunción"],
  [/\blambare\b/gi, "Lambaré"],
  [/\bcapiata\b/gi, "Capiatá"],
  [/\b(?:nemby|ñemby)\b/gi, "Ñemby"],
  [/\bitaugua\b/gi, "Itauguá"],
  [/\bguarambare\b/gi, "Guarambaré"],
  [/\baregua\b/gi, "Areguá"],
  [/\bypacarai\b/gi, "Ypacaraí"],
  [/\bcaacupe\b/gi, "Caacupé"],
  [/\bguaira\b/gi, "Guairá"],
  [/\balto parana\b/gi, "Alto Paraná"],
  [/\bencarnacion\b/gi, "Encarnación"],
  [/\bsan cristobal\b/gi, "San Cristóbal"],
  [/\bmbachio\b/gi, "Mbachió"],
  [/\bñemby\b/gi, "Ñemby"],

  // Marcas e instituciones mal escritas frecuentes
  [/\bhiunday\b/gi, "Hyundai"],
  [/\buniverso americana\b/gi, "Universidad Americana"],
  [/\buniversal americana\b/gi, "Universidad Americana"],
  [/\bunivesidad\b/gi, "Universidad"],
  [/\bsalário\b/gi, "Salario"],
  [/\b1millon\b/gi, "1.000.000"],

  // Tildes en sustantivos y adjetivos frecuentes en formularios
  [/\badministracion\b/gi, "Administración"],
  [/\batencion\b/gi, "atención"],
  [/\bcomunicacion\b/gi, "comunicación"],
  [/\binstitucion\b/gi, "institución"],
  [/\borganizacion\b/gi, "organización"],
  [/\bprofesion\b/gi, "profesión"],
  [/\beducacion\b/gi, "educación"],
  [/\binformacion\b/gi, "información"],
  [/\bubicacion\b/gi, "ubicación"],
  [/\bdireccion\b/gi, "dirección"],
  [/\bocupacion\b/gi, "ocupación"],
  [/\bsituacion\b/gi, "situación"],
  [/\brelacion\b/gi, "relación"],
  [/\bcondicion\b/gi, "condición"],
  [/\boperacion\b/gi, "operación"],
  [/\bcapacitacion\b/gi, "capacitación"],
  [/\bcapacitaciones\b/gi, "capacitaciones"],
  [/\bformacion\b/gi, "formación"],
  [/\bincorporacion\b/gi, "incorporación"],
  [/\bconstruccion\b/gi, "construcción"],
  [/\bhabitacion\b/gi, "habitación"],
  [/\bcreditos\b/gi, "créditos"],
  [/\bcredito\b/gi, "crédito"],
  [/\bdebito\b/gi, "débito"],
  [/\bprestamo\b/gi, "préstamo"],
  [/\bprestamos\b/gi, "préstamos"],
  [/\bomnibus\b/gi, "ómnibus"],
  [/\bvehiculo\b/gi, "vehículo"],
  [/\bvehiculos\b/gi, "vehículos"],
  [/\bautomovil\b/gi, "automóvil"],
  [/\btelefono\b/gi, "teléfono"],
  [/\btelefonia\b/gi, "telefonía"],
  [/\bmedico\b/gi, "médico"],
  [/\bmedica\b/gi, "médica"],
  [/\beconomico\b/gi, "económico"],
  [/\beconomica\b/gi, "económica"],
  [/\bacademico\b/gi, "académico"],
  [/\bacademica\b/gi, "académica"],
  [/\bpublico\b/gi, "público"],
  [/\bpublica\b/gi, "pública"],
  [/\blogistica\b/gi, "logística"],
  [/\bmecanica\b/gi, "mecánica"],
  [/\belectronica\b/gi, "electrónica"],
  [/\bgastronomia\b/gi, "gastronomía"],
  [/\bconsultoria\b/gi, "consultoría"],
  [/\bauditoria\b/gi, "auditoría"],
  [/\bpasantia\b/gi, "pasantía"],
  [/\banfitrion\b/gi, "Anfitrión"],
  [/\bminimo\b/gi, "mínimo"],
  [/\bmaximo\b/gi, "máximo"],
  [/\bbasico\b/gi, "básico"],
  [/\bingles\b/gi, "Inglés"],
  [/\bguarani\b/gi, "Guaraní"],
  [/\bportugues\b/gi, "Portugués"],
  [/\baleman\b/gi, "Alemán"],
  [/\bfrances\b/gi, "Francés"],
  [/\bceramica\b/gi, "cerámica"],
  [/\bhormigon\b/gi, "hormigón"],
  [/\bmamposteria\b/gi, "mampostería"],
  [/\btimida\b/gi, "tímida"],
  [/\btimido\b/gi, "tímido"],
  [/\btambien\b/gi, "también"],
  [/\bademas\b/gi, "además"],
  [/\baun\b/gi, "aún"],
  [/\barea\b/gi, "área"],
  [/\bareas\b/gi, "áreas"],
  [/\bhabito\b/gi, "hábito"],
  [/\bhabitos\b/gi, "hábitos"],
  [/\bningun\b/gi, "ningún"],
  [/\balgun\b/gi, "algún"],
  [/\bnumero\b/gi, "número"],
  [/\bcedula\b/gi, "cédula"],
  [/\bcodigo\b/gi, "código"],
  [/\bmodulo\b/gi, "módulo"],
  [/\bfacil\b/gi, "fácil"],
  [/\bdificil\b/gi, "difícil"],
  [/\butil\b/gi, "útil"],
  [/\banalisis\b/gi, "análisis"],
  [/\bsintesis\b/gi, "síntesis"],
  [/\baprender mas\b/gi, "aprender más"],
  [/\bmas adelante\b/gi, "más adelante"],
  [/\bmas rapido\b/gi, "más rápido"],
  [/\bmi mama\b/gi, "mi mamá"],
  [/\bmi papa\b/gi, "mi papá"],
  [/\bmi version\b/gi, "mi versión"],
  [/\bmejor version\b/gi, "mejor versión"],
];

/**
 * Autocorrige ortografía, tildes y puntuación respetando íntegramente el sentido del texto.
 */
export function corregirOrtografiaTexto(input: string): string {
  if (!input || typeof input !== "string") return "";

  // No alterar emails, handles de redes, URLs o números puros
  const trimmed = input.trim();
  if (
    !trimmed ||
    trimmed.includes("@") ||
    trimmed.startsWith("http") ||
    trimmed.startsWith("data:") ||
    /^[0-9.,+\-\s()]+$/.test(trimmed)
  ) {
    return input;
  }

  let text = trimmed;

  // Normalizar espacios después de comas (ej. "nuevas,dar" -> "nuevas, dar")
  text = text.replace(/,([a-zA-ZáéíóúñÁÉÍÓÚÑ])/g, ", $1");
  text = text.replace(/\s{2,}/g, " ");

  for (const [pattern, replacement] of WORD_REPLACEMENTS) {
    text = text.replace(pattern, (match) => {
      // Preservar mayúscula inicial si la palabra original empezaba con mayúscula
      const firstChar = match.charAt(0);
      if (
        firstChar === firstChar.toUpperCase() &&
        firstChar !== firstChar.toLowerCase()
      ) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }

  // Capitalizar primera letra de la oración si empieza con letra minúscula
  if (/^[a-záéíóúñ]/.test(text)) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }

  return text;
}

/**
 * Convierte respuestas redactadas en 1ª persona por el postulante a 3ª persona formal
 * para la extracción de informes periciales (PDF y PowerPoint).
 */
export function convertirATerceraPersona(input: unknown): string {
  if (input === undefined || input === null) return "";
  const raw = String(input).trim();
  if (!raw) return "";

  // Si es un dato corto técnico ("-", "No", "Sí", números, fechas, emails), solo corregir ortografía básica
  if (
    raw === "-" ||
    raw.toLowerCase() === "no" ||
    raw.toLowerCase() === "sí" ||
    raw.toLowerCase() === "si" ||
    raw.includes("@") ||
    /^[0-9.,+\-\s/():]+$/.test(raw)
  ) {
    return corregirOrtografiaTexto(raw);
  }

  // Quitar guiones iniciales de viñeta suelta (ej. "- Aprender bastante..." -> "Aprender bastante...")
  let text = corregirOrtografiaTexto(raw.replace(/^-\s*/, ""));

  const rules: Array<[RegExp, string]> = [
    // Frases reflexivas y verbos pronominales en 1ª persona
    [/\bme considero\b/gi, "se considera"],
    [/\bme defino como\b/gi, "se define como"],
    [/\bme gusta\b/gi, "le gusta"],
    [/\bme gustan\b/gi, "le gustan"],
    [/\bme encantaría\b/gi, "le encantaría"],
    [/\bme encanta\b/gi, "le encanta"],
    [/\bme gustaría\b/gi, "le gustaría"],
    [/\bme gustaria\b/gi, "le gustaría"],
    [/\bme interesa\b/gi, "le interesa"],
    [/\bme interesan\b/gi, "le interesan"],
    [/\bme motiva\b/gi, "le motiva"],
    [/\bme caracteriza\b/gi, "le caracteriza"],
    [/\bme cuesta\b/gi, "le cuesta"],
    [/\bme desempeño\b/gi, "se desempeña"],
    [/\bme desenvuelvo\b/gi, "se desenvuelve"],
    [/\bme encuentro\b/gi, "se encuentra"],
    [/\bme traslado\b/gi, "se traslada"],
    [/\bme movilizo\b/gi, "se moviliza"],
    [/\bme adapto\b/gi, "se adapta"],
    [/\bme comunico\b/gi, "se comunica"],
    [/\bme esfuerzo\b/gi, "se esfuerza"],
    [/\bme comprometo\b/gi, "se compromete"],
    [/\bme postulo\b/gi, "se postula"],
    [/\bme toque\b/gi, "le toque"],
    [/\bme corresponda\b/gi, "le corresponda"],
    [/\bme asignen\b/gi, "le asignen"],
    [/\bme toma\b/gi, "le toma"],
    [/\bme lleva\b/gi, "le lleva"],

    // Verbo ser / estar / tener / soler / querer / poder / elegir en 1ª persona
    [/\bsoy muy iniciativa\b/gi, "es muy proactiva"],
    [/\bsoy una persona\b/gi, "es una persona"],
    [/\bsoy alguien\b/gi, "es alguien"],
    [/\bsoy muy\b/gi, "es muy"],
    [/\bsoy\b/gi, "es"],
    [/\bestoy trabajando\b/gi, "está trabajando"],
    [/\bestoy cursando\b/gi, "está cursando"],
    [/\bestoy estudiando\b/gi, "está estudiando"],
    [/\bestoy buscando\b/gi, "está buscando"],
    [/\bno estoy trabajando\b/gi, "no está trabajando"],
    [/\baún no tengo\b/gi, "aún no tiene"],
    [/\bno tengo\b/gi, "no tiene"],
    [/\btengo experiencia\b/gi, "tiene experiencia"],
    [/\btengo interés\b/gi, "tiene interés"],
    [/\btengo ganas\b/gi, "tiene ganas"],
    [/\btengo como\b/gi, "tiene como"],
    [/\btengo\b/gi, "tiene"],
    [/\bsuelo ser\b/gi, "suele ser"],
    [/\bsuelo\b/gi, "suele"],
    [/\bquisiera\b/gi, "desea"],
    [/\bquiero\b/gi, "desea"],
    [/\bespero cumplir\b/gi, "espera cumplir"],
    [/\bespero lograr\b/gi, "espera lograr"],
    [/\bespero crecer\b/gi, "espera crecer"],
    [/\bespero\b/gi, "espera"],
    [/\bbusco\b/gi, "busca"],
    [/\bpuedo crecer\b/gi, "puede crecer"],
    [/\bpuedo aportar\b/gi, "puede aportar"],
    [/\bpuedo desarrollar\b/gi, "puede desarrollar"],
    [/\bpuedo\b/gi, "puede"],
    [/\bsiento que\b/gi, "considera que"],
    [/\bconsidero que\b/gi, "considera que"],
    [/\bcreo que\b/gi, "cree que"],
    [/\bpienso que\b/gi, "piensa que"],
    [/\belegí\b/gi, "eligió"],
    [/\belegi\b/gi, "eligió"],
    [/\btrabajé\b/gi, "trabajó"],
    [/\brealicé\b/gi, "realizó"],
    [/\brenuncié\b/gi, "renunció"],
    [/\bsalí\b/gi, "salió"],
    [/\brealizo\b/gi, "realiza"],
    [/\bdesempeño\b/gi, "desempeña"],
    [/\bvivo con\b/gi, "vive con"],
    [/\bvivo en\b/gi, "vive en"],
    [/\bresido\b/gi, "reside"],
    [/\bhabito\b/gi, "habita"],
    [/\bvoy en\b/gi, "se traslada en"],
    [/\btardo\b/gi, "tarda"],
    [/\bdemoro\b/gi, "demora"],

    // Infinitivos enclíticos de 1ª persona (-me -> -se)
    [/\bdestacarme\b/gi, "destacarse"],
    [/\bdesarrollarme\b/gi, "desarrollarse"],
    [/\bsuperarme\b/gi, "superarse"],
    [/\bincorporarme\b/gi, "incorporarse"],
    [/\bcapacitarme\b/gi, "capacitarse"],
    [/\bformarme\b/gi, "formarse"],
    [/\bdesempeñarme\b/gi, "desempeñarse"],
    [/\badaptarme\b/gi, "adaptarse"],
    [/\bcomunicarme\b/gi, "comunicarse"],
    [/\bganarme\b/gi, "ganarse"],
    [/\borganizarme\b/gi, "organizarse"],
    [/\bprepararme\b/gi, "prepararse"],
    [/\bprofesionalizarme\b/gi, "profesionalizarse"],
    [/\bayudarnos\b/gi, "colaborar mutuamente"],

    // Pronombres tónicos de 1ª persona
    [/\blo mejor de mí\b/gi, "lo mejor de sí"],
    [/\blo mejor de mi\b/gi, "lo mejor de sí"],
    [/\bde mi parte\b/gi, "de su parte"],
    [/\bpara mí\b/gi, "para sí"],

    // Parentescos enumerados ("Mi mamá, mi Padrastro mi Hermana" -> "Su mamá, su padrastro y su hermana")
    [/\bmi mamá,\s*mi padrastro\s+mi hermana\b/gi, "su madre, su padrastro y su hermana"],
    [/\bmi mamá,\s*mi padrastro,\s*mi hermana\b/gi, "su madre, su padrastro y su hermana"],

    // Posesivos plurales y singulares ("mis ..." -> "sus ...", "mi ..." -> "su ...")
    [/\bmis\b/gi, "sus"],
    [/\bmi\b/gi, "su"],
    [/\bnuestro\b/gi, "su"],
    [/\bnuestra\b/gi, "su"],
    [/\bnuestros\b/gi, "sus"],
    [/\bnuestras\b/gi, "sus"],
  ];

  for (const [pattern, replacement] of rules) {
    text = text.replace(pattern, (match) => {
      const firstChar = match.charAt(0);
      if (
        firstChar === firstChar.toUpperCase() &&
        firstChar !== firstChar.toLowerCase()
      ) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }

  // Asegurar mayúscula inicial tras conversión
  if (/^[a-záéíóúñ]/.test(text)) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }

  return text;
}
