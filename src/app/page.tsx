"use client";

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
import { ShieldCheck, MapPin, ChevronRight, Lock, Clock, EyeOff } from "lucide-react";

constKPIS = [
  { value: "< 24h", label: "SLA de Emisión" },
  { value: "100%", label: "Verificación GPS" },
  { value: "9 Módulos", label: "Protocolo Pericial" },
  { value: "Ley 6534/20", label: "Cumplimiento Legal" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-base text-text selection:bg-gold/30 selection:text-gold overflow-x-hidden">
      {/* Fondo interactivo que reacciona al cursor estilo Antigravity */}
      <AntigravityBackground />

      {/* Barra Superior Institucional */}
      <nav aria-label="Navegación principal" className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-subtext0">
            <a href="#showcase" className="hover:text-gold transition-colors">Consola</a>
            <a href="#tecnologia" className="hover:text-gold transition-colors">Tecnología</a>
            <a href="#simulador" className="hover:text-gold transition-colors">Aranceles</a>
            <a href="#cobertura" className="hover:text-gold transition-colors">Cobertura</a>
            <a href="#faqs" className="hover:text-gold transition-colors">Normativa</a>
          </div>

          <div className="flex items-center gap-3">
            <CommandPalette />
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-xl bg-gold px-4 py-2 text-xs font-bold text-black hover:bg-gold-light transition-all shadow-sm"
            >
              Portal Pericial
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO CORPORATIVO DIRECTO Y MINIMALISTA */}
      <main id="main-content" tabIndex={-1} className="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8 outline-none">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold font-mono"
            >
              <span className="h-2 w-2 rounded-full bg-green animate-ping" aria-hidden="true" />
              <span>AUDITORÍA SOCIOAMBIENTAL &amp; PERITAJE DE RIESGO • PARAGUAY</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.06 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.03] text-text"
            >
              Certeza domiciliaria para{" "}
              <span className="text-gradient-gold">comités de crédito.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="text-base sm:text-lg text-subtext0 max-w-2xl mx-auto font-normal"
            >
              Inspección presencial georreferenciada, análisis con IA y entrega ejecutiva en 5 láminas listas para directorio.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
            >
              <Link
                href="/entrevista/demo"
                className="w-full sm:w-auto group flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-3.5 text-sm font-bold text-black hover:bg-gold-light transition-all shadow-xl shadow-gold/20"
              >
                <span>Probar Consola Demo</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-overlay0/70 bg-surface0/80 backdrop-blur-md px-8 py-3.5 text-sm font-semibold text-text hover:border-gold transition-all"
              >
                <Lock className="h-4 w-4 text-gold" aria-hidden="true" />
                <span>Acceso Evaluadores</span>
              </Link>
            </motion.div>

            {/* Barra de KPIs Ejecutivos */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.24 }}
              className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto"
            >
              {constKPIS.map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-2xl border border-overlay0/50 bg-surface0/70 backdrop-blur-md px-4 py-3 text-center hover:border-gold/40 transition-colors"
                >
                  <p className="text-lg sm:text-xl font-black text-gold font-mono">{kpi.value}</p>
                  <p className="text-[11px] font-semibold text-subtext0 uppercase tracking-wider mt-0.5">
                    {kpi.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* CONSOLA INTERACTIVA 3D */}
          <section id="showcase" aria-label="Consola pericial interactiva">
            <HeroProductShowcase />
          </section>
        </div>
      </main>

      {/* BENTO GRID MINIMALISTA */}
      <section id="tecnologia" className="relative z-10 py-14 px-4 sm:px-6 lg:px-8 border-t border-overlay0/30">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest">
                Arquitectura Probatoria
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight mt-0.5">
                Precisión Forense en Campo
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs text-subtext0 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-gold" /> Matrícula N° 4.819
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gold" /> Cobertura Nacional
              </span>
            </div>
          </div>
          <BentoFeatures />
        </div>
      </section>

      {/* SIMULADOR DE ARANCELES */}
      <section id="simulador" className="relative z-10 py-14 px-4 sm:px-6 lg:px-8 border-t border-overlay0/30">
        <div className="max-w-7xl mx-auto">
          <PeritajeCalculator />
        </div>
      </section>

      {/* COBERTURA TERRITORIAL */}
      <section id="cobertura" className="relative z-10 py-14 px-4 sm:px-6 lg:px-8 border-t border-overlay0/30">
        <div className="max-w-7xl mx-auto">
          <ParaguayOperationalMap />
        </div>
      </section>

      {/* NORMATIVA Y PREGUNTAS CLAVE */}
      <section id="faqs" className="relative z-10 py-14 px-4 sm:px-6 lg:px-8 border-t border-overlay0/30">
        <div className="max-w-7xl mx-auto">
          <FaqSection />
        </div>
      </section>

      {/* FOOTER CORPORATIVO */}
      <footer className="relative z-10 border-t border-overlay0/40 py-8 bg-mantle/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-subtext0">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span>• Inteligencia Socioambiental • Asunción, Paraguay</span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/login" className="hover:text-gold transition-colors">Portal Pericial</Link>
            <Link href="/entrevista/demo" className="hover:text-gold transition-colors">Demo Interactiva</Link>
            <span className="text-subtext0/60 font-mono">© 2026 Jerovia Consultora</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
