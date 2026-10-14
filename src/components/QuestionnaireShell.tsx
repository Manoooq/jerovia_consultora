"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
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
    <div className="min-h-screen bg-base text-text flex flex-col justify-between">
      {/* Cabecera Fija Adaptable a Móvil y Escritorio */}
      <header className="border-b border-overlay0/60 bg-mantle/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <Link
              href="/dashboard"
              className="min-h-[38px] px-2.5 rounded-xl border border-overlay0/60 bg-surface1 flex items-center gap-1.5 text-xs font-semibold text-subtext1 hover:text-text transition-colors shrink-0"
              title="Volver al panel pericial"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Panel</span>
            </Link>
            <Logo size="sm" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Indicador de Estado de Red para Trabajo en Campo */}
            <div
              role="status"
              aria-live="polite"
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 ${
                isOnline
                  ? "bg-green/10 border-green/30 text-green"
                  : "bg-red/15 border-red/40 text-red animate-pulse"
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden md:inline">Sincronizado</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Sin conexión</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowInfoMobile(!showInfoMobile)}
              className="sm:hidden min-h-[38px] min-w-[38px] rounded-xl border border-overlay0/60 bg-surface1 flex items-center justify-center text-subtext1"
              aria-label="Ver detalles del expediente"
            >
              <Info className="h-4 w-4 text-gold" />
            </button>

            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-subtext0 font-semibold uppercase tracking-wider">
                Entidad Solicitante
              </p>
              <p className="text-xs font-bold text-text truncate max-w-[180px]">
                {entidadSolicitante}
              </p>
            </div>

            <ThemeToggle />
          </div>
        </div>

        {/* Alerta prominente si se corta el internet en el celular */}
        {!isOnline && (
          <div className="bg-red/15 border-t border-red/30 px-4 py-2 text-center text-xs font-semibold text-red">
            Conexión móvil interrumpida. No cierre esta pestaña; sus datos se enviarán al recuperar señal.
          </div>
        )}

        {/* Cajón informativo móvil desplegable */}
        {showInfoMobile && (
          <div className="sm:hidden border-t border-overlay0/50 bg-surface1 px-4 py-3 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-subtext0">Entidad:</span>
              <span className="font-bold text-text">{entidadSolicitante}</span>
            </div>
            {candidatoNombre && (
              <div className="flex justify-between">
                <span className="text-subtext0">Postulante:</span>
                <span className="font-bold text-text">{candidatoNombre}</span>
              </div>
            )}
            {evaluadorAsignado && (
              <div className="flex justify-between">
                <span className="text-subtext0">Perito asignado:</span>
                <span className="font-bold text-gold">{evaluadorAsignado}</span>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Contenedor Principal Optimizado para Móvil y PC */}
      <main
        id="main-content"
        tabIndex={-1}
        className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-8 outline-none space-y-4 sm:space-y-6 flex-1"
      >
        {candidatoNombre && (
          <div className="hidden sm:flex rounded-2xl border border-overlay0/60 bg-surface0 px-5 py-3 items-center justify-between gap-2 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold shrink-0" aria-hidden="true" />
              <span>
                Expediente en relevamiento: <strong className="text-text">{candidatoNombre}</strong>
              </span>
            </div>
            {evaluadorAsignado && (
              <span className="text-subtext0">
                Perito: <strong className="text-gold">{evaluadorAsignado}</strong>
              </span>
            )}
          </div>
        )}

        {/* Tarjeta del Wizard con padding adaptativo */}
        <div className="rounded-2xl sm:rounded-3xl border border-overlay0/60 bg-surface0 shadow-xl p-4 sm:p-8 lg:p-10">
          {children}
        </div>
      </main>

      {/* Pie de Garantías */}
      <footer className="border-t border-overlay0/40 bg-mantle/60 py-4 px-4">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] font-medium text-subtext0">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Protección de Datos Ley N° 6534/20
          </span>
          <span className="flex items-center gap-1.5">
            <Save className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Guardado Automático por Módulo
          </span>
          <span className="flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Interfaz Adaptada a Terreno
          </span>
        </div>
      </footer>
    </div>
  );
}
