"use client";

import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export const PASOS_CONFIG = [
  { id: 1, label: "Personal", desc: "Identificación y contacto" },
  { id: 2, label: "Académico", desc: "Formación y estudios" },
  { id: 3, label: "Laboral", desc: "Trayectoria y referencias" },
  { id: 4, label: "Perfil", desc: "Evaluación psicosocial" },
  { id: 5, label: "Familia", desc: "Composición del hogar" },
  { id: 6, label: "Salud", desc: "Antecedentes médicos" },
  { id: 7, label: "Economía", desc: "Ingresos, egresos y deudas" },
  { id: 8, label: "Vivienda", desc: "Inspección in situ y GPS" },
  { id: 9, label: "Dictamen", desc: "Conclusión pericial" },
];

interface ProgressBarProps {
  pasoActual: number;
  maxPasoAlcanzado?: number;
  onStepSelect?: (paso: number) => void;
  className?: string;
}

export function ProgressBar({
  pasoActual,
  maxPasoAlcanzado = pasoActual,
  onStepSelect,
  className,
}: ProgressBarProps) {
  const progreso = Math.round(((pasoActual - 1) / (PASOS_CONFIG.length - 1)) * 100);
  const currentStepObj = PASOS_CONFIG[pasoActual - 1] || PASOS_CONFIG[0];

  return (
    <div className={cn("w-full select-none space-y-3", className)}>
      {/* Cabecera de progreso con números tabulares */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-gold/15 border border-gold/30 text-gold text-xs font-mono font-bold tabular-nums shrink-0">
            {pasoActual} / {PASOS_CONFIG.length}
          </span>
          <span className="text-xs sm:text-sm font-bold text-text truncate">
            {currentStepObj.label}
          </span>
          <span className="hidden sm:inline text-xs text-subtext0 truncate">
            • {currentStepObj.desc}
          </span>
        </div>

        <span className="text-xs font-mono font-bold text-gold tabular-nums shrink-0">
          {progreso}%
        </span>
      </div>

      {/* Barra lineal continua */}
      <div
        role="progressbar"
        aria-valuenow={progreso}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progreso del relevamiento: módulo ${pasoActual} de ${PASOS_CONFIG.length}`}
        className="relative h-1.5 w-full rounded-full bg-surface2 overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-gold transition-all duration-300 ease-out"
          style={{ width: `${progreso}%` }}
        />
      </div>

      {/* Selector horizontal deslizable (Funciona en Celular y en PC) */}
      <nav
        aria-label="Módulos del cuestionario"
        className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar"
      >
        {PASOS_CONFIG.map((paso) => {
          const completado = paso.id < pasoActual;
          const activo = paso.id === pasoActual;
          const desbloqueado = paso.id <= Math.max(pasoActual, maxPasoAlcanzado);

          return (
            <button
              key={paso.id}
              type="button"
              disabled={!desbloqueado || !onStepSelect}
              onClick={() => desbloqueado && onStepSelect?.(paso.id)}
              aria-current={activo ? "step" : undefined}
              title={`${paso.id}. ${paso.label}: ${paso.desc}`}
              className={cn(
                "min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 border transition-all",
                activo &&
                  "bg-gold text-black border-gold font-bold shadow-2xs cursor-default",
                !activo &&
                  completado &&
                  "bg-green/10 text-green border-green/30 hover:bg-green/20 cursor-pointer",
                !activo &&
                  !completado &&
                  desbloqueado &&
                  "bg-surface1 text-text border-overlay0/70 hover:border-gold/50 cursor-pointer",
                !desbloqueado &&
                  "bg-surface1/40 text-subtext0/50 border-overlay0/30 cursor-not-allowed"
              )}
            >
              {completado ? (
                <Check className="h-3 w-3 shrink-0" aria-hidden="true" />
              ) : !desbloqueado ? (
                <Lock className="h-2.5 w-2.5 shrink-0 opacity-60" aria-hidden="true" />
              ) : (
                <span className="font-mono text-[11px] tabular-nums">{paso.id}.</span>
              )}
              <span>{paso.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
