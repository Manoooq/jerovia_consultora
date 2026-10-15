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
import { AntigravityBackground } from "@/components/ui/AntigravityBackground";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ChevronRight, Lock, Menu, X } from "lucide-react";

const METRICS = [
  { value: "9 Módulos", label: "Protocolo" },
  { value: "GPS + Fotos", label: "Terreno" },
  { value: "5 Láminas", label: ".PPTX y PDF" },
  { value: "< 24 hs", label: "Gran Asunción" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#capacidades", label: "Plataforma" },
    { href: "#simulador", label: "Cotizador" },
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
            <div className="grid grid-cols-3 gap-2">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[42px] px-3 py-2 rounded-xl bg-surface1 border border-overlay0 text-xs font-bold text-text flex items-center justify-center"
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

      {/* HERO EJECUTIVO ASIMÉTRICO (2 COLUMNAS EN PC, SIN RELLENO) */}
      <main id="main-content" tabIndex={-1} className="relative z-10 pt-24 sm:pt-28 pb-10 px-4 sm:px-6 lg:px-8 outline-none">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Columna Izquierda: Identidad Directa */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-gold">
                  JEROVIA CONSULTORA · PARAGUAY
                </p>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.06] text-text">
                  Verificación domiciliaria e informes socioambientales.
                </h1>
                <p className="text-sm text-subtext1 leading-relaxed">
                  Inspección presencial georreferenciada y emisión de legajos ejecutivos en 5 láminas.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/entrevista/demo"
                  className="min-h-[46px] group flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-xs sm:text-sm font-bold text-black hover:bg-gold-light transition-all shadow-lg shadow-gold/15"
                >
                  <span>Abrir Cuestionario</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/login"
                  className="min-h-[46px] flex items-center justify-center gap-2 rounded-xl border border-overlay1 bg-surface0/90 px-6 py-3 text-xs sm:text-sm font-semibold text-text hover:border-gold transition-all"
                >
                  <Lock className="h-4 w-4 text-gold" />
                  <span>Acceso Evaluadores</span>
                </Link>
              </div>

              {/* 4 Paneles Táctiles que Brillan y se Hunden */}
              <div className="recessed-well rounded-2xl p-2.5 grid grid-cols-2 gap-2.5">
                {METRICS.map((m) => (
                  <SpotlightCard
                    key={m.label}
                    sinkIntensity={8}
                    pressable
                    className="px-3.5 py-3"
                  >
                    <p className="text-sm sm:text-base font-black text-gold font-mono tabular-nums">
                      {m.value}
                    </p>
                    <p className="text-[11px] font-semibold text-subtext1">
                      {m.label}
                    </p>
                  </SpotlightCard>
                ))}
              </div>
            </div>

            {/* Columna Derecha: Consola Interactiva Inmediata */}
            <div className="lg:col-span-7">
              <HeroProductShowcase />
            </div>
          </div>

          {/* Fila de Capacidades Operativas */}
          <section id="capacidades" className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-subtext1">
              01 // PLATAFORMA DE CAMPO
            </span>
            <BentoFeatures />
          </section>

          {/* Cotizador Interactivo */}
          <section id="simulador" className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-subtext1">
              02 // COTIZADOR DE ARANCELES
            </span>
            <PeritajeCalculator />
          </section>

          {/* Cobertura Territorial */}
          <section id="cobertura" className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-subtext1">
              03 // COBERTURA EN PARAGUAY
            </span>
            <ParaguayOperationalMap />
          </section>
        </div>
      </main>

      <footer className="relative z-10 border-t border-overlay0/50 py-6 mt-8 bg-mantle/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-subtext1">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span>• Jerovia Consultora • Paraguay</span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/login" className="hover:text-gold transition-colors">Portal Evaluadores</Link>
            <Link href="/entrevista/demo" className="hover:text-gold transition-colors">Cuestionario Demo</Link>
            <span className="text-subtext0 font-mono">© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
