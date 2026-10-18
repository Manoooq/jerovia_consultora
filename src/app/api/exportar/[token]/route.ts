import { NextRequest, NextResponse } from "next/server";
import { obtenerEntrevista, syncStoreFromCloud } from "@/lib/store";
import { generarPptxInforme } from "@/lib/exportPptx";
import { getSession } from "@/lib/auth";
import { registrarEventoAuditoria } from "@/lib/audit";
import { enforceRateLimit, getClientIp } from "@/lib/apiSecurity";
import {
  convertirATerceraPersona,
  corregirOrtografiaTexto,
} from "@/lib/textProcessor";
import { formatDateToPy } from "@/lib/utils";

function escapeHtml(val: unknown): string {
  const str = String(val ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function v(val: unknown, fallback = "No especificado"): string {
  if (val !== undefined && val !== null) {
    const trimmed = String(val).trim();
    if (trimmed.length > 0) {
      return escapeHtml(convertirATerceraPersona(trimmed));
    }
  }
  return escapeHtml(fallback);
}

function vRaw(val: unknown, fallback = "No especificado"): string {
  if (val !== undefined && val !== null) {
    const trimmed = String(val).trim();
    if (trimmed.length > 0) {
      return escapeHtml(corregirOrtografiaTexto(trimmed));
    }
  }
  return escapeHtml(fallback);
}

function isSafeImageSrc(src: unknown): boolean {
  if (typeof src !== "string") return false;
  return src.startsWith("data:image/") || src.startsWith("https://");
}

function siNo(val: unknown, detalle?: unknown): string {
  if (val === true || val === "si" || val === "Sí") {
    const det = String(detalle ?? "").trim();
    return det ? "Sí - " + escapeHtml(convertirATerceraPersona(det)) : "Sí";
  }
  return "No";
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

  const session = await getSession();
  if (token !== "demo" && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set(
      "redirect",
      `/api/exportar/${encodeURIComponent(token)}?formato=${encodeURIComponent(formato)}`
    );
    return NextResponse.redirect(loginUrl);
  }

  await syncStoreFromCloud(token);
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
  const entidadTexto = v(entrevista.entidadSolicitante, "Banco Continental");

  const idiomasMostrar = d.idiomasTexto
    ? v(d.idiomasTexto)
    : Array.isArray(d.idiomas) && d.idiomas.length > 0
    ? d.idiomas.map((i) => v(i.idioma)).join(", ")
    : "Castellano, Guaraní";

  const tatuajesTexto =
    d.tieneTatuajes && d.tieneTatuajes !== "no"
      ? "Sí (" + (d.tatuajesVisibles === "visibles" ? "Visibles" : "No son visibles") + ")"
      : "No";

  const redSocialTexto = d.redSocial
    ? vRaw(d.redSocialPlataforma, "Instagram") + " - " + escapeHtml(String(d.redSocial).trim())
    : "No utiliza";

  const hermanosArray = Array.isArray(d.listaHermanos) ? d.listaHermanos : [];
  const hermanosHtml =
    hermanosArray.length > 0
      ? hermanosArray
          .map(
            (h) =>
              `<div class="sub-card"><strong>Nombre y apellido:</strong> ${v(
                h.nombre
              )} · <strong>Edad:</strong> ${v(
                h.edad
              )} · <strong>Ocupación:</strong> ${v(
                h.ocupacion
              )} · <strong>Empresa/Inst.:</strong> ${v(
                h.empresa,
                "-"
              )} · <strong>Domicilio:</strong> ${v(h.domicilio)}</div>`
          )
          .join("")
      : `<div class="qa-val">${
          d.cantidadHermanos ? v(d.cantidadHermanos) + " hermano(s)" : "No registra"
        }</div>`;

  const egresosArray = Array.isArray(d.listaEgresos) ? d.listaEgresos : [];
  const egresosHtml =
    egresosArray.length > 0
      ? egresosArray
          .map(
            (eg, idx) =>
              `<div class="sub-card"><strong>${idx + 1}. Empresa:</strong> ${v(
                eg.empresa
              )} — <strong>Monto del pago mensual:</strong> Gs. ${v(eg.monto)}</div>`
          )
          .join("")
      : `<div class="qa-val">${v(d.egresosMensuales, "Sin egresos detallados")}</div>`;

  const prestamosArray = Array.isArray(d.listaPrestamos) ? d.listaPrestamos : [];
  const prestamosHtml =
    d.prestamos && prestamosArray.length > 0
      ? prestamosArray
          .map(
            (pr, idx) =>
              `<div class="sub-card"><strong>${
                idx + 1
              }. Nombre del Banco/Entidad:</strong> ${v(
                pr.entidad
              )} — <strong>Valor de la cuota en Gs:</strong> ${v(pr.cuota)}</div>`
          )
          .join("")
      : `<div class="qa-val">${siNo(d.prestamos, d.prestamosDetalle)}</div>`;

  const fotoCandidatoHtml = isSafeImageSrc(d.fotoCandidato)
    ? `<div style="width: 104px; height: 124px; border-radius: 10px; border: 2px solid #f4f6f2; background: rgba(255,255,255,0.14); padding: 3px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><img src="${d.fotoCandidato}" alt="${nombreMostrar}" style="max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; border-radius: 7px; display: block;" /></div>`
    : "";

  const fotosViviendaSeguras = Array.isArray(d.fotosVivienda)
    ? d.fotosVivienda.filter(isSafeImageSrc)
    : [];

  const gridClass =
    fotosViviendaSeguras.length === 1
      ? "photo-grid photo-grid-1"
      : fotosViviendaSeguras.length === 2
      ? "photo-grid photo-grid-2"
      : "photo-grid photo-grid-multi";

  const galeriaViviendaHtml =
    fotosViviendaSeguras.length > 0
      ? `<div class="${gridClass}">${fotosViviendaSeguras
          .slice(0, 4)
          .map(
            (src, i) =>
              `<div class="photo-frame"><div class="photo-img-wrap"><img src="${src}" alt="Vivienda ${
                i + 1
              }" /></div><span>Evidencia Fotográfica del Hogar #${i + 1}</span></div>`
          )
          .join("")}</div>`
      : "";

  const firmaSvgOrImg = isSafeImageSrc(d.firmaEvaluador)
    ? `<img src="${d.firmaEvaluador}" alt="Firma" style="height: 68px; width: auto; margin: 0 auto; display: block;" />`
    : `<svg width="210" height="72" viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 0 auto; display: block;">
        <path d="M28 54C52 38 68 14 78 16C86 18 62 58 68 60C74 62 94 34 102 36C108 38 96 54 106 54C118 54 148 20 160 22C170 24 134 66 122 68C112 70 142 46 182 44C204 43 220 41 226 40" stroke="#2c3a58" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18 48C78 44 156 42 230 42" stroke="#536c45" stroke-width="1.6" stroke-linecap="round" stroke-opacity="0.75"/>
      </svg>`;

  const jeroviaOriginalLogoSvg = `<svg viewBox="0 0 350 118" fill="none" xmlns="http://www.w3.org/2000/svg" style="height: 36px; width: auto;">
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
  </svg>`;

  const pageHeader = (pageNum: number, sectionTitle: string) => `
    <div class="page-header">
      <div class="brand-wrap">
        ${jeroviaOriginalLogoSvg}
        <div style="border-left: 1.5px solid #85987a; padding-left: 10px;">
          <div class="brand-sub">INFORME CONFIDENCIAL DE VERIFICACIÓN SOCIOAMBIENTAL</div>
          <div style="font-size: 8.5pt; font-weight: 800; color: #536c45;">ENTIDAD: ${entidadTexto}</div>
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
      <span>Postulante: <strong>${nombreMostrar}</strong> (CI: ${v(d.cedula)})</span>
      <span>Jerovia Consultora · Pág. ${pageNum}/5</span>
    </div>
  `;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Informe Socioambiental - ${nombreMostrar}</title>
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1a2216;
      background: #dfe6dc;
      margin: 0;
      padding: 20px 10px;
      font-size: 9.8pt;
      line-height: 1.42;
    }
    .toolbar {
      max-width: 210mm;
      margin: 0 auto 18px auto;
      padding: 12px 18px;
      background: #1c2519;
      color: #f4f6f2;
      border-radius: 12px;
      border: 1px solid #536c45;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .toolbar button {
      background: #536c45;
      color: #ffffff;
      border: 1px solid #85987a;
      padding: 8px 16px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
    }
    .a4-page {
      position: relative;
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto 20px auto;
      background: #ffffff;
      padding: 14mm 16mm;
      border-radius: 6px;
      box-shadow: 0 12px 36px rgba(26, 34, 22, 0.14);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      break-after: page;
    }
    .a4-page:last-of-type { page-break-after: auto; break-after: auto; }
    .page-waves { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
    .page-content { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; gap: 12px; }
    .page-header {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #536c45;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .brand-wrap { display: flex; align-items: center; gap: 10px; }
    .brand-sub { font-size: 7.2pt; font-weight: 700; color: #52634b; letter-spacing: 0.4px; }
    .page-meta { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }
    .page-pill {
      background: #eaefe7;
      color: #485536;
      border: 1px solid #85987a;
      font-size: 7.2pt;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 99px;
      text-transform: uppercase;
    }
    .page-num { font-size: 7.8pt; color: #52634b; font-weight: 600; }

    .hero-banner {
      background: linear-gradient(135deg, #536c45 0%, #485536 100%);
      color: #ffffff;
      border-radius: 12px;
      padding: 14px 18px;
      border: 1px solid #85987a;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .hero-name { font-size: 16pt; font-weight: 900; margin: 0 0 8px 0; border-bottom: 1px solid rgba(255,255,255,0.22); padding-bottom: 6px; }
    .hero-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 14px; font-size: 9pt; }
    .hero-item span { display: block; font-size: 7pt; text-transform: uppercase; color: #d5ddd1; font-weight: 700; }
    .hero-item strong { font-size: 9.8pt; color: #ffffff; }

    .section-box {
      background: rgba(255, 255, 255, 0.95);
      border: 1.5px solid #85987a;
      border-radius: 10px;
      overflow: hidden;
    }
    .section-header {
      background: #536c45;
      color: #ffffff;
      font-size: 8.8pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      padding: 6px 14px;
    }
    .section-body { padding: 10px 14px; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .qa-list { display: flex; flex-direction: column; gap: 6px; }
    .qa-item { border-bottom: 1px dashed #cbd5c5; padding-bottom: 5px; }
    .qa-item:last-child { border-bottom: none; padding-bottom: 0; }
    .qa-label { font-size: 7.8pt; font-weight: 800; color: #485536; text-transform: uppercase; }
    .qa-val { font-size: 9.5pt; font-weight: 600; color: #1a2216; }
    .sub-card { background: #f4f7f2; border: 1px solid #cbd5c5; border-radius: 6px; padding: 5px 8px; font-size: 8.8pt; margin-bottom: 4px; }
    .photo-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 6px; }
    .photo-grid-1 { grid-template-columns: 1fr; }
    .photo-grid-2 { grid-template-columns: repeat(2, 1fr); }
    .photo-grid-multi { grid-template-columns: repeat(2, 1fr); }
    .photo-frame { border: 1.5px solid #85987a; border-radius: 8px; overflow: hidden; text-align: center; background: #f4f7f2; display: flex; flex-direction: column; }
    .photo-img-wrap { width: 100%; display: flex; align-items: center; justify-content: center; background: #eef3eb; padding: 4px; }
    .photo-grid-1 .photo-img-wrap { height: 215px; }
    .photo-grid-2 .photo-img-wrap { height: 185px; }
    .photo-grid-multi .photo-img-wrap { height: 120px; }
    .photo-frame img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; display: block; margin: 0 auto; border-radius: 4px; }
    .photo-frame span { display: block; font-size: 7pt; font-weight: 700; color: #485536; padding: 3px 4px; border-top: 1px solid #d5ddd1; background: #f8faf7; }
    .signature-area { margin-top: auto; padding-top: 14px; display: flex; flex-direction: column; align-items: center; text-align: center; }
    .signature-box { background: #f8faf7; border: 1.5px solid #85987a; border-radius: 12px; padding: 14px 36px; min-width: 300px; }
    .signature-line { border-top: 1.5px solid #485536; padding-top: 6px; margin-top: 4px; font-size: 10.5pt; font-weight: 800; color: #1a2216; }
    .page-footer { position: relative; z-index: 2; border-top: 1px solid #cbd5c5; padding-top: 6px; margin-top: 10px; display: flex; justify-content: space-between; font-size: 7.8pt; color: #52634b; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .no-print { display: none !important; }
      .a4-page { margin: 0; border: none; border-radius: 0; box-shadow: none; width: 210mm; height: 297mm; }
    }
  </style>
</head>
<body>
  <div class="toolbar no-print">
    <div>
      <strong>Informe Socioambiental (5 Páginas) — ${nombreMostrar}</strong>
      <div style="font-size: 8.5pt; color: #d5ddd1;">Estructura Oficial Homologada · Jerovia Consultora</div>
    </div>
    <button onclick="window.print()">Imprimir / Guardar PDF (5 Páginas)</button>
  </div>

  <!-- PÁGINA 1: DATOS PERSONALES, ESTUDIOS, TRASLADO Y PERFIL -->
  <section class="a4-page">
    ${waveBgSvg}
    ${pageHeader(1, "I. Filiación, Estudios y Perfil")}
    <div class="page-content">
      <div class="hero-banner">
        <div style="flex: 1;">
          <h1 class="hero-name">${nombreMostrar}</h1>
          <div class="hero-grid">
            <div class="hero-item"><span>Número de cédula</span><strong>${v(d.cedula)}</strong></div>
            <div class="hero-item"><span>Fecha de nacimiento</span><strong>${formatDateToPy(d.fechaNacimiento) || v(d.fechaNacimiento)}</strong></div>
            <div class="hero-item"><span>Número de teléfono</span><strong>${v(d.telefono)}</strong></div>
            <div class="hero-item"><span>Estado civil</span><strong>${v(d.estadoCivil)}</strong></div>
            <div class="hero-item"><span>Tiene hijos/as</span><strong>${siNo(d.hijos, d.cantidadHijos)}</strong></div>
            <div class="hero-item"><span>Profesión</span><strong>${v(d.profesion, "Estudiante Activo")}</strong></div>
          </div>
        </div>
        ${fotoCandidatoHtml}
      </div>

      <div class="section-box">
        <div class="section-header">Formación Académica e Idiomas</div>
        <div class="section-body two-col">
          <div class="qa-list">
            <div class="qa-item"><div class="qa-label">Carrera</div><div class="qa-val">${v(d.carrera)}</div></div>
            <div class="qa-item"><div class="qa-label">Cursando actualmente el</div><div class="qa-val">${v(d.cursoActual, v(d.aniosEstudio) + " año")}</div></div>
          </div>
          <div class="qa-list">
            <div class="qa-item"><div class="qa-label">Institución</div><div class="qa-val">${v(d.universidad)}</div></div>
            <div class="qa-item"><div class="qa-label">Idiomas que habla</div><div class="qa-val">${idiomasMostrar}</div></div>
          </div>
        </div>
      </div>

      <div class="section-box">
        <div class="section-header">Aspectos Personales, Traslado a Sucursal y Presencia Digital</div>
        <div class="section-body qa-list">
          <div class="qa-item"><div class="qa-label">Aspectos positivos como persona</div><div class="qa-val">${v(d.aspectosPositivos)}</div></div>
          <div class="qa-item"><div class="qa-label">Actitud a mejorar</div><div class="qa-val">${v(d.aspectosMejorar)}</div></div>
          <div class="qa-item"><div class="qa-label">Logros personales que espera cumplir</div><div class="qa-val">${v(d.visionLargoPlazo)}</div></div>
          <div class="two-col">
            <div class="qa-item"><div class="qa-label">¿Tiene algún familiar políticamente expuesto?</div><div class="qa-val">${siNo(d.familiaresPoliticos, d.familiaresPoliticosDetalle)}</div></div>
            <div class="qa-item"><div class="qa-label">Movilidad (Propia o Familiar) y Características</div><div class="qa-val">${d.tenenciaMovilidad === "propia" ? "Movilidad Propia" : d.tenenciaMovilidad === "familiar" ? "Movilidad Familiar" : d.movilidadPropia ? "Sí" : "No"} ${d.tipoMovilidad ? "— " + v(d.tipoMovilidad) : ""}</div></div>
          </div>
          <div class="two-col">
            <div class="qa-item"><div class="qa-label">Con qué medio irá generalmente a la sucursal asignada</div><div class="qa-val">${v(d.medioTransporteSucursal, "Ómnibus")}</div></div>
            <div class="qa-item"><div class="qa-label">Cuánto tiempo le toma ir de su casa a la sucursal asignada</div><div class="qa-val">${v(d.tiempoViajeSucursal, "30 Minutos")}</div></div>
          </div>
          <div class="two-col">
            <div class="qa-item"><div class="qa-label">Tiene tatuajes / Zona tatuada</div><div class="qa-val">${tatuajesTexto} ${d.zonaTatuada ? "· Zona: " + v(d.zonaTatuada) : ""}</div></div>
            <div class="qa-item"><div class="qa-label">Red social que más utiliza</div><div class="qa-val">${redSocialTexto}</div></div>
          </div>
        </div>
      </div>
    </div>
    ${pageFooter(1)}
  </section>

  <!-- PÁGINA 2: DATOS DE LA SALUD Y DATOS FAMILIARES -->
  <section class="a4-page">
    ${waveBgSvg}
    ${pageHeader(2, "II. Datos de Salud y Familiares")}
    <div class="page-content">
      <div class="section-box">
        <div class="section-header">Datos de la Salud</div>
        <div class="section-body two-col">
          <div class="qa-list">
            <div class="qa-item"><div class="qa-label">¿Cuentas con algún problema de salud o alergia?</div><div class="qa-val">${siNo(d.enfermedadBase, d.enfermedadBaseDetalle)}</div></div>
            <div class="qa-item"><div class="qa-label">Consume medicamento cognitivo, tranquilizante u hormonal</div><div class="qa-val">${siNo(d.consumeMedicamentos, d.consumeMedicamentosDetalle)}</div></div>
            <div class="qa-item"><div class="qa-label">Tiene fobias, pánicos, claustrofobias, etc.</div><div class="qa-val">${siNo(d.tieneFobias, d.tieneFobiasDetalle)}</div></div>
            <div class="qa-item"><div class="qa-label">Posee seguro médico</div><div class="qa-val">${v(d.seguroMedico ? d.seguroMedico.toUpperCase() : "Ninguno")} ${d.seguroMedicoDetalle ? "— " + v(d.seguroMedicoDetalle) : ""}</div></div>
            <div class="qa-item"><div class="qa-label">Realiza algún tratamiento médico</div><div class="qa-val">${siNo(d.tratamientos, d.tratamientosDetalle)}</div></div>
          </div>
          <div class="qa-list">
            <div class="qa-item"><div class="qa-label">Consume bebidas alcohólicas</div><div class="qa-val">${v(d.consumoAlcohol, "No")}</div></div>
            <div class="qa-item"><div class="qa-label">Fuma o vapea</div><div class="qa-val">${siNo(d.consumoTabaco)}</div></div>
            <div class="qa-item"><div class="qa-label">Familiar con problemas de salud</div><div class="qa-val">${d.familiaresEnfermedad ? v(d.familiaresEnfermedadDetalle, "Sí") : "No"}</div></div>
            <div class="qa-item"><div class="qa-label">Persona en la vivienda con condición diferente (intelectual, física)</div><div class="qa-val">${v(d.condicionDiferenteVivienda, "Ninguno")}</div></div>
          </div>
        </div>
      </div>

      <div class="section-box">
        <div class="section-header">Datos Familiares (${v(d.relacionPadres, "Separados")})</div>
        <div class="section-body qa-list">
          <div class="two-col">
            <div class="sub-card">
              <strong>Su madre es la Sra.:</strong> ${v(d.nombreMadre)}<br/>
              <strong>Edad en años:</strong> ${v(d.edadMadre)} · <strong>Ocupación:</strong> ${v(d.ocupacionMadre)}<br/>
              <strong>Empresa o Institución:</strong> ${v(d.empresaMadre)}<br/>
              <strong>Salario aproximado:</strong> ${v(d.salarioMadre)}<br/>
              <strong>Vive en:</strong> ${v(d.ciudadMadre)} · <strong>Tel:</strong> ${v(d.telefonoMadre)}
            </div>
            <div class="sub-card">
              <strong>Su padre es el Sr.:</strong> ${v(d.nombrePadre)}<br/>
              <strong>Edad en años:</strong> ${v(d.edadPadre)} · <strong>Ocupación:</strong> ${v(d.ocupacionPadre)}<br/>
              <strong>Empresa o Institución:</strong> ${v(d.empresaPadre)}<br/>
              <strong>Salario aproximado:</strong> ${v(d.salarioPadre)}<br/>
              <strong>Vive en:</strong> ${v(d.ciudadPadre)} · <strong>Tel:</strong> ${v(d.telefonoPadre)}
            </div>
          </div>

          <div class="qa-item">
            <div class="qa-label">Su padre/madre tiene pareja viviendo en la casa: ${siNo(d.parejaPadreMadreViveCasa)}</div>
            ${
              d.parejaPadreMadreViveCasa
                ? `<div class="sub-card"><strong>La pareja es:</strong> ${v(
                    d.nombrePareja
                  )} · <strong>Edad:</strong> ${v( d.edadPareja )} · <strong>Ocupación:</strong> ${v(
                    d.ocupacionPareja
                  )} · <strong>Empresa/Inst.:</strong> ${v( d.empresaPareja )} · <strong>Salario aprox.:</strong>${v(
                    d.salarioPareja
                  )} · <strong>Vive en:</strong> ${v( d.ciudadPareja )} · <strong>Tel:</strong>${v(d.telefonoPareja)}</div>`
                : ""
            }
          </div>

          <div class="qa-item">
            <div class="qa-label">Tiene hermanos: ${
              d.tieneHermanos || hermanosArray.length > 0
                ? "Sí - " + (hermanosArray.length || d.cantidadHermanos)
                : "No"
            }</div>
            ${hermanosHtml}
          </div>

          <div class="qa-item">
            <div class="qa-label">¿Tienes algún familiar que tenga algún producto del Banco Continental?</div>
            <div class="qa-val">${siNo(d.familiaresProductosEntidad, d.familiarConProductosDetalle)}</div>
          </div>
        </div>
      </div>
    </div>
    ${pageFooter(2)}
  </section>

  <!-- PÁGINA 3: DATOS DE LA VIVIENDA Y DATOS ECONÓMICOS -->
  <section class="a4-page">
    ${waveBgSvg}
    ${pageHeader(3, "III. Vivienda y Datos Económicos")}
    <div class="page-content">
      <div class="section-box">
        <div class="section-header">Datos de la Vivienda</div>
        <div class="section-body qa-list">
          <div class="two-col">
            <div class="qa-item"><div class="qa-label">Ciudad y Barrio</div><div class="qa-val">Ciudad: ${v(d.ciudad)} · Barrio: ${v(d.barrio)}</div></div>
            <div class="qa-item"><div class="qa-label">Trayecto y Propiedad de la vivienda</div><div class="qa-val">${v(d.tipoCamino)} · Propiedad: ${v(d.tenenciaVivienda)}</div></div>
          </div>
          <div class="two-col">
            <div class="qa-item"><div class="qa-label">Cantidad de habitantes en la casa</div><div class="qa-val">${v(d.cantidadPersonas, "1")}</div></div>
            <div class="qa-item"><div class="qa-label">Quién vive en la casa junto a la persona entrevistada</div><div class="qa-val">${v(d.quienesVivenCasa, v(d.estructuraFamiliar))}</div></div>
          </div>
          <div class="qa-item">
            <div class="qa-label">Dependencias de la vivienda y Pisos</div>
            <div class="qa-val">Dormitorios: ${v(d.habitaciones, "1")} · Salas: ${v(d.salaCantidad, "1")} · Baños: ${v(d.banos, "1")} · Cocinas: ${v(d.cocinaCantidad, "1")} · De cuántos pisos es la vivienda/edificio: ${v(d.plantas, "1")}</div>
          </div>
          <div class="qa-item">
            <div class="qa-label">Materiales de Construcción</div>
            <div class="qa-val">Material de las paredes: ${v(d.paredesDetalle, v(d.paredes))} · Material del techo: ${v(d.techoDetalle, v(d.techo))} · Material del piso: ${v(d.pisosDetalle, v(d.pisos))}</div>
          </div>
          ${galeriaViviendaHtml}
        </div>
      </div>

      <div class="section-box">
        <div class="section-header">Datos Económicos de la Persona</div>
        <div class="section-body qa-list">
          <div class="two-col">
            <div class="qa-item"><div class="qa-label">¿Tienes algún producto del Banco Continental?</div><div class="qa-val">${siNo(d.productosEntidad, d.tiposProductosEntidad)}</div></div>
            <div class="qa-item"><div class="qa-label">¿Sus ingresos cubren todas sus deudas o gastos?</div><div class="qa-val">${siNo(d.ingresosCubrenDeudas)} · Dependientes económicos: ${siNo(d.tieneDependientesEconomicos)}</div></div>
          </div>
          <div class="qa-item">
            <div class="qa-label">Cantidad de egresos a nombre del/a entrevistado/a: ${egresosArray.length || v(d.cantidadEgresos, "0")}</div>
            ${egresosHtml}
          </div>
          <div class="qa-item">
            <div class="qa-label">Tiene préstamos a su nombre: ${
              d.prestamos ? "Sí (" + (prestamosArray.length || v(d.cantidadPrestamos, "1")) + ")" : "No"
            }</div>
            ${prestamosHtml}
          </div>
        </div>
      </div>
    </div>
    ${pageFooter(3)}
  </section>

  <!-- PÁGINA 4: DATOS LABORALES COMPLETOS -->
  <section class="a4-page">
    ${waveBgSvg}
    ${pageHeader(4, "IV. Datos Laborales")}
    <div class="page-content">
      <div class="section-box">
        <div class="section-header">Datos Laborales y Postulación</div>
        <div class="section-body qa-list">
          <div class="two-col">
            <div class="qa-item"><div class="qa-label">Situación laboral actual</div><div class="qa-val">${v(d.situacionActual)}</div></div>
            <div class="qa-item"><div class="qa-label">Lugar de empleo actual</div><div class="qa-val">${v(d.empresaAnterior)}</div></div>
          </div>
          <div class="qa-item"><div class="qa-label">Motivo de salida de su anterior empleo o por qué quiere salir de donde está</div><div class="qa-val">${v(d.motivoSalida)}</div></div>
          <div class="two-col">
            <div class="qa-item"><div class="qa-label">Cargo que ocupa actualmente</div><div class="qa-val">${v(d.cargoAnterior)}</div></div>
            <div class="qa-item"><div class="qa-label">Antigüedad</div><div class="qa-val">Actual: ${v(d.antiguedad)} · Anterior: ${v(d.antiguedadAnterior, "-")}</div></div>
          </div>
          <div class="two-col">
            <div class="qa-item"><div class="qa-label">Salario (Gs.)</div><div class="qa-val">Gs. ${v(d.salarioBruto, String(d.salarioAnterior || "No especificado"))}</div></div>
            <div class="qa-item"><div class="qa-label">Aportes / Descuentos</div><div class="qa-val">${v(d.aportesDescuentos, "IPS")}</div></div>
          </div>
          <div class="two-col">
            <div class="qa-item"><div class="qa-label">Cargo al que postula</div><div class="qa-val">${v(d.cargoPostula, "Atención al cliente")}</div></div>
            <div class="qa-item"><div class="qa-label">Pretensión salarial o monto acordado con RRHH</div><div class="qa-val">${v(d.pretensionSalarial)}</div></div>
          </div>
          <div class="qa-item"><div class="qa-label">Por qué eligió este Banco para trabajar</div><div class="qa-val">${v(d.motivoEleccionEntidad, v(d.expectativasEntidad))}</div></div>
          <div class="two-col">
            <div class="qa-item"><div class="qa-label">Objetivos profesionales si se incorpora</div><div class="qa-val">${v(d.objetivosProfesionales)}</div></div>
            <div class="qa-item"><div class="qa-label">Cómo sería su ambiente laboral ideal</div><div class="qa-val">${v(d.ambienteLaboralIdeal)}</div></div>
          </div>
          <div class="qa-item"><div class="qa-label">Posee algún familiar y/o conocido en la entidad donde se postula</div><div class="qa-val">${siNo(d.familiarEnEntidad, d.familiarEnEntidadDetalle)}</div></div>
        </div>
      </div>
    </div>
    ${pageFooter(4)}
  </section>

  <!-- PÁGINA 5: OBSERVACIONES GENERALES Y FIRMA -->
  <section class="a4-page">
    ${waveBgSvg}
    ${pageHeader(5, "V. Observaciones Generales y Firma")}
    <div class="page-content">
      <div class="section-box">
        <div class="section-header">Observaciones Generales</div>
        <div class="section-body qa-list">
          <div class="two-col">
            <div class="qa-item"><div class="qa-label">Limpieza y orden de la vivienda</div><div class="qa-val">${v(d.limpiezaOrdenVivienda, "Ordenada y limpia")}</div></div>
            <div class="qa-item"><div class="qa-label">Presencia de otras personas durante la entrevista</div><div class="qa-val">${v(d.quienesPresentes, "Ninguno")}</div></div>
          </div>
          <div class="two-col">
            <div class="qa-item"><div class="qa-label">Vocabulario utilizado por la persona entrevistada</div><div class="qa-val">${v(d.vocabularioEntrevistado, "Respetuosa y acorde a la situación")}</div></div>
            <div class="qa-item"><div class="qa-label">¿La zona es de fácil acceso?</div><div class="qa-val">${siNo(d.zonaFacilAcceso ?? true)}</div></div>
          </div>
          <div class="qa-item"><div class="qa-label">Síntesis / Concepto de la Entrevista</div><div class="qa-val">${v(d.observacionesEntrevista)}</div></div>
          <div class="qa-item"><div class="qa-label">Otras observaciones</div><div class="qa-val">${v(d.otrasObservaciones, "Ninguna")}</div></div>
          <div class="two-col">
            <div class="qa-item"><div class="qa-label">Entrevistador/a</div><div class="qa-val">${v(d.entrevistadorNombre, v(d.consultorNombre, "Michelle Romero"))}</div></div>
            <div class="qa-item"><div class="qa-label">La visita fue realizada el</div><div class="qa-val">${formatDateToPy(d.fechaVisita) || v(d.fechaVisita)} ${d.horaVisita ? ", " + v(d.horaVisita) : ""}</div></div>
          </div>
        </div>
      </div>

      <div class="signature-area">
        <div class="signature-box">
          ${firmaSvgOrImg}
          <div class="signature-line">${v(d.consultorNombre, "Lic. Michelle Romero")}</div>
          <div style="font-size: 8.5pt; font-weight: 700; color: #536c45; text-transform: uppercase; margin-top: 2px;">
            Jerovia Consultora · Verificación Socioambiental
          </div>
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
