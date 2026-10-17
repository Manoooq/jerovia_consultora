import { NextRequest, NextResponse } from "next/server";
import { obtenerEntrevista } from "@/lib/store";
import { generarPptxInforme } from "@/lib/exportPptx";
import { getSession } from "@/lib/auth";
import { registrarEventoAuditoria } from "@/lib/audit";
import { enforceRateLimit, getClientIp } from "@/lib/apiSecurity";

function escapeHtml(val: unknown): string {
  const str = String(val ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function v(val: unknown, fallback = "N/A"): string {
  if (val !== undefined && val !== null) {
    const trimmed = String(val).trim();
    if (trimmed.length > 0) {
      return escapeHtml(trimmed);
    }
  }
  return escapeHtml(fallback);
}

function isSafeImageSrc(src: unknown): boolean {
  if (typeof src !== "string") return false;
  return (
    src.startsWith("data:image/jpeg;base64,") ||
    src.startsWith("data:image/png;base64,") ||
    src.startsWith("data:image/webp;base64,") ||
    src.startsWith("https://")
  );
}

function calcularEdad(fechaNac?: string): string {
  if (!fechaNac) return "N/A";
  let year = 0;
  let month = 0;
  let day = 0;

  if (/^\d{4}-\d{2}-\d{2}/.test(fechaNac)) {
    const parts = fechaNac.slice(0, 10).split("-").map(Number);
    [year, month, day] = parts;
  } else if (/^\d{2}\/\d{2}\/\d{4}/.test(fechaNac)) {
    const parts = fechaNac.slice(0, 10).split("/").map(Number);
    [day, month, year] = parts;
  }

  if (!year || year < 1920) return "N/A";
  const today = new Date();
  let age = today.getFullYear() - year;
  const m = today.getMonth() + 1 - month;
  if (m < 0 || (m === 0 && today.getDate() < day)) {
    age--;
  }
  return age > 0 && age < 110 ? `${age} años` : "N/A";
}

function siNo(val: unknown, detalle?: unknown): string {
  if (val === true || val === "si" || val === "Sí") {
    const det = String(detalle ?? "").trim();
    return det ? `Sí (${escapeHtml(det)})` : "Sí.";
  }
  return "No.";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const rateErr = enforceRateLimit(req, "export-doc", 30, 60_000);
  if (rateErr) return rateErr;

  const { token } = await params;
  const url = new URL(req.url);
  const formato = url.searchParams.get("formato") ?? "pptx";

  const entrevista = obtenerEntrevista(token);
  if (!entrevista) {
    return NextResponse.json(
      { error: "Expediente no encontrado." },
      { status: 404 }
    );
  }

  const d = entrevista.datos ?? {};
  const fullNombre = [d.nombre, d.apellido].filter(Boolean).join(" ").trim();
  const nombreCandidato =
    entrevista.candidatoNombre ?? (fullNombre ? fullNombre : "Postulante");
  const cleanFileName =
    nombreCandidato.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60) || "Informe";

  const session = await getSession();
  if (session) {
    registrarEventoAuditoria({
      userId: session.userId,
      userName: session.name,
      userRole: session.role,
      action: "EXPORT_PPTX",
      detail:
        "Descarga de informe (" +
        formato.toUpperCase() +
        ") del expediente " +
        nombreCandidato +
        ".",
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
          "Content-Disposition":
            'attachment; filename="Jerovia_Informe_' + cleanFileName + '.pptx"',
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

  const nombreMostrar = v(fullNombre, nombreCandidato);
  const edadCalculada = calcularEdad(d.fechaNacimiento);
  const idiomasTexto =
    Array.isArray(d.idiomas) && d.idiomas.length > 0
      ? d.idiomas
          .map(
            (i) => v(i.idioma, "Idioma") + " (" + v(i.nivel, "intermedio") + ")"
          )
          .join(", ")
      : "Español";

  const redSocialTexto = d.redSocial
    ? v(d.redSocialPlataforma, "Red Social") + " (" + v(d.redSocial) + ")"
    : "No declarado.";

  const fechaVisitaTexto = v(
    d.fechaVisita,
    new Date().toLocaleDateString("es-PY")
  );
  const evaluadorRaw = d.consultorNombre
    ? d.consultorNombre
    : entrevista.evaluadorAsignado;
  const evaluadorTexto = v(evaluadorRaw, "Michelle Romero");
  const entidadTexto = v(entrevista.entidadSolicitante, "Entidad Solicitante");

  const salarioAntTexto = d.salarioAnterior
    ? "Gs. " + Number(d.salarioAnterior).toLocaleString("es-PY")
    : "N/A";
  const costoAlquilerTexto = d.costoAlquiler
    ? "Gs. " + Number(d.costoAlquiler).toLocaleString("es-PY")
    : "-";
  const seguroMedTexto =
    d.seguroMedico && d.seguroMedico !== "ninguno"
      ? "Sí (" + v(d.seguroMedico.toUpperCase()) + ")."
      : "No.";
  const alcoholTexto = d.consumoAlcohol
    ? escapeHtml(
        d.consumoAlcohol.charAt(0).toUpperCase() + d.consumoAlcohol.slice(1)
      ) + "."
    : "No.";
  const hijosTexto = d.hijos
    ? "Sí (" +
      v(d.cantidadHijos, "1") +
      " - Edades: " +
      v(d.edadesHijos, "N/A") +
      ")."
    : "No.";
  const hermanosTexto = d.cantidadHermanos
    ? v(d.cantidadHermanos) + " hermano(s)."
    : "No registra / Hijo único.";
  const diccionTexto = d.diccion
    ? escapeHtml(d.diccion.charAt(0).toUpperCase() + d.diccion.slice(1))
    : "Fluida y coherente";
  const otrasObsFallback =
    "La vivienda se encontró en estado " +
    v(d.estadoVivienda, "bueno") +
    ", en orden y limpieza.";

  // Fotografías verificadas para incrustar en Página 1 y Página 4
  const fotosSeguras = Array.isArray(d.fotosVivienda)
    ? d.fotosVivienda.filter(isSafeImageSrc)
    : [];

  const galeriaPagina4Html =
    fotosSeguras.length > 0
      ? `<div class="section-box">
          <div class="section-header">Registro Fotográfico de la Vivienda Verificada</div>
          <div class="section-body photo-grid">
            ${fotosSeguras
              .slice(0, 4)
              .map(
                (src, idx) =>
                  `<div class="photo-frame"><img src="${src}" alt="Evidencia ${
                    idx + 1
                  }" /><span>Fotografía In Situ #${idx + 1}</span></div>`
              )
              .join("")}
          </div>
        </div>`
      : "";

  // Firma digitalizada en Página 5 (Firma dibujada en Pad o Firma Oficial de Michelle Romero)
  const firmaSvgOrImg = isSafeImageSrc(d.firmaEvaluador)
    ? `<img src="${d.firmaEvaluador}" alt="Firma del Perito" style="height: 68px; width: auto; margin: 0 auto; display: block;" />`
    : `<svg width="210" height="72" viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 0 auto; display: block;">
        <path d="M28 54C52 38 68 14 78 16C86 18 62 58 68 60C74 62 94 34 102 36C108 38 96 54 106 54C118 54 148 20 160 22C170 24 134 66 122 68C112 70 142 46 182 44C204 43 220 41 226 40" stroke="#2c3a58" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18 48C78 44 156 42 230 42" stroke="#536c45" stroke-width="1.6" stroke-linecap="round" stroke-opacity="0.75"/>
      </svg>`;

  // Logo Original de Jerovia Consultora sin fondo en cada cabecera de página
  const jeroviaOriginalLogoSvg = `<svg viewBox="0 0 350 118" fill="none" xmlns="http://www.w3.org/2000/svg" style="height: 36px; width: auto; color: #1a2216;">
    <g transform="translate(212, 4)">
      <circle cx="46" cy="10" r="6.5" fill="#536c45" />
      <path d="M33 25C33 19.5 38.8 16.5 46 16.5C53.2 16.5 59 19.5 59 25" fill="#536c45" />
      <circle cx="20" cy="24" r="7.5" fill="#536c45" />
      <path d="M5 44C5 36.5 11.5 32.5 20 32.5C26.5 32.5 31.5 35 33.5 39.5H5V44Z" fill="#536c45" />
      <circle cx="72" cy="24" r="7.5" fill="#536c45" />
      <path d="M58.5 39.5C60.5 35 65.5 32.5 72 32.5C80.5 32.5 87 36.5 87 44H58.5V39.5Z" fill="#536c45" />
      <circle cx="46" cy="35" r="16.5" stroke="#1a2216" stroke-width="5" />
      <circle cx="46" cy="30.5" r="5.5" fill="#1a2216" />
      <path d="M35.5 44.5C36.8 39.2 40.8 37 46 37C51.2 37 55.2 39.2 56.5 44.5H35.5Z" fill="#1a2216" />
      <path d="M59 47.5L75 63.5" stroke="#1a2216" stroke-width="6.5" stroke-linecap="round" />
      <circle cx="26" cy="49" r="10.5" fill="#536c45" stroke="#ffffff" stroke-width="2" />
      <path d="M21.2 49.2L24.6 52.5L31.2 45.5" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <text x="4" y="56" fill="#1a2216" font-family="Georgia, serif" font-weight="700" font-size="54">Jerovia</text>
    <text x="4" y="105" fill="#1a2216" font-family="Georgia, serif" font-weight="700" font-size="55">Consultora</text>
  </svg>`;

  const waveBgSvg = `<svg class="page-waves" viewBox="0 0 800 1130" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <path d="M800 0C680 340 520 720 140 1130H800V0Z" fill="#85987a" fill-opacity="0.08"/>
    <path d="M800 220C690 520 560 840 280 1130H800V220Z" fill="#536c45" fill-opacity="0.09"/>
    <path d="M800 480C720 710 610 940 440 1130H800V480Z" fill="#485536" fill-opacity="0.08"/>
    <path d="M800 0C680 340 520 720 140 1130" stroke="#85987a" stroke-opacity="0.22" stroke-width="2"/>
    <path d="M800 220C690 520 560 840 280 1130" stroke="#536c45" stroke-opacity="0.25" stroke-width="1.5"/>
  </svg>`;

  const pageHeader = (pageNum: number, sectionTitle: string) => `
    <div class="page-header">
      <div class="brand-wrap">
        ${jeroviaOriginalLogoSvg}
        <div style="border-left: 1.5px solid #85987a; padding-left: 10px;">
          <div class="brand-sub">INFORME CONFIDENCIAL DE VISITA DOMICILIARIA</div>
          <div style="font-size: 8.5pt; font-weight: 800; color: #536c45;">SOLICITANTE: ${entidadTexto}</div>
        </div>
      </div>
      <div class="page-meta">
        <span class="page-pill">${escapeHtml(sectionTitle)}</span>
        <span class="page-num">Página ${pageNum} de 5</span>
      </div>
    </div>
  `;

  const pageFooter = (pageNum: number) => `
    <div class="page-footer">
      <span>Evaluado: <strong>${nombreMostrar}</strong> (CI: ${v(d.cedula)})</span>
      <span>Jerovia Consultora · Documento Confidencial · Pág. ${pageNum}/5</span>
    </div>
  `;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Informe Confidencial - ${nombreMostrar}</title>
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1a2216;
      background: #dfe6dc;
      margin: 0;
      padding: 24px 12px;
      font-size: 10.5pt;
      line-height: 1.48;
    }
    .toolbar {
      max-width: 210mm;
      margin: 0 auto 20px auto;
      padding: 12px 18px;
      background: #1c2519;
      color: #f4f6f2;
      border-radius: 12px;
      border: 1px solid #536c45;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .toolbar button {
      background: #536c45;
      color: #ffffff;
      border: 1px solid #85987a;
      padding: 9px 18px;
      font-weight: 700;
      font-size: 9.5pt;
      border-radius: 8px;
      cursor: pointer;
    }
    .toolbar button:hover { background: #485536; }

    .a4-page {
      position: relative;
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto 24px auto;
      background: #ffffff;
      padding: 16mm 18mm 14mm 18mm;
      border-radius: 6px;
      box-shadow: 0 12px 36px rgba(26, 34, 22, 0.14);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      break-after: page;
    }
    .a4-page:last-of-type {
      page-break-after: auto;
      break-after: auto;
    }
    .page-waves {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }
    .page-content {
      position: relative;
      z-index: 2;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .page-header {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #536c45;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .brand-wrap { display: flex; align-items: center; gap: 12px; }
    .brand-sub { font-size: 7.5pt; font-weight: 700; color: #52634b; letter-spacing: 0.5px; }
    .page-meta { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .page-pill {
      background: #eaefe7;
      color: #485536;
      border: 1px solid #85987a;
      font-size: 7.5pt;
      font-weight: 800;
      padding: 3px 9px;
      border-radius: 99px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }
    .page-num { font-size: 8pt; color: #52634b; font-weight: 600; }

    .hero-banner {
      background: linear-gradient(135deg, #536c45 0%, #485536 100%);
      color: #ffffff;
      border-radius: 12px;
      padding: 16px 20px;
      border: 1px solid #85987a;
      box-shadow: 0 6px 18px rgba(83, 108, 69, 0.18);
    }
    .hero-name {
      font-size: 17pt;
      font-weight: 900;
      letter-spacing: 0.3px;
      margin: 0 0 10px 0;
      border-bottom: 1px solid rgba(255,255,255,0.22);
      padding-bottom: 8px;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px 16px;
      font-size: 9.5pt;
    }
    .hero-item span {
      display: block;
      font-size: 7.5pt;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #d5ddd1;
      font-weight: 700;
    }
    .hero-item strong {
      font-size: 10.5pt;
      color: #ffffff;
    }

    .section-box {
      background: rgba(255, 255, 255, 0.94);
      border: 1.5px solid #85987a;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(26, 34, 22, 0.04);
    }
    .section-header {
      background: #536c45;
      color: #ffffff;
      font-size: 9pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 7px 16px;
    }
    .section-body {
      padding: 12px 16px;
    }

    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .qa-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .qa-item {
      border-bottom: 1px dashed #cbd5c5;
      padding-bottom: 6px;
    }
    .qa-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .qa-label {
      font-size: 8pt;
      font-weight: 800;
      color: #485536;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 2px;
    }
    .qa-val {
      font-size: 10pt;
      font-weight: 600;
      color: #1a2216;
      white-space: pre-line;
    }

    .composition-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-top: 4px;
    }
    .comp-pill {
      background: #f2f5f0;
      border: 1px solid #85987a;
      border-radius: 8px;
      padding: 6px 8px;
      text-align: center;
    }
    .comp-pill span {
      display: block;
      font-size: 7pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #52634b;
    }
    .comp-pill strong {
      font-size: 10.5pt;
      color: #1a2216;
    }

    .photo-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .photo-frame {
      border: 1px solid #85987a;
      border-radius: 8px;
      overflow: hidden;
      background: #f8faf7;
      text-align: center;
    }
    .photo-frame img {
      width: 100%;
      height: 115px;
      object-fit: cover;
      display: block;
    }
    .photo-frame span {
      display: block;
      font-size: 7.5pt;
      font-weight: 700;
      color: #485536;
      padding: 3px 6px;
    }

    .signature-area {
      margin-top: auto;
      padding-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .signature-box {
      background: #f8faf7;
      border: 1.5px solid #85987a;
      border-radius: 14px;
      padding: 18px 44px;
      min-width: 320px;
    }
    .signature-line {
      border-top: 1.5px solid #485536;
      padding-top: 8px;
      margin-top: 6px;
      font-size: 11pt;
      font-weight: 800;
      color: #1a2216;
    }
    .signature-role {
      font-size: 8.5pt;
      font-weight: 700;
      color: #536c45;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-top: 2px;
    }

    .page-footer {
      position: relative;
      z-index: 2;
      border-top: 1px solid #cbd5c5;
      padding-top: 8px;
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #52634b;
    }

    @media print {
      body { background: #ffffff; padding: 0; }
      .no-print { display: none !important; }
      .a4-page {
        margin: 0;
        border: none;
        border-radius: 0;
        box-shadow: none;
        width: 210mm;
        height: 297mm;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar no-print">
    <div>
      <strong>Informe Confidencial de 5 Páginas — ${nombreMostrar}</strong>
      <div style="font-size: 8.5pt; color: #d5ddd1;">Formato Oficial Jerovia Consultora (Paleta Verde Oliva)</div>
    </div>
    <button onclick="window.print()">Imprimir / Guardar PDF (5 Páginas)</button>
  </div>

  <!-- ==================== PÁGINA 1: IDENTIFICACIÓN, ACADÉMICO Y LABORAL ==================== -->
  <section class="a4-page">
    ${waveBgSvg}
    ${pageHeader(1, "I. Filiación, Estudios y Empleo")}
    <div class="page-content">
      <div class="hero-banner">
        <h1 class="hero-name">${nombreMostrar}</h1>
        <div class="hero-grid">
          <div class="hero-item"><span>Edad</span><strong>${escapeHtml(edadCalculada)}</strong></div>
          <div class="hero-item"><span>Fecha de Nac.</span><strong>${v(d.fechaNacimiento)}</strong></div>
          <div class="hero-item"><span>Cédula de Identidad (CI)</span><strong>${v(d.cedula)}</strong></div>
          <div class="hero-item"><span>Estado Civil</span><strong>${v(d.estadoCivil)}</strong></div>
          <div class="hero-item"><span>Contacto</span><strong>${v(d.telefono)}</strong></div>
          <div class="hero-item"><span>Correo Electrónico</span><strong>${v(d.email)}</strong></div>
        </div>
      </div>

      <div class="two-col">
        <div class="section-box">
          <div class="section-header">Formación Académica y Estudios</div>
          <div class="section-body qa-list">
            <div class="qa-item">
              <div class="qa-label">Carrera / Nivel Educativo</div>
              <div class="qa-val">${v(d.carrera, "No especificado")}</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Universidad / Institución</div>
              <div class="qa-val">${v(d.universidad, "No especificado")}</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Años de Estudio y Estado Actual</div>
              <div class="qa-val">${v(d.aniosEstudio, "0")} años cursados · ${v(d.estadoEstudios)}</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Dominio de Idiomas</div>
              <div class="qa-val">${idiomasTexto}</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Cursos y Capacitaciones Adicionales</div>
              <div class="qa-val">${v(d.cursos, "Ninguno declarado.")}</div>
            </div>
          </div>
        </div>

        <div class="section-box">
          <div class="section-header">Situación y Trayectoria Laboral</div>
          <div class="section-body qa-list">
            <div class="qa-item">
              <div class="qa-label">Situación Ocupacional Actual</div>
              <div class="qa-val">${v(d.situacionActual, "No especificado")}</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Empresa / Empleo Anterior o Actual</div>
              <div class="qa-val">${v(d.empresaAnterior, "No registra")}</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Cargo Desempeñado y Antigüedad</div>
              <div class="qa-val">${v(d.cargoAnterior)} (${v(d.antiguedad, "0")} meses)</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Último Salario / Pretensión Salarial</div>
              <div class="qa-val">${salarioAntTexto} · Pretensión: ${v(d.pretensionSalarial, "Acorde al cargo")}</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Disponibilidad y Vínculos en la Entidad</div>
              <div class="qa-val">Disponibilidad: ${v(d.disponibilidad, "Inmediata")} · Vínculos: ${siNo(d.vinculosFamiliares, d.vinculosFamiliaresDetalle)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${pageFooter(1)}
  </section>

  <!-- ==================== PÁGINA 2: PERFIL PSICOSOCIAL, REDES Y MOVILIDAD ==================== -->
  <section class="a4-page">
    ${waveBgSvg}
    ${pageHeader(2, "II. Perfil Personal y Movilidad")}
    <div class="page-content">
      <div class="section-box">
        <div class="section-header">Evaluación Psicosocial y Proyección Personal</div>
        <div class="section-body qa-list">
          <div class="qa-item">
            <div class="qa-label">Aspectos positivos de tu persona</div>
            <div class="qa-val">${v(d.aspectosPositivos, "No especificado.")}</div>
          </div>
          <div class="qa-item">
            <div class="qa-label">Aspectos para mejorar</div>
            <div class="qa-val">${v(d.aspectosMejorar, "No especificado.")}</div>
          </div>
          <div class="qa-item">
            <div class="qa-label">Visión a largo plazo</div>
            <div class="qa-val">- ${v(d.visionLargoPlazo, "No especificado.")}</div>
          </div>
          <div class="qa-item">
            <div class="qa-label">Expectativas de ${entidadTexto} (por qué eligió esta entidad)</div>
            <div class="qa-val">- ${v(d.expectativasEntidad, "No especificado.")}</div>
          </div>
        </div>
      </div>

      <div class="section-box">
        <div class="section-header">Presencia Digital, Movilidad y Vínculos Sindicales / Políticos</div>
        <div class="section-body qa-list">
          <div class="qa-item">
            <div class="qa-label">Red social que más utilices</div>
            <div class="qa-val">- ${redSocialTexto}</div>
          </div>
          <div class="qa-item">
            <div class="qa-label">Licencia de conducir</div>
            <div class="qa-val">- ${d.licenciaConducir ? "Sí." : "No."}</div>
          </div>
          <div class="qa-item">
            <div class="qa-label">Movilidad propia</div>
            <div class="qa-val">- ${d.movilidadPropia ? "Sí." : "No."}</div>
          </div>
          <div class="qa-item">
            <div class="qa-label">Tipo de movilidad / Características</div>
            <div class="qa-val">- ${d.movilidadPropia ? v(d.tipoMovilidad, "Vehículo propio.") : "No."}</div>
          </div>
          <div class="qa-item">
            <div class="qa-label">Tienes algún familiar político o miembro de un sindicato</div>
            <div class="qa-val">- ${siNo(d.familiaresPoliticos, d.familiaresPoliticosDetalle)}</div>
          </div>
        </div>
      </div>
    </div>
    ${pageFooter(2)}
  </section>

  <!-- ==================== PÁGINA 3: SALUD Y ESTRUCTURA FAMILIAR ==================== -->
  <section class="a4-page">
    ${waveBgSvg}
    ${pageHeader(3, "III. Salud y Entorno Familiar")}
    <div class="page-content">
      <div class="section-box">
        <div class="section-header">Estado de Salud, Cobertura y Hábitos</div>
        <div class="section-body two-col">
          <div class="qa-list">
            <div class="qa-item">
              <div class="qa-label">Enfermedad de base o Alergias</div>
              <div class="qa-val">- ${siNo(d.enfermedadBase, d.enfermedadBaseDetalle)}</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Familiares con enfermedad de base</div>
              <div class="qa-val">- ${siNo(d.familiaresEnfermedad, d.familiaresEnfermedadDetalle)}</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Posees seguro médico</div>
              <div class="qa-val">- ${seguroMedTexto}</div>
            </div>
          </div>
          <div class="qa-list">
            <div class="qa-item">
              <div class="qa-label">Consumes bebidas alcohólicas</div>
              <div class="qa-val">- ${alcoholTexto}</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Fumas o vapea</div>
              <div class="qa-val">- ${d.consumoTabaco ? "Sí." : "No."}</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Realizas algún tipo de tratamiento</div>
              <div class="qa-val">- ${siNo(d.tratamientos, d.tratamientosDetalle)}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-box">
        <div class="section-header">Composición del Hogar y Referencias Filiales</div>
        <div class="section-body qa-list">
          <div class="two-col">
            <div class="qa-item">
              <div class="qa-label">Hijos</div>
              <div class="qa-val">${hijosTexto}</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Relación de sus padres</div>
              <div class="qa-val">${v(d.relacionPadres)}.</div>
            </div>
          </div>

          <div class="qa-item">
            <div class="qa-label">Estructura Familiar</div>
            <div class="qa-val">${v(d.estructuraFamiliar, "No especificado.")}</div>
          </div>

          <div class="two-col">
            <div class="qa-item">
              <div class="qa-label">Datos del Padre</div>
              <div class="qa-val">Nombre del padre: ${v(d.nombrePadre)}.
Edad: ${v(d.edadPadre)} Años.
Ocupación: ${v(d.ocupacionPadre)}.
Contacto: ${v(d.telefonoPadre)}.
Vive en: ${v(d.ciudadPadre)}.</div>
            </div>

            <div class="qa-item">
              <div class="qa-label">Datos de la Madre</div>
              <div class="qa-val">Nombre de la madre: ${v(d.nombreMadre)}.
Edad: ${v(d.edadMadre)} Años.
Ocupación: ${v(d.ocupacionMadre)}.
Vive en: ${v(d.ciudadMadre)}.
Contacto: ${v(d.telefonoMadre)}.</div>
            </div>
          </div>

          <div class="qa-item">
            <div class="qa-label">Cantidad de hermanos</div>
            <div class="qa-val">${hermanosTexto}</div>
          </div>
        </div>
      </div>
    </div>
    ${pageFooter(3)}
  </section>

  <!-- ==================== PÁGINA 4: VIVIENDA, FOTOS Y ECONOMÍA ==================== -->
  <section class="a4-page">
    ${waveBgSvg}
    ${pageHeader(4, "IV. Vivienda y Balance Económico")}
    <div class="page-content">
      <div class="section-box">
        <div class="section-header">Inspección Física de la Vivienda y Georreferenciación</div>
        <div class="section-body qa-list">
          <div class="two-col">
            <div class="qa-item">
              <div class="qa-label">Ciudad y Barrio</div>
              <div class="qa-val">Ciudad: ${v(d.ciudad, "Asunción")}. · Barrio: ${v(d.barrio)}.</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Coordenadas GPS</div>
              <div class="qa-val">${v(d.coordenadas)} ${d.plusCode ? "(" + v(d.plusCode) + ")" : ""}</div>
            </div>
          </div>

          <div class="qa-item">
            <div class="qa-label">Dirección Exacta</div>
            <div class="qa-val">${v(d.direccion, "No especificada.")}</div>
          </div>

          <div class="two-col">
            <div class="qa-item">
              <div class="qa-label">Camino y Propiedad de la Vivienda</div>
              <div class="qa-val">Camino: ${v(d.tipoCamino, "Asfaltado")}. · Propiedad: ${v(d.tenenciaVivienda, "Propia")}.</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Costo de Alquiler y Habitantes</div>
              <div class="qa-val">Costo de alquiler: ${costoAlquilerTexto} · Habitantes: ${v(d.cantidadPersonas, "1")} Personas.</div>
            </div>
          </div>

          <div class="qa-item">
            <div class="qa-label">Composición de la vivienda</div>
            <div class="composition-grid">
              <div class="comp-pill"><span>Habitaciones</span><strong>${v(d.habitaciones, "1")}</strong></div>
              <div class="comp-pill"><span>Baño</span><strong>${v(d.banos, "1")}</strong></div>
              <div class="comp-pill"><span>Cocina Comedor</span><strong>${d.cocina ? "1" : "0"}</strong></div>
              <div class="comp-pill"><span>Sala</span><strong>${d.sala ? "1" : "0"}</strong></div>
            </div>
          </div>

          <div class="qa-item">
            <div class="qa-label">Construcción y Número de Plantas</div>
            <div class="qa-val">Techo: ${v(d.techo, "Tejas")}. · Pisos: ${v(d.pisos, "Cerámica")}. · Paredes: ${v(d.paredes, "Ladrillos")}. · Número de planta: ${v(d.plantas, "1")} piso(s).</div>
          </div>
        </div>
      </div>

      ${galeriaPagina4Html}

      <div class="section-box">
        <div class="section-header">Situación Bancaria y Flujo Económico Mensual</div>
        <div class="section-body qa-list">
          <div class="two-col">
            <div class="qa-item">
              <div class="qa-label">La persona entrevistada posee algún producto de ${entidadTexto}</div>
              <div class="qa-val">${d.productosEntidad ? "Sí." : "No."}</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Miembros de la familia que posean productos de ${entidadTexto}</div>
              <div class="qa-val">${d.familiaresProductosEntidad ? "Sí." : "No."}</div>
            </div>
          </div>

          <div class="qa-item">
            <div class="qa-label">Tipos de productos</div>
            <div class="qa-val">${d.productosEntidad ? v(d.tiposProductosEntidad, "Caja de ahorro / Tarjetas.") : "No."}</div>
          </div>

          <div class="two-col">
            <div class="qa-item">
              <div class="qa-label">Ingresos Familiares</div>
              <div class="qa-val">${v(d.ingresosFamiliares, "No declarado.")}</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Otros ingresos del entrevistado</div>
              <div class="qa-val">${v(d.otrosIngresos, "No refiere.")}</div>
            </div>
          </div>

          <div class="two-col">
            <div class="qa-item">
              <div class="qa-label">Egresos mensuales</div>
              <div class="qa-val">${v(d.egresosMensuales, "No declarado.")}</div>
            </div>
            <div class="qa-item">
              <div class="qa-label">Posee préstamo a su nombre</div>
              <div class="qa-val">${siNo(d.prestamos, d.prestamosDetalle)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${pageFooter(4)}
  </section>

  <!-- ==================== PÁGINA 5: OBSERVACIONES Y FIRMA DEL PERITO ==================== -->
  <section class="a4-page">
    ${waveBgSvg}
    ${pageHeader(5, "V. Conclusión y Firma")}
    <div class="page-content">
      <div class="section-box">
        <div class="section-header">Observaciones Durante la Entrevista</div>
        <div class="section-body qa-list">
          <div class="qa-item">
            <div class="qa-label">Concepto General y Desenvolvimiento</div>
            <div class="qa-val">${v(
              d.observacionesEntrevista,
              "Se muestra como una persona amable y cooperadora durante el relevamiento."
            )}</div>
          </div>
          <div class="qa-item">
            <div class="qa-label">Personas Presentes en el Momento de la Visita</div>
            <div class="qa-val">${v(
              d.quienesPresentes,
              "En el momento de la visita, se encontraba en la vivienda."
            )}</div>
          </div>
          <div class="qa-item">
            <div class="qa-label">Dicción y Comunicación</div>
            <div class="qa-val">Dicción: ${diccionTexto}.</div>
          </div>
        </div>
      </div>

      <div class="section-box">
        <div class="section-header">Otras Observaciones y Constatación del Inmueble</div>
        <div class="section-body qa-list">
          <div class="qa-item">
            <div class="qa-label">Orden, Limpieza y Entorno</div>
            <div class="qa-val">${v(d.otrasObservaciones, otrasObsFallback)}</div>
          </div>
          <div class="qa-item">
            <div class="qa-label">Visita realizada en</div>
            <div class="qa-val">${fechaVisitaTexto}</div>
          </div>
        </div>
      </div>

      <div class="signature-area">
        <div class="signature-box">
          ${firmaSvgOrImg}
          <div class="signature-line">Realizado por ${evaluadorTexto}</div>
          <div class="signature-role">Jerovia Consultora · Verificación Socioambiental</div>
        </div>
      </div>
    </div>
    ${pageFooter(5)}
  </section>
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
