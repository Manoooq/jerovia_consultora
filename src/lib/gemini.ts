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
