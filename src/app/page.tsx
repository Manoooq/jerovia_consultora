"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandPalette } from "@/components/CommandPalette";
import { HeroProductShowcase } from "@/components/HeroProductShowcase";
import { BentoFeatures } from "@/components/BentoFeatures";
import { PeritajeCalculator } from "@/components/PeritajeCalculator";
import { ParaguayOperationalMap } from "@/components/ParaguayOperationalMap";
import { FaqSection } from "@/components/FaqSection";
import { AntigravityBackground } from "@/components/ui/AntigravityBackground";
import {
  ShieldCheck,
  MapPin,
  ChevronRight,
  Lock,
  Menu,
  X,
  FileSpreadsheet,
} from "lucide-react";

const KPIS = [
  { value: "< 24 hs", label: "Entrega en Gran Asunción" },
  { value: "5 Láminas", label: "Formato Comité (.PPTX y PDF)" },
  { value: "GPS + ANDE", label: "Constatación Domiciliaria" },
  { value: "Ley 6534/20", label: "Resguardo Confidencial" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#showcase", label: "Expediente" },
    { href: "#tecnologia", label: "Metodología" },
    { href: "#simulador", label: "Aranceles" },
    { href: "#cobertura", label: "Cobertura" },
    { href: "#faqs", label: "Normativa" },
  ];

  return (
    <div className="relative min-h-screen bg-base text-text selection:bg-gold/30 selection:text-gold overflow-x-hidden">
      {/* Matriz interactiva sutil que reacciona al cursor */}
      <AntigravityBackground />

      {/* Navegación Institucional con Soporte Completo en Celular y PC */}
      <nav aria-label="Navegación principal" className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-subtext1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-gold transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <CommandPalette />
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden sm:inline-flex min-h-[38px] items-center rounded-xl bg-gold px-4 py-2 text-xs font-bold text-black hover:bg-gold-light transition-colors shadow-xs"
            >
              Portal Pericial
            </Link>

            {/* Botón Menú Hamburguesa para Celulares */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-h-[40px] min-w-[40px] rounded-xl border border-overlay0/70 bg-surface1 flex items-center justify-center text-text"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú de navegación"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Cajón de Navegación Móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-overlay0/60 bg-mantle/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface1 border border-overlay0/50 text-xs font-semibold text-text flex items-center"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-2 pt-2 border-t border-overlay0/40">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] rounded-xl bg-gold text-black font-bold text-xs flex items-center justify-center gap-2"
              >
                <Lock className="h-4 w-4" />
                <span>Ingresar al Portal de Evaluadores</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Principal Sobrio y Directo */}
      <main id="main-content" tabIndex={-1} className="relative z-10 pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 outline-none">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-overlay1 bg-surface0/90 px-3.5 py-1.5 text-xs font-semibold text-subtext1 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-gold shrink-0" aria-hidden="true" />
              <span>Consultoría Pericial Socioambiental • Matrícula N° 4.819</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-text">
              Verificación domiciliaria y solvencia para{" "}
              <span className="text-gradient-gold">comités de riesgo.</span>
            </h1>

            <p className="text-sm sm:text-lg text-subtext0 max-w-2xl mx-auto leading-relaxed">
              Constatamos presencialmente el arraigo, la titularidad del servicio ANDE y la capacidad de pago del postulante. Entregamos el dictamen en 5 láminas ejecutivas en menos de 24 horas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <Link
                href="/entrevista/demo"
                className="min-h-[48px] w-full sm:w-auto group flex items-center justify-center gap-2 rounded-xl bg-gold px-7 py-3 text-sm font-bold text-black hover:bg-gold-light transition-all shadow-md"
              >
                <span>Explorar Cuestionario Demo</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="min-h-[48px] w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-overlay1 bg-surface0/90 px-7 py-3 text-sm font-semibold text-text hover:border-gold transition-all"
              >
                <Lock className="h-4 w-4 text-gold" aria-hidden="true" />
                <span>Portal de Evaluadores</span>
              </Link>
            </div>

            {/* Indicadores Clave en Números Tabulares */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {KPIS.map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-2xl border border-overlay0/60 bg-surface0/85 backdrop-blur-md px-3.5 py-3 text-center"
                >
                  <p className="text-base sm:text-lg font-bold text-text font-mono tabular-nums">
                    {kpi.value}
                  </p>
                  <p className="text-[11px] font-medium text-subtext0 mt-0.5">
                    {kpi.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Muestra Interactiva de Expediente Real */}
          <section id="showcase" aria-label="Demostración de expediente pericial">
            <HeroProductShowcase />
          </section>
        </div>
      </main>

      {/* Metodología y Estándar Probatorio */}
      <section id="tecnologia" className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-overlay0/40">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-gold">
                Metodología de Trabajo
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-text tracking-tight mt-0.5">
                Rigor Documental en Cada Inspección
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-subtext0">
              <span className="flex items-center gap-1.5">
                <FileSpreadsheet className="h-4 w-4 text-gold" /> Entregable estandarizado
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gold" /> Cobertura nacional
              </span>
            </div>
          </div>
          <BentoFeatures />
        </div>
      </section>

      {/* Simulador de Aranceles */}
      <section id="simulador" className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-overlay0/40">
        <div className="max-w-7xl mx-auto">
          <PeritajeCalculator />
        </div>
      </section>

      {/* Cobertura Territorial */}
      <section id="cobertura" className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-overlay0/40">
        <div className="max-w-7xl mx-auto">
          <ParaguayOperationalMap />
        </div>
      </section>

      {/* Respaldo Normativo */}
      <section id="faqs" className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-overlay0/40">
        <div className="max-w-7xl mx-auto">
          <FaqSection />
        </div>
      </section>

      {/* Pie de Página Institucional */}
      <footer className="relative z-10 border-t border-overlay0/50 py-8 bg-mantle/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-subtext0">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span>• Informes Socioambientales y Verificación Domiciliaria • Asunción, Paraguay</span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/login" className="hover:text-gold transition-colors">Portal Pericial</Link>
            <Link href="/entrevista/demo" className="hover:text-gold transition-colors">Cuestionario Demo</Link>
            <span className="text-subtext0/70 font-mono">© 2026 Jerovia Consultora</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
