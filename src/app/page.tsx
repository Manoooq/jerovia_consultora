"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandPalette } from "@/components/CommandPalette";
import { HeroProductShowcase } from "@/components/HeroProductShowcase";
import { BentoFeatures } from "@/components/BentoFeatures";
import { PeritajeCalculator } from "@/components/PeritajeCalculator";
import { ParaguayOperationalMap } from "@/components/ParaguayOperationalMap";
import { FaqSection } from "@/components/FaqSection";
import {
  ShieldCheck, MapPin, ChevronRight, Lock, EyeOff
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base text-text selection:bg-gold/30 selection:text-gold">
      {/* ══ BARRA SUPERIOR INSTITUCIONAL ══ */}
      <nav aria-label="Navegación principal" className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-subtext0">
            <a href="#showcase" className="hover:text-text transition-colors">Plataforma</a>
            <a href="#tecnologia" className="hover:text-text transition-colors">Tecnología</a>
            <a href="#simulador" className="hover:text-text transition-colors">Aranceles</a>
            <a href="#cobertura" className="hover:text-text transition-colors">Cobertura</a>
            <a href="#faqs" className="hover:text-text transition-colors">Normativa</a>
          </div>

          <div className="flex items-center gap-3">
            <CommandPalette />
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

      {/* ══ HERO PRINCIPAL: PRODUCT-AS-THE-HERO (CONSOLA PERICIAL UNIFICADA) ══ */}
      <main id="main-content" tabIndex={-1} className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 outline-none">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/10 px-3.5 py-1 text-xs font-semibold text-green font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-green animate-ping" />
              <span>Red de Auditoría Activa · Asunción, CDE y Encarnación</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.04] text-text">
              Verificación domiciliaria y peritajes de crédito.
            </h1>

            <p className="text-base sm:text-xl text-subtext0 leading-relaxed font-normal">
              Constatamos in situ la residencia efectiva, solvencia declarada y referencias vecinales. Emitimos el legajo en 5 láminas ejecutivas (.pptx y PDF).
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/entrevista/demo"
                className="group flex items-center justify-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-black hover:bg-gold-light transition-all shadow-lg shadow-gold/20"
              >
                <span>Explorar Formulario Demo</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-surface1 px-7 py-3.5 text-sm font-semibold text-text hover:bg-surface2 transition-all"
              >
                <Lock className="h-4 w-4 text-subtext0" />
                <span>Portal de Evaluadores</span>
              </Link>
            </div>

            {/* Sellos de Estándar */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-6 text-xs text-subtext0 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                <span>Matrícula Pericial N° 4.819</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gold shrink-0" />
                <span>Georreferenciación GPS In Situ</span>
              </span>
              <span className="flex items-center gap-1.5">
                <EyeOff className="h-4 w-4 text-gold shrink-0" />
                <span>Reserva Confidencial Ley N° 1682/01</span>
              </span>
            </div>
          </div>

          {/* ══ PRODUCTO INTERACTIVO: CONSOLA PERICIAL UNIFICADA ══ */}
          <section id="showcase">
            <HeroProductShowcase />
          </section>

        </div>
      </main>

      {/* ══ BENTO GRID DE CAPACIDADES TECNOLÓGICAS (SHOW, DON'T TELL) ══ */}
      <section id="tecnologia" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider">
                Infraestructura Probatoria
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight mt-0.5">
                Rigor Técnico y Metodología Inviolable
              </h2>
            </div>
            <span className="text-xs text-subtext0 font-mono">
              Auditoría en fachada y algoritmos predictivos
            </span>
          </div>

          <BentoFeatures />
        </div>
      </section>

      {/* ══ SIMULADOR DE ARANCELES (COMPACTO) ══ */}
      <section id="simulador" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto">
          <PeritajeCalculator />
        </div>
      </section>

      {/* ══ COBERTURA TERRITORIAL PARAGUAY ══ */}
      <section id="cobertura" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto space-y-6">
          <ParaguayOperationalMap />
        </div>
      </section>

      {/* ══ PREGUNTAS FRECUENTES DE COMITÉS DE RIESGO ══ */}
      <section id="faqs" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto">
          <FaqSection />
        </div>
      </section>

      {/* ══ PIE DE PÁGINA SOBRIO Y ELEGANTE ══ */}
      <footer className="border-t border-white/[0.08] py-8 bg-mantle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-subtext0">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span>· Peritajes Socioambientales · Asunción, Paraguay</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link href="/login" className="hover:text-text transition-colors">Portal Pericial</Link>
            <Link href="/entrevista/demo" className="hover:text-text transition-colors">Formulario Demo</Link>
            <span className="text-subtext0/60 font-mono">© 2026 Jerovia Consultora</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
