"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ProgressBar } from "@/components/ProgressBar";
import { Paso1Personal } from "@/components/wizard/Paso1_Personal";
import { Paso2Academico } from "@/components/wizard/Paso2_Academico";
import { Paso3_Laboral } from "@/components/wizard/Paso3_Laboral";
import { Paso4_Psicosocial } from "@/components/wizard/Paso4_Psicosocial";
import { Paso5_Familiar } from "@/components/wizard/Paso5_Familiar";
import { Paso6_Salud } from "@/components/wizard/Paso6_Salud";
import { Paso7_Economico } from "@/components/wizard/Paso7_Economico";
import { Paso8_Vivienda } from "@/components/wizard/Paso8_Vivienda";
import { Paso9_Conclusion } from "@/components/wizard/Paso9_Conclusion";
import type { FormularioCompleto } from "@/lib/validations";
import {
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  LayoutDashboard,
  CloudUpload,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardProps {
  token: string;
  initialData?: Partial<FormularioCompleto>;
  initialPaso?: number;
}

export function Wizard({ token, initialData = {}, initialPaso = 1 }: WizardProps) {
  const storageKey = `jerovia_draft_${token}`;

  const [paso, setPaso] = useState(initialPaso);
  const [maxPaso, setMaxPaso] = useState(initialPaso);
  const [data, setData] = useState<Partial<FormularioCompleto>>(initialData);
  const [alertas, setAlertas] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [pendienteSync, setPendienteSync] = useState(false);
  const [completado, setCompletado] = useState(false);

  // Recuperar borrador local si el perito recargó la página o tuvo microcorte de señal
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.datos === "object") {
          setData((prev) => ({ ...prev, ...parsed.datos }));
          if (typeof parsed.maxPaso === "number" && parsed.maxPaso > initialPaso) {
            setMaxPaso(parsed.maxPaso);
          }
        }
      }
    } catch {
      // Ignorar si localStorage está bloqueado
    }
  }, [storageKey, initialPaso]);

  // Función de guardado resiliente (Local + Servidor)
  const sincronizarConServidor = useCallback(
    async (
      nuevaData: Partial<FormularioCompleto>,
      nuevoPaso: number,
      nuevoEstado?: "pendiente" | "en_progreso" | "completado"
    ) => {
      const nuevoMax = Math.max(maxPaso, nuevoPaso);

      // 1. Respaldo inmediato en el dispositivo móvil / PC
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            datos: nuevaData,
            pasoActual: nuevoPaso,
            maxPaso: nuevoMax,
            updatedAt: new Date().toISOString(),
          })
        );
      } catch {
        // Ignorar cuota excedida
      }

      // 2. Envío al servidor
      setGuardando(true);
      try {
        const estadoCalculado =
          nuevoEstado || (nuevoPaso > 1 ? "en_progreso" : "pendiente");

        const res = await fetch(`/api/entrevista/${token}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            datos: nuevaData,
            pasoActual: nuevoPaso,
            estado: estadoCalculado,
          }),
        });

        if (!res.ok) throw new Error("Sync error");
        setPendienteSync(false);
      } catch {
        setPendienteSync(true);
      } finally {
        setGuardando(false);
      }
    },
    [maxPaso, storageKey, token]
  );

  // Reintentar sincronización automáticamente cuando vuelve internet en el celular
  useEffect(() => {
    function handleOnline() {
      if (pendienteSync) {
        sincronizarConServidor(data, paso);
      }
    }
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [pendienteSync, data, paso, sincronizarConServidor]);

  async function handleStepComplete(stepData: Partial<FormularioCompleto>) {
    const merged = { ...data, ...stepData };
    setData(merged);

    // Cruce automático de inconsistencias financieras al completar el módulo económico (7)
    if (paso === 7) {
      fetch("/api/ai/inconsistencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((resData) => {
          if (resData?.alertas && Array.isArray(resData.alertas)) {
            setAlertas(resData.alertas);
          }
        })
        .catch(() => {});
    }

    if (paso < 9) {
      const siguiente = paso + 1;
      setPaso(siguiente);
      setMaxPaso((prev) => Math.max(prev, siguiente));
      window.scrollTo({ top: 0, behavior: "smooth" });
      await sincronizarConServidor(merged, siguiente, "en_progreso");
    } else {
      await sincronizarConServidor(merged, 9, "completado");
      try {
        localStorage.removeItem(storageKey);
      } catch {}
      setCompletado(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handlePrev() {
    const anterior = Math.max(paso - 1, 1);
    setPaso(anterior);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleJumpToStep(targetStep: number) {
    if (targetStep >= 1 && targetStep <= Math.max(paso, maxPaso)) {
      setPaso(targetStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (completado) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[46vh] text-center gap-6 py-6 px-2 sm:px-6"
      >
        <div className="h-14 w-14 rounded-2xl bg-green/15 border border-green/30 flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-green" aria-hidden="true" />
        </div>

        <div className="space-y-2 max-w-lg">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold">
            EXPEDIENTE FINALIZADO Y ARCHIVADO
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
            Relevamiento Socioambiental Completado
          </h2>
          <p className="text-xs sm:text-sm text-subtext0 leading-relaxed">
            Los datos recabados en los 9 módulos han sido verificados y almacenados. Puede descargar inmediatamente la presentación para comité o el legajo documental.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md pt-2">
          <a
            href={`/api/exportar/${token}?formato=pptx`}
            className="min-h-[46px] flex items-center justify-center gap-2 rounded-xl bg-gold hover:bg-gold-light text-black font-bold px-5 py-3 text-xs sm:text-sm transition-all shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Descargar 5 Láminas (.PPTX)</span>
          </a>
          <a
            href={`/api/exportar/${token}?formato=pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[46px] flex items-center justify-center gap-2 rounded-xl border border-overlay1 bg-surface1 text-text hover:border-gold font-semibold px-5 py-3 text-xs sm:text-sm transition-all"
          >
            <FileText className="h-4 w-4 text-gold shrink-0" aria-hidden="true" />
            <span>Abrir Dictamen PDF</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-overlay0/50 w-full max-w-md text-xs">
          <button
            type="button"
            onClick={() => setCompletado(false)}
            className="inline-flex items-center gap-1.5 text-subtext1 hover:text-text font-semibold cursor-pointer py-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5 text-gold" />
            <span>Revisar o corregir respuestas</span>
          </button>
          <span className="text-overlay2">•</span>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-subtext1 hover:text-text font-semibold py-1.5"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-gold" />
            <span>Volver al Panel de Expedientes</span>
          </Link>
        </div>
      </motion.div>
    );
  }

  const pasosProps = {
    defaultValues: data,
    onNext: handleStepComplete,
    onPrev: handlePrev,
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6" aria-busy={guardando}>
      <div role="status" aria-live="polite" className="sr-only">
        {guardando
          ? "Guardando progreso..."
          : `Módulo ${paso} de 9 activo.`}
      </div>

      {/* Barra de progreso interactiva */}
      <ProgressBar
        pasoActual={paso}
        maxPasoAlcanzado={maxPaso}
        onStepSelect={handleJumpToStep}
      />

      {/* Indicador de sincronización limpio y discreto */}
      <div className="flex items-center justify-between text-[11px] text-subtext0 border-b border-overlay0/40 pb-3">
        <span className="flex items-center gap-1.5 font-medium">
          {guardando ? (
            <>
              <CloudUpload className="h-3.5 w-3.5 text-gold animate-pulse" aria-hidden="true" />
              <span>Guardando cambios...</span>
            </>
          ) : pendienteSync ? (
            <>
              <span className="h-2 w-2 rounded-full bg-yellow" aria-hidden="true" />
              <span className="text-yellow">Respaldado en este dispositivo (esperando red)</span>
            </>
          ) : (
            <>
              <Check className="h-3.5 w-3.5 text-green" aria-hidden="true" />
              <span>Progreso respaldado automáticamente</span>
            </>
          )}
        </span>

        <span className="font-mono text-[11px] text-subtext0 tabular-nums">
          Paso {paso} de 9
        </span>
      </div>

      {/* Alertas de auditoría financiera (Módulo 7) */}
      {alertas.length > 0 && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-yellow/40 bg-yellow/10 p-4 space-y-1.5"
        >
          <p className="text-xs font-bold text-yellow flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Observaciones de consistencia financiera detectadas:</span>
          </p>
          <ul className="list-disc list-inside text-xs text-text space-y-1 pl-1">
            {alertas.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Transición limpia y sin esqueletos bloqueantes */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={paso}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          {paso === 1 && <Paso1Personal {...pasosProps} />}
          {paso === 2 && <Paso2Academico {...pasosProps} />}
          {paso === 3 && <Paso3_Laboral {...pasosProps} />}
          {paso === 4 && <Paso4_Psicosocial {...pasosProps} />}
          {paso === 5 && <Paso5_Familiar {...pasosProps} />}
          {paso === 6 && <Paso6_Salud {...pasosProps} />}
          {paso === 7 && <Paso7_Economico {...pasosProps} />}
          {paso === 8 && <Paso8_Vivienda {...pasosProps} />}
          {paso === 9 && <Paso9_Conclusion {...pasosProps} data={data} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
