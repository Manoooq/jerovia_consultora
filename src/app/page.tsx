"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandPalette } from "@/components/CommandPalette";
import { CinematicHero } from "@/components/CinematicHero";
import { HeroProductShowcase } from "@/components/HeroProductShowcase";
import { BentoFeatures } from "@/components/BentoFeatures";
import { PeritajeCalculator } from "@/components/PeritajeCalculator";
import { ParaguayOperationalMap } from "@/components/ParaguayOperationalMap";
import { FaqSection } from "@/components/FaqSection";
import { AntigravityBackground } from "@/components/ui/AntigravityBackground";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { UserCircle2, Globe, Lock, X, Shield } from "lucide-react";

const METRICS = [
  { value: "9 Módulos", label: "Protocolo de Campo" },
  { value: "GPS + Fotos", label: "Constatación In Situ" },
  { value: "5 Láminas", label: "Dossier .PPTX y PDF" },
  { value: "< 24 hs", label: "Gran Asunción" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#showcase", label: "Consola" },
    { href: "#capacidades", label: "Capacidades" },
    { href: "#simulador", label: "Aranceles" },
    { href: "#cobertura", label: "Cobertura" },
    { href: "#especificaciones", label: "Proceso" },
  ];

  return (
    <div className="relative min-h-screen bg-base text-text selection:bg-gold/30 selection:text-gold overflow-x-hidden">
      {/* Fondo de partículas Antigravity para toda la zona inferior al hacer scroll */}
      <AntigravityBackground />

      {/* BARRA DE NAVEGACIÓN: Transparente estilo Tesla sobre el Hero -> Cristal al bajar */}
      <nav
        aria-label="Navegación principal"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-panel py-0"
            : "bg-gradient-to-b from-black/60 to-transparent border-b border-transparent py-1"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Izquierda: Wordmark espaciado estilo Tesla en el Hero, o Logo al bajar */}
          <a
            href="#"
            className="flex items-center gap-2.5 focus:outline-none"
            aria-label="Jerovia Consultora Inicio"
          >
            {scrolled ? (
              <Logo size="sm" />
            ) : (
              <span className="font-black text-sm sm:text-base tracking-[0.38em] uppercase text-white drop-shadow">
                JEROVIA
              </span>
            )}
          </a>

          {/* Centro: 5 Enlaces limpios centrados */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-[13px] font-semibold transition-colors ${
                  scrolled
                    ? "text-text hover:bg-surface2"
                    : "text-white/95 hover:text-white hover:bg-white/15 drop-shadow"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Derecha: 3 Íconos minimalistas estilo Tesla en escritorio + Pastilla "Menú" en móvil */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {scrolled ? (
              <>
                <CommandPalette />
                <ThemeToggle />
                <Link
                  href="/login"
                  className="hidden sm:inline-flex min-h-[38px] items-center rounded-xl bg-gold px-4 py-2 text-xs font-bold text-black hover:bg-gold-light transition-all"
                >
                  Portal Evaluadores
                </Link>
              </>
            ) : (
              <>
                <CommandPalette variant="hero-icon" />
                <a
                  href="#cobertura"
                  className="hidden sm:flex h-9 w-9 rounded-full items-center justify-center text-white/90 hover:text-white hover:bg-white/15 transition-colors"
                  title="Cobertura en Paraguay"
                  aria-label="Ver cobertura en Paraguay"
                >
                  <Globe className="h-5 w-5 stroke-[1.8]" />
                </a>
                <ThemeToggle />
                <Link
                  href="/login"
                  className="hidden sm:flex h-9 w-9 rounded-full items-center justify-center text-white/90 hover:text-white hover:bg-white/15 transition-colors"
                  title="Portal de Evaluadores"
                  aria-label="Ingresar al Portal de Evaluadores"
                >
                  <UserCircle2 className="h-5 w-5 stroke-[1.8]" />
                </Link>
              </>
            )}

            {/* Botón "Menú" en pastilla translúcida para celulares */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md transition-colors cursor-pointer ${
                scrolled
                  ? "border border-overlay1 bg-surface1 text-text"
                  : "bg-white/15 hover:bg-white/25 text-white border border-white/20"
              }`}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? "Cerrar" : "Menú"}
            </button>
          </div>
        </div>

        {/* Cajón Móvil Desplegable */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-overlay0 bg-mantle/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3 text-text">
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
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-overlay0">
              <Link
                href="/entrevista/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] rounded-xl border border-overlay1 bg-surface1 text-text font-bold text-xs flex items-center justify-center"
              >
                Cuestionario Demo
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] rounded-xl bg-gold text-black font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Evaluadores</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* 1. HERO FULL-SCREEN (100dvh) ESTILO TESLA */}
      <CinematicHero />

      {/* 2. SECCIONES INTERACTIVAS 3D AL HACER SCROLL HACIA ABAJO */}
      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-20 outline-none"
      >
        {/* Banda de 4 Indicadores con paneles que brillan y se hunden */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          aria-label="Indicadores principales"
          className="recessed-well rounded-3xl p-3 sm:p-4 grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {METRICS.map((m) => (
            <SpotlightCard
              key={m.label}
              sinkIntensity={7}
              pressable
              className="px-4 py-4 text-center"
            >
              <p className="text-lg sm:text-2xl font-black text-gold font-mono tabular-nums">
                {m.value}
              </p>
              <p className="text-xs font-bold text-subtext1 mt-1">
                {m.label}
              </p>
            </SpotlightCard>
          ))}
        </motion.section>

        {/* Consola Pericial Interactiva */}
        <motion.section
          id="showcase"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold">
                01 // CONSOLA INTERACTIVA
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight mt-0.5">
                Relevamiento en Campo y 5 Láminas
              </h2>
            </div>
            <p className="text-xs font-semibold text-subtext1">
              Mueva el cursor sobre los paneles para inspeccionar cada módulo
            </p>
          </div>
          <HeroProductShowcase />
        </motion.section>

        {/* Capacidades Operativas */}
        <motion.section
          id="capacidades"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 space-y-4"
        >
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold">
              02 // CAPACIDADES DE TERRENO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight mt-0.5">
              Tecnología Aplicada a la Visita
            </h2>
          </div>
          <BentoFeatures />
        </motion.section>

        {/* Simulador de Aranceles */}
        <motion.section
          id="simulador"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 space-y-4"
        >
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold">
              03 // ARANCELES Y PLAZOS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight mt-0.5">
              Cotizador Instantáneo por Zona
            </h2>
          </div>
          <PeritajeCalculator />
        </motion.section>

        {/* Cobertura en Paraguay */}
        <motion.section
          id="cobertura"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 space-y-4"
        >
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold">
              04 // ALCANCE NACIONAL
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight mt-0.5">
              Cobertura Operativa en Paraguay
            </h2>
          </div>
          <ParaguayOperationalMap />
        </motion.section>

        {/* Especificaciones del Proceso */}
        <motion.section
          id="especificaciones"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 space-y-4"
        >
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold">
              05 // ARQUITECTURA OPERATIVA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight mt-0.5">
              Especificaciones del Servicio
            </h2>
          </div>
          <FaqSection />
        </motion.section>
      </main>

      <footer className="relative z-10 border-t border-overlay0 py-8 bg-mantle/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-subtext1">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span>• Verificación Domiciliaria e Informes Socioambientales • Paraguay</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-gold transition-colors">
              Portal Evaluadores
            </Link>
            <Link href="/entrevista/demo" className="hover:text-gold transition-colors">
              Cuestionario Demo
            </Link>
            <span className="text-subtext0 font-mono">© 2026 Jerovia</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
