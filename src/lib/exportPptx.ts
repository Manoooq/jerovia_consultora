import pptxgen from "pptxgenjs";
import { EntrevistaRecord } from "./store";

export async function generarPptxInforme(entrevista: EntrevistaRecord): Promise<Buffer> {
  const d = entrevista.datos;
  const pres = new pptxgen();

  pres.layout = "LAYOUT_16x9";
  pres.author = "Jerovia Consultora";
  pres.company = "Jerovia Consultora";
  pres.title = `Informe Confidencial - ${d.nombre || "Candidato"} ${d.apellido || ""}`;

  // Paleta corporativa
  const COLOR_BG = "0D0D11";
  const COLOR_CARD = "16161D";
  const COLOR_GOLD = "C9A84C";
  const COLOR_TEXT = "E2E8F0";
  const COLOR_MUTED = "94A3B8";
  const COLOR_LINE = "2D2D3A";

  const addHeader = (slide: pptxgen.Slide, titulo: string, moduloNum: string) => {
    slide.background = { color: COLOR_BG };
    
    // Header bar
    slide.addShape(pres.ShapeType.rect, {
      x: 0.5, y: 0.4, w: 12.3, h: 0.8,
      fill: { color: COLOR_CARD },
      line: { color: COLOR_GOLD, width: 1 },
    });

    slide.addText("JEROVIA CONSULTORA", {
      x: 0.8, y: 0.5, w: 4, h: 0.3,
      fontSize: 11, fontFace: "Arial", bold: true, color: COLOR_GOLD,
    });

    slide.addText(`INFORME SOCIOAMBIENTAL CONFIDENCIAL · ${moduloNum}`, {
      x: 0.8, y: 0.8, w: 7, h: 0.3,
      fontSize: 9, fontFace: "Arial", color: COLOR_MUTED,
    });

    slide.addText(titulo.toUpperCase(), {
      x: 6.5, y: 0.5, w: 6, h: 0.6,
      fontSize: 15, fontFace: "Arial", bold: true, color: "FFFFFF", align: "right",
    });
  };

  const addFooter = (slide: pptxgen.Slide) => {
    slide.addText(
      `Entidad Solicitante: ${entrevista.entidadSolicitante} | Evaluado: ${d.nombre || ""} ${d.apellido || ""} (CI: ${d.cedula || "N/A"}) | Jerovia Consultora Confidential`,
      {
        x: 0.5, y: 7.1, w: 12.3, h: 0.3,
        fontSize: 8, fontFace: "Arial", color: COLOR_MUTED, align: "center",
      }
    );
  };

  // -------------------------------------------------------------
  // SLIDE 1: INFORMACIÓN PERSONAL, ACADÉMICA Y LABORAL
  // -------------------------------------------------------------
  const s1 = pres.addSlide();
  addHeader(s1, "Información Personal, Académica y Laboral", "MÓDULO 01 - 03");

  // Col 1: Datos Personales
  s1.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: 1.5, w: 3.9, h: 5.3,
    fill: { color: COLOR_CARD }, line: { color: COLOR_LINE, width: 1 },
  });
  s1.addText("INFORMACIÓN PERSONAL", {
    x: 0.7, y: 1.7, w: 3.5, h: 0.4,
    fontSize: 12, bold: true, color: COLOR_GOLD,
  });

  const textoPersonal = [
    `Nombre: ${d.nombre || ""} ${d.apellido || ""}`,
    `Cédula (CI): ${d.cedula || "N/A"}`,
    `Fecha Nac.: ${d.fechaNacimiento || "N/A"}`,
    `Estado Civil: ${d.estadoCivil || "N/A"}`,
    `Contacto: ${d.telefono || "N/A"}`,
    `Email: ${d.email || "N/A"}`,
    `Red Social: ${d.redSocial || "N/A"} (${d.redSocialPlataforma || "N/A"})`,
    `Licencia Conducir: ${d.licenciaConducir ? "Sí" : "No"}`,
    `Movilidad Propia: ${d.movilidadPropia ? `Sí (${d.tipoMovilidad || "Vehículo"})` : "No"}`,
  ].join("\n\n");

  s1.addText(textoPersonal, {
    x: 0.7, y: 2.2, w: 3.5, h: 4.4,
    fontSize: 10, color: COLOR_TEXT, fontFace: "Arial",
  });

  // Col 2: Formación Académica
  s1.addShape(pres.ShapeType.roundRect, {
    x: 4.7, y: 1.5, w: 3.9, h: 5.3,
    fill: { color: COLOR_CARD }, line: { color: COLOR_LINE, width: 1 },
  });
  s1.addText("FORMACIÓN ACADÉMICA", {
    x: 4.9, y: 1.7, w: 3.5, h: 0.4,
    fontSize: 12, bold: true, color: COLOR_GOLD,
  });

  const idiomasStr = (d.idiomas && d.idiomas.length > 0)
    ? d.idiomas.map(i => `${i.idioma} (${i.nivel})`).join(", ")
    : "Español";

  const textoAcademico = [
    `Carrera / Especialidad:`,
    `${d.carrera || "N/A"} (${d.aniosEstudio || 0} años cursados)`,
    ``,
    `Universidad / Institución:`,
    `${d.universidad || "N/A"}`,
    ``,
    `Estado de Estudios: ${d.estadoEstudios || "N/A"}`,
    `Idiomas: ${idiomasStr}`,
    ``,
    `Capacitaciones Adicionales:`,
    `${d.cursos || "Ninguno declarado"}`,
  ].join("\n");

  s1.addText(textoAcademico, {
    x: 4.9, y: 2.2, w: 3.5, h: 4.4,
    fontSize: 10, color: COLOR_TEXT, fontFace: "Arial",
  });

  // Col 3: Trayectoria Laboral
  s1.addShape(pres.ShapeType.roundRect, {
    x: 8.9, y: 1.5, w: 3.9, h: 5.3,
    fill: { color: COLOR_CARD }, line: { color: COLOR_LINE, width: 1 },
  });
  s1.addText("TRAYECTORIA LABORAL", {
    x: 9.1, y: 1.7, w: 3.5, h: 0.4,
    fontSize: 12, bold: true, color: COLOR_GOLD,
  });

  const textoLaboral = [
    `Situación Actual: ${d.situacionActual || "N/A"}`,
    `Empleo Anterior: ${d.empresaAnterior || "N/A"}`,
    `Cargo Desempeñado: ${d.cargoAnterior || "N/A"}`,
    `Antigüedad: ${d.antiguedad || "N/A"}`,
    `Último Salario: ${d.salarioAnterior ? d.salarioAnterior.toLocaleString("es-PY") + " Gs." : "N/A"}`,
    `Disponibilidad: ${d.disponibilidad || "Inmediata"}`,
    `Pretensión Salarial: ${d.pretensionSalarial || "Mínimo Legal Vigente"}`,
    `Familiares en entidad: ${d.vinculosFamiliares ? `Sí (${d.vinculosFamiliaresDetalle || ""})` : "No"}`,
  ].join("\n\n");

  s1.addText(textoLaboral, {
    x: 9.1, y: 2.2, w: 3.5, h: 4.4,
    fontSize: 10, color: COLOR_TEXT, fontFace: "Arial",
  });

  addFooter(s1);

  // -------------------------------------------------------------
  // SLIDE 2: PERFIL PSICOLABORAL Y PROYECCIÓN
  // -------------------------------------------------------------
  const s2 = pres.addSlide();
  addHeader(s2, "Perfil Psicolaboral y Proyección", "MÓDULO 04");

  // Box 1: Fortalezas
  s2.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: 1.5, w: 6.0, h: 2.5,
    fill: { color: COLOR_CARD }, line: { color: COLOR_LINE, width: 1 },
  });
  s2.addText("ASPECTOS POSITIVOS (FORTALEZAS)", {
    x: 0.8, y: 1.7, w: 5.5, h: 0.3,
    fontSize: 11, bold: true, color: COLOR_GOLD,
  });
  s2.addText(d.aspectosPositivos || "No especificado", {
    x: 0.8, y: 2.1, w: 5.5, h: 1.7,
    fontSize: 10, color: COLOR_TEXT, fontFace: "Arial",
  });

  // Box 2: Oportunidades de Mejora
  s2.addShape(pres.ShapeType.roundRect, {
    x: 6.8, y: 1.5, w: 6.0, h: 2.5,
    fill: { color: COLOR_CARD }, line: { color: COLOR_LINE, width: 1 },
  });
  s2.addText("ASPECTOS PARA MEJORAR", {
    x: 7.1, y: 1.7, w: 5.5, h: 0.3,
    fontSize: 11, bold: true, color: COLOR_GOLD,
  });
  s2.addText(d.aspectosMejorar || "No especificado", {
    x: 7.1, y: 2.1, w: 5.5, h: 1.7,
    fontSize: 10, color: COLOR_TEXT, fontFace: "Arial",
  });

  // Box 3: Visión a Largo Plazo
  s2.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: 4.3, w: 6.0, h: 2.5,
    fill: { color: COLOR_CARD }, line: { color: COLOR_LINE, width: 1 },
  });
  s2.addText("VISIÓN A LARGO PLAZO", {
    x: 0.8, y: 4.5, w: 5.5, h: 0.3,
    fontSize: 11, bold: true, color: COLOR_GOLD,
  });
  s2.addText(d.visionLargoPlazo || "No especificado", {
    x: 0.8, y: 4.9, w: 5.5, h: 1.7,
    fontSize: 10, color: COLOR_TEXT, fontFace: "Arial",
  });

  // Box 4: Expectativas hacia la entidad
  s2.addShape(pres.ShapeType.roundRect, {
    x: 6.8, y: 4.3, w: 6.0, h: 2.5,
    fill: { color: COLOR_CARD }, line: { color: COLOR_LINE, width: 1 },
  });
  s2.addText(`EXPECTATIVAS HACIA ${entrevista.entidadSolicitante.toUpperCase()}`, {
    x: 7.1, y: 4.5, w: 5.5, h: 0.3,
    fontSize: 11, bold: true, color: COLOR_GOLD,
  });
  s2.addText(d.expectativasEntidad || "No especificado", {
    x: 7.1, y: 4.9, w: 5.5, h: 1.7,
    fontSize: 10, color: COLOR_TEXT, fontFace: "Arial",
  });

  addFooter(s2);

  // -------------------------------------------------------------
  // SLIDE 3: ENTORNO FAMILIAR Y SALUD
  // -------------------------------------------------------------
  const s3 = pres.addSlide();
  addHeader(s3, "Entorno Familiar y Estado de Salud", "MÓDULO 05 - 06");

  // Col 1: Estructura Familiar
  s3.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: 1.5, w: 6.0, h: 5.3,
    fill: { color: COLOR_CARD }, line: { color: COLOR_LINE, width: 1 },
  });
  s3.addText("COMPOSICIÓN FAMILIAR DEL HOGAR", {
    x: 0.8, y: 1.7, w: 5.5, h: 0.3,
    fontSize: 11, bold: true, color: COLOR_GOLD,
  });

  const textoFamilia = [
    `Relación de los padres: ${d.relacionPadres || "N/A"}`,
    `Convivencia actual: ${d.estructuraFamiliar || "N/A"}`,
    `Hijos: ${d.hijos ? `Sí (${d.cantidadHijos || 0} hijos - Edades: ${d.edadesHijos || "N/A"})` : "No posee"}`,
    `Cantidad de hermanos: ${d.cantidadHermanos || 0}`,
    ``,
    `DATOS DEL PADRE:`,
    `Nombre: ${d.nombrePadre || "N/A"} (${d.edadPadre || "N/A"} años)`,
    `Ocupación: ${d.ocupacionPadre || "N/A"} | Ciudad: ${d.ciudadPadre || "N/A"}`,
    `Contacto: ${d.telefonoPadre || "N/A"}`,
    ``,
    `DATOS DE LA MADRE:`,
    `Nombre: ${d.nombreMadre || "N/A"} (${d.edadMadre || "N/A"} años)`,
    `Ocupación: ${d.ocupacionMadre || "N/A"} | Ciudad: ${d.ciudadMadre || "N/A"}`,
    `Contacto: ${d.telefonoMadre || "N/A"}`,
  ].join("\n");

  s3.addText(textoFamilia, {
    x: 0.8, y: 2.1, w: 5.5, h: 4.5,
    fontSize: 9.5, color: COLOR_TEXT, fontFace: "Arial",
  });

  // Col 2: Salud
  s3.addShape(pres.ShapeType.roundRect, {
    x: 6.8, y: 1.5, w: 6.0, h: 5.3,
    fill: { color: COLOR_CARD }, line: { color: COLOR_LINE, width: 1 },
  });
  s3.addText("ESTADO DE SALUD Y HÁBITOS", {
    x: 7.1, y: 1.7, w: 5.5, h: 0.3,
    fontSize: 11, bold: true, color: COLOR_GOLD,
  });

  const textoSalud = [
    `Enfermedad de Base o Alergias:`,
    `${d.enfermedadBase ? `Sí: ${d.enfermedadBaseDetalle || ""}` : "No refiere"}`,
    ``,
    `Familiares con enfermedad de base:`,
    `${d.familiaresEnfermedad ? `Sí: ${d.familiaresEnfermedadDetalle || ""}` : "No refiere"}`,
    ``,
    `Cobertura de Seguro Médico: ${d.seguroMedico ? d.seguroMedico.toUpperCase() : "NINGUNO"}`,
    `Tratamientos Médicos Actuales: ${d.tratamientos ? `Sí (${d.tratamientosDetalle || ""})` : "No"}`,
    ``,
    `Consumo de Bebidas Alcohólicas: ${d.consumoAlcohol || "No"}`,
    `Consumo de Tabaco / Vapeo: ${d.consumoTabaco ? "Sí" : "No"}`,
    ``,
    `Vínculos Políticos o Sindicales:`,
    `${d.familiaresPoliticos ? `Sí (${d.familiaresPoliticosDetalle || ""})` : "No refiere"}`,
  ].join("\n");

  s3.addText(textoSalud, {
    x: 7.1, y: 2.1, w: 5.5, h: 4.5,
    fontSize: 9.5, color: COLOR_TEXT, fontFace: "Arial",
  });

  addFooter(s3);

  // -------------------------------------------------------------
  // SLIDE 4: ECONOMÍA Y CONDICIONES HABITACIONALES
  // -------------------------------------------------------------
  const s4 = pres.addSlide();
  addHeader(s4, "Situación Económica y Condiciones de Vivienda", "MÓDULO 07 - 08");

  // Col 1: Economía
  s4.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: 1.5, w: 6.0, h: 5.3,
    fill: { color: COLOR_CARD }, line: { color: COLOR_LINE, width: 1 },
  });
  s4.addText("BALANCE SOCIOECONÓMICO", {
    x: 0.8, y: 1.7, w: 5.5, h: 0.3,
    fontSize: 11, bold: true, color: COLOR_GOLD,
  });

  const textoEco = [
    `Productos en la entidad solicitante:`,
    `${d.productosEntidad ? `Sí (${d.tiposProductosEntidad || "Caja de ahorro/Tarjetas"})` : "No posee"}`,
    ``,
    `Familiares con productos en la entidad:`,
    `${d.familiaresProductosEntidad ? "Sí" : "No"}`,
    ``,
    `Ingresos Familiares Estimados: ${d.ingresosFamiliares || "No declarado"}`,
    `Otros Ingresos Secundarios: ${d.otrosIngresos || "No refiere"}`,
    `Egresos Mensuales Estimados: ${d.egresosMensuales || "No declarado"}`,
    ``,
    `Deudas / Préstamos a su nombre:`,
    `${d.prestamos ? `Sí: ${d.prestamosDetalle || ""}` : "No registra préstamos activos"}`,
  ].join("\n");

  s4.addText(textoEco, {
    x: 0.8, y: 2.1, w: 5.5, h: 4.5,
    fontSize: 10, color: COLOR_TEXT, fontFace: "Arial",
  });

  // Col 2: Vivienda
  s4.addShape(pres.ShapeType.roundRect, {
    x: 6.8, y: 1.5, w: 6.0, h: 5.3,
    fill: { color: COLOR_CARD }, line: { color: COLOR_LINE, width: 1 },
  });
  s4.addText("INFRAESTRUCTURA HABITACIONAL Y UBICACIÓN", {
    x: 7.1, y: 1.7, w: 5.5, h: 0.3,
    fontSize: 11, bold: true, color: COLOR_GOLD,
  });

  const textoViv = [
    `Ubicación: ${d.ciudad || "Luque"}, Barrio ${d.barrio || "Cañada Garay"}`,
    `Dirección: ${d.direccion || "N/A"}`,
    `Coordenadas GPS: ${d.coordenadas || "N/A"} | Plus Code: ${d.plusCode || "N/A"}`,
    `Acceso / Camino: ${d.tipoCamino ? d.tipoCamino.toUpperCase() : "N/A"}`,
    ``,
    `Tenencia del Inmueble: ${d.tenenciaVivienda ? d.tenenciaVivienda.toUpperCase() : "PROPIA"}`,
    `${d.costoAlquiler ? `Costo de Alquiler: ${d.costoAlquiler.toLocaleString("es-PY")} Gs.` : ""}`,
    `Habitantes en la vivienda: ${d.cantidadPersonas || 1} personas`,
    `Ambientes: ${d.habitaciones || 1} habitaciones, ${d.banos || 1} baño(s), Cocina: ${d.cocina ? "Sí" : "No"}, Sala: ${d.sala ? "Sí" : "No"}`,
    ``,
    `MATERIALES DE CONSTRUCCIÓN:`,
    `Techo: ${d.techo || "Tejas"} | Paredes: ${d.paredes || "Ladrillo"}`,
    `Pisos: ${d.pisos || "Cerámica"} | Plantas: ${d.plantas || 1} piso(s)`,
  ].join("\n");

  s4.addText(textoViv, {
    x: 7.1, y: 2.1, w: 5.5, h: 4.5,
    fontSize: 9.5, color: COLOR_TEXT, fontFace: "Arial",
  });

  addFooter(s4);

  // -------------------------------------------------------------
  // SLIDE 5: CONCLUSIONES Y DICTAMEN DEL CONSULTOR
  // -------------------------------------------------------------
  const s5 = pres.addSlide();
  addHeader(s5, "Conclusiones Generales y Dictamen", "MÓDULO 09");

  // Big observation box
  s5.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: 1.5, w: 12.3, h: 3.5,
    fill: { color: COLOR_CARD }, line: { color: COLOR_LINE, width: 1 },
  });
  s5.addText("OBSERVACIONES DEL EVALUADOR DURANTE LA VISITA", {
    x: 0.8, y: 1.7, w: 11.7, h: 0.3,
    fontSize: 11, bold: true, color: COLOR_GOLD,
  });

  const textoObs = [
    d.observacionesEntrevista || "Se muestra como una persona amable, colaboradora y con predisposición favorable al diálogo.",
    "",
    `Personas presentes durante la inspección: ${d.quienesPresentes || "Entrevistado a solas en el domicilio."}`,
    `Dicción y coherencia comunicacional: ${d.diccion ? d.diccion.toUpperCase() : "FLUIDA Y COHERENTE"}.`,
    `Condición de orden y habitabilidad: ${d.estadoVivienda ? d.estadoVivienda.toUpperCase() : "BUENO - EN ORDEN Y LIMPIEZA"}.`,
    d.otrasObservaciones ? `Otras consideraciones: ${d.otrasObservaciones}` : "",
  ].filter(Boolean).join("\n");

  s5.addText(textoObs, {
    x: 0.8, y: 2.1, w: 11.7, h: 2.7,
    fontSize: 11, color: COLOR_TEXT, fontFace: "Arial",
  });

  // Footer signature box
  s5.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: 5.2, w: 12.3, h: 1.6,
    fill: { color: "111116" }, line: { color: COLOR_GOLD, width: 1 },
  });

  s5.addText(`Fecha de Realización de la Visita: ${d.fechaVisita || new Date().toLocaleDateString("es-PY")}`, {
    x: 0.8, y: 5.5, w: 6, h: 0.3,
    fontSize: 11, color: COLOR_TEXT, bold: true,
  });

  s5.addText(`Dictamen: APTO PARA CONTINUAR PROCESO`, {
    x: 0.8, y: 6.0, w: 6, h: 0.3,
    fontSize: 11, color: COLOR_GOLD, bold: true,
  });

  s5.addText(`Perito Evaluador Responsable:\n${d.consultorNombre || "Michelle Romero"}\nJerovia Consultora`, {
    x: 7.5, y: 5.4, w: 5, h: 0.9,
    fontSize: 11, color: "FFFFFF", align: "right", bold: true,
  });

  addFooter(s5);

  const buffer = await pres.write({ outputType: "nodebuffer" });
  return buffer as Buffer;
}
