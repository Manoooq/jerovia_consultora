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
import { ShieldCheck, MapPin, ChevronRight, Lock, EyeOff, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base text-text selection:bg-gold/30 selection:text-gold">
      <header aria-label="Navegación principal" className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-subtext0">
            <a href="#showcase" className="hover:text-text transition-colors">Plataforma</a>
            <a href="#tecnologia" className="hover:text-text transition-colors">Tecnología</a>
            <a href="#simulador" className="hover:text-text transition-colors">Aranceles</a>
            <a href="#cobertura" className="hover:text-text transition-colors">Cobertura</a>
            <a href="#faqs" className="hover:text-text transition-colors">Normativa</a>
          </nav>

          <div className="flex items-center gap-4">
            <CommandPalette />
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg border border-overlay0 bg-surface1 px-4 py-2 text-sm font-medium text-text hover:border-overlay1 hover:bg-surface2 transition-all shadow-sm"
            >
              Portal Pericial
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 outline-none">
        <div className="max-w-7xl mx-auto space-y-16">
          <section className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/10 px-4 py-1.5 text-xs font-medium text-green">
              <span className="h-2 w-2 rounded-full bg-green animate-pulse" aria-hidden="true" />
              <span>Red de Auditoría Activa • Asunción, Central, CDE y Encarnación</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text leading-tight">
              Verificación domiciliaria y peritajes de crédito.
            </h1>

            <p className="text-lg sm:text-xl text-subtext0 leading-relaxed max-w-2xl">
              Constatamos in situ la residencia efectiva, solvencia declarada y referencias vecinales con evidencia GPS. Emitimos dictámenes ejecutivos en menos de 24 horas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/entrevista/demo"
                className="group flex items-center justify-center gap-2 rounded-lg bg-gold px-8 py-3.5 text-sm font-semibold text-white hover:bg-gold-light transition-all shadow-md"
              >
                <span>Explorar Demo</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-lg border border-overlay1 bg-surface0 px-8 py-3.5 text-sm font-medium text-text hover:bg-surface1 transition-all"
              >
                <Lock className="h-4 w-4 text-subtext1" aria-hidden="true" />
                <span>Portal de Evaluadores</span>
              </Link>
            </div>

            <div className="pt-8 border-t border-overlay0 flex flex-wrap items-center gap-8 text-sm text-subtext0">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gold shrink-0" aria-hidden="true" />
                <span>Matrícula Pericial N° 4.819</span>
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gold shrink-0" aria-hidden="true" />
                <span>Georreferenciación GPS In Situ</span>
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gold shrink-0" aria-hidden="true" />
                <span>SLA Ejecutivo &lt; 24 Horas</span>
              </span>
              <span className="flex items-center gap-2">
                <EyeOff className="h-5 w-5 text-gold shrink-0" aria-hidden="true" />
                <span>Cumplimiento Ley N° 6534/20</span>
              </span>
            </div>
          </section>

          <section id="showcase" aria-label="Plataforma de Consola Pericial">
            <HeroProductShowcase />
          </section>
        </div>
      </main>

      <section id="tecnologia" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-overlay0 bg-surface1/30">
        <div className="max-w-7xl mx-auto space-y-10">
          <header className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
              Rigor Técnico y Metodología Inviolable
            </h2>
            <p className="mt-4 text-lg text-subtext0">
              Auditoría en fachada y detección de inconsistencias para decisiones de crédito seguras.
            </p>
          </header>
          <BentoFeatures />
        </div>
      </section>

      <section id="simulador" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-overlay0 bg-base">
        <div className="max-w-7xl mx-auto">
          <PeritajeCalculator />
        </div>
      </section>

      <section id="cobertura" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-overlay0 bg-surface1/30">
        <div className="max-w-7xl mx-auto space-y-10">
          <header className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
              Cobertura Operativa
            </h2>
            <p className="mt-4 text-lg text-subtext0">
              Red nacional de peritaje con nodos activos en los principales departamentos del país.
            </p>
          </header>
          <ParaguayOperationalMap />
        </div>
      </section>

      <section id="faqs" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-overlay0 bg-base">
        <div className="max-w-7xl mx-auto">
          <FaqSection />
        </div>
      </section>

      <footer className="border-t border-overlay0 py-12 bg-surface1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-subtext0">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <span className="hidden sm:inline">•</span>
            <span>Peritajes Socioambientales • Asunción, Paraguay</span>
          </div>
          <nav className="flex flex-wrap justify-center items-center gap-6 font-medium">
            <Link href="/login" className="hover:text-text transition-colors">Portal Pericial</Link>
            <Link href="/entrevista/demo" className="hover:text-text transition-colors">Formulario Demo</Link>
            <span className="text-subtext1">© {new Date().getFullYear()} Jerovia Consultora</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}
