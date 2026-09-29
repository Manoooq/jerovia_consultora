import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowRight, CheckCircle, ChevronRight,
  Users, FileText, MapPin, BarChart3, Shield, Clock,
  Building2, Star, TrendingUp
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Entrevistas Estructuradas",
    desc: "Formularios de visita socioambiental en 9 módulos. Datos personales, familiares, laborales, económicos y habitacionales.",
  },
  {
    icon: MapPin,
    title: "Geolocalización en Campo",
    desc: "Captura GPS automática con Plus Code y georreferenciación. El evaluador confirma el domicilio con un solo toque.",
  },
  {
    icon: FileText,
    title: "Documentos Ejecutivos",
    desc: "Generación automática del informe en PDF y PowerPoint con la plantilla corporativa de Jerovia, lista para entregar al cliente.",
  },
  {
    icon: BarChart3,
    title: "Panel de Gestión",
    desc: "Dashboard centralizado con estado de cada visita, progreso por evaluador y métricas de actividad en tiempo real.",
  },
  {
    icon: Shield,
    title: "Datos Protegidos",
    desc: "Acceso por enlace único temporal. La información confidencial del evaluado no se expone sin autorización explícita.",
  },
  {
    icon: Clock,
    title: "Acceso Inmediato",
    desc: "El postulante accede al formulario desde su celular con un enlace. Sin descargas, sin contraseñas.",
  },
];

const clientes = [
  "Banco Continental", "Cooperativa Universitaria", "Grupo Empresarial San Miguel",
  "Financiera Familiar", "Constructora Mbareté", "Aseguradora Nacional",
];

const stats = [
  { value: "500+", label: "Visitas procesadas" },
  { value: "98%", label: "Satisfacción de clientes" },
  { value: "< 5min", label: "Para generar un informe" },
  { value: "100%", label: "Digital y sin papel" },
];

const testimonials = [
  {
    quote: "Pasamos de tardar 3 días en entregar un informe social a entregarlo el mismo día de la visita. La diferencia es abismal.",
    author: "Michelle R.",
    role: "Evaluadora Senior, Jerovia Consultora",
    rating: 5,
  },
  {
    quote: "La captura GPS y el formulario paso a paso eliminaron los errores de transcripción. Ahora confío en que los datos son exactos.",
    author: "Carlos M.",
    role: "Coordinador de Recursos Humanos",
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base overflow-hidden">

      {/* ══ NAVBAR ══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-overlay0/40 bg-mantle/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-8 text-sm">
            {["Servicios", "¿Cómo funciona?", "Clientes"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/[^a-z]/g, "")}`}
                className="text-subtext0 hover:text-text font-medium transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="hidden sm:block text-xs font-semibold text-subtext1 hover:text-text transition-colors px-3 py-2"
            >
              Acceso consultores
            </Link>
            <Link
              href="/dashboard/nueva"
              className="flex items-center gap-1.5 rounded-xl bg-gold px-4 py-2 text-xs font-bold text-black hover:bg-gold-light transition-all shadow-md shadow-gold/20"
            >
              Nueva visita <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO (CONTENIDO PRINCIPAL) ══ */}
      <main id="main-content" tabIndex={-1} className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 outline-none">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-semibold text-gold mb-6 tracking-wider uppercase">
                <Building2 className="h-3.5 w-3.5" />
                Plataforma de Visitas Sociales
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text leading-[1.1] mb-6">
                Informes sociales{" "}
                <span className="text-gradient-gold">precisos</span>,<br />
                en tiempo real.
              </h1>

              <p className="text-base sm:text-lg text-subtext1 leading-relaxed mb-8 max-w-lg">
                Jerovia Consultora digitaliza el proceso completo de visita socioambiental: desde el formulario estructurado en campo hasta el informe ejecutivo final en PDF y PowerPoint.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/entrevista/demo"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-black hover:bg-gold-light transition-all shadow-xl shadow-gold/20"
                >
                  Ver formulario en vivo
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 rounded-xl border border-overlay0 bg-surface0 px-7 py-3.5 text-sm font-semibold text-text hover:bg-surface1 transition-all"
                >
                  Panel de gestión
                </Link>
              </div>

              {/* Trust signals */}
              <div className="mt-8 flex flex-wrap gap-4 text-xs font-medium text-subtext1">
                {["Sin contraseñas para entrevistados", "Acceso desde celular", "Generación en 1 clic"].map((s) => (
                  <div key={s} className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual preview card */}
            <div className="relative hidden lg:block">
              <div className="rounded-3xl border border-overlay0/50 bg-surface0 p-6 shadow-xl">
                {/* Header preview */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-overlay0/40">
                  <Logo size="sm" />
                  <div className="text-right">
                    <p className="text-[11px] text-subtext0">Entidad Solicitante</p>
                    <p className="text-xs font-bold text-text">Banco Continental</p>
                  </div>
                </div>

                {/* Progress mock */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-subtext0 mb-1.5">
                    <span>Módulo 03 — Trayectoria Laboral</span>
                    <span className="text-gold font-bold">25%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface2">
                    <div className="h-1.5 w-1/4 rounded-full bg-gradient-to-r from-gold to-gold-light" />
                  </div>
                </div>

                {/* Mock fields */}
                <div className="space-y-2.5">
                  {[
                    { label: "Postulante", val: "Tobias Maximiliano Sánchez" },
                    { label: "Cargo anterior", val: "Intérprete (Epicus S.A.)" },
                    { label: "Disponibilidad", val: "Incorporación Inmediata" },
                    { label: "Ubicación", val: "Luque, Cañada Garay" },
                  ].map((f) => (
                    <div key={f.label} className="rounded-xl bg-surface1 border border-overlay0/40 px-3.5 py-2.5 flex items-center justify-between">
                      <span className="text-xs text-subtext0">{f.label}</span>
                      <span className="text-xs font-semibold text-text">{f.val}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <div className="flex-1 rounded-xl border border-overlay0 bg-surface1 py-2 text-xs font-medium text-subtext0 text-center">Anterior</div>
                  <div className="flex-1 rounded-xl bg-gold py-2 text-xs font-bold text-black text-center">Siguiente →</div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-3 -right-3 flex items-center gap-1.5 rounded-xl border border-green/30 bg-surface0 px-3.5 py-1.5 shadow-lg">
                <div className="h-2 w-2 rounded-full bg-green animate-pulse" />
                <span className="text-xs font-bold text-green">Dictamen APTO</span>
              </div>
              <div className="absolute -bottom-3 -left-3 flex items-center gap-1.5 rounded-xl border border-gold/30 bg-surface0 px-3.5 py-1.5 shadow-lg">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                <span className="text-xs font-semibold text-text">GPS: PGXV+CVW Luque</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ══ STATS ══ */}
      <section className="border-y border-overlay0/30 bg-surface1/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-gold mb-1">{s.value}</div>
              <div className="text-xs font-medium text-subtext0">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CLIENTES ══ */}
      <section id="clientes" className="py-12 border-b border-overlay0/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-subtext0 font-semibold uppercase tracking-wider mb-6">Empresas e instituciones que confían en Jerovia Consultora</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {clientes.map((c) => (
              <div key={c} className="px-5 py-2 rounded-xl border border-overlay0/40 bg-surface0">
                <span className="text-xs font-semibold text-subtext1">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICIOS ══ */}
      <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="lg:sticky lg:top-24">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold uppercase tracking-wider mb-4">
                <TrendingUp className="h-3.5 w-3.5" />
                Capacidades operativas
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-text leading-tight mb-5">
                Una plataforma que trabaja{" "}
                <span className="text-gradient-gold">con la precisión de tu equipo</span>
              </h2>
              <p className="text-sm text-subtext1 leading-relaxed mb-6">
                Diseñada específicamente para consultores de trabajo social y evaluadores que auditan postulantes para bancos, cooperativas e industrias en Paraguay.
              </p>
              <Link
                href="/entrevista/demo"
                className="group inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:gap-2.5 transition-all"
              >
                Probar el formulario demo <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className={`rounded-2xl border border-overlay0/40 bg-surface0 p-5 hover:border-gold/40 hover:bg-surface1 transition-all ${i === 0 ? "sm:col-span-2" : ""}`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 mb-3 text-gold">
                    <f.icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-text text-sm mb-1.5">{f.title}</h3>
                  <p className="text-xs text-subtext0 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CÓMO FUNCIONA ══ */}
      <section id="cmofunciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface1/40 border-y border-overlay0/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-text mb-3">De la visita al informe en 3 pasos</h2>
            <p className="text-xs text-subtext0">Flujo ágil sin burocracia ni pérdidas de tiempo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Asignación rápida",
                desc: "El consultor registra al postulante y envía el enlace directo por WhatsApp en un toque.",
              },
              {
                num: "02",
                title: "Visita y completado",
                desc: "Se recogen los datos en campo con geolocalización GPS y guardado instantáneo.",
              },
              {
                num: "03",
                title: "Descarga ejecutiva",
                desc: "El informe en PowerPoint (.pptx) y PDF queda disponible inmediatamente con dictamen.",
              },
            ].map((step) => (
              <div key={step.num} className="rounded-2xl border border-overlay0/40 bg-surface0 p-6 flex flex-col">
                <div className="text-3xl font-black text-gold mb-3">{step.num}</div>
                <h3 className="font-bold text-text text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-subtext0 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIOS ══ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-text mb-2">Evaluaciones en campo comprobadas</h2>
            <p className="text-xs text-subtext0">Experiencias reales de evaluadores profesionales.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t) => (
              <div key={t.author} className="rounded-2xl border border-overlay0/40 bg-surface0 p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="text-xs text-subtext1 leading-relaxed mb-4 italic">"{t.quote}"</blockquote>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gold/15 flex items-center justify-center text-xs font-bold text-gold">
                    {t.author[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text">{t.author}</p>
                    <p className="text-[11px] text-subtext0">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-overlay0/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-xs text-subtext0 text-center">
            © 2026 Jerovia Consultora · Plataforma de Visitas Socioambientales Confidenciales · Paraguay
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-subtext0">
            <Link href="/dashboard" className="hover:text-text transition-colors">Panel</Link>
            <Link href="/entrevista/demo" className="hover:text-text transition-colors">Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
