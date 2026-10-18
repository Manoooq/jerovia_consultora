"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { QuestionnaireShell } from "@/components/QuestionnaireShell";
import { ProgressBar } from "@/components/ProgressBar";
import { InterviewModeProvider } from "@/components/InterviewModeContext";
import { Paso1Personal } from "@/components/wizard/Paso1Personal";
import { Paso2Academico } from "@/components/wizard/Paso2Academico";
import { Paso3Laboral } from "@/components/wizard/Paso3Laboral";
import { Paso4Psicosocial } from "@/components/wizard/Paso4Psicosocial";
import { Paso5Familiar } from "@/components/wizard/Paso5Familiar";
import { Paso6Salud } from "@/components/wizard/Paso6Salud";
import { Paso7Economico } from "@/components/wizard/Paso7Economico";
import { Paso8Vivienda } from "@/components/wizard/Paso8Vivienda";
import { Paso9Observaciones } from "@/components/wizard/Paso9Observaciones";
import type { FormularioCompleto } from "@/lib/validations";
import {
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  ArrowLeft,
  Lock,
} from "lucide-react";

interface StoredDraft {
  paso: number;
  maxPaso: number;
  completado: boolean;
  datos: Partial<FormularioCompleto>;
  updatedAt: number;
}

function isFilled(v: unknown): boolean {
  if (v === undefined || v === null || v === "") return false;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

function countNonEmpty(obj?: Record<string, unknown>): number {
  if (!obj) return 0;
  return Object.entries(obj).filter(([k, v]) => !k.startsWith("_") && isFilled(v)).length;
}

function mergeClientServerDatos(
  localDatos: Partial<FormularioCompleto>,
  serverDatos: Partial<FormularioCompleto>
): Partial<FormularioCompleto> {
  const localCount = countNonEmpty(localDatos as Record<string, unknown>);
  const serverCount = countNonEmpty(serverDatos as Record<string, unknown>);

  const base = serverCount >= localCount ? localDatos : serverDatos;
  const top = serverCount >= localCount ? serverDatos : localDatos;

  const merged: Record<string, unknown> = { ...(base || {}) };
  for (const [k, val] of Object.entries(top || {})) {
    if (isFilled(val)) {
      merged[k] = val;
    }
  }
  for (const [k, val] of Object.entries(base || {})) {
    if (!isFilled(merged[k]) && isFilled(val)) {
      merged[k] = val;
    }
  }
  return merged as Partial<FormularioCompleto>;
}

function EntrevistaWizardContent() {
  const params = useParams<{ token: string }>();
  const rawToken = Array.isArray(params?.token)
    ? params.token[0]
    : params?.token || "demo";
  const token = (() => {
    try {
      return decodeURIComponent(rawToken);
    } catch {
      return rawToken;
    }
  })();

  const storageKey = `jerovia_draft_v5_${token}`;

  const [loading, setLoading] = useState(true);
  const [dataVersion, setDataVersion] = useState(1);
  const [isEvaluator, setIsEvaluator] = useState(false);
  const [prefilledList, setPrefilledList] = useState<string[]>([]);
  const [paso, setPaso] = useState(1);
  const [maxPasoAlcanzado, setMaxPasoAlcanzado] = useState(1);
  const [entidadSolicitante, setEntidadSolicitante] = useState(
    "Banco Continental"
  );
  const [candidatoNombre, setCandidatoNombre] = useState<string | undefined>();
  const [evaluadorAsignado, setEvaluadorAsignado] = useState<
    string | undefined
  >("Lic. Michelle Romero");
  const [datos, setDatos] = useState<Partial<FormularioCompleto>>({});
  const [completado, setCompletado] = useState(false);

  const datosRef = useRef<Partial<FormularioCompleto>>({});

  useEffect(() => {
    datosRef.current = datos;
  }, [datos]);

  const totalSteps: 8 | 9 = isEvaluator ? 9 : 8;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    const resetScroll = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    resetScroll();
    const rafId = requestAnimationFrame(resetScroll);
    const timerId = setTimeout(resetScroll, 60);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [paso, completado]);

  const saveLocalDraft = useCallback(
    (
      nextDatos: Partial<FormularioCompleto>,
      nextPaso: number,
      nextMaxPaso: number,
      isDone = false
    ) => {
      try {
        const draft: StoredDraft = {
          paso: nextPaso,
          maxPaso: nextMaxPaso,
          completado: isDone,
          datos: nextDatos,
          updatedAt: Date.now(),
        };
        localStorage.setItem(storageKey, JSON.stringify(draft));
      } catch {}
    },
    [storageKey]
  );

  const syncWithServer = useCallback(
    async (
      nextDatos: Partial<FormularioCompleto>,
      nextPaso: number,
      estado: "pendiente" | "en_progreso" | "revision" | "completado" = "en_progreso",
      extraFlags?: { candidateActive?: boolean; _forceEstado?: boolean }
    ) => {
      const payloadStr = JSON.stringify({
        pasoActual: nextPaso,
        estado,
        datos: nextDatos,
        ...extraFlags,
      });

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const res = await fetch(
            `/api/entrevista/${encodeURIComponent(token)}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: payloadStr,
            }
          );
          if (res.ok) {
            const serverUpdated = await res.json().catch(() => null);
            if (serverUpdated?.datos) {
              const merged = mergeClientServerDatos(
                nextDatos,
                serverUpdated.datos
              );
              datosRef.current = merged;
              setDatos(merged);
            }
            return;
          }
        } catch {}
        await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
      }
    },
    [token]
  );

  useEffect(() => {
    let mounted = true;

    async function init() {
      let localDraft: StoredDraft | null = null;
      try {
        const raw =
          localStorage.getItem(storageKey) ||
          localStorage.getItem(`jerovia_draft_v4_${token}`) ||
          localStorage.getItem(`jerovia_draft_v3_${token}`);
        if (raw) {
          localDraft = JSON.parse(raw) as StoredDraft;
        }
      } catch {}

      try {
        const [meRes, entRes] = await Promise.all([
          fetch("/api/auth/me", { cache: "no-store" }).catch(() => null),
          fetch(
            `/api/entrevista/${encodeURIComponent(token)}?_t=${Date.now()}`,
            { cache: "no-store" }
          ).catch(() => null),
        ]);

        let evalRole = false;
        if (meRes && meRes.ok) {
          const meData = await meRes.json().catch(() => null);
          if (meData?.authenticated) {
            evalRole = true;
          }
        }
        if (mounted) setIsEvaluator(evalRole);

        if (entRes && entRes.ok) {
          const serverRecord = await entRes.json();
          if (!mounted) return;

          setEntidadSolicitante(
            serverRecord.entidadSolicitante || "Banco Continental"
          );
          setCandidatoNombre(serverRecord.candidatoNombre);
          setEvaluadorAsignado(
            serverRecord.evaluadorAsignado || "Lic. Michelle Romero"
          );

          if (Array.isArray(serverRecord.camposPrellenados)) {
            setPrefilledList(serverRecord.camposPrellenados);
          }

          const serverDatos = (serverRecord.datos ||
            {}) as Partial<FormularioCompleto>;
          const localDatos = localDraft?.datos || {};

          const mergedDatos = evalRole
            ? mergeClientServerDatos(localDatos, serverDatos)
            : mergeClientServerDatos(serverDatos, localDatos);

          const isCandidateFinished =
            serverRecord.estado === "completado" ||
            serverRecord.estado === "revision" ||
            (!evalRole && Boolean(localDraft?.completado));

          const maxAllowed = evalRole ? 9 : 8;
          const serverPaso = Math.min(
            maxAllowed,
            serverRecord.pasoActual || 1
          );

          // Si es el evaluador y el postulante ya terminó (estado 'revision' o 'completado'), abrir directo en el Paso 9
          const bestPaso = evalRole
            ? serverRecord.estado === "completado" ||
              serverRecord.estado === "revision" ||
              serverPaso >= 8
              ? 9
              : serverPaso
            : Math.min(maxAllowed, Math.max(localDraft?.paso || 1, serverPaso));

          const bestMaxPaso = Math.min(
            maxAllowed,
            Math.max(
              localDraft?.maxPaso || 1,
              bestPaso,
              serverPaso,
              isCandidateFinished ? maxAllowed : 1
            )
          );

          saveLocalDraft(
            mergedDatos,
            bestPaso,
            bestMaxPaso,
            isCandidateFinished
          );

          datosRef.current = mergedDatos;
          setDatos(mergedDatos);
          setPaso(bestPaso);
          setMaxPasoAlcanzado(bestMaxPaso);
          setDataVersion((v) => v + 1);

          if (isCandidateFinished && !evalRole && token !== "demo") {
            setCompletado(true);
          }

          // Si es el postulante abriendo un formulario activo, registrar pulso en vivo ("Rellenando ahora")
          if (!evalRole && !isCandidateFinished && token !== "demo") {
            void syncWithServer(mergedDatos, bestPaso, "en_progreso", {
              candidateActive: true,
            });
          } else if (
            !evalRole &&
            countNonEmpty(mergedDatos as Record<string, unknown>) >
              countNonEmpty(serverDatos as Record<string, unknown>)
          ) {
            void syncWithServer(
              mergedDatos,
              isCandidateFinished ? 8 : bestPaso,
              isCandidateFinished ? "revision" : "en_progreso"
            );
          }
        } else if (localDraft && mounted) {
          datosRef.current = localDraft.datos;
          setDatos(localDraft.datos);
          setDataVersion((v) => v + 1);
          if (localDraft.completado && !evalRole && token !== "demo") {
            setCompletado(true);
          } else {
            setPaso(Math.min(evalRole ? 9 : 8, localDraft.paso));
            setMaxPasoAlcanzado(
              Math.min(evalRole ? 9 : 8, localDraft.maxPaso)
            );
          }
        }
      } catch {
        if (localDraft && mounted) {
          datosRef.current = localDraft.datos;
          setDatos(localDraft.datos);
          setDataVersion((v) => v + 1);
          if (localDraft.completado && token !== "demo") {
            setCompletado(true);
          } else {
            setPaso(localDraft.paso || 1);
            setMaxPasoAlcanzado(localDraft.maxPaso || 1);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void init();
    return () => {
      mounted = false;
    };
  }, [token, storageKey, saveLocalDraft, syncWithServer]);

  // Pulso en vivo (Heartbeat) cada 25 segundos mientras el postulante tiene abierto el formulario
  useEffect(() => {
    if (loading || completado || isEvaluator || token === "demo") return;

    const sendHeartbeat = () => {
      if (document.hidden) return;
      void fetch(`/api/entrevista/${encodeURIComponent(token)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pasoActual: Math.max(paso, maxPasoAlcanzado),
          estado: "en_progreso",
          candidateActive: true,
        }),
      }).catch(() => {});
    };

    const intervalId = setInterval(sendHeartbeat, 25_000);
    return () => clearInterval(intervalId);
  }, [loading, completado, isEvaluator, token, paso, maxPasoAlcanzado]);

  function handleNextStep(stepData: Partial<FormularioCompleto>) {
    const merged = mergeClientServerDatos(datosRef.current, stepData);
    datosRef.current = merged;

    const fullNombre = [merged.nombre, merged.apellido]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (fullNombre) setCandidatoNombre(fullNombre);

    // Cuando el postulante termina el Paso 8, pasa a 'revision' ("Listo para el Evaluador")
    if (!isEvaluator && paso === 8) {
      setDatos(merged);
      setCompletado(true);
      saveLocalDraft(merged, 8, 8, true);
      void syncWithServer(merged, 8, "revision", { candidateActive: false });
      return;
    }

    const nextPaso = Math.min(totalSteps, paso + 1);
    const nextMax = Math.max(maxPasoAlcanzado, nextPaso);

    setDatos(merged);
    setPaso(nextPaso);
    setMaxPasoAlcanzado(nextMax);
    setDataVersion((v) => v + 1);

    saveLocalDraft(merged, nextPaso, nextMax, false);
    void syncWithServer(merged, nextMax, "en_progreso", {
      candidateActive: !isEvaluator,
    });
  }

  function handleBackStep() {
    const prevPaso = Math.max(1, paso - 1);
    setPaso(prevPaso);
    setDataVersion((v) => v + 1);
    saveLocalDraft(datosRef.current, prevPaso, maxPasoAlcanzado, false);
  }

  async function handleAutoSavePartial(partial: Record<string, unknown>) {
    const merged = {
      ...datosRef.current,
      ...partial,
    } as Partial<FormularioCompleto>;
    datosRef.current = merged;
    setDatos(merged);
    saveLocalDraft(merged, paso, maxPasoAlcanzado, completado);
    await syncWithServer(
      merged,
      Math.max(paso, maxPasoAlcanzado),
      completado ? "completado" : "en_progreso",
      { candidateActive: !isEvaluator }
    );
  }

  // Cuando el Evaluador completa y guarda el Paso 9, pasa a 'completado' ("Finalizado")
  async function handleCompleteEvaluator(
    step9Data: Partial<FormularioCompleto>
  ) {
    const merged = {
      ...datosRef.current,
      ...step9Data,
    } as Partial<FormularioCompleto>;
    datosRef.current = merged;
    setDatos(merged);
    setCompletado(true);
    saveLocalDraft(merged, 9, 9, true);
    await syncWithServer(merged, 9, "completado", { _forceEstado: true });
  }

  if (loading) {
    return (
      <QuestionnaireShell
        entidadSolicitante={entidadSolicitante}
        isEvaluator={isEvaluator}
      >
        <div className="py-16 text-center space-y-3">
          <div className="h-10 w-10 rounded-full border-3 border-gold border-t-transparent animate-spin mx-auto" />
          <p className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-subtext1">
            Sincronizando expediente...
          </p>
        </div>
      </QuestionnaireShell>
    );
  }

  if (completado) {
    return (
      <QuestionnaireShell
        entidadSolicitante={entidadSolicitante}
        candidatoNombre={candidatoNombre}
        evaluadorAsignado={evaluadorAsignado}
        isEvaluator={isEvaluator}
      >
        <div className="py-10 text-center space-y-6">
          <div className="h-16 w-16 rounded-2xl bg-[#536c45]/15 border border-[#536c45]/40 text-gold flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold">
              {isEvaluator
                ? "EXPEDIENTE FINALIZADO Y HOMOLOGADO"
                : "FORMULARIO ENVIADO AL EVALUADOR"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-text">
              ¡Muchas gracias{candidatoNombre ? `, ${candidatoNombre}` : ""}!
            </h2>
            <p className="text-sm sm:text-base text-subtext1 max-w-md mx-auto leading-relaxed">
              {isEvaluator
                ? "El dictamen pericial ha sido archivado como finalizado y está listo para exportar."
                : "Sus respuestas fueron enviadas correctamente al equipo evaluador de Jerovia Consultora."}
            </p>
          </div>

          {!isEvaluator && (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface1 border border-overlay1 text-xs sm:text-sm font-bold text-subtext1">
              <Lock className="h-4 w-4 text-gold" />
              <span>
                El cuestionario se encuentra cerrado y ya fue remitido para revisión del evaluador.
              </span>
            </div>
          )}

          {isEvaluator && (
            <>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={`/api/exportar/${encodeURIComponent(token)}?formato=pdf&v=${dataVersion}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[46px] px-5 rounded-xl bg-gold text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm"
                >
                  <FileText className="h-4 w-4" />
                  <span>Abrir Informe en 5 Páginas (PDF)</span>
                </a>

                <a
                  href={`/api/exportar/${encodeURIComponent(token)}?formato=pptx&v=${dataVersion}`}
                  className="min-h-[46px] px-5 rounded-xl border border-overlay1 bg-surface1 hover:border-gold text-text font-bold text-xs sm:text-sm inline-flex items-center gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4 text-gold" />
                  <span>Descargar PowerPoint (.PPTX)</span>
                </a>
              </div>

              <div className="pt-4 border-t border-overlay0 flex items-center justify-center gap-6 text-xs sm:text-sm font-bold">
                <button
                  type="button"
                  onClick={() => setCompletado(false)}
                  className="text-subtext1 hover:text-gold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Volver a editar expediente (Modo Evaluador)</span>
                </button>
                <Link href="/dashboard" className="text-gold hover:underline">
                  Ir al Panel General →
                </Link>
              </div>
            </>
          )}
        </div>
      </QuestionnaireShell>
    );
  }

  return (
    <InterviewModeProvider
      isEvaluator={isEvaluator}
      prefilledList={prefilledList}
    >
      <QuestionnaireShell
        entidadSolicitante={entidadSolicitante}
        candidatoNombre={candidatoNombre}
        evaluadorAsignado={evaluadorAsignado}
        isEvaluator={isEvaluator}
      >
        <div className="space-y-6">
          <ProgressBar
            currentStep={paso}
            maxReachedStep={maxPasoAlcanzado}
            totalSteps={totalSteps}
            onStepSelect={(targetStep) => {
              setPaso(targetStep);
              setDataVersion((v) => v + 1);
              saveLocalDraft(
                datosRef.current,
                targetStep,
                maxPasoAlcanzado,
                false
              );
            }}
          />

          {paso === 1 && (
            <Paso1Personal
              key={`p1-${dataVersion}`}
              defaultValues={datos}
              onNext={handleNextStep}
            />
          )}
          {paso === 2 && (
            <Paso2Academico
              key={`p2-${dataVersion}`}
              defaultValues={datos}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
          {paso === 3 && (
            <Paso3Laboral
              key={`p3-${dataVersion}`}
              defaultValues={datos}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
          {paso === 4 && (
            <Paso4Psicosocial
              key={`p4-${dataVersion}`}
              defaultValues={datos}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
          {paso === 5 && (
            <Paso5Familiar
              key={`p5-${dataVersion}`}
              defaultValues={datos}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
          {paso === 6 && (
            <Paso6Salud
              key={`p6-${dataVersion}`}
              defaultValues={datos}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
          {paso === 7 && (
            <Paso7Economico
              key={`p7-${dataVersion}`}
              defaultValues={datos}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
          {paso === 8 && (
            <Paso8Vivienda
              key={`p8-${dataVersion}`}
              defaultValues={datos}
              onAutoSave={handleAutoSavePartial}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
          {isEvaluator && paso === 9 && (
            <Paso9Observaciones
              key={`p9-${dataVersion}`}
              defaultValues={datos}
              allData={datos as Record<string, unknown>}
              token={token}
              onAutoSave={handleAutoSavePartial}
              onComplete={handleCompleteEvaluator}
              onBack={handleBackStep}
            />
          )}
        </div>
      </QuestionnaireShell>
    </InterviewModeProvider>
  );
}

export default function EntrevistaWizardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-base" />}>
      <EntrevistaWizardContent />
    </Suspense>
  );
}
