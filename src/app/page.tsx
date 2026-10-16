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
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ChevronRight, Lock, Menu, X } from "lucide-react";

const METRICS = [
  { value: "9 Módulos", label: "Protocolo de Campo" },
  { value: "GPS + Fotos", label: "Constatación In Situ" },
  { value: "5 Láminas", label: "Dossier .PPTX y PDF" },
  { value: "< 24 hs", label: "Gran Asunción" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#showcase", label: "Sistema" },
    { href: "#tecnologia", label: "Capacidades" },
    { href: "#simulador", label: "Aranceles" },
    { href: "#cobertura", label: "Cobertura" },
  ];

  return (
    <div className="relative min-h-screen bg-base text-text selection:bg-gold/30 selection:text-gold overflow-x-hidden">
      <AntigravityBackground />

      {/* Barra Superior Corporativa */}
      <nav aria-label="Navegación principal" className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-subtext1">
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
              className="hidden sm:inline-flex min-h-[38px] items-center rounded-xl bg-gold px-4 py-2 text-xs font-bold text-black hover:bg-gold-light transition-all"
            >
              Portal Evaluadores
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-h-[40px] min-w-[40px] rounded-xl border border-overlay1 bg-surface1 flex items-center justify-center text-text"
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
                  className="min-h-[42px] px-3.5 py-2 rounded-xl bg-surface1 border border-overlay0 text-xs font-bold text-text flex items-center"
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
              <span>Portal Evaluadores</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Directo y Sobrio */}
      <main id="main-content" tabIndex={-1} className="relative z-10 pt-28 pb-12 px-4 sm:px-6 lg:px-8 outline-none">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-gold">
              JEROVIA CONSULTORA — PARAGUAY
            </p>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.04] text-text">
              Verificación domiciliaria e{" "}
              <span className="text-gradient-gold">informes socioambientales.</span>
            </h1>

            <p className="text-sm sm:text-base text-subtext1 max-w-xl mx-auto">
              Relevamiento presencial georreferenciado. Entregables ejecutivos en 5 láminas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/entrevista/demo"
                className="min-h-[46px] w-full sm:w-auto group flex items-center justify-center gap-2 rounded-xl bg-gold px-7 py-3 text-sm font-bold text-black hover:bg-gold-light transition-all shadow-lg shadow-gold/15"
              >
                <span>Explorar Cuestionario</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="min-h-[46px] w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-overlay1 bg-surface0/90 px-7 py-3 text-sm font-semibold text-text hover:border-gold transition-all"
              >
                <Lock className="h-4 w-4 text-gold" />
                <span>Acceso Evaluadores</span>
              </Link>
            </div>

            {/* 4 Tarjetas Táctiles que Brillan y se Hunden */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {METRICS.map((m) => (
                <SpotlightCard key={m.label} sinkIntensity={6} className="px-4 py-3.5 text-center">
                  <p className="text-base sm:text-lg font-black text-gold font-mono tabular-nums">
                    {m.value}
                  </p>
                  <p className="text-[11px] font-semibold text-subtext1 mt-0.5">
                    {m.label}
                  </p>
                </SpotlightCard>
              ))}
            </div>
          </div>

          <section id="showcase" aria-label="Sistema pericial interactivo">
            <HeroProductShowcase />
          </section>
        </div>
      </main>

      <section id="tecnologia" className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight">
            Capacidades Operativas
          </h2>
          <BentoFeatures />
        </div>
      </section>

      <section id="simulador" className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight">
            Simulador de Aranceles
          </h2>
          <PeritajeCalculator />
        </div>
      </section>

      <section id="cobertura" className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight">
            Cobertura Territorial
          </h2>
          <ParaguayOperationalMap />
        </div>
      </section>

      <section id="faqs" className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight">
            Especificaciones del Servicio
          </h2>
          <FaqSection />
        </div>
      </section>

      <footer className="relative z-10 border-t border-overlay0/50 py-8 mt-6 bg-mantle/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-subtext1">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span>• Visitas Socioambientales y Verificación Domiciliaria • Paraguay</span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/login" className="hover:text-gold transition-colors">Portal Evaluadores</Link>
            <Link href="/entrevista/demo" className="hover:text-gold transition-colors">Cuestionario Demo</Link>
            <span className="text-subtext0 font-mono">© 2026 Jerovia Consultora</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
