import pptxgen from "pptxgenjs";
import { EntrevistaRecord } from "./store";
import { convertirATerceraPersona } from "./textProcessor";
import { formatDateToPy } from "./utils";
import { FIRMA_IVONE_DATA_URL } from "./defaultSignature";

function v(val: unknown, fallback = "No especificado"): string {
  if (val !== undefined && val !== null) {
    const s = String(val).trim();
    if (s.length > 0) return convertirATerceraPersona(s);
  }
  return fallback;
}

function siNo(val: unknown, detalle?: unknown): string {
  if (val === true || val === "si" || val === "Sí") {
    const det = String(detalle ?? "").trim();
    return det ? `Sí - ${convertirATerceraPersona(det)}` : "Sí";
  }
  return "No";
}

function isValidDataUrl(src: unknown): src is string {
  return typeof src === "string" && src.startsWith("data:image/");
}

/**
 * Extrae las dimensiones reales (ancho x alto en píxeles) de un dataURL JPEG o PNG
 * para insertar la imagen en PowerPoint manteniendo su proporción exacta sin recortes.
 */
function getImageDimensions(
  dataUrl: string
): { width: number; height: number } | null {
  try {
    const commaIdx = dataUrl.indexOf(",");
    if (commaIdx === -1) return null;
    const b64 = dataUrl.slice(commaIdx + 1);
    const buf = Buffer.from(b64, "base64");

    // PNG: 89 50 4E 47 0D 0A 1A 0A + IHDR chunk at offset 16..24
    if (
      buf.length >= 24 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47
    ) {
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      if (width > 0 && height > 0) return { width, height };
    }

    // JPEG: FF D8 ... buscar marcador SOF0/SOF1/SOF2 (FF C0 .. FF C3)
    if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
      let offset = 2;
      while (offset + 9 < buf.length) {
        if (buf[offset] !== 0xff) {
          offset++;
          continue;
        }
        const marker = buf[offset + 1];
        if (marker === 0xff) {
          offset++;
          continue;
        }
        if (
          marker === 0xc0 ||
          marker === 0xc1 ||
          marker === 0xc2 ||
          marker === 0xc3
        ) {
          const height = buf.readUInt16BE(offset + 5);
          const width = buf.readUInt16BE(offset + 7);
          if (width > 0 && height > 0) return { width, height };
          break;
        }
        const segLen = buf.readUInt16BE(offset + 2);
        if (segLen < 2) break;
        offset += 2 + segLen;
      }
    }
  } catch {}
  return null;
}

/**
 * Calcula la caja contenedora centrada (object-fit: contain) manteniendo el aspect ratio original.
 */
function fitImageInBox(
  dataUrl: string,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number
): { x: number; y: number; w: number; h: number } {
  const dims = getImageDimensions(dataUrl);
  if (!dims || dims.width <= 0 || dims.height <= 0) {
    return { x: boxX, y: boxY, w: boxW, h: boxH };
  }
  const imgRatio = dims.width / dims.height;
  const boxRatio = boxW / boxH;

  let w = boxW;
  let h = boxH;
  if (imgRatio > boxRatio) {
    w = boxW;
    h = boxW / imgRatio;
  } else {
    h = boxH;
    w = boxH * imgRatio;
  }

  const x = boxX + (boxW - w) / 2;
  const y = boxY + (boxH - h) / 2;
  return {
    x: Number(x.toFixed(3)),
    y: Number(y.toFixed(3)),
    w: Number(w.toFixed(3)),
    h: Number(h.toFixed(3)),
  };
}

export async function generarPptxInforme(
  entrevista: EntrevistaRecord
): Promise<Buffer> {
  const d = entrevista.datos ?? {};
  const pres = new pptxgen();

  pres.layout = "LAYOUT_16x9";
  pres.author = "Jerovia Consultora";
  pres.company = "Jerovia Consultora";
  const fullNombre = [d.nombre, d.apellido].filter(Boolean).join(" ").trim();
  const nombreMostrar = v(
    fullNombre,
    entrevista.candidatoNombre || "Postulante"
  );
  pres.title = `Informe Socioambiental - ${nombreMostrar}`;

  const COLOR_BG = "F4F6F2";
  const COLOR_CARD = "FFFFFF";
  const COLOR_OLIVE = "536C45";
  const COLOR_DARK_OLIVE = "485536";
  const COLOR_SAGE = "85987A";
  const COLOR_TEXT = "1A2216";
  const COLOR_MUTED = "52634B";

  const entidadTexto = v(entrevista.entidadSolicitante, "Banco Continental");

  const addHeaderAndFooter = (
    slide: pptxgen.Slide,
    pageNum: number,
    sectionTitle: string
  ) => {
    slide.background = { color: COLOR_BG };

    slide.addShape(pres.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 13.33,
      h: 0.12,
      fill: { color: COLOR_OLIVE },
    });

    slide.addText("Jerovia Consultora", {
      x: 0.5,
      y: 0.22,
      w: 4.2,
      h: 0.45,
      fontSize: 20,
      fontFace: "Georgia",
      bold: true,
      color: COLOR_TEXT,
    });

    slide.addText(
      `INFORME CONFIDENCIAL DE VERIFICACIÓN SOCIOAMBIENTAL · ${entidadTexto.toUpperCase()}`,
      {
        x: 0.5,
        y: 0.64,
        w: 8.0,
        h: 0.25,
        fontSize: 8.5,
        fontFace: "Arial",
        bold: true,
        color: COLOR_OLIVE,
      }
    );

    slide.addShape(pres.ShapeType.roundRect, {
      x: 8.8,
      y: 0.25,
      w: 4.03,
      h: 0.55,
      fill: { color: COLOR_OLIVE },
      line: { color: COLOR_SAGE, width: 1 },
    });

    slide.addText(`${sectionTitle} (Pág. ${pageNum}/5)`, {
      x: 8.9,
      y: 0.32,
      w: 3.83,
      h: 0.4,
      fontSize: 10,
      fontFace: "Arial",
      bold: true,
      color: "FFFFFF",
      align: "center",
    });

    slide.addShape(pres.ShapeType.line, {
      x: 0.5,
      y: 0.95,
      w: 12.33,
      h: 0,
      line: { color: COLOR_OLIVE, width: 1.5 },
    });

    slide.addText(
      `Postulante: ${nombreMostrar} (CI: ${v(
        d.cedula
      )})   |   Jerovia Consultora · Documento Confidencial · Página ${pageNum} de 5`,
      {
        x: 0.5,
        y: 7.12,
        w: 12.33,
        h: 0.28,
        fontSize: 8.5,
        fontFace: "Arial",
        color: COLOR_MUTED,
        align: "center",
      }
    );
  };

  // PÁGINA 1
  const s1 = pres.addSlide();
  addHeaderAndFooter(s1, 1, "I. Filiación, Estudios y Perfil");

  s1.addShape(pres.ShapeType.roundRect, {
    x: 0.5,
    y: 1.1,
    w: 12.33,
    h: 1.65,
    fill: { color: COLOR_OLIVE },
    line: { color: COLOR_SAGE, width: 1.5 },
  });

  const hasCandidatePhoto = isValidDataUrl(d.fotoCandidato);
  const bannerTextW = hasCandidatePhoto ? 10.2 : 11.8;

  s1.addText(nombreMostrar, {
    x: 0.75,
    y: 1.2,
    w: bannerTextW,
    h: 0.45,
    fontSize: 18,
    fontFace: "Arial",
    bold: true,
    color: "FFFFFF",
  });

  s1.addText(
    [
      `Número de cédula: ${v(d.cedula)}   |   Fecha de nacimiento: ${
        formatDateToPy(d.fechaNacimiento) || v(d.fechaNacimiento)
      }   |   Teléfono: ${v(d.telefono)}`,
      `Estado civil: ${v(d.estadoCivil)}   |   Tiene hijos/as: ${siNo(
        d.hijos,
        d.cantidadHijos
      )}   |   Situación Académica: ${v(d.profesion, "Estudiante")}`,
    ].join("\n"),
    {
      x: 0.75,
      y: 1.72,
      w: bannerTextW,
      h: 0.85,
      fontSize: 10.5,
      fontFace: "Arial",
      bold: true,
      color: "F4F6F2",
    }
  );

  if (hasCandidatePhoto) {
    try {
      const fitted = fitImageInBox(
        d.fotoCandidato as string,
        11.15,
        1.16,
        1.5,
        1.52
      );
      s1.addImage({
        data: d.fotoCandidato as string,
        ...fitted,
      });
    } catch {}
  }

  s1.addShape(pres.ShapeType.roundRect, {
    x: 0.5,
    y: 2.9,
    w: 5.95,
    h: 4.05,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1.2 },
  });
  s1.addText("FORMACIÓN ACADÉMICA E IDIOMAS", {
    x: 0.75,
    y: 3.05,
    w: 5.45,
    h: 0.35,
    fontSize: 11,
    bold: true,
    color: COLOR_OLIVE,
  });

  const idiomasMostrar = d.idiomasTexto
    ? v(d.idiomasTexto)
    : Array.isArray(d.idiomas) && d.idiomas.length > 0
    ? d.idiomas.map((i) => v(i.idioma)).join(", ")
    : "Castellano, Guaraní";

  s1.addText(
    [
      `Situación: ${v(d.profesion, "Estudiante")}`,
      `Carrera / Nivel: ${v(d.carrera)}`,
      `Cursando actualmente el: ${v(d.cursoActual)}`,
      `Institución / Universidad: ${v(d.universidad)}`,
      `Idiomas que maneja: ${idiomasMostrar}`,
      `Cursos adicionales: ${v(d.cursos, "Ninguno declarado")}`,
    ].join("\n\n"),
    {
      x: 0.75,
      y: 3.45,
      w: 5.45,
      h: 3.35,
      fontSize: 10,
      color: COLOR_TEXT,
      fontFace: "Arial",
    }
  );

  s1.addShape(pres.ShapeType.roundRect, {
    x: 6.7,
    y: 2.9,
    w: 6.13,
    h: 4.05,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1.2 },
  });
  s1.addText("PERFIL PERSONAL, MOVILIDAD Y REDES", {
    x: 6.95,
    y: 3.05,
    w: 5.6,
    h: 0.35,
    fontSize: 11,
    bold: true,
    color: COLOR_OLIVE,
  });

  const movTexto =
    d.tenenciaMovilidad === "propia"
      ? `Movilidad Propia (${v(d.tipoMovilidad)})`
      : d.tenenciaMovilidad === "familiar"
      ? `Movilidad Familiar (${v(d.tipoMovilidad)})`
      : d.movilidadPropia
      ? `Sí (${v(d.tipoMovilidad)})`
      : "No posee vehículo";

  const tatTexto =
    d.tieneTatuajes && d.tieneTatuajes !== "no"
      ? `Sí (${
          d.tatuajesVisibles === "visibles" ? "Visibles" : "No son visibles"
        }) · Zona: ${v(d.zonaTatuada)}`
      : "No";

  const s1RightText = [
    `Aspectos positivos: ${v(d.aspectosPositivos)}`,
    `Actitud a mejorar: ${v(d.aspectosMejorar)}`,
    `Logros personales que espera cumplir: ${v(d.visionLargoPlazo)}`,
    `¿Tiene algún familiar políticamente expuesto?: ${siNo(
      d.familiaresPoliticos,
      d.familiaresPoliticosDetalle
    )}`,
    `Movilidad: ${movTexto}`,
    `Medio a sucursal: ${v(d.medioTransporteSucursal)} (${v(
      d.tiempoViajeSucursal
    )})`,
    `Tatuajes: ${tatTexto}`,
    `Red social que más usa: ${
      d.redSocial
        ? `${v(d.redSocialPlataforma, "Instagram")} - ${v(d.redSocial)}`
        : "No utiliza"
    }`,
  ].join("\n");

  const s1RightFontSize =
    s1RightText.length > 450 ? 8.2 : s1RightText.length > 320 ? 8.8 : 9.5;

  s1.addText(s1RightText, {
    x: 6.95,
    y: 3.45,
    w: 5.6,
    h: 3.35,
    fontSize: s1RightFontSize,
    color: COLOR_TEXT,
    fontFace: "Arial",
  });

  // PÁGINA 2
  const s2 = pres.addSlide();
  addHeaderAndFooter(s2, 2, "II. Salud y Entorno Familiar");

  s2.addShape(pres.ShapeType.roundRect, {
    x: 0.5,
    y: 1.1,
    w: 5.6,
    h: 5.85,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1.2 },
  });
  s2.addText("DATOS DE LA SALUD", {
    x: 0.75,
    y: 1.25,
    w: 5.1,
    h: 0.35,
    fontSize: 11,
    bold: true,
    color: COLOR_OLIVE,
  });

  const segTexto =
    v(d.seguroMedico ? d.seguroMedico.toUpperCase() : "Ninguno") +
    (d.seguroMedicoDetalle ? ` — ${v(d.seguroMedicoDetalle)}` : "");

  s2.addText(
    [
      `¿Cuentas con algún problema de salud o alergia?:\n${siNo(
        d.enfermedadBase,
        d.enfermedadBaseDetalle
      )}`,
      `Consume medicamento cognitivo, tranquilizante u hormonal:\n${siNo(
        d.consumeMedicamentos,
        d.consumeMedicamentosDetalle
      )}`,
      `Tiene fobias, pánicos, claustrofobias, etc.:\n${siNo(
        d.tieneFobias,
        d.tieneFobiasDetalle
      )}`,
      `Posee seguro médico: ${segTexto}`,
      `Consume bebidas alcohólicas: ${v(d.consumoAlcohol, "No")}`,
      `Fuma o vapea: ${siNo(d.consumoTabaco)}`,
      `Familiar con problemas de salud:\n${
        d.familiaresEnfermedad ? v(d.familiaresEnfermedadDetalle, "Sí") : "No"
      }`,
      `Persona en la vivienda con condición diferente:\n${v(
        d.condicionDiferenteVivienda,
        "Ninguno"
      )}`,
      `Realiza algún tratamiento médico:\n${siNo(
        d.tratamientos,
        d.tratamientosDetalle
      )}`,
    ].join("\n\n"),
    {
      x: 0.75,
      y: 1.65,
      w: 5.1,
      h: 5.1,
      fontSize: 9.2,
      color: COLOR_TEXT,
      fontFace: "Arial",
    }
  );

  s2.addShape(pres.ShapeType.roundRect, {
    x: 6.3,
    y: 1.1,
    w: 6.53,
    h: 5.85,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1.2 },
  });
  s2.addText(`DATOS FAMILIARES (Padres: ${v(d.relacionPadres, "Casados")})`, {
    x: 6.55,
    y: 1.25,
    w: 6.0,
    h: 0.35,
    fontSize: 11,
    bold: true,
    color: COLOR_OLIVE,
  });

  const hermanosArr = Array.isArray(d.listaHermanos) ? d.listaHermanos : [];
  const hermanosResumen =
    hermanosArr.length > 0
      ? hermanosArr
          .slice(0, 5)
          .map(
            (h) =>
              `• ${v(h.nombre)} (${v(h.edad)} años) - ${v(
                h.ocupacion
              )} - ${v(h.domicilio)}`
          )
          .join("\n")
      : d.tieneHermanos
      ? `Sí (${v(d.cantidadHermanos)} hermanos)`
      : "No registra hermanos";

  const parejaLinea = d.parejaPadreMadreViveCasa
    ? `Pareja en la casa: Sí — ${v(d.nombrePareja)} (${v(
        d.edadPareja
      )} años), ${v(d.ocupacionPareja)}, ${v(d.empresaPareja)}, Salario: ${v(
        d.salarioPareja
      )}, Tel: ${v(d.telefonoPareja)}`
    : "Su padre/madre tiene pareja viviendo en la casa: No";

  s2.addText(
    [
      `MADRE: ${v(d.nombreMadre)} (${v(d.edadMadre)} años)`,
      `Ocupación: ${v(d.ocupacionMadre)} | Empresa: ${v(
        d.empresaMadre
      )} | Salario: ${v(d.salarioMadre)} | Vive en: ${v(
        d.ciudadMadre
      )} | Tel: ${v(d.telefonoMadre)}`,
      ``,
      `PADRE: ${v(d.nombrePadre)} (${v(d.edadPadre)} años)`,
      `Ocupación: ${v(d.ocupacionPadre)} | Empresa: ${v(
        d.empresaPadre
      )} | Salario: ${v(d.salarioPadre)} | Vive en: ${v(
        d.ciudadPadre
      )} | Tel: ${v(d.telefonoPadre)}`,
      ``,
      parejaLinea,
      ``,
      `HERMANOS (${hermanosArr.length || d.cantidadHermanos || 0}):`,
      hermanosResumen,
      ``,
      `¿Tienes algún familiar que tenga algún producto del Banco Continental?:`,
      siNo(d.familiaresProductosEntidad, d.familiarConProductosDetalle),
    ].join("\n"),
    {
      x: 6.55,
      y: 1.65,
      w: 6.0,
      h: 5.1,
      fontSize: 9.0,
      color: COLOR_TEXT,
      fontFace: "Arial",
    }
  );

  // PÁGINA 3
  const s3 = pres.addSlide();
  addHeaderAndFooter(s3, 3, "III. Vivienda y Economía");

  s3.addShape(pres.ShapeType.roundRect, {
    x: 0.5,
    y: 1.1,
    w: 6.2,
    h: 5.85,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1.2 },
  });
  s3.addText("DATOS DE LA VIVIENDA Y EVIDENCIA FOTOGRÁFICA", {
    x: 0.75,
    y: 1.25,
    w: 5.7,
    h: 0.35,
    fontSize: 10.5,
    bold: true,
    color: COLOR_OLIVE,
  });

  const fotosViv = Array.isArray(d.fotosVivienda)
    ? d.fotosVivienda.filter(isValidDataUrl).slice(0, 4)
    : [];

  s3.addText(
    [
      `Ciudad: ${v(d.ciudad)}   |   Barrio: ${v(d.barrio)}`,
      `Dirección: ${v(d.direccion)}   |   GPS: ${v(d.coordenadas, "N/A")}`,
      `Trayecto: ${v(d.tipoCamino)}   |   Propiedad: ${v(d.tenenciaVivienda)}`,
      `Habitantes en la casa: ${v(d.cantidadPersonas, "1")} personas`,
      `Quién vive con el entrevistado/a: ${v(d.quienesVivenCasa)}`,
      `Dependencias: Dormitorios: ${v(d.habitaciones, "1")} | Salas: ${v(
        d.salaCantidad,
        "1"
      )} | Baños: ${v(d.banos, "1")} | Cocinas: ${v(
        d.cocinaCantidad,
        "1"
      )} | Pisos: ${v(d.plantas, "1")}`,
      `Materiales: Paredes: ${v(
        d.paredesDetalle,
        v(d.paredes)
      )} | Techo: ${v(d.techoDetalle, v(d.techo))} | Piso: ${v(
        d.pisosDetalle,
        v(d.pisos)
      )}`,
    ].join("\n"),
    {
      x: 0.75,
      y: 1.62,
      w: 5.7,
      h: fotosViv.length > 0 ? 2.35 : 4.9,
      fontSize: 9.0,
      color: COLOR_TEXT,
      fontFace: "Arial",
    }
  );

  if (fotosViv.length === 1) {
    try {
      s3.addShape(pres.ShapeType.roundRect, {
        x: 0.75,
        y: 4.05,
        w: 5.7,
        h: 2.72,
        fill: { color: "EEF3EB" },
        line: { color: COLOR_SAGE, width: 1 },
      });
      const fitted = fitImageInBox(fotosViv[0], 0.82, 4.1, 5.56, 2.62);
      s3.addImage({
        data: fotosViv[0],
        ...fitted,
      });
    } catch {}
  } else if (fotosViv.length === 2) {
    fotosViv.forEach((imgData, idx) => {
      try {
        const bx = 0.75 + idx * 2.9;
        s3.addShape(pres.ShapeType.roundRect, {
          x: bx,
          y: 4.05,
          w: 2.8,
          h: 2.72,
          fill: { color: "EEF3EB" },
          line: { color: COLOR_SAGE, width: 1 },
        });
        const fitted = fitImageInBox(imgData, bx + 0.05, 4.1, 2.7, 2.62);
        s3.addImage({
          data: imgData,
          ...fitted,
        });
      } catch {}
    });
  } else if (fotosViv.length >= 3) {
    fotosViv.slice(0, 4).forEach((imgData, idx) => {
      try {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const bx = 0.75 + col * 2.9;
        const by = 4.02 + row * 1.38;
        s3.addShape(pres.ShapeType.roundRect, {
          x: bx,
          y: by,
          w: 2.8,
          h: 1.32,
          fill: { color: "EEF3EB" },
          line: { color: COLOR_SAGE, width: 0.8 },
        });
        const fitted = fitImageInBox(imgData, bx + 0.04, by + 0.04, 2.72, 1.24);
        s3.addImage({
          data: imgData,
          ...fitted,
        });
      } catch {}
    });
  }

  s3.addShape(pres.ShapeType.roundRect, {
    x: 6.9,
    y: 1.1,
    w: 5.93,
    h: 5.85,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1.2 },
  });
  s3.addText("DATOS ECONÓMICOS DE LA PERSONA", {
    x: 7.15,
    y: 1.25,
    w: 5.4,
    h: 0.35,
    fontSize: 10.5,
    bold: true,
    color: COLOR_OLIVE,
  });

  const gastosArr = Array.isArray(d.listaEgresos) ? d.listaEgresos : [];
  const gastosTexto =
    gastosArr.length > 0
      ? gastosArr
          .map(
            (g, i) =>
              `${i + 1}. ${v(g.empresa)} — Monto mensual: Gs. ${v(g.monto)}`
          )
          .join("\n")
      : v(d.egresosMensuales, "Sin gastos declarados");

  const prestArr = Array.isArray(d.listaPrestamos) ? d.listaPrestamos : [];
  const prestTexto =
    d.prestamos && prestArr.length > 0
      ? prestArr
          .map(
            (p, i) =>
              `${i + 1}. Entidad: ${v(p.entidad)} — Cuota: Gs. ${v(p.cuota)}`
          )
          .join("\n")
      : siNo(d.prestamos, d.prestamosDetalle);

  s3.addText(
    [
      `¿Tienes algún producto del Banco Continental?:`,
      siNo(d.productosEntidad, d.tiposProductosEntidad),
      ``,
      `¿Sus ingresos cubren todas sus deudas o gastos?: ${siNo(
        d.ingresosCubrenDeudas
      )}`,
      `¿Tiene personas que dependen económicamente?: ${siNo(
        d.tieneDependientesEconomicos
      )}`,
      ``,
      `Indica cuáles serían tus gastos (${gastosArr.length}):`,
      gastosTexto,
      ``,
      `Tiene préstamos a su nombre:`,
      prestTexto,
    ].join("\n"),
    {
      x: 7.15,
      y: 1.65,
      w: 5.4,
      h: 5.1,
      fontSize: 9.5,
      color: COLOR_TEXT,
      fontFace: "Arial",
    }
  );

  // PÁGINA 4
  const s4 = pres.addSlide();
  addHeaderAndFooter(s4, 4, "IV. Datos Laborales");

  s4.addShape(pres.ShapeType.roundRect, {
    x: 0.5,
    y: 1.1,
    w: 12.33,
    h: 5.85,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1.2 },
  });
  s4.addText("CONDICIÓN OCUPACIONAL, SALARIO Y POSTULACIÓN", {
    x: 0.8,
    y: 1.28,
    w: 11.7,
    h: 0.35,
    fontSize: 11.5,
    bold: true,
    color: COLOR_OLIVE,
  });

  const condLabel =
    d.situacionActual === "empleado"
      ? "Actualmente estoy trabajando"
      : d.situacionActual === "desempleado"
      ? "Actualmente no estoy trabajando"
      : d.situacionActual === "pasantia"
      ? "Solo realicé pasantía"
      : d.situacionActual === "primera_experiencia"
      ? "Primera experiencia laboral"
      : v(d.situacionActual);

  const s4Text = [
    `Condición ocupacional: ${condLabel}`,
    `Lugar de empleo / Pasantía: ${v(d.empresaAnterior)}`,
    `Cargo / Tareas desempeñadas: ${v(d.cargoAnterior)}`,
    `Antigüedad actual: ${v(
      d.antiguedad,
      "-"
    )}   |   Antigüedad anterior: ${v(d.antiguedadAnterior, "-")}`,
    `Salario (Gs.): ${v(
      d.salarioBruto,
      "-"
    )}   |   Aportes / Descuentos: ${v(d.aportesDescuentos, "-")}`,
    `Motivo de salida o cambio: ${v(d.motivoSalida, "-")}`,
    ``,
    `Cargo al que postula: ${v(d.cargoPostula)}`,
    `Pretensión salarial o monto acordado con RRHH: ${v(
      d.pretensionSalarial
    )}`,
    `Por qué eligió este Banco para trabajar: ${v(
      d.motivoEleccionEntidad
    )}`,
    `Objetivos profesionales si se incorpora: ${v(
      d.objetivosProfesionales
    )}`,
    `Cómo sería su ambiente laboral ideal: ${v(d.ambienteLaboralIdeal)}`,
    `Posee algún familiar y/o conocido en la entidad: ${siNo(
      d.familiarEnEntidad,
      d.familiarEnEntidadDetalle
    )}`,
  ].join("\n\n");

  const s4FontSize =
    s4Text.length > 650 ? 8.4 : s4Text.length > 450 ? 9.0 : 10;

  s4.addText(s4Text, {
    x: 0.8,
    y: 1.75,
    w: 11.7,
    h: 4.95,
    fontSize: s4FontSize,
    color: COLOR_TEXT,
    fontFace: "Arial",
  });

  // PÁGINA 5
  const s5 = pres.addSlide();
  addHeaderAndFooter(s5, 5, "V. Observaciones y Firma");

  s5.addShape(pres.ShapeType.roundRect, {
    x: 0.5,
    y: 1.1,
    w: 12.33,
    h: 3.7,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1.2 },
  });
  s5.addText("OBSERVACIONES GENERALES DE LA ENTREVISTA", {
    x: 0.8,
    y: 1.28,
    w: 11.7,
    h: 0.35,
    fontSize: 11.5,
    bold: true,
    color: COLOR_OLIVE,
  });

  const s5Text = [
    `Limpieza y orden de la vivienda: ${v(
      d.limpiezaOrdenVivienda,
      "Ordenada y limpia"
    )}   |   ¿La zona es de fácil acceso?: ${siNo(
      d.zonaFacilAcceso ?? true
    )}`,
    `Presencia de otras personas durante la entrevista: ${v(
      d.quienesPresentes,
      "Ninguno"
    )}   |   Dicción: ${v(d.diccion, "Fluida y coherente")}`,
    `Vocabulario de la persona entrevistada: ${v(
      d.vocabularioEntrevistado,
      "Respetuoso y acorde a la situación"
    )}   |   Estado de vivienda: ${v(d.estadoVivienda, "Bueno")}`,
    ``,
    `Concepto / Observaciones de la visita:`,
    v(d.observacionesEntrevista),
    ``,
    `Otras observaciones: ${v(d.otrasObservaciones, "Ninguna")}`,
    `Entrevistador/a: ${v(
      d.entrevistadorNombre,
      v(d.consultorNombre, "Lic. Ivonne Rodas")
    )}   |   Visita realizada el: ${
      formatDateToPy(d.fechaVisita) || v(d.fechaVisita)
    } ${
      d.horaVisita ? `, ${v(d.horaVisita)}` : ""
    }`,
  ].join("\n");

  const s5FontSize =
    s5Text.length > 480 ? 8.6 : s5Text.length > 340 ? 9.2 : 10;

  s5.addText(s5Text, {
    x: 0.8,
    y: 1.7,
    w: 11.7,
    h: 2.95,
    fontSize: s5FontSize,
    color: COLOR_TEXT,
    fontFace: "Arial",
  });

  s5.addShape(pres.ShapeType.roundRect, {
    x: 3.66,
    y: 5.0,
    w: 6.0,
    h: 1.9,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_DARK_OLIVE, width: 1.5 },
  });

  const firmaData = isValidDataUrl(d.firmaEvaluador)
    ? (d.firmaEvaluador as string)
    : FIRMA_IVONE_DATA_URL;

  if (isValidDataUrl(firmaData)) {
    try {
      const fittedSig = fitImageInBox(firmaData, 5.1, 5.06, 3.1, 0.98);
      s5.addImage({
        data: firmaData,
        ...fittedSig,
      });
    } catch {}
  }

  s5.addShape(pres.ShapeType.line, {
    x: 4.3,
    y: 6.12,
    w: 4.7,
    h: 0,
    line: { color: COLOR_DARK_OLIVE, width: 1.2 },
  });

  s5.addText(v(d.consultorNombre, "Lic. Ivonne Rodas"), {
    x: 3.86,
    y: 6.18,
    w: 5.6,
    h: 0.35,
    fontSize: 12,
    color: COLOR_TEXT,
    align: "center",
    bold: true,
  });

  s5.addText("JEROVIA CONSULTORA · VERIFICACIÓN SOCIOAMBIENTAL", {
    x: 3.86,
    y: 6.5,
    w: 5.6,
    h: 0.3,
    fontSize: 8.5,
    color: COLOR_OLIVE,
    align: "center",
    bold: true,
  });

  const buffer = await pres.write({ outputType: "nodebuffer" });
  return buffer as Buffer;
}
