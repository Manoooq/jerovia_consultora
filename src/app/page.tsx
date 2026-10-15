"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandPalette } from "@/components/CommandPalette";
import { HeroProductShowcase } from "@/components/HeroProductShowcase";
import { BentoFeatures } from "@/components/BentoFeatures";
import { PeritajeCalculator } from "@/components/PeritajeCalculator";
import { ParaguayOperationalMap } from "@/components/ParaguayOperationalMap";
import { FaqSection } from "@/components/FaqSection";
import { AntigravityBackground } from "@/components/ui/AntigravityBackground";
import { ChevronRight, Lock, Menu, X } from "lucide-react";

const KPIS = [
  { value: "9 Módulos", label: "Entrevista Estructurada" },
  { value: "GPS + Fotos", label: "Verificación en Sitio" },
  { value: "5 Láminas", label: "Informe .PPTX y PDF" },
  { value: "< 24 hs", label: "Entrega Gran Asunción" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#showcase", label: "Plataforma" },
    { href: "#tecnologia", label: "Método" },
    { href: "#simulador", label: "Aranceles" },
    { href: "#cobertura", label: "Cobertura" },
    { href: "#faqs", label: "Preguntas" },
  ];

  return (
    <div className="relative min-h-screen bg-base text-text selection:bg-gold/30 selection:text-gold overflow-x-hidden">
      {/* Fondo interactivo de partículas y filamentos a 60 FPS */}
      <AntigravityBackground />

      {/* Navegación limpia */}
      <nav aria-label="Navegación principal" className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-subtext0">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-gold transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <CommandPalette />
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden sm:inline-flex min-h-[38px] items-center rounded-xl bg-gold px-4 py-2 text-xs font-bold text-black hover:bg-gold-light transition-all shadow-xs"
            >
              Acceso Evaluadores
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-h-[40px] min-w-[40px] rounded-xl border border-overlay0/70 bg-surface1 flex items-center justify-center text-text"
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-overlay0/60 bg-mantle/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[42px] px-3.5 py-2 rounded-xl bg-surface1 border border-overlay0/50 text-xs font-bold text-text flex items-center"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] w-full rounded-xl bg-gold text-black font-bold text-xs flex items-center justify-center gap-2"
            >
              <Lock className="h-4 w-4" />
              <span>Acceso Evaluadores</span>
            </Link>
          </div>
        )}
      </nav>

      {/* HERO DIRECTO ENFOCADO EN LA MARCA JEROVIA */}
      <main id="main-content" tabIndex={-1} className="relative z-10 pt-28 pb-14 px-4 sm:px-6 lg:px-8 outline-none">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1 text-xs font-bold text-gold font-mono"
            >
              <span className="h-2 w-2 rounded-full bg-gold" aria-hidden="true" />
              <span>JEROVIA CONSULTORA • PARAGUAY</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] text-text"
            >
              Visitas socioambientales y{" "}
              <span className="text-gradient-gold">verificación domiciliaria.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="text-sm sm:text-lg text-subtext0 max-w-xl mx-auto"
            >
              Relevamiento presencial en terreno, registro fotográfico con GPS e informes ejecutivos claros para la toma de decisiones.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1"
            >
              <Link
                href="/entrevista/demo"
                className="min-h-[46px] w-full sm:w-auto group flex items-center justify-center gap-2 rounded-xl bg-gold px-7 py-3 text-sm font-bold text-black hover:bg-gold-light transition-all shadow-lg shadow-gold/20"
              >
                <span>Probar Cuestionario</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="min-h-[46px] w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-overlay0/80 bg-surface0/80 backdrop-blur-md px-7 py-3 text-sm font-semibold text-text hover:border-gold transition-all"
              >
                <Lock className="h-4 w-4 text-gold" />
                <span>Portal de Evaluadores</span>
              </Link>
            </motion.div>

            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto">
              {KPIS.map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-2xl border border-overlay0/50 bg-surface0/75 backdrop-blur-md px-3 py-2.5 text-center"
                >
                  <p className="text-base sm:text-lg font-black text-gold font-mono tabular-nums">
                    {kpi.value}
                  </p>
                  <p className="text-[11px] font-semibold text-subtext0 mt-0.5">
                    {kpi.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <section id="showcase" aria-label="Consola interactiva Jerovia">
            <HeroProductShowcase />
          </section>
        </div>
      </main>

      <section id="tecnologia" className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-t border-overlay0/30">
        <div className="max-w-7xl mx-auto space-y-5">
          <div>
            <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest">
              HERRAMIENTAS DE CAMPO
            </span>
            <h2 className="text-2xl font-black text-text tracking-tight mt-0.5">
              El Método Jerovia
            </h2>
          </div>
          <BentoFeatures />
        </div>
      </section>

      <section id="simulador" className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-t border-overlay0/30">
        <div className="max-w-7xl mx-auto">
          <PeritajeCalculator />
        </div>
      </section>

      <section id="cobertura" className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-t border-overlay0/30">
        <div className="max-w-7xl mx-auto">
          <ParaguayOperationalMap />
        </div>
      </section>

      <section id="faqs" className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-t border-overlay0/30">
        <div className="max-w-7xl mx-auto">
          <FaqSection />
        </div>
      </section>

      <footer className="relative z-10 border-t border-overlay0/40 py-8 bg-mantle/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-subtext0">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span>• Visitas Socioambientales y Verificación Domiciliaria • Paraguay</span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/login" className="hover:text-gold transition-colors">Acceso Evaluadores</Link>
            <Link href="/entrevista/demo" className="hover:text-gold transition-colors">Formulario Demo</Link>
            <span className="text-subtext0/60 font-mono">© 2026 Jerovia Consultora</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
