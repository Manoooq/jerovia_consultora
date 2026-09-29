"use client";

import { useState, useEffect } from "react";
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
import { CheckCircle, AlertTriangle } from "lucide-react";

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
    } catch { /* silent fail, los datos están en estado local */ }
    setGuardando(false);
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
      } catch { /* non-blocking */ }
    }

    const siguiente = Math.min(paso + 1, 9);
    await guardar(merged, siguiente);

    if (paso < 9) {
      setPaso(siguiente);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    setPaso((p) => Math.max(p - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (completado) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 p-8"
      >
        <div className="h-20 w-20 rounded-3xl bg-green/10 border border-green/20 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-text mb-2">Entrevista completada</h2>
          <p className="text-subtext1 max-w-md">
            Gracias por completar todos los pasos. La consultora revisará la información y se pondrá en contacto contigo.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <a
            href={`/api/exportar/${token}?formato=pptx`}
            className="flex items-center gap-2 rounded-xl bg-gold hover:bg-gold-light text-black font-bold px-6 py-3 text-sm transition-all shadow-lg shadow-gold/20"
          >
            📊 Descargar Presentación (.PPTX)
          </a>
          <a
            href={`/api/exportar/${token}?formato=pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-overlay0 bg-surface1 text-text hover:bg-surface2 font-semibold px-6 py-3 text-sm transition-all"
          >
            📄 Ver / Imprimir Informe (.PDF)
          </a>
        </div>
      </motion.div>
    );
  }

  const pasosProps = { defaultValues: data, onNext: handleStepComplete, onPrev: handlePrev };

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de progreso */}
      <ProgressBar pasoActual={paso} />

      {/* Alerta de guardado */}
      {guardando && (
        <p className="text-xs text-subtext0 animate-pulse">💾 Guardando automáticamente...</p>
      )}

      {/* Alertas de inconsistencias */}
      {alertas.length > 0 && (
        <div className="rounded-2xl border border-yellow/20 bg-yellow/5 p-4 flex flex-col gap-2">
          {alertas.map((a, i) => (
            <div key={i} className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow shrink-0 mt-0.5" />
              <p className="text-sm text-yellow">{a}</p>
            </div>
          ))}
        </div>
      )}

      {/* Paso activo */}
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
    </div>
  );
}
