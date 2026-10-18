"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
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

function countNonEmpty(obj?: Record<string, unknown>): number {
  if (!obj) return 0;
  return Object.entries(obj).filter(([, v]) => {
    if (v === undefined || v === null || v === "") return false;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  }).length;
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
      estado: "en_progreso" | "completado" = "en_progreso"
    ) => {
      try {
        await fetch(`/api/entrevista/${encodeURIComponent(token)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pasoActual: nextPaso,
            estado,
            datos: nextDatos,
          }),
        });
      } catch {}
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

          // Fusión estricta: jamás perder un campo no vacío ni del servidor ni del navegador
          const mergedDatos: Partial<FormularioCompleto> = {
            ...serverDatos,
          };
          for (const [k, val] of Object.entries(localDatos)) {
            const isLocalFilled =
              val !== undefined &&
              val !== null &&
              val !== "" &&
              (!Array.isArray(val) || val.length > 0);
            if (isLocalFilled) {
              (mergedDatos as Record<string, unknown>)[k] = val;
            }
          }
          for (const [k, val] of Object.entries(serverDatos)) {
            const isServerFilled =
              val !== undefined &&
              val !== null &&
              val !== "" &&
              (!Array.isArray(val) || val.length > 0);
            if (isServerFilled) {
              (mergedDatos as Record<string, unknown>)[k] = val;
            }
          }

          const isAlreadyCompleted =
            serverRecord.estado === "completado" ||
            Boolean(localDraft?.completado);

          const maxAllowed = evalRole ? 9 : 8;
          const bestPaso = Math.min(
            maxAllowed,
            Math.max(localDraft?.paso || 1, serverRecord.pasoActual || 1)
          );
          const bestMaxPaso = Math.min(
            maxAllowed,
            Math.max(
              localDraft?.maxPaso || 1,
              bestPaso,
              isAlreadyCompleted ? maxAllowed : 1
            )
          );

          // GUARDAR INMEDIATAMENTE EN LOCALSTORAGE para que al cerrar y abrir jamás vuelva a salir vacío
          saveLocalDraft(
            mergedDatos,
            bestPaso,
            bestMaxPaso,
            isAlreadyCompleted
          );

          setDatos(mergedDatos);
          setPaso(bestPaso);
          setMaxPasoAlcanzado(bestMaxPaso);
          setDataVersion((v) => v + 1);

          if (isAlreadyCompleted && !evalRole && token !== "demo") {
            setCompletado(true);
          }

          // Si nuestro navegador tenía más campos que el servidor, curar el servidor automáticamente
          if (
            countNonEmpty(mergedDatos as Record<string, unknown>) >
            countNonEmpty(serverDatos as Record<string, unknown>)
          ) {
            syncWithServer(
              mergedDatos,
              isAlreadyCompleted ? 9 : bestPaso,
              isAlreadyCompleted ? "completado" : "en_progreso"
            );
          }
        } else if (localDraft && mounted) {
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

    init();
    return () => {
      mounted = false;
    };
  }, [token, storageKey, saveLocalDraft, syncWithServer]);

  function handleNextStep(stepData: Partial<FormularioCompleto>) {
    const merged = { ...datos, ...stepData };
    const fullNombre = [merged.nombre, merged.apellido]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (fullNombre) setCandidatoNombre(fullNombre);

    if (!isEvaluator && paso === 8) {
      setDatos(merged);
      setCompletado(true);
      saveLocalDraft(merged, 9, 9, true);
      syncWithServer(merged, 9, "completado");
      return;
    }

    const nextPaso = Math.min(totalSteps, paso + 1);
    const nextMax = Math.max(maxPasoAlcanzado, nextPaso);

    setDatos(merged);
    setPaso(nextPaso);
    setMaxPasoAlcanzado(nextMax);
    setDataVersion((v) => v + 1);

    saveLocalDraft(merged, nextPaso, nextMax, false);
    syncWithServer(merged, nextPaso, "en_progreso");
  }

  function handleBackStep() {
    const prevPaso = Math.max(1, paso - 1);
    setPaso(prevPaso);
    setDataVersion((v) => v + 1);
    saveLocalDraft(datos, prevPaso, maxPasoAlcanzado, false);
  }

  async function handleAutoSavePartial(partial: Record<string, unknown>) {
    const merged = { ...datos, ...partial };
    setDatos(merged);
    saveLocalDraft(merged, paso, maxPasoAlcanzado, completado);
    await syncWithServer(
      merged,
      paso,
      completado ? "completado" : "en_progreso"
    );
  }

  async function handleCompleteEvaluator(
    step9Data: Partial<FormularioCompleto>
  ) {
    const merged = { ...datos, ...step9Data };
    setDatos(merged);
    setCompletado(true);
    saveLocalDraft(merged, 9, 9, true);
    await syncWithServer(merged, 9, "completado");
  }

  if (loading) {
    return (
      <QuestionnaireShell
        entidadSolicitante={entidadSolicitante}
        isEvaluator={isEvaluator}
      >
        <div className="py-16 text-center space-y-3">
          <div className="h-10 w-10 rounded-full border-3 border-gold border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-subtext1">
            Cargando formulario...
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
              FORMULARIO FINALIZADO Y CERRADO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-text">
              ¡Muchas gracias{candidatoNombre ? `, ${candidatoNombre}` : ""}!
            </h2>
            <p className="text-xs sm:text-sm text-subtext1 max-w-md mx-auto leading-relaxed">
              Sus datos ya fueron enviados y registrados de forma definitiva en el sistema de Jerovia Consultora.
            </p>
          </div>

          {!isEvaluator && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface1 border border-overlay1 text-xs font-bold text-subtext1">
              <Lock className="h-3.5 w-3.5 text-gold" />
              <span>
                El cuestionario se encuentra cerrado y ya no admite modificaciones.
              </span>
            </div>
          )}

          {isEvaluator && (
            <>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={`/api/exportar/${encodeURIComponent(token)}?formato=pdf&t=${Date.now()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-5 rounded-xl bg-gold text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm"
                >
                  <FileText className="h-4 w-4" />
                  <span>Abrir Informe en 5 Páginas (PDF)</span>
                </a>

                <a
                  href={`/api/exportar/${encodeURIComponent(token)}?formato=pptx&t=${Date.now()}`}
                  className="min-h-[44px] px-5 rounded-xl border border-overlay1 bg-surface1 hover:border-gold text-text font-bold text-xs inline-flex items-center gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4 text-gold" />
                  <span>Descargar PowerPoint (.PPTX)</span>
                </a>
              </div>

              <div className="pt-4 border-t border-overlay0 flex items-center justify-center gap-6 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCompletado(false)}
                  className="text-subtext1 hover:text-gold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
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
              saveLocalDraft(datos, targetStep, maxPasoAlcanzado, false);
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
