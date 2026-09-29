"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PASOS = [
  { id: 1, label: "Personal", short: "Datos personales" },
  { id: 2, label: "Académico", short: "Formación" },
  { id: 3, label: "Laboral", short: "Trayectoria" },
  { id: 4, label: "Perfil", short: "Psicolaboral" },
  { id: 5, label: "Familia", short: "Entorno familiar" },
  { id: 6, label: "Salud", short: "Estado de salud" },
  { id: 7, label: "Economía", short: "Situación económica" },
  { id: 8, label: "Vivienda", short: "Condiciones habitacionales" },
  { id: 9, label: "Revisión", short: "Conclusiones" },
];

interface ProgressBarProps {
  pasoActual: number;
  className?: string;
}

export function ProgressBar({ pasoActual, className }: ProgressBarProps) {
  const progreso = ((pasoActual - 1) / (PASOS.length - 1)) * 100;

  return (
    <div className={cn("w-full select-none", className)}>
      {/* Barra lineal */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-subtext0 uppercase tracking-wider">
          Módulo {pasoActual} de {PASOS.length}
        </span>
        <span className="text-xs font-bold text-gold">
          {Math.round(progreso)}% completado
        </span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-surface2 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light transition-all duration-300 ease-out"
          style={{ width: `${progreso}%` }}
        />
      </div>

      {/* Pasos en móvil: solo el paso actual y los adyacentes */}
      <div className="hidden sm:flex items-center gap-1 mt-4 overflow-x-auto pb-1 scrollbar-none">
        {PASOS.map((paso, idx) => {
          const completado = paso.id < pasoActual;
          const activo = paso.id === pasoActual;
          const futuro = paso.id > pasoActual;

          return (
            <div key={paso.id} className="flex items-center gap-1 shrink-0">
              <div className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all",
                activo && "bg-gold text-black shadow-sm font-bold",
                completado && "bg-green/15 text-green",
                futuro && "text-subtext0/70"
              )}>
                {completado ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <Circle className={cn("h-3 w-3", activo ? "text-black fill-black/20" : "text-subtext0/50")} />
                )}
                <span className={futuro ? "hidden md:inline" : ""}>{paso.label}</span>
              </div>
              {idx < PASOS.length - 1 && (
                <ChevronRight className={cn("h-3 w-3 shrink-0", completado ? "text-green" : "text-overlay0/40")} />
              )}
            </div>
          );
        })}
      </div>

      {/* Móvil: solo nombre del paso actual */}
      <div className="sm:hidden mt-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gold">{PASOS[pasoActual - 1]?.label}</span>
          <span className="text-xs text-subtext0 font-medium">— {PASOS[pasoActual - 1]?.short}</span>
        </div>
      </div>
    </div>
  );
}
