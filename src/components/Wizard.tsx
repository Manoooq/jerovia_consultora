"use client";

import { useState } from "react";
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
import { WizardStepSkeleton } from "@/components/ui/Skeleton";
import type { FormularioCompleto } from "@/lib/validations";
import { CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardProps {
  token: string;
  initialData?: Partial<FormularioCompleto>;
  initialPaso?: number;
}

export function Wizard({ token, initialData = {}, initialPaso = 1 }: WizardProps) {
  const [paso, setPaso] = useState(initialPaso);
  const [data, setData] = useState<Partial<FormularioCompleto>>(initialData);
  const [alertas, setAlertas] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [cambiandoPaso, setCambiandoPaso] = useState(false);
  const [completado, setCompletado] = useState(false);

  // Guardado automático al cambiar de paso
  async function guardar(nuevaData: Partial<FormularioCompleto>, nuevoPaso: number) {
    setGuardando(true);
    try {
      await fetch(`/api/entrevista/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datos: nuevaData, pasoActual: nuevoPaso }),
      });
    } catch {
      /* non-blocking */
    } finally {
      setGuardando(false);
    }
  }

  async function handleStepComplete(stepData: Partial<FormularioCompleto>) {
    const merged = { ...data, ...stepData };
    setData(merged);

    // Verificar inconsistencias en paso 7 (economía)
    if (paso === 7) {
      try {
        const res = await fetch("/api/ai/inconsistencias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(merged),
        });
        const { alertas: nuevasAlertas } = await res.json();
        setAlertas(nuevasAlertas);
      } catch {
        /* non-blocking */
      }
    }

    const siguiente = Math.min(paso + 1, 9);
    await guardar(merged, siguiente);

    if (paso < 9) {
      setCambiandoPaso(true);
      setTimeout(() => {
        setPaso(siguiente);
        setCambiandoPaso(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 150);
    } else {
      // Completar entrevista
      await fetch(`/api/entrevista/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datos: merged, estado: "completado", pasoActual: 9 }),
      });
      setCompletado(true);
    }
  }

  function handlePrev() {
    setCambiandoPaso(true);
    setTimeout(() => {
      setPaso((p) => Math.max(p - 1, 1));
      setCambiandoPaso(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 150);
  }

  if (completado) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-6 p-6"
      >
        <div className="h-16 w-16 rounded-3xl bg-green/15 border border-green/30 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-text">Entrevista Socioambiental Completada</h2>
          <p className="text-xs sm:text-sm text-subtext1 max-w-md mx-auto leading-relaxed">
            Todos los datos han sido archivados de forma confidencial. El informe ejecutivo se encuentra generado y listo para auditoría.
          </p>
        </div>

        {/* Ley de Hick: Dos acciones dominantes claras */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-3 w-full max-w-md">
          <a
            href={`/api/exportar/${token}?formato=pptx`}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-xl bg-gold hover:bg-gold-light text-black font-bold px-5 py-3 text-xs sm:text-sm transition-all shadow-lg shadow-gold/20 focus-visible:ring-2 focus-visible:ring-gold"
          >
            📊 Descargar PowerPoint (.PPTX)
          </a>
          <a
            href={`/api/exportar/${token}?formato=pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-xl border border-overlay0 bg-surface1 text-text hover:bg-surface2 font-semibold px-5 py-3 text-xs sm:text-sm transition-all focus-visible:ring-2 focus-visible:ring-gold"
          >
            📄 Ver / Imprimir PDF
          </a>
        </div>
      </motion.div>
    );
  }

  const pasosProps = { defaultValues: data, onNext: handleStepComplete, onPrev: handlePrev };

  return (
    <div className="flex flex-col gap-6" aria-busy={guardando || cambiandoPaso}>
      {/* Live region para lectores de pantalla (Accesibilidad WCAG 4.1.3) */}
      <div role="status" aria-live="polite" className="sr-only">
        {guardando
          ? "Guardando cambios en el servidor..."
          : `Módulo ${paso} de 9 activo. Cambios sincronizados.`}
      </div>

      {/* Barra de progreso */}
      <ProgressBar pasoActual={paso} />

      {/* Estado sutil de sincronización (Ley de Hick: presencia visual mínima sin ruidos) */}
      <div className="flex items-center justify-between text-[11px] text-subtext0 -mt-2 px-1">
        <span className="flex items-center gap-1.5 font-medium">
          <span
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              guardando ? "bg-yellow animate-ping" : "bg-green"
            )}
            aria-hidden="true"
          />
          {guardando ? "Sincronizando datos..." : "Guardado automático activo"}
        </span>
        <span className="hidden sm:flex items-center gap-1 font-semibold text-subtext0">
          <ShieldCheck className="h-3 w-3 text-gold" aria-hidden="true" />
          Confidencial
        </span>
      </div>

      {/* Alertas de inconsistencias económicas (Paso 7) */}
      {alertas.length > 0 && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-2xl border border-yellow/30 bg-yellow/5 p-4 flex flex-col gap-2"
        >
          {alertas.map((a, i) => (
            <div key={i} className="flex items-start gap-2 text-xs font-semibold text-yellow">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-yellow" aria-hidden="true" />
              <p>{a}</p>
            </div>
          ))}
        </div>
      )}

      {/* Paso activo con Skeleton suave durante transición */}
      {cambiandoPaso ? (
        <WizardStepSkeleton />
      ) : (
        <AnimatePresence mode="wait">
          <div key={paso}>
            {paso === 1 && <Paso1Personal {...pasosProps} />}
            {paso === 2 && <Paso2Academico {...pasosProps} />}
            {paso === 3 && <Paso3_Laboral {...pasosProps} />}
            {paso === 4 && <Paso4_Psicosocial {...pasosProps} />}
            {paso === 5 && <Paso5_Familiar {...pasosProps} />}
            {paso === 6 && <Paso6_Salud {...pasosProps} />}
            {paso === 7 && <Paso7_Economico {...pasosProps} />}
            {paso === 8 && <Paso8_Vivienda {...pasosProps} />}
            {paso === 9 && <Paso9_Conclusion {...pasosProps} data={data} />}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
