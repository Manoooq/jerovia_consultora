"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandPalette } from "@/components/CommandPalette";
import { HeroProductShowcase } from "@/components/HeroProductShowcase";
import { PeritajeCalculator } from "@/components/PeritajeCalculator";
import { ParaguayOperationalMap } from "@/components/ParaguayOperationalMap";
import {
  ShieldCheck, MapPin, Building2, Scale,
  ChevronRight, Lock, EyeOff, Layers, Zap,
  CheckCircle2
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base text-text selection:bg-gold/30 selection:text-gold">
      {/* ══ BARRA SUPERIOR INSTITUCIONAL ══ */}
      <nav aria-label="Navegación principal" className="fixed top-0 left-0 right-0 z-50 border-b border-overlay0/40 bg-mantle/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-subtext0">
            <a href="#showcase" className="hover:text-text transition-colors">Plataforma</a>
            <a href="#claves" className="hover:text-text transition-colors">Metodología</a>
            <a href="#simulador" className="hover:text-text transition-colors">Aranceles</a>
            <a href="#cobertura" className="hover:text-text transition-colors">Cobertura País</a>
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

      {/* ══ HERO CONCISO: MÁXIMA ESCANABILIDAD (LEY DE HICK) ══ */}
      <main id="main-content" tabIndex={-1} className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 outline-none">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
              <Building2 className="h-3.5 w-3.5" />
              <span>Peritajes Socioambientales · Asunción, Paraguay</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-text">
              Verificación domiciliaria y peritajes para comités de crédito.
            </h1>

            <p className="text-base sm:text-lg text-subtext0 leading-relaxed font-normal">
              Constatamos in situ la residencia efectiva, solvencia declarada y referencias vecinales. Emitimos el legajo en 5 láminas ejecutivas (.pptx y PDF) estandarizado para carpetas bancarias.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/entrevista/demo"
                className="group flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-black hover:bg-gold-light transition-all shadow-md"
              >
                <span>Explorar Formulario Demo</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-xl border border-overlay0/60 bg-surface1 px-6 py-3 text-sm font-semibold text-text hover:bg-surface2 transition-all"
              >
                <Lock className="h-4 w-4 text-subtext0" />
                <span>Portal de Evaluadores</span>
              </Link>
            </div>

            {/* Sellos de Estándar */}
            <div className="pt-4 border-t border-overlay0/30 flex flex-wrap items-center gap-6 text-xs text-subtext0 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                <span>Matrícula Pericial N° 4.819</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gold shrink-0" />
                <span>Georreferenciación GPS</span>
              </span>
              <span className="flex items-center gap-1.5">
                <EyeOff className="h-4 w-4 text-gold shrink-0" />
                <span>Reserva Confidencial Ley N° 1682/01</span>
              </span>
            </div>
          </div>

          {/* ══ PRODUCTO INTERACTIVO: SIMULADOR DE 3 LENTES ══ */}
          <section id="showcase">
            <HeroProductShowcase />
          </section>

        </div>
      </main>

      {/* ══ LAS 3 CLAVES DEL RELEVAMIENTO (SIN TEXTO DE MÁS) ══ */}
      <section id="claves" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-overlay0/30 bg-surface1/20">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="max-w-xl">
            <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider">
              Metodología In Situ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight mt-0.5">
              Tres pilares de certeza probatoria
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pilar 1 */}
            <div className="p-6 rounded-3xl border border-overlay0/40 bg-surface0 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                  <Zap className="h-4 w-4" />
                </div>
                <span className="font-mono text-[10px] text-subtext0 font-bold">01 / Inmueble</span>
              </div>
              <h3 className="font-bold text-base text-text">Vivienda y Medidor ANDE</h3>
              <p className="text-xs text-subtext0 leading-relaxed">
                Inspección ocular de mampostería, techo de tejas, linderos y cotejo del número de NIS del medidor eléctrico oficial.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] text-green font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Presencia física garantizada</span>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="p-6 rounded-3xl border border-overlay0/40 bg-surface0 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-blue/10 text-blue flex items-center justify-center">
                  <Scale className="h-4 w-4" />
                </div>
                <span className="font-mono text-[10px] text-subtext0 font-bold">02 / Solvencia</span>
              </div>
              <h3 className="font-bold text-base text-text">Consistencia Financiera</h3>
              <p className="text-xs text-subtext0 leading-relaxed">
                Cálculo de relación entre ingresos familiares declarados (formales en IPS o independientes) frente a alquiler y pasivos fijos.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] text-green font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Detección de alertas de riesgo</span>
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="p-6 rounded-3xl border border-overlay0/40 bg-surface0 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-green/10 text-green flex items-center justify-center">
                  <Layers className="h-4 w-4" />
                </div>
                <span className="font-mono text-[10px] text-subtext0 font-bold">03 / Entrega</span>
              </div>
              <h3 className="font-bold text-base text-text">Legajo de 5 Láminas</h3>
              <p className="text-xs text-subtext0 leading-relaxed">
                Informe ejecutivo en PowerPoint (.pptx editable) y PDF con dictamen concluyente firmado para resolución de comité.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] text-green font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Listo para carpeta de crédito</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══ SIMULADOR DE ARANCELES (COMPACTO) ══ */}
      <section id="simulador" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-overlay0/30">
        <div className="max-w-7xl mx-auto">
          <PeritajeCalculator />
        </div>
      </section>

      {/* ══ COBERTURA TERRITORIAL PARAGUAY ══ */}
      <section id="cobertura" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-overlay0/30 bg-surface1/20">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="max-w-xl">
            <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider">
              Despliegue Territorial
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight mt-0.5">
              Cobertura en los principales polos del país
            </h2>
          </div>

          <ParaguayOperationalMap />
        </div>
      </section>

      {/* ══ PIE DE PÁGINA SOBRIO Y ELEGANTE ══ */}
      <footer className="border-t border-overlay0/30 py-8 bg-mantle">
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
