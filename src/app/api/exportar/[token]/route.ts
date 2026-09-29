import { NextRequest, NextResponse } from "next/server";
import { obtenerEntrevista, crearEntrevista, actualizarEntrevista } from "@/lib/store";
import { generarPptxInforme } from "@/lib/exportPptx";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const url = new URL(req.url);
  const formato = url.searchParams.get("formato") || "pptx";

  let entrevista = obtenerEntrevista(token);

  // Fallback demo sample data si el token es "demo"
  if (!entrevista && token === "demo") {
    entrevista = crearEntrevista("Banco Continental", "demo");
    actualizarEntrevista("demo", {
      candidatoNombre: "Tobias Maximiliano Sánchez Alvarenga",
      estado: "completado",
      pasoActual: 9,
      datos: {
        nombre: "Tobias Maximiliano",
        apellido: "Sánchez Alvarenga",
        cedula: "5.551.895",
        fechaNacimiento: "27/12/2005",
        estadoCivil: "soltero",
        telefono: "0982.176890",
        redSocial: "Tobias6749",
        redSocialPlataforma: "Instagram",
        licenciaConducir: false,
        movilidadPropia: false,
        carrera: "Economía",
        aniosEstudio: 2,
        universidad: "Universidad Americana",
        estadoEstudios: "en_curso",
        idiomas: [{ idioma: "Inglés", nivel: "avanzado" }],
        situacionActual: "desempleado",
        empresaAnterior: "Epicus",
        cargoAnterior: "Intérprete",
        antiguedad: "10 meses",
        salarioAnterior: 3000000,
        disponibilidad: "inmediata",
        pretensionSalarial: "Mínimo Legal Vigente",
        vinculosFamiliares: false,
        aspectosPositivos: "Determinado, responsable y con capacidad de seguir estructuras organizadas.",
        aspectosMejorar: "Mejorar la oratoria y hablar en público.",
        visionLargoPlazo: "Culminar la carrera de grado en Economía y especializarse en finanzas.",
        expectativasEntidad: "Interés por Banco Continental por tratarse de una institución de alto prestigio.",
        relacionPadres: "casados",
        estructuraFamiliar: "Reside con sus padres y un primo.",
        hijos: false,
        nombrePadre: "Hugo Sánchez",
        edadPadre: 51,
        ocupacionPadre: "Técnico Industrial",
        telefonoPadre: "0994 305412",
        ciudadPadre: "Luque",
        nombreMadre: "Maria Alvarenga",
        edadMadre: 48,
        ocupacionMadre: "Ama de casa",
        telefonoMadre: "0994 128218",
        ciudadMadre: "Luque",
        cantidadHermanos: 0,
        seguroMedico: "ninguno",
        consumoAlcohol: "no",
        consumoTabaco: false,
        productosEntidad: false,
        familiaresProductosEntidad: true,
        ingresosFamiliares: "8.000.000 a 9.000.000 Gs.",
        ciudad: "Luque",
        barrio: "Cañada Garay",
        direccion: "A tres cuadras de Wenseslao Martinez",
        coordenadas: "-25.2711, -57.4892",
        plusCode: "PGXV+CVW Luque",
        tipoCamino: "tierra",
        tenenciaVivienda: "propia",
        cantidadPersonas: 4,
        habitaciones: 1,
        banos: 1,
        cocina: true,
        sala: true,
        techo: "tejas",
        paredes: "ladrillo",
        pisos: "ceramica",
        plantas: 1,
        observacionesEntrevista: "Se muestra como una persona amable y colaboradora. En el momento de la visita se encontraba solo en la vivienda.",
        diccion: "fluida",
        estadoVivienda: "bueno",
        fechaVisita: "17/02/2026",
        consultorNombre: "Michelle Romero",
      },
    });
    entrevista = obtenerEntrevista("demo");
  }

  if (!entrevista) {
    return NextResponse.json({ error: "Entrevista no encontrada" }, { status: 404 });
  }

  const nombreCandidato = entrevista.candidatoNombre || entrevista.datos.nombre || "Candidato";
  const cleanName = nombreCandidato.replace(/[^a-zA-Z0-9_-]/g, "_");

  if (formato === "pptx") {
    try {
      const buffer = await generarPptxInforme(entrevista);
      return new NextResponse(buffer as unknown as BodyInit, {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "Content-Disposition": `attachment; filename="Jerovia_Informe_${cleanName}.pptx"`,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      return NextResponse.json({ error: "Error al generar PPTX", detalle: msg }, { status: 500 });
    }
  }

  // Formato HTML imprimible para PDF
  const d = entrevista.datos;
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Informe Confidencial - ${nombreCandidato}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 20px; font-size: 11pt; line-height: 1.5; }
    .header { border-bottom: 2px solid #C9A84C; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
    .brand { font-size: 18pt; font-weight: 800; color: #000; letter-spacing: 1px; }
    .brand span { color: #C9A84C; }
    .badge { font-size: 8pt; background: #C9A84C; color: #000; padding: 3px 8px; font-weight: 700; border-radius: 4px; text-transform: uppercase; }
    .subtitle { font-size: 9pt; color: #666; margin-top: 4px; }
    .card { background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 16px; page-break-inside: avoid; }
    .card-title { font-size: 10pt; font-weight: 700; color: #C9A84C; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px; text-transform: uppercase; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .field { margin-bottom: 6px; }
    .label { font-size: 8.5pt; color: #666; font-weight: 600; text-transform: uppercase; }
    .val { font-size: 10pt; font-weight: 500; color: #111; }
    .full { grid-column: span 2; }
    .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 12px; display: flex; justify-content: space-between; font-size: 8.5pt; color: #777; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; padding: 10px; background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
    <span style="font-size: 10pt; color: #92400E;">Presione Ctrl+P o use el botón para guardar como PDF.</span>
    <button onclick="window.print()" style="background: #C9A84C; border: none; padding: 8px 16px; font-weight: 700; border-radius: 6px; cursor: pointer;">Imprimir / Guardar PDF</button>
  </div>

  <div class="header">
    <div>
      <div class="brand">JEROVIA <span>CONSULTORA</span></div>
      <div class="subtitle">ESTUDIO SOCIOAMBIENTAL Y DE ANTECEDENTES LABORALES</div>
    </div>
    <div style="text-align: right;">
      <span class="badge">ESTRICTAMENTE CONFIDENCIAL</span>
      <div class="subtitle" style="margin-top: 4px;">Solicitado por: <strong>${entrevista.entidadSolicitante}</strong></div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">1. Identificación Personal y Trayectoria Laboral</div>
    <div class="grid">
      <div class="field"><div class="label">Postulante</div><div class="val">${d.nombre || ""} ${d.apellido || ""}</div></div>
      <div class="field"><div class="label">Cédula de Identidad</div><div class="val">${d.cedula || "N/A"}</div></div>
      <div class="field"><div class="label">Contacto Telefónico</div><div class="val">${d.telefono || "N/A"}</div></div>
      <div class="field"><div class="label">Estado Civil</div><div class="val">${d.estadoCivil || "N/A"}</div></div>
      <div class="field"><div class="label">Formación Académica</div><div class="val">${d.carrera || "N/A"} (${d.universidad || "N/A"})</div></div>
      <div class="field"><div class="label">Situación Laboral</div><div class="val">${d.situacionActual || "N/A"} (Ant. ${d.empresaAnterior || "N/A"})</div></div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">2. Entorno Familiar y Estado de Salud</div>
    <div class="grid">
      <div class="field"><div class="label">Estructura del Hogar</div><div class="val">${d.estructuraFamiliar || "N/A"}</div></div>
      <div class="field"><div class="label">Hijos</div><div class="val">${d.hijos ? `Sí (${d.cantidadHijos || 0})` : "No"}</div></div>
      <div class="field"><div class="label">Datos del Padre</div><div class="val">${d.nombrePadre || "N/A"} (${d.ocupacionPadre || "N/A"})</div></div>
      <div class="field"><div class="label">Datos de la Madre</div><div class="val">${d.nombreMadre || "N/A"} (${d.ocupacionMadre || "N/A"})</div></div>
      <div class="field"><div class="label">Seguro Médico</div><div class="val">${d.seguroMedico ? d.seguroMedico.toUpperCase() : "NINGUNO"}</div></div>
      <div class="field"><div class="label">Enfermedades de Base</div><div class="val">${d.enfermedadBase ? d.enfermedadBaseDetalle : "No refiere"}</div></div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">3. Situación Económica y Condiciones Habitacionales</div>
    <div class="grid">
      <div class="field"><div class="label">Ingresos Familiares</div><div class="val">${d.ingresosFamiliares || "No declarado"}</div></div>
      <div class="field"><div class="label">Tenencia Inmueble</div><div class="val">${d.tenenciaVivienda ? d.tenenciaVivienda.toUpperCase() : "PROPIA"}</div></div>
      <div class="field full"><div class="label">Dirección y Referencias</div><div class="val">${d.direccion || "N/A"}, Barrio ${d.barrio || "N/A"}, ${d.ciudad || "N/A"}</div></div>
      <div class="field"><div class="label">Coordenadas GPS</div><div class="val">${d.coordenadas || "N/A"} (${d.plusCode || "N/A"})</div></div>
      <div class="field"><div class="label">Tipo de Acceso</div><div class="val">${d.tipoCamino ? d.tipoCamino.toUpperCase() : "N/A"}</div></div>
      <div class="field full"><div class="label">Construcción</div><div class="val">Techo: ${d.techo || "Tejas"} | Paredes: ${d.paredes || "Ladrillo"} | Pisos: ${d.pisos || "Cerámica"}</div></div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">4. Conclusiones y Dictamen del Perito</div>
    <div class="field full">
      <div class="val" style="line-height: 1.6; text-align: justify;">${d.observacionesEntrevista || "El postulante demuestra actitud cooperativa y predisposición favorable. Las condiciones habitacionales y de entorno resultan acordes a lo declarado."}</div>
    </div>
  </div>

  <div class="footer">
    <div>Fecha de Visita: <strong>${d.fechaVisita || "17/02/2026"}</strong></div>
    <div>Perito Responsable: <strong>${d.consultorNombre || "Michelle Romero"}</strong> (Jerovia Consultora)</div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
