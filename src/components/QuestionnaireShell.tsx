"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AntigravityBackground } from "@/components/ui/AntigravityBackground";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  ShieldCheck,
  Lock,
  Save,
  Smartphone,
  Building2,
  UserCheck,
} from "lucide-react";

interface QuestionnaireShellProps {
  entidadSolicitante: string;
  candidatoNombre?: string;
  evaluadorAsignado?: string;
  children: React.ReactNode;
}

export function QuestionnaireShell({
  entidadSolicitante,
  candidatoNombre,
  evaluadorAsignado,
  children,
}: QuestionnaireShellProps) {
  return (
    <div className="relative min-h-screen bg-base text-text flex flex-col justify-between overflow-x-hidden">
      <AntigravityBackground />

      <header className="glass-panel sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-3.5 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Logo size="sm" />
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-2.5 py-1 rounded-lg border bg-[#536c45]/15 border-[#536c45]/40 text-gold text-[11px] font-mono font-bold flex items-center gap-1.5">
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">AUTOGUARDADO ACTIVO</span>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 w-full max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-7 outline-none space-y-4 flex-1"
      >
        <div className="rounded-2xl bg-gradient-to-r from-[#536c45] via-[#485536] to-[#364228] text-white p-4 sm:p-5 shadow-md border border-[#85987a]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#d5ddd1]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>FORMULARIO OFICIAL SOCIOAMBIENTAL</span>
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
              {candidatoNombre
                ? `Postulante: ${candidatoNombre}`
                : "Relevamiento de Datos del Postulante"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/25 border border-white/20 font-bold text-[#f4f6f2]">
              <Building2 className="h-3.5 w-3.5 text-[#b4c6aa]" />
              <span>{entidadSolicitante}</span>
            </span>
            {evaluadorAsignado && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/20 border border-white/15 font-mono text-[11px] text-[#d5ddd1]">
                <UserCheck className="h-3.5 w-3.5" />
                <span>{evaluadorAsignado}</span>
              </span>
            )}
          </div>
        </div>

        <div className="recessed-well rounded-3xl p-2 sm:p-4">
          <SpotlightCard sinkIntensity={2} className="p-4 sm:p-7">
            {children}
          </SpotlightCard>
        </div>
      </main>

      <footer className="relative z-10 border-t border-overlay0/40 bg-mantle/90 backdrop-blur-md py-4 px-4">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] font-mono text-subtext1">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Jerovia Consultora · Datos Confidenciales
          </span>
          <span className="flex items-center gap-1.5">
            <Save className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Memoria Persistente en Celular y Servidor
          </span>
          <span className="flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Compatible con iPhone, Android y PC
          </span>
        </div>
      </footer>
    </div>
  );
}
