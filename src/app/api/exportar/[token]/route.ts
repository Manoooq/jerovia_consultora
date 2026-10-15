import { NextRequest, NextResponse } from "next/server";
import { obtenerEntrevista } from "@/lib/store";
import { generarPptxInforme } from "@/lib/exportPptx";
import { getSession } from "@/lib/auth";
import { registrarEventoAuditoria } from "@/lib/audit";
import { enforceRateLimit, getClientIp } from "@/lib/apiSecurity";

/**
 * Sanitizador estricto contra XSS en reportes HTML/PDF
 */
function escapeHtml(val: unknown): string {
  const str = String(val ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const rateErr = enforceRateLimit(req, "export-doc", 30, 60_000);
  if (rateErr) return rateErr;

  const { token } = await params;
  const url = new URL(req.url);
  const formato = url.searchParams.get("formato") || "pptx";

  const entrevista = obtenerEntrevista(token);
  if (!entrevista) {
    return NextResponse.json(
      { error: "Expediente no encontrado." },
      { status: 404 }
    );
  }

  const d = entrevista.datos || {};
  const nombreCandidato =
    entrevista.candidatoNombre ||
    `${d.nombre || ""} ${d.apellido || ""}`.trim() ||
    "Postulante";
  const cleanFileName =
    nombreCandidato.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60) || "Informe";

  // Registrar evento en bitácora si hay sesión activa
  const session = await getSession();
  if (session) {
    registrarEventoAuditoria({
      userId: session.userId,
      userName: session.name,
      userRole: session.role,
      action: "EXPORT_PPTX",
      detail: `Descarga de informe (${formato.toUpperCase()}) del expediente ${nombreCandidato}.`,
      ip: getClientIp(req),
    });
  }

  if (formato === "pptx") {
    try {
      const buffer = await generarPptxInforme(entrevista);
      return new NextResponse(buffer as unknown as BodyInit, {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "Content-Disposition": `attachment; filename="Jerovia_Informe_${cleanFileName}.pptx"`,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error interno";
      return NextResponse.json(
        { error: "Error al generar PPTX", detalle: msg },
        { status: 500 }
      );
    }
  }

  const idiomasTexto =
    Array.isArray(d.idiomas) && d.idiomas.length > 0
      ? d.idiomas
          .map((i) => `${escapeHtml(i.idioma)} (${escapeHtml(i.nivel)})`)
          .join(", ")
      : "Español";

  // Reporte HTML/PDF 100% escapado contra XSS y con los 9 módulos completos
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Informe Socioambiental - ${escapeHtml(nombreCandidato)}</title>
  <style>
    @page { size: A4 portrait; margin: 14mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 24px;
      font-size: 10pt;
      line-height: 1.45;
    }
    .sheet {
      max-width: 210mm;
      margin: 0 auto;
      background: #ffffff;
      padding: 24px 28px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    .toolbar {
      max-width: 210mm;
      margin: 0 auto 16px auto;
      padding: 12px 16px;
      background: #0f172a;
      color: #f8fafc;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .toolbar button {
      background: #d4af37;
      color: #000000;
      border: none;
      padding: 8px 16px;
      font-weight: 700;
      font-size: 9.5pt;
      border-radius: 8px;
      cursor: pointer;
    }
    .header {
      border-bottom: 2px solid #8a6412;
      padding-bottom: 12px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
    }
    .brand { font-size: 16pt; font-weight: 900; color: #0f172a; letter-spacing: 0.5px; }
    .brand span { color: #8a6412; }
    .badge {
      display: inline-block;
      font-size: 7.5pt;
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fcd34d;
      padding: 3px 8px;
      font-weight: 700;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .subtitle { font-size: 8.5pt; color: #475569; margin-top: 3px; }
    .card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    .card-title {
      font-size: 9.5pt;
      font-weight: 800;
      color: #8a6412;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 5px;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 12px; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 12px; }
    .field { margin-bottom: 4px; }
    .label { font-size: 7.5pt; color: #64748b; font-weight: 700; text-transform: uppercase; }
    .val { font-size: 9.5pt; font-weight: 600; color: #0f172a; word-break: break-word; }
    .full { grid-column: 1 / -1; }
    .obs-box {
      background: #f8fafc;
      border-left: 3px solid #8a6412;
      padding: 10px 12px;
      font-size: 9.5pt;
      color: #1e293b;
      text-align: justify;
      white-space: pre-line;
    }
    .footer {
      margin-top: 20px;
      border-top: 1px solid #cbd5e1;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      color: #475569;
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .sheet { border: none; padding: 0; max-width: 100%; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="toolbar no-print">
    <span>Vista previa de impresión A4 — <strong>${escapeHtml(nombreCandidato)}</strong></span>
    <button onclick="window.print()">Imprimir / Guardar como PDF</button>
  </div>

  <div class="sheet">
    <div class="header">
      <div>
        <div class="brand">JEROVIA <span>CONSULTORA</span></div>
        <div class="subtitle">INFORME DE VISITA SOCIOAMBIENTAL Y VERIFICACIÓN DOMICILIARIA</div>
      </div>
      <div style="text-align: right;">
        <span class="badge">Confidencial</span>
        <div class="subtitle">Entidad Solicitante: <strong>${escapeHtml(entrevista.entidadSolicitante)}</strong></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">1. Identificación Personal, Formación y Empleo</div>
      <div class="grid-3">
        <div class="field"><div class="label">Nombre Completo</div><div class="val">${escapeHtml(d.nombre || "")} ${escapeHtml(d.apellido || "")}</div></div>
        <div class="field"><div class="label">Cédula de Identidad</div><div class="val">${escapeHtml(d.cedula || "N/A")}</div></div>
        <div class="field"><div class="label">Fecha de Nacimiento</div><div class="val">${escapeHtml(d.fechaNacimiento || "N/A")}</div></div>
        <div class="field"><div class="label">Estado Civil</div><div class="val">${escapeHtml(d.estadoCivil || "N/A")}</div></div>
        <div class="field"><div class="label">Teléfono / WhatsApp</div><div class="val">${escapeHtml(d.telefono || "N/A")}</div></div>
        <div class="field"><div class="label">Movilidad Propia</div><div class="val">${d.movilidadPropia ? `Sí (${escapeHtml(d.tipoMovilidad || "Vehículo")})` : "No"}</div></div>
        <div class="field"><div class="label">Estudios / Carrera</div><div class="val">${escapeHtml(d.carrera || "N/A")} (${escapeHtml(d.estadoEstudios || "N/A")})</div></div>
        <div class="field"><div class="label">Institución</div><div class="val">${escapeHtml(d.universidad || "N/A")}</div></div>
        <div class="field"><div class="label">Idiomas</div><div class="val">${idiomasTexto}</div></div>
        <div class="field"><div class="label">Situación Laboral</div><div class="val">${escapeHtml(d.situacionActual || "N/A")}</div></div>
        <div class="field"><div class="label">Empresa / Actividad</div><div class="val">${escapeHtml(d.empresaAnterior || "N/A")} (${escapeHtml(d.cargoAnterior || "N/A")})</div></div>
        <div class="field"><div class="label">Antigüedad / Pretensión</div><div class="val">${escapeHtml(d.antiguedad || "0")} meses | ${escapeHtml(d.pretensionSalarial || "N/A")}</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">2. Perfil Psicosocial y Entorno Familiar</div>
      <div class="grid-2">
        <div class="field"><div class="label">Fortalezas Destacadas</div><div class="val">${escapeHtml(d.aspectosPositivos || "No especificado")}</div></div>
        <div class="field"><div class="label">Aspectos a Mejorar</div><div class="val">${escapeHtml(d.aspectosMejorar || "No especificado")}</div></div>
        <div class="field"><div class="label">Proyección a Largo Plazo</div><div class="val">${escapeHtml(d.visionLargoPlazo || "No especificado")}</div></div>
        <div class="field"><div class="label">Composición Conviviente</div><div class="val">${escapeHtml(d.estructuraFamiliar || "N/A")}</div></div>
        <div class="field"><div class="label">Hijos / Dependientes</div><div class="val">${d.hijos ? `Sí (${escapeHtml(d.cantidadHijos \vert{}\vert{} 1)} - Edades:${escapeHtml(d.edadesHijos || "N/A")})` : "Sin hijos"}</div></div>
        <div class="field"><div class="label">Cobertura Médica / Salud</div><div class="val">Seguro: ${escapeHtml((d.seguroMedico || "ninguno").toUpperCase())} | Enf. Base: ${d.enfermedadBase ? escapeHtml(d.enfermedadBaseDetalle || "Sí") : "No refiere"}</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">3. Situación Económica e Inspección del Inmueble</div>
      <div class="grid-3">
        <div class="field"><div class="label">Ingresos Familiares</div><div class="val">${escapeHtml(d.ingresosFamiliares || "No declarado")}</div></div>
        <div class="field"><div class="label">Otros Ingresos</div><div class="val">${escapeHtml(d.otrosIngresos || "No refiere")}</div></div>
        <div class="field"><div class="label">Egresos Mensuales</div><div class="val">${escapeHtml(d.egresosMensuales || "No declarado")}</div></div>
        <div class="field full"><div class="label">Compromisos / Préstamos Vigentes</div><div class="val">${d.prestamos ? escapeHtml(d.prestamosDetalle || "Registra préstamos activos") : "Sin préstamos declarados"}</div></div>
        <div class="field"><div class="label">Ciudad y Barrio</div><div class="val">${escapeHtml(d.ciudad || "N/A")} - ${escapeHtml(d.barrio || "N/A")}</div></div>
        <div class="field"><div class="label">Tenencia de Vivienda</div><div class="val">${escapeHtml((d.tenenciaVivienda || "propia").toUpperCase())}</div></div>
        <div class="field"><div class="label">Coordenadas GPS</div><div class="val">${escapeHtml(d.coordenadas || "N/A")}</div></div>
        <div class="field full"><div class="label">Dirección Exacta</div><div class="val">${escapeHtml(d.direccion || "N/A")}</div></div>
        <div class="field full"><div class="label">Calidad Constructiva y Distribución</div><div class="val">Techo: ${escapeHtml(d.techo || "N/A")} | Paredes: ${escapeHtml(d.paredes || "N/A")} | Pisos: ${escapeHtml(d.pisos || "N/A")} | Habitantes: ${escapeHtml(d.cantidadPersonas || 1)} | Dormitorios: ${escapeHtml(d.habitaciones || 1)}</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">4. Conclusión y Concepto del Evaluador</div>
      <div class="obs-box">${escapeHtml(d.observacionesEntrevista || "Sin observaciones adicionales.")}</div>
      <div class="grid-2" style="margin-top: 10px;">
        <div class="field"><div class="label">Comunicación y Dicción</div><div class="val">${escapeHtml((d.diccion || "fluida").toUpperCase())}</div></div>
        <div class="field"><div class="label">Estado General del Inmueble</div><div class="val">${escapeHtml((d.estadoVivienda || "bueno").toUpperCase())}</div></div>
      </div>
    </div>

    <div class="footer">
      <div>Fecha de Visita: <strong>${escapeHtml(d.fechaVisita || new Date().toLocaleDateString("es-PY"))}</strong></div>
      <div>Evaluador Responsable: <strong>${escapeHtml(d.consultorNombre || entrevista.evaluadorAsignado || "Jerovia Consultora")}</strong></div>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
