"use client";

import { useState, useEffect, useCallback, use } from "react";
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
} from "lucide-react";

interface StoredDraft {
  paso: number;
  maxPaso: number;
  completado: boolean;
  datos: Partial<FormularioCompleto>;
  updatedAt: number;
}

export default function EntrevistaWizardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const storageKey = `jerovia_draft_v4_${token}`;

  const [loading, setLoading] = useState(true);
  const [isEvaluator, setIsEvaluator] = useState(false);
  const [prefilledList, setPrefilledList] = useState<string[]>([]);
  const [paso, setPaso] = useState(1);
  const [maxPasoAlcanzado, setMaxPasoAlcanzado] = useState(1);
  const [entidadSolicitante, setEntidadSolicitante] = useState("Entidad Solicitante");
  const [candidatoNombre, setCandidatoNombre] = useState<string | undefined>();
  const [evaluadorAsignado, setEvaluadorAsignado] = useState<string | undefined>(
    "Lic. Michelle Romero"
  );
  const [datos, setDatos] = useState<Partial<FormularioCompleto>>({});
  const [completado, setCompletado] = useState(false);

  const totalSteps: 8 | 9 = isEvaluator ? 9 : 8;

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
        await fetch(`/api/entrevista/${token}`, {
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
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          localDraft = JSON.parse(raw) as StoredDraft;
        }
      } catch {}

      try {
        const [meRes, entRes] = await Promise.all([
          fetch("/api/auth/me").catch(() => null),
          fetch(`/api/entrevista/${token}`).catch(() => null),
        ]);

        let evalRole = false;
        if (meRes && meRes.ok) {
          const meData = await meRes.json();
          if (meData?.authenticated) {
            evalRole = true;
          }
        }
        if (mounted) setIsEvaluator(evalRole);

        if (entRes && entRes.ok) {
          const serverRecord = await entRes.json();
          if (!mounted) return;

          setEntidadSolicitante(
            serverRecord.entidadSolicitante || "Entidad Solicitante"
          );
          setCandidatoNombre(serverRecord.candidatoNombre);
          setEvaluadorAsignado(
            serverRecord.evaluadorAsignado || "Lic. Michelle Romero"
          );

          if (Array.isArray(serverRecord.camposPrellenados)) {
            setPrefilledList(serverRecord.camposPrellenados);
          }

          const serverDatos = (serverRecord.datos || {}) as Partial<FormularioCompleto>;
          const localDatos = localDraft?.datos || {};

          const mergedDatos: Partial<FormularioCompleto> = {
            ...serverDatos,
          };
          Object.entries(localDatos).forEach(([k, val]) => {
            if (val !== undefined && val !== "" && val !== null) {
              (mergedDatos as Record<string, unknown>)[k] = val;
            }
          });

          const maxAllowed = evalRole ? 9 : 8;
          const bestPaso = Math.min(
            maxAllowed,
            Math.max(localDraft?.paso || 1, serverRecord.pasoActual || 1)
          );
          const bestMaxPaso = Math.min(
            maxAllowed,
            Math.max(localDraft?.maxPaso || 1, bestPaso)
          );

          setDatos(mergedDatos);
          setPaso(bestPaso);
          setMaxPasoAlcanzado(bestMaxPaso);

          if (
            localDraft &&
            Object.keys(localDatos).length > Object.keys(serverDatos).length
          ) {
            syncWithServer(mergedDatos, bestPaso, "en_progreso");
          }
        } else if (localDraft && mounted) {
          setDatos(localDraft.datos);
          setPaso(Math.min(evalRole ? 9 : 8, localDraft.paso));
          setMaxPasoAlcanzado(Math.min(evalRole ? 9 : 8, localDraft.maxPaso));
        }
      } catch {
        if (localDraft && mounted) {
          setDatos(localDraft.datos);
          setPaso(localDraft.paso);
          setMaxPasoAlcanzado(localDraft.maxPaso);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, [token, storageKey, syncWithServer]);

  function handleNextStep(stepData: Partial<FormularioCompleto>) {
    const merged = { ...datos, ...stepData };
    const fullNombre = [merged.nombre, merged.apellido]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (fullNombre) setCandidatoNombre(fullNombre);

    // Si es un postulante (!isEvaluator) y está en el Paso 8, al enviar finaliza el formulario sin ver el Paso 9
    if (!isEvaluator && paso === 8) {
      setDatos(merged);
      setCompletado(true);
      saveLocalDraft(merged, 8, 8, true);
      syncWithServer(merged, 8, "en_progreso");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const nextPaso = Math.min(totalSteps, paso + 1);
    const nextMax = Math.max(maxPasoAlcanzado, nextPaso);

    setDatos(merged);
    setPaso(nextPaso);
    setMaxPasoAlcanzado(nextMax);

    saveLocalDraft(merged, nextPaso, nextMax, false);
    syncWithServer(merged, nextPaso, "en_progreso");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBackStep() {
    const prevPaso = Math.max(1, paso - 1);
    setPaso(prevPaso);
    saveLocalDraft(datos, prevPaso, maxPasoAlcanzado, false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCompleteEvaluator(step9Data: Partial<FormularioCompleto>) {
    const merged = { ...datos, ...step9Data };
    setDatos(merged);
    setCompletado(true);
    saveLocalDraft(merged, 9, 9, true);
    syncWithServer(merged, 9, "completado");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        <div className="py-8 text-center space-y-6">
          <div className="h-16 w-16 rounded-2xl bg-[#536c45]/15 border border-[#536c45]/40 text-gold flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold">
              DATOS ENVIADOS CON ÉXITO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-text">
              ¡Muchas gracias{candidatoNombre ? `, ${candidatoNombre}` : ""}!
            </h2>
            <p className="text-xs sm:text-sm text-subtext1 max-w-md mx-auto leading-relaxed">
              Sus datos fueron registrados correctamente en el sistema de Jerovia Consultora.
            </p>
          </div>

          {/* Los botones de descarga de Informe Confidencial solo son visibles para el Evaluador */}
          {isEvaluator && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={`/api/exportar/${token}?formato=pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 rounded-xl bg-gold text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm"
              >
                <FileText className="h-4 w-4" />
                <span>Abrir Informe en 5 Páginas (PDF)</span>
              </a>

              <a
                href={`/api/exportar/${token}?formato=pptx`}
                className="min-h-[44px] px-5 rounded-xl border border-overlay1 bg-surface1 hover:border-gold text-text font-bold text-xs inline-flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4 text-gold" />
                <span>Descargar PowerPoint (.PPTX)</span>
              </a>
            </div>
          )}

          <div className="pt-4 border-t border-overlay0 flex items-center justify-center gap-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCompletado(false)}
              className="text-subtext1 hover:text-gold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Revisar mis respuestas</span>
            </button>
            {isEvaluator && (
              <Link href="/dashboard" className="text-gold hover:underline">
                Volver al Panel →
              </Link>
            )}
          </div>
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
              saveLocalDraft(datos, targetStep, maxPasoAlcanzado, false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />

          {paso === 1 && (
            <Paso1Personal defaultValues={datos} onNext={handleNextStep} />
          )}
          {paso === 2 && (
            <Paso2Academico
              defaultValues={datos}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
          {paso === 3 && (
            <Paso3Laboral
              defaultValues={datos}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
          {paso === 4 && (
            <Paso4Psicosocial
              defaultValues={datos}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
          {paso === 5 && (
            <Paso5Familiar
              defaultValues={datos}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
          {paso === 6 && (
            <Paso6Salud
              defaultValues={datos}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
          {paso === 7 && (
            <Paso7Economico
              defaultValues={datos}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
          {paso === 8 && (
            <Paso8Vivienda
              defaultValues={datos}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
          {isEvaluator && paso === 9 && (
            <Paso9Observaciones
              defaultValues={datos}
              allData={datos as Record<string, unknown>}
              token={token}
              onComplete={handleCompleteEvaluator}
              onBack={handleBackStep}
            />
          )}
        </div>
      </QuestionnaireShell>
    </InterviewModeProvider>
  );
}
