"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AntigravityBackground } from "@/components/ui/AntigravityBackground";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  ArrowLeft,
  ShieldCheck,
  Wifi,
  WifiOff,
  Lock,
  Save,
  Smartphone,
  Info,
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
  const [isOnline, setIsOnline] = useState(true);
  const [showInfoMobile, setShowInfoMobile] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-base text-text flex flex-col justify-between overflow-x-hidden">
      <AntigravityBackground />

      {/* Cabecera Fija */}
      <header className="glass-panel sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <Link
              href="/dashboard"
              className="min-h-[38px] px-2.5 rounded-xl border border-overlay1 bg-surface1 flex items-center gap-1.5 text-xs font-bold text-subtext1 hover:text-text hover:border-gold transition-colors shrink-0"
              title="Volver al panel"
            >
              <ArrowLeft className="h-4 w-4 text-gold" aria-hidden="true" />
              <span className="hidden sm:inline">Panel</span>
            </Link>
            <Logo size="sm" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              role="status"
              aria-live="polite"
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 ${
                isOnline
                  ? "bg-green/10 border-green/30 text-green"
                  : "bg-red/15 border-red/40 text-red animate-pulse"
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden md:inline">EN LÍNEA</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>OFFLINE</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowInfoMobile(!showInfoMobile)}
              className="sm:hidden min-h-[38px] min-w-[38px] rounded-xl border border-overlay1 bg-surface1 flex items-center justify-center text-subtext1"
              aria-label="Detalles del expediente"
            >
              <Info className="h-4 w-4 text-gold" />
            </button>

            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-subtext0 font-mono font-bold uppercase tracking-wider">
                SOLICITANTE
              </p>
              <p className="text-xs font-bold text-text truncate max-w-[180px]">
                {entidadSolicitante}
              </p>
            </div>

            <ThemeToggle />
          </div>
        </div>

        {!isOnline && (
          <div className="bg-red/15 border-t border-red/30 px-4 py-2 text-center text-xs font-semibold text-red">
            Sin conexión móvil. Sus respuestas quedan respaldadas en este dispositivo y se sincronizarán al recuperar señal.
          </div>
        )}

        {showInfoMobile && (
          <div className="sm:hidden border-t border-overlay0/50 bg-mantle px-4 py-3 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-subtext0">Solicitante:</span>
              <span className="font-bold text-text">{entidadSolicitante}</span>
            </div>
            {candidatoNombre && (
              <div className="flex justify-between">
                <span className="text-subtext0">Evaluado:</span>
                <span className="font-bold text-text">{candidatoNombre}</span>
              </div>
            )}
            {evaluadorAsignado && (
              <div className="flex justify-between">
                <span className="text-subtext0">Perito:</span>
                <span className="font-bold text-gold">{evaluadorAsignado}</span>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Contenedor Principal con Chasis Hundido y SpotlightCard */}
      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 w-full max-w-3xl mx-auto px-3 sm:px-6 py-5 sm:py-8 outline-none space-y-4 flex-1"
      >
        {candidatoNombre && (
          <div className="hidden sm:flex recessed-well rounded-2xl px-5 py-3 items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold shrink-0" aria-hidden="true" />
              <span className="text-subtext1">
                Expediente: <strong className="text-text">{candidatoNombre}</strong>
              </span>
            </div>
            {evaluadorAsignado && (
              <span className="text-subtext1 font-mono text-[11px]">
                Perito: <strong className="text-gold">{evaluadorAsignado}</strong>
              </span>
            )}
          </div>
        )}

        <div className="recessed-well rounded-3xl p-2.5 sm:p-4">
          <SpotlightCard sinkIntensity={2.2} className="p-4 sm:p-8">
            {children}
          </SpotlightCard>
        </div>
      </main>

      {/* Pie de Garantías */}
      <footer className="relative z-10 border-t border-overlay0/40 bg-mantle/85 backdrop-blur-md py-4 px-4">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] font-mono text-subtext1">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Datos Confidenciales
          </span>
          <span className="flex items-center gap-1.5">
            <Save className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Autoguardado Local + Servidor
          </span>
          <span className="flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Móvil y Escritorio
          </span>
        </div>
      </footer>
    </div>
  );
}
