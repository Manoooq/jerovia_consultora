"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DossierInteractiveViewer } from "@/components/DossierInteractiveViewer";
import { ParaguayOperationalMap } from "@/components/ParaguayOperationalMap";
import {
  ShieldCheck, MapPin, Building2, Scale,
  FileCheck, FileText, Check, ChevronRight,
  Lock, EyeOff, Layers, Download, CheckCircle2,
  PhoneCall, Zap, Compass
} from "lucide-react";

const EJES_PERICIALES = [
  {
    num: "01",
    icon: Scale,
    title: "Constatación Habitacional In Situ",
    desc: "Inspección ocular presencial en el domicilio. Verificación de mampostería, techo de tejas o losa, pisos, cerramiento perimetral y estado de conservación del inmueble.",
    tag: "Relevamiento Físico",
  },
  {
    num: "02",
    icon: Zap,
    title: "Cotejo de Medidor y NIS de la ANDE",
    desc: "Lectura y fotografía del medidor eléctrico oficial, verificación de NIS, titularidad del suministro y contraste con facturas de ESSAP o juntas de saneamiento locales.",
    tag: "Suministros Básicos",
  },
  {
    num: "03",
    icon: FileCheck,
    title: "Cruce de Solvencia y Nivel de Vida",
    desc: "Análisis técnico de coherencia entre los ingresos declarados (formales en IPS o independientes) frente a la carga fija observable: alquiler, vehículos y personas a cargo.",
    tag: "Capacidad de Pago",
  },
  {
    num: "04",
    icon: MapPin,
    title: "Georreferenciación Satelital y Plus Code",
    desc: "Fijación de coordenadas GPS inalterables en la puerta de acceso y código Plus Code satelital para asegurar la presencia física efectiva del perito en el inmueble.",
    tag: "Acreditación GPS",
  },
  {
    num: "05",
    icon: PhoneCall,
    title: "Referencias Vecinales y de Entorno",
    desc: "Consulta discreta con vecinos de linderos sobre arraigo, antigüedad de residencia en la cuadra, concepto vecinal y características de seguridad del barrio.",
    tag: "Arraigo Territorial",
  },
  {
    num: "06",
    icon: Layers,
    title: "Dictamen Técnico para Comité de Crédito",
    desc: "Resolución formal fundamentada (Favorable, Favorable con Observaciones o Desfavorable) con firma y número de registro profesional de la perito evaluadora.",
    tag: "Resolución Ejecutiva",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base text-text selection:bg-gold/30 selection:text-gold">
      {/* ══ BARRA SUPERIOR INSTITUCIONAL ══ */}
      <nav aria-label="Navegación institucional" className="fixed top-0 left-0 right-0 z-50 border-b border-overlay0/40 bg-mantle/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-subtext0">
            <a href="#dossier" className="hover:text-text transition-colors">Legajo de 5 Láminas</a>
            <a href="#metodologia" className="hover:text-text transition-colors">Metodología Pericial</a>
            <a href="#cobertura" className="hover:text-text transition-colors">Cobertura País</a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-xl border border-gold/40 bg-surface1 px-4 py-2 text-xs font-bold text-text hover:border-gold hover:text-gold transition-all shadow-sm"
            >
              Acceso a Expedientes
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO PRINCIPAL: RIGOR EDITORIAL Y VISOR REAL DE EXPEDIENTE ══ */}
      <main id="main-content" tabIndex={-1} className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 outline-none">
        <div className="max-w-7xl mx-auto">
          
          {/* Cabecera Editorial */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-semibold text-gold mb-5">
              <Building2 className="h-3.5 w-3.5" />
              <span>Peritajes Socioambientales y Verificación Domiciliaria · Asunción, Paraguay</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-text mb-6">
              Informes socioambientales y verificación domiciliaria para comités de crédito en Paraguay.
            </h1>

            <p className="text-base sm:text-lg text-subtext0 leading-relaxed font-normal mb-8">
              Constatamos in situ la residencia efectiva, solvencia real y entorno familiar de postulantes a préstamos o cargos de confianza. Entregamos un legajo pericial en 5 láminas ejecutivas (.pptx y PDF) estandarizado para carpetas de análisis de riesgo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/entrevista/demo"
                className="group flex items-center justify-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-black hover:bg-gold-light transition-all shadow-lg shadow-gold/20"
              >
                <span>Explorar Formulario Pericial</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-xl border border-overlay0/60 bg-surface1 px-7 py-3.5 text-sm font-semibold text-text hover:bg-surface2 transition-all"
              >
                <Lock className="h-4 w-4 text-subtext0" />
                <span>Portal de Evaluadores</span>
              </Link>
            </div>

            {/* Sellos de Estándar Operativo Real */}
            <div className="mt-10 pt-6 border-t border-overlay0/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-subtext0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                <span>Peritos con Registro Homologado</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold shrink-0" />
                <span>Georreferenciación Satelital GPS</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-gold shrink-0" />
                <span>Reserva Confidencial Ley N° 1682/01</span>
              </div>
            </div>
          </div>

          {/* ══ VISOR DEL LEGAJO OFICIAL DE 5 LÁMINAS (REEMPLAZO DE FOTOS IA) ══ */}
          <section id="dossier" className="pt-4">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
                  Muestra Interactiva de Legajo
                </span>
                <h2 className="text-lg font-black text-text">
                  Estructura Oficial del Informe de 5 Láminas para Directorio
                </h2>
              </div>
              <p className="text-xs text-subtext0">
                Navega por las 5 láminas para examinar los datos técnicos presentados al comité evaluador.
              </p>
            </div>

            <DossierInteractiveViewer />
          </section>

        </div>
      </main>

      {/* ══ METODOLOGÍA PERICIAL: LOS 6 EJES DE INSPECCIÓN ══ */}
      <section id="metodologia" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-overlay0/30 bg-surface1/20">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
              Protocolo Técnico In Situ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-text tracking-tight mt-1">
              Las 6 dimensiones de la auditoría socioambiental
            </h2>
            <p className="text-sm text-subtext0 mt-2 leading-relaxed">
              Un relevamiento objetivo que elimina la discrecionalidad y proporciona al analista de crédito una fotografía exacta de la situación patrimonial y del entorno del candidato.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {EJES_PERICIALES.map((eje) => (
              <div
                key={eje.num}
                className="p-6 rounded-3xl border border-overlay0/40 bg-surface0 shadow-sm flex flex-col justify-between hover:border-gold/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-gold opacity-80">{eje.num}</span>
                    <span className="text-[10px] font-mono text-subtext0 bg-surface1 px-2.5 py-0.5 rounded-full border border-overlay0/30 font-semibold">
                      {eje.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-text text-base mb-2">{eje.title}</h3>
                  <p className="text-xs text-subtext0 leading-relaxed">{eje.desc}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-overlay0/20 flex items-center gap-1.5 text-[11px] text-green font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Verificado en campo por el evaluador</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══ COBERTURA TERRITORIAL: MAPA VECTORIAL DE PARAGUAY ══ */}
      <section id="cobertura" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-overlay0/30">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
              Despliegue Operativo
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-text tracking-tight mt-1">
              Cobertura Nacional con Peritos en Territorio
            </h2>
            <p className="text-sm text-subtext0 mt-2 leading-relaxed">
              Equipos de inspección con movilidad propia en los polos urbanos e industriales clave de la República del Paraguay.
            </p>
          </div>

          {/* Componente de Mapa Vectorial de Paraguay */}
          <ParaguayOperationalMap />

        </div>
      </section>

      {/* ══ ENTREGABLE FINAL Y DESCARGA ══ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-overlay0/30 bg-surface1/30">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl border border-overlay0/50 bg-surface0 p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
                Estandarización de Informes
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-text">
                Legajos listos para la carpeta del Comité de Crédito
              </h2>
              <p className="text-xs sm:text-sm text-subtext0 leading-relaxed">
                Cada expediente genera de forma inmediata la presentación oficial en formato PowerPoint (.pptx editable) con la identidad institucional y la síntesis pericial, además del archivo PDF con cadena de custodia.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-subtext1">
                <span>• 5 Diapositivas 16:9</span>
                <span>• Exportación en 1 Clic</span>
                <span>• Sello y Matrícula Pericial</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/entrevista/demo"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gold text-black font-bold text-xs hover:bg-gold-light transition-all shadow-md text-center"
              >
                Abrir Formulario de Muestra
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-overlay0/60 bg-surface1 text-text font-bold text-xs hover:bg-surface2 transition-all text-center"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PIE DE PÁGINA INSTITUCIONAL ══ */}
      <footer className="border-t border-overlay0/30 py-10 bg-mantle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <Logo size="sm" />
            <p className="text-[11px] text-subtext0 mt-1">
              Jerovia Consultora · Evaluaciones Socioambientales y de Confiabilidad · Asunción, Paraguay
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-subtext0">
            <Link href="/login" className="hover:text-text transition-colors">Portal de Acceso</Link>
            <Link href="/entrevista/demo" className="hover:text-text transition-colors">Formulario Demo</Link>
            <span className="text-subtext0/60">© 2026 Jerovia Consultora</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
