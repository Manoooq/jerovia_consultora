import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { enforceRateLimit, parseSafeJson } from "@/lib/apiSecurity";
import { corregirOrtografiaTexto } from "@/lib/textProcessor";

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

function extraerCamposHeuristico(
  texto: string,
  paso: number
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const clean = texto.trim();
  if (!clean) return out;

  // Paso 1: Datos personales
  if (paso === 1) {
    const ci = clean.match(/(?:ci|c[eé]dula|documento)[:\s]*([0-9.]{5,12})/i);
    if (ci) out.cedula = ci[1].trim();

    const tel = clean.match(/(09[6789][0-9\s.-]{6,10})/);
    if (tel) out.telefono = tel[1].trim();

    const mail = clean.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (mail) out.email = mail[1].trim();

    if (/casad[oa]/i.test(clean)) out.estadoCivil = "casado";
    else if (/solter[oa]/i.test(clean)) out.estadoCivil = "soltero";
    else if (/divorciad[oa]/i.test(clean)) out.estadoCivil = "divorciado";
    else if (/viud[oa]/i.test(clean)) out.estadoCivil = "viudo";

    if (/no tengo hijos|sin hijos/i.test(clean)) {
      out.hijos = false;
    } else {
      const hijosMatch = clean.match(/([0-9]+)\s*hijos?/i);
      if (hijosMatch) {
        out.hijos = true;
        out.cantidadHijos = Number(hijosMatch[1]);
      }
    }

    if (/tengo tatuaje|con tatuaje/i.test(clean)) {
      out.tieneTatuajes = "si";
      out.tatuajesVisibles = /no son visibles|no visible/i.test(clean)
        ? "no_visibles"
        : "visibles";
    } else if (/no tengo tatuaje|sin tatuaje/i.test(clean)) {
      out.tieneTatuajes = "no";
    }

    const trans = clean.match(/(?:voy en|medio|transporte|ir[eé] en)\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{3,20}?)(?:,|\.|tardo|demoro|$)/i);
    if (trans) out.medioTransporteSucursal = trans[1].trim();

    const tiempo = clean.match(/([0-9]+\s*(?:minutos|min|horas|hs))/i);
    if (tiempo) out.tiempoViajeSucursal = tiempo[1].trim();
  }

  // Paso 2: Académico e Idiomas
  if (paso === 2) {
    const carr = clean.match(/(?:carrera de|estudio|licenciatura en|ingenier[ií]a en)\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{3,40}?)(?:\s+en\s+|,|\.|$)/i);
    if (carr) out.carrera = carr[1].trim();

    const uni = clean.match(/(?:en la|universidad|instituci[oó]n)\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{2,40}?)(?:,|\.|hablo|manejo|$)/i);
    if (uni) out.universidad = uni[1].trim();

    const curso = clean.match(/([1-6](?:er|do|to|mo)?\s*(?:a[ñn]o|semestre|curso))/i);
    if (curso) out.cursoActual = curso[1].trim();

    const idiomasDetectados: string[] = [];
    const listaIdiomas = [
      "Castellano",
      "Español",
      "Guaraní",
      "Inglés",
      "Portugués",
      "Alemán",
      "Francés",
      "Italiano",
    ];
    for (const lang of listaIdiomas) {
      const regex = new RegExp(
        lang.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        "i"
      );
      const cleanNorm = clean.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (regex.test(cleanNorm)) {
        idiomasDetectados.push(lang === "Español" ? "Castellano" : lang);
      }
    }
    if (idiomasDetectados.length > 0) {
      out.idiomasTexto = Array.from(new Set(idiomasDetectados)).join(", ");
    }
  }

  // Paso 3: Condición Ocupacional
  if (paso === 3) {
    if (/no estoy trabajando|desemplead/i.test(clean)) {
      out.situacionActual = "desempleado";
    } else if (/pasant[ií]a|pasante/i.test(clean)) {
      out.situacionActual = "pasantia";
    } else if (/estoy trabajando|trabajo en|emplead/i.test(clean)) {
      out.situacionActual = "empleado";
    }

    const emp = clean.match(/(?:trabajo en|trabaj[eé] en|empresa|en)\s+([a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s.&-]{2,35}?)(?:,|\.|como|hace|ganando|$)/i);
    if (emp) out.empresaAnterior = emp[1].trim();

    const cargo = clean.match(/(?:como|cargo de|puesto de)\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{3,30}?)(?:,|\.|hace|ganando|$)/i);
    if (cargo) out.cargoAnterior = cargo[1].trim();

    const ant = clean.match(/(?:hace|durante|por)\s+([0-9]+\s*(?:meses|mes|a[ñn]os|a[ñn]o))/i);
    if (ant) out.antiguedad = ant[1].trim();

    const sal = clean.match(/(?:salario|sueldo|gano|cobro|percibo)\s*(?:de)?\s*(?:gs\.?)?\s*([0-9.]{5,12})/i);
    if (sal) out.salarioBruto = sal[1].trim();

    const post = clean.match(/(?:postulo a|postulo para|cargo al que postulo)\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{3,30}?)(?:,|\.|$)/i);
    if (post) out.cargoPostula = post[1].trim();
  }

  // Paso 4: Perfil Personal
  if (paso === 4) {
    out.aspectosPositivos = clean;
  }

  // Paso 6: Salud
  if (paso === 6) {
    if (/seguro privado|privado/i.test(clean)) {
      out.seguroMedico = "privado";
      const det = clean.match(/(?:privado|seguro)\s+(?:en|con|de)?\s*([a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{2,25})/i);
      if (det) out.seguroMedicoDetalle = det[1].trim();
    } else if (/ips/i.test(clean)) {
      out.seguroMedico = "ips";
    }
  }

  // Paso 8: Vivienda
  if (paso === 8) {
    const ciu = clean.match(/(?:ciudad de|vivo en)\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{3,25}?)(?:,|\.|barrio|$)/i);
    if (ciu) out.ciudad = ciu[1].trim();
    const bar = clean.match(/barrio\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ0-9\s]{2,25}?)(?:,|\.|$)/i);
    if (bar) out.barrio = bar[1].trim();
  }

  if (Object.keys(out).length === 0) {
    out._rawAiText = clean;
  }

  return out;
}

export async function POST(req: NextRequest) {
  const rateErr = enforceRateLimit(req, "ai-extraer", 35, 60_000);
  if (rateErr) return rateErr;

  const { data: body, errorResponse } = await parseSafeJson<{
    texto?: string;
    paso?: number;
    modo?: "extraer" | "mejorar" | "corregir";
    campo?: string;
  }>(req, 64_000);
  if (errorResponse) return errorResponse;

  const texto = (body?.texto || "").trim();
  const paso = Number(body?.paso || 1);
  const modo = body?.modo || "extraer";

  if (!texto) {
    return NextResponse.json({ campos: {}, textoCorregido: "" });
  }

  // Modo: Corrector ortográfico puro (sin cambiar las palabras ni inventar contenido del postulante)
  if (modo === "corregir" || modo === "mejorar") {
    const localFixed = corregirOrtografiaTexto(texto);
    if (genAI && texto.length >= 12) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          generationConfig: { temperature: 0.0, maxOutputTokens: 300 },
        });
        const prompt = `Corrige ÚNICAMENTE los errores ortográficos, tildes faltantes y signos de puntuación del siguiente texto escrito en español (Paraguay).
REGLA ESTRICTA: NO cambies las palabras del autor, NO agregues frases nuevas, NO inventes información y NO cambies el tono. Devuelve exactamente el mismo texto pero sin faltas de ortografía:
"${localFixed}"`;
        const res = await model.generateContent(prompt);
        const limpio = res.response
          .text()
          .trim()
          .replace(/^["«]|["»]$/g, "");
        if (limpio && Math.abs(limpio.length - localFixed.length) < 25) {
          return NextResponse.json({
            textoCorregido: limpio,
            textoMejorado: limpio,
          });
        }
      } catch {}
    }

    return NextResponse.json({
      textoCorregido: localFixed,
      textoMejorado: localFixed,
    });
  }

  // Modo: Extraer campos estructurados con Gemini 2.5 Flash + Fallback Heurístico
  const heuristico = extraerCamposHeuristico(texto, paso);

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const schemasPorPaso: Record<number, string> = {
        1: "nombre, apellido, cedula, fechaNacimiento (YYYY-MM-DD), telefono, email, estadoCivil (soltero|casado|conviviente|divorciado|viudo), medioTransporteSucursal, tiempoViajeSucursal, tieneTatuajes (no|si), tatuajesVisibles (visibles|no_visibles), zonaTatuada, redSocialPlataforma, redSocial",
        2: "profesion, carrera, cursoActual, universidad, estadoEstudios (en_curso|finalizado|interrumpido), idiomasTexto, cursos",
        3: "situacionActual (empleado|desempleado|pasantia), empresaAnterior, cargoAnterior, antiguedad, salarioBruto, aportesDescuentos, motivoSalida, cargoPostula, pretensionSalarial, motivoEleccionEntidad, objetivosProfesionales, ambienteLaboralIdeal",
        4: "aspectosPositivos, aspectosMejorar, visionLargoPlazo",
        5: "relacionPadres (casados|separados|divorciados|union_libre|fallecidos), nombreMadre, ocupacionMadre, empresaMadre, salarioMadre, ciudadMadre, telefonoMadre, nombrePadre, ocupacionPadre, empresaPadre, salarioPadre, ciudadPadre, telefonoPadre",
        6: "seguroMedico (ninguno|ips|privado|ambos), seguroMedicoDetalle, consumoAlcohol (no|ocasional|social|frecuente), familiaresEnfermedadDetalle, condicionDiferenteVivienda",
        7: "tiposProductosEntidad, ingresosFamiliares, egresosMensuales",
        8: "ciudad, barrio, direccion, tipoCamino (asfalto|empedrado|tierra), tenenciaVivienda (propia|alquilada|prestada|familiar), quienesVivenCasa, paredesDetalle, techoDetalle, pisosDetalle",
        9: "limpiezaOrdenVivienda, quienesPresentes, vocabularioEntrevistado, observacionesEntrevista, otrasObservaciones",
      };

      const camposObjetivo = schemasPorPaso[paso] || schemasPorPaso[1];
      const prompt = `Extrae únicamente en formato JSON válido los campos que estén presentes en el siguiente texto para el paso ${paso} de un formulario socioambiental.
Campos posibles: ${camposObjetivo}.
Texto del usuario: "${texto}"
Responde SOLO con el objeto JSON sin bloques markdown.`;

      const result = await model.generateContent(prompt);
      const rawJson = result.response
        .text()
        .replace(/```json|```/g, "")
        .trim();
      const parsed = JSON.parse(rawJson);
      if (parsed && typeof parsed === "object") {
        return NextResponse.json({
          campos: { ...heuristico, ...parsed },
        });
      }
    } catch {}
  }

  return NextResponse.json({ campos: heuristico });
}
