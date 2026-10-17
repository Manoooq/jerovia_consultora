import pptxgen from "pptxgenjs";
import { EntrevistaRecord } from "./store";

function calcularEdadPptx(fechaNac?: string): string {
  if (!fechaNac) return "N/A";
  let year = 0;
  if (/^\d{4}-\d{2}-\d{2}/.test(fechaNac)) {
    year = Number(fechaNac.slice(0, 4));
  } else if (/^\d{2}\/\d{2}\/\d{4}/.test(fechaNac)) {
    year = Number(fechaNac.slice(6, 10));
  }
  if (!year || year < 1920) return "N/A";
  const age = new Date().getFullYear() - year;
  return age > 0 && age < 110 ? `${age} años` : "N/A";
}

export async function generarPptxInforme(
  entrevista: EntrevistaRecord
): Promise<Buffer> {
  const d = entrevista.datos;
  const pres = new pptxgen();

  pres.layout = "LAYOUT_16x9";
  pres.author = "Jerovia Consultora";
  pres.company = "Jerovia Consultora";
  pres.title = `Informe Confidencial - ${d.nombre || "Candidato"} ${
    d.apellido || ""
  }`;

  // Paleta Verde Oliva Corporativa (#536C45 / #85987A / #F4F6F2)
  const COLOR_BG = "F4F6F2";
  const COLOR_CARD = "FFFFFF";
  const COLOR_OLIVE = "536C45";
  const COLOR_SAGE = "85987A";
  const COLOR_TEXT = "1A2216";
  const COLOR_MUTED = "52634B";

  const addHeader = (
    slide: pptxgen.Slide,
    titulo: string,
    paginaStr: string
  ) => {
    slide.background = { color: COLOR_BG };

    // Formas suaves laterales en Verde Oliva
    slide.addShape(pres.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 13.33,
      h: 0.14,
      fill: { color: COLOR_OLIVE },
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.5,
      y: 0.35,
      w: 12.33,
      h: 0.8,
      fill: { color: COLOR_OLIVE },
      line: { color: COLOR_SAGE, width: 1 },
    });

    slide.addText("JEROVIA CONSULTORA", {
      x: 0.8,
      y: 0.45,
      w: 4.5,
      h: 0.3,
      fontSize: 12,
      fontFace: "Arial",
      bold: true,
      color: "FFFFFF",
    });

    slide.addText(
      `INFORME CONFIDENCIAL · ${entrevista.entidadSolicitante.toUpperCase()} ·${paginaStr}`,
      {
        x: 0.8,
        y: 0.75,
        w: 7.5,
        h: 0.3,
        fontSize: 8.5,
        fontFace: "Arial",
        color: "E2E8DE",
      }
    );

    slide.addText(titulo.toUpperCase(), {
      x: 6.5,
      y: 0.45,
      w: 6.0,
      h: 0.6,
      fontSize: 13,
      fontFace: "Arial",
      bold: true,
      color: "FFFFFF",
      align: "right",
    });
  };

  const addFooter = (slide: pptxgen.Slide, pageNum: number) => {
    slide.addText(
      `Evaluado: ${d.nombre || ""} ${d.apellido || ""} (CI: ${
        d.cedula || "N/A"
      }) | Jerovia Consultora · Página ${pageNum} de 5`,
      {
        x: 0.5,
        y: 7.1,
        w: 12.33,
        h: 0.3,
        fontSize: 8.5,
        fontFace: "Arial",
        color: COLOR_MUTED,
        align: "center",
      }
    );
  };

  // =============================================================
  // PÁGINA 1: IDENTIFICACIÓN, FORMACIÓN ACADÉMICA Y LABORAL
  // =============================================================
  const s1 = pres.addSlide();
  addHeader(s1, "1. Filiación, Estudios y Trayectoria Laboral", "PÁGINA 1 DE 5");

  // Banner Superior con Nombre, Edad, Nac, CI, Estado Civil y Contacto
  s1.addShape(pres.ShapeType.roundRect, {
    x: 0.5,
    y: 1.35,
    w: 12.33,
    h: 1.35,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_OLIVE, width: 1.5 },
  });

  const edadStr = calcularEdadPptx(d.fechaNacimiento);
  s1.addText(
    `${d.nombre || ""} ${d.apellido || ""}   |   Edad: ${edadStr}\nFecha de Nac.: ${ d.fechaNacimiento || "N/A" }   |   CI: ${d.cedula || "N/A"}   |   Estado Civil: ${ d.estadoCivil || "N/A" }   |   Contacto: ${d.telefono || "N/A"}`,
    {
      x: 0.8,
      y: 1.48,
      w: 11.7,
      h: 1.1,
      fontSize: 12,
      bold: true,
      color: COLOR_TEXT,
      fontFace: "Arial",
    }
  );

  // Columna Izquierda: Académico
  s1.addShape(pres.ShapeType.roundRect, {
    x: 0.5,
    y: 2.9,
    w: 6.0,
    h: 4.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1 },
  });
  s1.addText("FORMACIÓN ACADÉMICA", {
    x: 0.8,
    y: 3.1,
    w: 5.4,
    h: 0.35,
    fontSize: 11,
    bold: true,
    color: COLOR_OLIVE,
  });

  const idiomasStr =
    d.idiomas && d.idiomas.length > 0
      ? d.idiomas.map((i) => `${i.idioma} (${i.nivel})`).join(", ")
      : "Español";

  s1.addText(
    [
      `Carrera / Nivel: ${d.carrera || "N/A"} (${
        d.aniosEstudio || 0
      } años cursados)`,
      `Universidad / Institución: ${d.universidad || "N/A"}`,
      `Estado de Estudios: ${d.estadoEstudios || "N/A"}`,
      `Idiomas: ${idiomasStr}`,
      `Cursos / Capacitaciones: ${d.cursos || "Ninguno declarado"}`,
    ].join("\n\n"),
    {
      x: 0.8,
      y: 3.55,
      w: 5.4,
      h: 3.1,
      fontSize: 10.5,
      color: COLOR_TEXT,
      fontFace: "Arial",
    }
  );

  // Columna Derecha: Laboral
  s1.addShape(pres.ShapeType.roundRect, {
    x: 6.83,
    y: 2.9,
    w: 6.0,
    h: 4.0,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1 },
  });
  s1.addText("EXPERIENCIA Y SITUACIÓN LABORAL", {
    x: 7.1,
    y: 3.1,
    w: 5.4,
    h: 0.35,
    fontSize: 11,
    bold: true,
    color: COLOR_OLIVE,
  });

  s1.addText(
    [
      `Situación Actual: ${d.situacionActual || "N/A"}`,
      `Empleo / Empresa: ${d.empresaAnterior || "N/A"}`,
      `Cargo: ${d.cargoAnterior || "N/A"} (${d.antiguedad || "0"} meses)`,
      `Último Salario: ${
        d.salarioAnterior
          ? d.salarioAnterior.toLocaleString("es-PY") + " Gs."
          : "N/A"
      }`,
      `Disponibilidad: ${d.disponibilidad || "Inmediata"} | Pretensión: ${
        d.pretensionSalarial || "N/A"
      }`,
    ].join("\n\n"),
    {
      x: 7.1,
      y: 3.55,
      w: 5.4,
      h: 3.1,
      fontSize: 10.5,
      color: COLOR_TEXT,
      fontFace: "Arial",
    }
  );
  addFooter(s1, 1);

  // =============================================================
  // PÁGINA 2: PERFIL PSICOSOCIAL, REDES, MOVILIDAD Y VÍNCULOS
  // =============================================================
  const s2 = pres.addSlide();
  addHeader(
    s2,
    "2. Perfil Psicosocial, Redes y Movilidad",
    "PÁGINA 2 DE 5"
  );

  s2.addShape(pres.ShapeType.roundRect, {
    x: 0.5,
    y: 1.4,
    w: 6.0,
    h: 5.5,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1 },
  });
  s2.addText("PERFIL PSICOSOCIAL Y PROYECCIÓN", {
    x: 0.8,
    y: 1.6,
    w: 5.4,
    h: 0.35,
    fontSize: 11,
    bold: true,
    color: COLOR_OLIVE,
  });
  s2.addText(
    [
      `Aspectos positivos de tu persona:\n${
        d.aspectosPositivos || "No especificado."
      }`,
      `Aspectos para mejorar:\n${d.aspectosMejorar || "No especificado."}`,
      `Visión a largo plazo:\n- ${d.visionLargoPlazo || "No especificado."}`,
      `Expectativas de ${entrevista.entidadSolicitante}:\n-${
        d.expectativasEntidad || "No especificado."
      }`,
    ].join("\n\n"),
    {
      x: 0.8,
      y: 2.05,
      w: 5.4,
      h: 4.6,
      fontSize: 10,
      color: COLOR_TEXT,
      fontFace: "Arial",
    }
  );

  s2.addShape(pres.ShapeType.roundRect, {
    x: 6.83,
    y: 1.4,
    w: 6.0,
    h: 5.5,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1 },
  });
  s2.addText("REDES SOCIALES, MOVILIDAD Y VÍNCULOS", {
    x: 7.1,
    y: 1.6,
    w: 5.4,
    h: 0.35,
    fontSize: 11,
    bold: true,
    color: COLOR_OLIVE,
  });
  s2.addText(
    [
      `Red social que más utilices:\n- ${
        d.redSocial
          ? `${d.redSocialPlataforma || "Red"} (${d.redSocial})`
          : "No."
      }`,
      `Licencia de conducir:\n- ${d.licenciaConducir ? "Sí." : "No."}`,
      `Movilidad propia:\n- ${d.movilidadPropia ? "Sí." : "No."}`,
      `Tipo de movilidad / Características:\n- ${
        d.movilidadPropia ? d.tipoMovilidad || "Vehículo propio." : "No."
      }`,
      `Tienes algún familiar político o miembro de un sindicato:\n- ${
        d.familiaresPoliticos
          ? `Sí (${d.familiaresPoliticosDetalle || ""})`
          : "No."
      }`,
    ].join("\n\n"),
    {
      x: 7.1,
      y: 2.05,
      w: 5.4,
      h: 4.6,
      fontSize: 10,
      color: COLOR_TEXT,
      fontFace: "Arial",
    }
  );
  addFooter(s2, 2);

  // =============================================================
  // PÁGINA 3: SALUD (IZQ/ARRIBA) Y ESTRUCTURA FAMILIAR (DER/ABAJO)
  // =============================================================
  const s3 = pres.addSlide();
  addHeader(s3, "3. Estado de Salud y Estructura Familiar", "PÁGINA 3 DE 5");

  s3.addShape(pres.ShapeType.roundRect, {
    x: 0.5,
    y: 1.4,
    w: 5.8,
    h: 5.5,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1 },
  });
  s3.addText("SALUD, SEGURO MÉDICO Y HÁBITOS", {
    x: 0.8,
    y: 1.6,
    w: 5.2,
    h: 0.35,
    fontSize: 11,
    bold: true,
    color: COLOR_OLIVE,
  });
  s3.addText(
    [
      `Enfermedad de base o Alergias:\n- ${
        d.enfermedadBase ? `Sí (${d.enfermedadBaseDetalle || ""})` : "No."
      }`,
      `Familiares con enfermedad de base:\n- ${
        d.familiaresEnfermedad
          ? `Sí (${d.familiaresEnfermedadDetalle || ""})`
          : "No."
      }`,
      `Posees seguro médico:\n- ${
        d.seguroMedico && d.seguroMedico !== "ninguno"
          ? `Sí (${d.seguroMedico.toUpperCase()}).`
          : "No."
      }`,
      `Consumes bebidas alcohólicas:\n- ${d.consumoAlcohol || "No"}.`,
      `Fumas o vapea:\n- ${d.consumoTabaco ? "Sí." : "No."}`,
      `Realizas algún tipo de tratamiento:\n- ${
        d.tratamientos ? `Sí (${d.tratamientosDetalle || ""})` : "No."
      }`,
    ].join("\n\n"),
    {
      x: 0.8,
      y: 2.05,
      w: 5.2,
      h: 4.6,
      fontSize: 9.8,
      color: COLOR_TEXT,
      fontFace: "Arial",
    }
  );

  s3.addShape(pres.ShapeType.roundRect, {
    x: 6.55,
    y: 1.4,
    w: 6.28,
    h: 5.5,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1 },
  });
  s3.addText("ESTRUCTURA Y ENTORNO FAMILIAR", {
    x: 6.85,
    y: 1.6,
    w: 5.7,
    h: 0.35,
    fontSize: 11,
    bold: true,
    color: COLOR_OLIVE,
  });
  s3.addText(
    [
      `Hijos: ${
        d.hijos
          ? `Sí (${d.cantidadHijos || 1} - Edades: ${d.edadesHijos || "N/A"})`
          : "No."
      }`,
      `Relación de sus padres: ${d.relacionPadres || "N/A"}.`,
      `Estructura Familiar: ${d.estructuraFamiliar || "N/A"}`,
      ``,
      `Nombre del padre: ${d.nombrePadre || "N/A"} (${
        d.edadPadre || "N/A"
      } Años)`,
      `Ocupación: ${d.ocupacionPadre || "N/A"} | Contacto: ${
        d.telefonoPadre || "N/A"
      } | Vive en: ${d.ciudadPadre || "N/A"}`,
      ``,
      `Nombre de la madre: ${d.nombreMadre || "N/A"} (${
        d.edadMadre || "N/A"
      } Años)`,
      `Ocupación: ${d.ocupacionMadre || "N/A"} | Contacto: ${
        d.telefonoMadre || "N/A"
      } | Vive en: ${d.ciudadMadre || "N/A"}`,
      ``,
      `Cantidad de hermanos: ${d.cantidadHermanos ?? 0}`,
    ].join("\n"),
    {
      x: 6.85,
      y: 2.05,
      w: 5.7,
      h: 4.6,
      fontSize: 9.8,
      color: COLOR_TEXT,
      fontFace: "Arial",
    }
  );
  addFooter(s3, 3);

  // =============================================================
  // PÁGINA 4: VIVIENDA (PRIMERO) Y SITUACIÓN ECONÓMICA (SEGUNDO)
  // =============================================================
  const s4 = pres.addSlide();
  addHeader(
    s4,
    "4. Inspección de Vivienda y Situación Económica",
    "PÁGINA 4 DE 5"
  );

  // Vivienda a la izquierda (Primero, respetando el orden del documento)
  s4.addShape(pres.ShapeType.roundRect, {
    x: 0.5,
    y: 1.4,
    w: 6.2,
    h: 5.5,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1 },
  });
  s4.addText("DATOS DE LA VIVIENDA Y GEORREFERENCIACIÓN", {
    x: 0.8,
    y: 1.6,
    w: 5.6,
    h: 0.35,
    fontSize: 11,
    bold: true,
    color: COLOR_OLIVE,
  });
  s4.addText(
    [
      `Ciudad: ${d.ciudad || "Asunción"}. | Coordenadas: ${
        d.coordenadas || "N/A"
      }`,
      `Dirección: ${d.direccion || "N/A"}`,
      `Barrio: ${d.barrio || "N/A"} | Camino: ${d.tipoCamino || "Asfaltado"}`,
      `Propiedad de la vivienda: ${d.tenenciaVivienda || "Propia"}`,
      `Costo de alquiler: ${
        d.costoAlquiler ? d.costoAlquiler.toLocaleString("es-PY") + " Gs." : "-"
      }`,
      `Cantidad de personas que viven en la casa: ${
        d.cantidadPersonas || 1
      } Personas.`,
      `Composición de la vivienda:`,
      `  - habitaciones: ${d.habitaciones ?? 1}   |   - baño: ${d.banos ?? 1}`,
      `  - cocina comedor: ${d.cocina ? 1 : 0}   |   - sala: ${d.sala ? 1 : 0}`,
      `Construcción: Techo: ${d.techo || "Tejas"}. Pisos: ${
        d.pisos || "Cerámica"
      }. Paredes: ${d.paredes || "Ladrillos"}.`,
      `Número de planta: ${d.plantas || 1} piso(s).`,
    ].join("\n"),
    {
      x: 0.8,
      y: 2.05,
      w: 5.6,
      h: 4.6,
      fontSize: 9.8,
      color: COLOR_TEXT,
      fontFace: "Arial",
    }
  );

  // Economía a la derecha (Segundo)
  s4.addShape(pres.ShapeType.roundRect, {
    x: 6.95,
    y: 1.4,
    w: 5.88,
    h: 5.5,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1 },
  });
  s4.addText("PRODUCTOS BANCARIOS Y FLUJO ECONÓMICO", {
    x: 7.25,
    y: 1.6,
    w: 5.3,
    h: 0.35,
    fontSize: 11,
    bold: true,
    color: COLOR_OLIVE,
  });
  s4.addText(
    [
      `Posee algún producto de ${entrevista.entidadSolicitante}:\n${
        d.productosEntidad ? "Sí." : "No."
      }`,
      `Miembros de la familia con productos de ${entrevista.entidadSolicitante}:\n${
        d.familiaresProductosEntidad ? "Sí." : "No."
      }`,
      `Tipos de productos:\n${
        d.productosEntidad ? d.tiposProductosEntidad || "Sí." : "No."
      }`,
      `Ingresos Familiares:\n${d.ingresosFamiliares || "No declarado."}`,
      `Otros ingresos del entrevistado:\n${d.otrosIngresos || "No refiere."}`,
      `Egresos mensuales:\n${d.egresosMensuales || "No declarado."}`,
      `Posee préstamo a su nombre:\n${
        d.prestamos ? `Sí (${d.prestamosDetalle || ""})` : "No."
      }`,
    ].join("\n\n"),
    {
      x: 7.25,
      y: 2.05,
      w: 5.3,
      h: 4.6,
      fontSize: 9.8,
      color: COLOR_TEXT,
      fontFace: "Arial",
    }
  );
  addFooter(s4, 4);

  // =============================================================
  // PÁGINA 5: OBSERVACIONES Y FIRMA (REALIZADO POR MICHELLE ROMERO)
  // =============================================================
  const s5 = pres.addSlide();
  addHeader(
    s5,
    "5. Observaciones de la Entrevista y Firma",
    "PÁGINA 5 DE 5"
  );

  s5.addShape(pres.ShapeType.roundRect, {
    x: 0.5,
    y: 1.4,
    w: 12.33,
    h: 3.6,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_SAGE, width: 1 },
  });
  s5.addText("OBSERVACIONES DURANTE LA ENTREVISTA", {
    x: 0.8,
    y: 1.6,
    w: 11.7,
    h: 0.35,
    fontSize: 11,
    bold: true,
    color: COLOR_OLIVE,
  });

  const textoObs = [
    d.observacionesEntrevista ||
      "Se muestra como una persona amable y cooperadora.",
    "",
    `${
      d.quienesPresentes ||
      "En el momento de la visita, se encontraba solo en la vivienda."
    } Dicción: ${d.diccion ? d.diccion : "Fluida y coherente"}.`,
    "",
    `Otras observaciones:`,
    `${
      d.otrasObservaciones ||
      "La vivienda se encontró en orden y limpieza."
    }`,
    `Visita realizada en: ${
      d.fechaVisita || new Date().toLocaleDateString("es-PY")
    }`,
  ].join("\n");

  s5.addText(textoObs, {
    x: 0.8,
    y: 2.05,
    w: 11.7,
    h: 2.75,
    fontSize: 11,
    color: COLOR_TEXT,
    fontFace: "Arial",
  });

  // Recuadro de Firma ("Realizado por Michelle Romero")
  s5.addShape(pres.ShapeType.roundRect, {
    x: 3.66,
    y: 5.25,
    w: 6.0,
    h: 1.6,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_OLIVE, width: 1.5 },
  });

  s5.addText(`Realizado por ${d.consultorNombre || "Michelle Romero"}`, {
    x: 3.86,
    y: 5.55,
    w: 5.6,
    h: 0.45,
    fontSize: 13,
    color: COLOR_TEXT,
    align: "center",
    bold: true,
  });

  s5.addText("JEROVIA CONSULTORA · VERIFICACIÓN SOCIOAMBIENTAL", {
    x: 3.86,
    y: 6.05,
    w: 5.6,
    h: 0.35,
    fontSize: 9,
    color: COLOR_OLIVE,
    align: "center",
    bold: true,
  });

  addFooter(s5, 5);

  const buffer = await pres.write({ outputType: "nodebuffer" });
  return buffer as Buffer;
}
