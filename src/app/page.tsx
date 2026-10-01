import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowRight, CheckCircle, ChevronRight,
  Shield, MapPin, Building2, Scale,
  FileCheck, FileText, Check, Award
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
    desc: "Cruce automático y riguroso de ingresos contra egresos, alquiler y tenencia de vivienda para advertir inconsistencias antes de elevar el informe.",
  },
  {
    icon: MapPin,
    title: "Georreferenciación Notarial y Plus Code",
    desc: "Certificación satelital de visita en el domicilio exacto del postulante con coordenadas GPS y fotografía georreferenciada.",
  },
  {
    icon: FileText,
    title: "Emisión Ejecutiva en PPTX y PDF",
    desc: "Generación instantánea del legajo corporativo con formato oficial de 5 láminas para comités de crédito y recursos humanos.",
  },
  {
    icon: Shield,
    title: "Cadena de Custodia y Confidencialidad",
    desc: "Acceso protegido por token criptográfico único. Ningún dato sensible queda expuesto ni indexado públicamente.",
  },
  {
    icon: Award,
    title: "Dictamen Pericial con Respaldo Profesional",
    desc: "Firmas de peritos evaluadores homologados con dictamen categórico: Favorable, Favorable con Observaciones o Desfavorable.",
  },
];

const CLIENTES_CORPORATIVOS = [
  "Banco Continental",
  "Cooperativa Universitaria",
  "Banco Itaú Paraguay",
  "Sudameris Bank",
  "Financiera Familiar",
  "Banco Basa",
];

const MODULOS_EVALUACION = [
  { num: "01", nombre: "Datos Personales", detalle: "Identidad, filiación y contacto" },
  { num: "02", nombre: "Historial Académico", detalle: "Titulaciones, cursos e idiomas" },
  { num: "03", nombre: "Trayectoria Laboral", detalle: "Referencias y antecedentes en plaza" },
  { num: "04", nombre: "Perfil Psicolaboral", detalle: "Aspiraciones y declaración guiada" },
  { num: "05", nombre: "Entorno Familiar", detalle: "Estructura del hogar y convivientes" },
  { num: "06", nombre: "Condición de Salud", detalle: "Cobertura médica y dependencias" },
  { num: "07", nombre: "Balance Económico", detalle: "Ingresos, pasivos y control de desvío" },
  { num: "08", nombre: "Vivienda y Terreno", detalle: "Materiales constructivos y servicios" },
  { num: "09", nombre: "Dictamen Final", detalle: "Conclusión ejecutiva del perito" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base overflow-hidden">
      {/* ══ BARRA SUPERIOR INSTITUCIONAL ══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-overlay0/40 bg-mantle/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-subtext0">
            <a href="#servicios" className="hover:text-text transition-colors">Peritajes</a>
            <a href="#modulos" className="hover:text-text transition-colors">Metodología 9 Módulos</a>
            <a href="#instituciones" className="hover:text-text transition-colors">Instituciones</a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-xl border border-overlay0/60 bg-surface1 px-4 py-2 text-xs font-bold text-text hover:border-gold hover:text-gold transition-colors"
            >
              Portal Pericial
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO PRINCIPAL ══ */}
      <main id="main-content" tabIndex={-1} className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 outline-none">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Columna Izquierda: Mensaje Directo y Corporativo */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-semibold text-gold mb-6 tracking-wide">
                <Building2 className="h-3.5 w-3.5" />
                Auditoría Socioambiental y de Confiabilidad · Asunción, Paraguay
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text leading-[1.08] mb-6">
                Evaluaciones socioambientales con rigor pericial.
              </h1>

              <p className="text-base sm:text-lg text-subtext0 leading-relaxed mb-8 max-w-xl font-normal">
                Jerovia Consultora audita y documenta visitas domiciliarias para entidades bancarias, financieras y corporativas. Desde el levantamiento en campo con geolocalización hasta la emisión del dictamen oficial en PowerPoint y PDF.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/entrevista/demo"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-black hover:bg-gold-light transition-all shadow-xl shadow-gold/20"
                >
                  Explorar Formulario Pericial
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-xl border border-overlay0 bg-surface0 px-7 py-3.5 text-sm font-semibold text-text hover:bg-surface1 transition-all"
                >
                  Ingreso de Evaluadores
                </Link>
              </div>

              {/* Indicadores de Seguridad y Rigor */}
              <div className="mt-10 pt-8 border-t border-overlay0/30 flex flex-wrap gap-6 text-xs text-subtext0 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gold shrink-0" />
                  <span>Protocolo homologado para banca</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gold shrink-0" />
                  <span>Georreferenciación GPS obligatoria</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gold shrink-0" />
                  <span>Cruce de consistencia financiera</span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Tarjeta de Muestra Ejecutiva */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-overlay0/60 bg-surface0 p-6 sm:p-7 shadow-2xl relative">
                {/* Cabecera del Documento */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-overlay0/40">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-gold/15 flex items-center justify-center text-gold font-bold text-xs">
                      JC
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text">Jerovia Consultora</p>
                      <p className="text-[10px] text-subtext0 font-mono">EXP-2026-094-PY</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green/15 text-green border border-green/30">
                    Dictamen Favorable
                  </span>
                </div>

                {/* Resumen del Postulante */}
                <div className="space-y-3 mb-5">
                  <div className="p-3 rounded-xl bg-surface1/70 border border-overlay0/30">
                    <p className="text-[10px] text-subtext0 uppercase font-semibold">Postulante Evaluado</p>
                    <p className="text-sm font-bold text-text">Tobias Maximiliano Sánchez</p>
                    <p className="text-xs text-subtext0 mt-0.5">C.I. Nº 5.551.895 · Luque, Central</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface1 border border-overlay0/30">
                      <span className="text-[10px] text-subtext0 block">Entidad Solicitante</span>
                      <strong className="text-text font-semibold">Banco Continental</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface1 border border-overlay0/30">
                      <span className="text-[10px] text-subtext0 block">Perito Asignado</span>
                      <strong className="text-text font-semibold">Lic. Michelle Romero</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface1/50 border border-gold/20 text-xs">
                    <div className="flex items-center justify-between text-subtext0 mb-1">
                      <span className="text-[11px] font-semibold text-gold">Consistencia Socioeconómica</span>
                      <span className="text-green font-bold">100% Coherente</span>
                    </div>
                    <p className="text-[11px] text-subtext0 leading-relaxed">
                      Ingresos declarados y nivel habitacional resultan consistentes con la capacidad de pago y referencias vecinales comprobadas en Luque.
                    </p>
                  </div>
                </div>

                {/* Botón de Demostración */}
                <Link
                  href="/entrevista/demo"
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-surface1 hover:bg-surface2 border border-overlay0/60 text-xs font-bold text-text transition-colors"
                >
                  <span>Ver Formulario Completo</span>
                  <ArrowRight className="h-3.5 w-3.5 text-gold" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ══ CLIENTES E INSTITUCIONES ══ */}
      <section id="instituciones" className="py-12 border-y border-overlay0/30 bg-surface1/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] text-subtext0 font-bold uppercase tracking-widest mb-6">
            Instituciones que confían en los peritajes de Jerovia Consultora
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {CLIENTES_CORPORATIVOS.map((c) => (
              <div
                key={c}
                className="px-5 py-2.5 rounded-xl border border-overlay0/50 bg-surface0 text-xs font-bold text-subtext0 shadow-sm"
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICIOS PERICIALES ══ */}
      <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-wider mb-2">
              <Scale className="h-3.5 w-3.5" /> Estándar de Peritaje
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text tracking-tight">
              Metodología pericial con tecnología de asistencia y verificación
            </h2>
            <p className="text-sm text-subtext0 mt-2 leading-relaxed">
              Eliminamos la subjetividad y los retrasos del informe en papel mediante auditorías estructuradas y control de inconsistencias en tiempo real.
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

      {/* ══ LOS 9 MÓDULOS DEL PROCESO ══ */}
      <section id="modulos" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface1/40 border-t border-overlay0/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-text tracking-tight">El Proceso en 9 Módulos</h2>
            <p className="text-xs text-subtext0 mt-1.5">
              Estructura exhaustiva que garantiza la validez jurídica y ejecutiva de la evaluación socioambiental.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULOS_EVALUACION.map((m) => (
              <div
                key={m.num}
                className="rounded-2xl border border-overlay0/40 bg-surface0 p-5 flex items-start gap-4"
              >
                <span className="text-2xl font-black text-gold font-mono">{m.num}</span>
                <div>
                  <h3 className="font-bold text-text text-sm">{m.nombre}</h3>
                  <p className="text-xs text-subtext0 mt-0.5">{m.detalle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-overlay0/30 py-10 bg-mantle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <Logo size="sm" />
            <p className="text-[11px] text-subtext0 mt-1">
              Jerovia Consultora · Evaluaciones Socioambientales Periciales y Auditoría Domiciliaria · Asunción, Paraguay
            </p>
          </div>

          <div className="flex items-center gap-5 text-xs font-semibold text-subtext0">
            <Link href="/login" className="hover:text-text transition-colors">Portal de Acceso</Link>
            <Link href="/entrevista/demo" className="hover:text-text transition-colors">Formulario Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
