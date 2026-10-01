"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowRight, Shield, MapPin, Building2, Scale,
  FileCheck, FileText, Check, ChevronRight,
  ShieldCheck, Lock, CheckCircle2,
  Compass, EyeOff, Layers, Download
} from "lucide-react";

const SERVICIOS_PERICIALES = [
  {
    icon: Scale,
    title: "Auditoría Socioambiental y Domiciliaria",
    desc: "Peritaje presencial en 9 dimensiones: composición familiar, condiciones habitacionales, solvencia económica y entorno vecinal en Paraguay.",
  },
  {
    icon: FileCheck,
    title: "Validación de Consistencia y Dictamen",
    desc: "Cruce riguroso de ingresos contra egresos, alquiler y tenencia de vivienda para advertir inconsistencias antes de elevar el informe al comité.",
  },
  {
    icon: MapPin,
    title: "Georreferenciación Notarial y Plus Code",
    desc: "Certificación satelital de visita en el domicilio exacto con coordenadas GPS validadas en campo y registro fotográfico de fachadas y accesos.",
  },
  {
    icon: FileText,
    title: "Legajos Ejecutivos en PPTX y PDF",
    desc: "Generación instantánea del informe corporativo con el formato oficial de 5 láminas, listo para la toma de decisiones en comités de crédito y RRHH.",
  },
  {
    icon: Shield,
    title: "Cadena de Custodia y Secreto Bancario",
    desc: "Acceso protegido por token criptográfico único. Ningún dato sensible queda indexado públicamente cumpliendo normas de confidencialidad.",
  },
  {
    icon: Layers,
    title: "Dictamen Pericial con Respaldo Técnico",
    desc: "Conclusión categórica firmada por peritos evaluadores homologados: Favorable, Favorable con Observaciones o Desfavorable.",
  },
];

const COBERTURA_TERRITORIAL = [
  { zona: "Gran Asunción y Capital", tasa: "Respuesta en < 24hs", status: "Activo" },
  { zona: "Departamento Central (Luque, San Lorenzo, Lambaré)", tasa: "Respuesta en < 24hs", status: "Activo" },
  { zona: "Alto Paraná (Ciudad del Este, Hernandarias)", tasa: "Cobertura semanal", status: "Activo" },
  { zona: "Itapúa (Encarnación, Colonias Unidas)", tasa: "Cobertura coordinada", status: "Activo" },
];

const SLIDES_MOCK = [
  {
    id: 1,
    titulo: "1. Filiación e Identidad",
    tag: "Lámina 01 / Carátula",
    desc: "Verificación de cédula, estado civil, entorno de residencia y comprobación de datos personales con estricta reserva de identidad.",
  },
  {
    id: 2,
    titulo: "2. Composición Familiar y Laboral",
    tag: "Lámina 02 / Trayectoria",
    desc: "Historial de empleo, aportes, personas a cargo, convivencia y verificación de referencias laborales vigentes.",
  },
  {
    id: 3,
    titulo: "3. Balance Económico y Pasivos",
    tag: "Lámina 03 / Solvencia",
    desc: "Cálculo de ingresos familiares vs. egresos mensuales declarados, alquiler, préstamos vigentes y alerta de inconsistencias.",
  },
  {
    id: 4,
    titulo: "4. Auditoría Habitacional y GPS",
    tag: "Lámina 04 / Peritaje",
    desc: "Inspección técnica de materiales (techo, paredes, pisos), condiciones de saneamiento y Plus Code satelital.",
  },
  {
    id: 5,
    titulo: "5. Dictamen Pericial Conclusivo",
    tag: "Lámina 05 / Resolución",
    desc: "Dictamen técnico final emitido por el perito responsable con ponderación de riesgos y recomendación formal para la entidad.",
  },
];

export default function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="min-h-screen bg-base overflow-hidden text-text">
      {/* ══ BARRA SUPERIOR INSTITUCIONAL ══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-overlay0/40 bg-mantle/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-subtext0">
            <a href="#servicios" className="hover:text-text transition-colors">Peritajes</a>
            <a href="#metodologia" className="hover:text-text transition-colors">Estructura del Informe</a>
            <a href="#cobertura" className="hover:text-text transition-colors">Cobertura País</a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-xl border border-gold/40 bg-surface1 px-4 py-2 text-xs font-bold text-text hover:border-gold hover:text-gold transition-all shadow-sm"
            >
              Portal Pericial
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO PRINCIPAL CON IMAGEN CORPORATIVA Y MOVIMIENTO VIVO ══ */}
      <main id="main-content" tabIndex={-1} className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 outline-none">
        {/* Fondo sutil con brillo tenue */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gold/5 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Columna Izquierda: Mensaje Ejecutivo y Discreto */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold mb-6 shadow-sm">
                <Building2 className="h-3.5 w-3.5" />
                <span>Auditoría Socioambiental y de Confiabilidad · Paraguay</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
                Evaluaciones socioambientales con{" "}
                <span className="text-gold">rigor pericial</span> y reserva absoluta.
              </h1>

              <p className="text-base sm:text-lg text-subtext0 leading-relaxed mb-8 max-w-xl font-normal">
                Digitalizamos el ciclo integral de verificación domiciliaria y laboral para entidades financieras e industrias. Desde la captura georreferenciada en campo hasta la emisión del dictamen oficial en 5 láminas ejecutivas.
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5">
                <Link
                  href="/entrevista/demo"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-black hover:bg-gold-light transition-all shadow-xl shadow-gold/20"
                >
                  <span>Explorar Formulario Pericial</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-xl border border-overlay0/60 bg-surface0 px-7 py-3.5 text-sm font-semibold text-text hover:bg-surface1 transition-all"
                >
                  <Lock className="h-4 w-4 text-subtext0" />
                  <span>Acceso de Evaluadores</span>
                </Link>
              </div>

              {/* Indicadores de Estándar y Cumplimiento Normativo */}
              <div className="mt-10 pt-8 border-t border-overlay0/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-subtext0">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                  <span>Protocolo homologado bancario</span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-gold shrink-0" />
                  <span>Georreferenciación satelital</span>
                </div>
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4 text-gold shrink-0" />
                  <span>100% Reserva de datos personales</span>
                </div>
              </div>
            </motion.div>

            {/* Columna Derecha: Imagen Corporativa Viva y Tarjeta Discreta */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              {/* Contenedor con fotografía arquitectónica de alta gama */}
              <div className="relative rounded-3xl overflow-hidden border border-overlay0/60 shadow-2xl bg-surface0 group">
                <div className="relative h-64 sm:h-72 w-full">
                  <Image
                    src="/hero-corporate.jpg"
                    alt="Sede corporativa y pericial"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface0 via-surface0/60 to-transparent" />
                  
                  {/* Badge flotante con pulso vivo */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-green/30 bg-base/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-green shadow-lg">
                    <span className="h-2 w-2 rounded-full bg-green animate-ping" />
                    <span>Peritaje en Campo Activo</span>
                  </div>
                </div>

                {/* Tarjeta de Expediente Confidencial */}
                <div className="p-6 relative -mt-12 bg-surface0/95 backdrop-blur-md rounded-b-3xl border-t border-overlay0/30">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-overlay0/30">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold">Expediente Pericial</span>
                      <h2 className="text-base font-black text-text">EXP-2026-CONFIDENCIAL</h2>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green/15 text-green border border-green/30">
                      Dictamen Apto
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-overlay0/20 text-subtext0">
                      <span>Postulante Auditado:</span>
                      <strong className="text-text font-mono font-medium">Postulante #7492 (C.I. 5.***.***)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-overlay0/20 text-subtext0">
                      <span>Entidad Solicitante:</span>
                      <strong className="text-text font-medium">Entidad Bancaria de Primera Línea</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-overlay0/20 text-subtext0">
                      <span>Zona de Inspección:</span>
                      <strong className="text-text font-medium">Gran Asunción (Georreferenciado GPS)</strong>
                    </div>
                    <div className="flex justify-between py-1 text-subtext0">
                      <span>Consistencia Financiera:</span>
                      <strong className="text-green font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> 100% Coherente
                      </strong>
                    </div>
                  </div>

                  <div className="mt-5 pt-3">
                    <Link
                      href="/entrevista/demo"
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-surface1 hover:bg-surface2 border border-overlay0/60 text-xs font-bold text-text transition-colors"
                    >
                      <span>Ver Muestra de Formulario</span>
                      <ArrowRight className="h-3.5 w-3.5 text-gold" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      {/* ══ SECCIÓN INTERACTIVA: LÁMINAS DEL INFORME OFICIAL (CON MOVIMIENTO) ══ */}
      <section id="metodologia" className="py-20 px-4 sm:px-6 lg:px-8 border-y border-overlay0/30 bg-surface1/30">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-wider mb-2">
              <Download className="h-3.5 w-3.5" /> Entregable Ejecutivo
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text tracking-tight">
              Informe Oficial de 5 Láminas para Comités
            </h2>
            <p className="text-sm text-subtext0 mt-2 leading-relaxed">
              El peritaje culmina en una presentación ejecutiva estandarizada (.pptx y PDF), estructurada para permitir a directores y evaluadores resolver en minutos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Lista interactiva de Láminas */}
            <div className="lg:col-span-6 space-y-2.5">
              {SLIDES_MOCK.map((slide, index) => {
                const isSelected = activeSlide === index;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                      isSelected
                        ? "border-gold/50 bg-surface0 shadow-lg scale-[1.01]"
                        : "border-overlay0/30 bg-surface0/60 hover:bg-surface0 hover:border-overlay0/60"
                    }`}
                  >
                    <span className={`text-xl font-mono font-black ${isSelected ? "text-gold" : "text-subtext0"}`}>
                      0{slide.id}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-sm text-text">{slide.titulo}</h3>
                        <span className="text-[10px] font-semibold text-subtext0 px-2 py-0.5 rounded-md bg-surface1">
                          {slide.tag}
                        </span>
                      </div>
                      <p className="text-xs text-subtext0 leading-relaxed">{slide.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Visualizador en vivo con imagen pericial de campo */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-overlay0/60 bg-surface0 overflow-hidden shadow-2xl p-6 relative">
                <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-5">
                  <Image
                    src="/audit-tablet.jpg"
                    alt="Inspección pericial en tablet digital"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface0 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-base/90 backdrop-blur-md border border-overlay0/50">
                    <p className="text-[10px] text-gold font-bold uppercase tracking-wider">Lámina Seleccionada</p>
                    <h3 className="text-sm font-bold text-text mt-0.5">{SLIDES_MOCK[activeSlide].titulo}</h3>
                    <p className="text-xs text-subtext0 mt-1">{SLIDES_MOCK[activeSlide].desc}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-subtext0 pt-2 border-t border-overlay0/30 font-medium">
                  <span>Formato: PowerPoint (.pptx) & PDF A4</span>
                  <span className="text-gold font-bold">100% Listo para Comité</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CAPACIDADES Y SERVICIOS PERICIALES ══ */}
      <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-wider mb-2">
              <Scale className="h-3.5 w-3.5" /> Metodología Institucional
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text tracking-tight">
              Garantía de rigor en auditoría socioambiental
            </h2>
            <p className="text-sm text-subtext0 mt-2 leading-relaxed">
              Eliminamos errores de apreciación y transcripción mediante controles cruzados de consistencia y protocolos de custodia de información.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICIOS_PERICIALES.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-overlay0/40 bg-surface0 p-6 hover:border-gold/40 transition-colors shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold mb-4">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-text text-sm mb-2">{s.title}</h3>
                <p className="text-xs text-subtext0 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COBERTURA TERRITORIAL VIVA ══ */}
      <section id="cobertura" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface1/40 border-t border-overlay0/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-wider mb-2">
                <Compass className="h-3.5 w-3.5" /> Capacidad Operativa
              </div>
              <h2 className="text-3xl font-black text-text tracking-tight mb-4">
                Cobertura Nacional con Peritos en Campo
              </h2>
              <p className="text-sm text-subtext0 leading-relaxed mb-6">
                Despliegue ágil en los principales polos económicos y urbanos de la República del Paraguay, con capacidad de respuesta inmediata para requerimientos urgentes de contratación y crédito.
              </p>
              <div className="p-4 rounded-2xl bg-surface0 border border-gold/30 flex items-center gap-3">
                <Check className="h-5 w-5 text-gold shrink-0" />
                <p className="text-xs text-subtext0">
                  <strong className="text-text block">Geolocalización en Tiempo Real:</strong> Cada visita registra coordenadas GPS exactas para garantizar la presencia física del evaluador en el domicilio.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-overlay0/50 bg-surface0 p-6 shadow-xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-subtext0 mb-2">
                  Regiones de Atención Inmediata
                </h3>
                {COBERTURA_TERRITORIAL.map((c) => (
                  <div
                    key={c.zona}
                    className="p-4 rounded-xl bg-surface1/60 border border-overlay0/30 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-text">{c.zona}</h4>
                      <p className="text-xs text-subtext0 mt-0.5">{c.tasa}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-green bg-green/10 px-2.5 py-1 rounded-full border border-green/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
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
              Jerovia Consultora · Evaluaciones Socioambientales Periciales y Auditoría Domiciliaria · Asunción, Paraguay
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-subtext0">
            <Link href="/login" className="hover:text-text transition-colors">Portal de Acceso</Link>
            <Link href="/entrevista/demo" className="hover:text-text transition-colors">Formulario Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
