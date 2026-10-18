"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { CinematicHero } from "@/components/CinematicHero";
import { HeroProductShowcase } from "@/components/HeroProductShowcase";
import { BentoFeatures } from "@/components/BentoFeatures";
import { PeritajeCalculator } from "@/components/PeritajeCalculator";
import { ParaguayOperationalMap } from "@/components/ParaguayOperationalMap";
import { AntigravityBackground } from "@/components/ui/AntigravityBackground";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const METRICS = [
  { value: "9 Módulos", label: "Protocolo de Campo" },
  { value: "GPS + Fotos", label: "Constatación In Situ" },
  { value: "5 Páginas", label: "Dossier PDF A4 y .PPTX" },
  { value: "< 24 hs", label: "Gran Asunción" },
];

const sectionTransition = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-base text-text selection:bg-gold/25 selection:text-gold overflow-x-hidden">
      <SmoothScroll />
      <AntigravityBackground />

      {/* 1. PORTADA CORPORATIVA */}
      <CinematicHero />

      {/* 2. SECCIONES INTERACTIVAS BIEN SEPARADAS (SIN ENCIMARSE) */}
      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 sm:pb-20 space-y-16 sm:space-y-20 outline-none"
      >
        {/* 4 Indicadores Clave */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={sectionTransition}
          aria-label="Indicadores principales"
          className="recessed-well rounded-3xl p-3 sm:p-4 grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {METRICS.map((m) => (
            <SpotlightCard
              key={m.label}
              sinkIntensity={5.5}
              pressable
              className="px-4 py-4 text-center"
            >
              <p className="text-lg sm:text-2xl font-black text-gold font-mono tabular-nums">
                {m.value}
              </p>
              <p className="text-xs sm:text-sm font-bold text-text mt-1">
                {m.label}
              </p>
            </SpotlightCard>
          ))}
        </motion.section>

        {/* Visor de las 5 Páginas Oficiales */}
        <motion.section
          id="showcase"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={sectionTransition}
          className="scroll-mt-12 space-y-3"
        >
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
              Informe Confidencial de 5 Páginas
            </h2>
            <span className="text-xs font-mono font-bold text-gold hidden sm:inline">
              01 // ENTREGABLE OFICIAL
            </span>
          </div>
          <HeroProductShowcase />
        </motion.section>

        {/* Tecnología de Verificación */}
        <motion.section
          id="capacidades"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={sectionTransition}
          className="scroll-mt-12 space-y-3"
        >
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
              Método de Relevamiento
            </h2>
            <span className="text-xs font-mono font-bold text-gold hidden sm:inline">
              02 // CAMPO
            </span>
          </div>
          <BentoFeatures />
        </motion.section>

        {/* Simulador de Aranceles */}
        <motion.section
          id="simulador"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={sectionTransition}
          className="scroll-mt-12 space-y-3"
        >
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
              Simulador de Aranceles
            </h2>
            <span className="text-xs font-mono font-bold text-gold hidden sm:inline">
              03 // COTIZADOR
            </span>
          </div>
          <PeritajeCalculator />
        </motion.section>

        {/* Cobertura Territorial */}
        <motion.section
          id="cobertura"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={sectionTransition}
          className="scroll-mt-12 space-y-3"
        >
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
              Cobertura en Paraguay
            </h2>
            <span className="text-xs font-mono font-bold text-gold hidden sm:inline">
              04 // TERRITORIO
            </span>
          </div>
          <ParaguayOperationalMap />
        </motion.section>
      </main>

      <footer className="relative z-10 border-t border-overlay0 py-8 bg-mantle/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-subtext1">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span>• Verificación Domiciliaria y Estudios Socioambientales • Paraguay</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-gold transition-colors">
              Portal Evaluadores
            </Link>
            <Link href="/entrevista/demo" className="hover:text-gold transition-colors">
              Cuestionario Demo
            </Link>
            <span className="text-subtext0 font-mono">© 2026 Jerovia Consultora</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
