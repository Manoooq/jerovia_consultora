"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso4Schema, Paso4Data } from "@/lib/validations";
import { Input, Textarea, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { AiStepAssistant } from "@/components/AiStepAssistant";
import { Sparkles, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface Props {
  defaultValues: Partial<Paso4Data>;
  onNext: (data: Paso4Data) => void;
  onBack: () => void;
}

export function Paso4Psicosocial({ defaultValues, onNext, onBack }: Props) {
  const [loadingField, setLoadingField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<Paso4Data>({
    resolver: zodResolver(paso4Schema),
    defaultValues: {
      aspectosPositivos: defaultValues.aspectosPositivos || "",
      aspectosMejorar: defaultValues.aspectosMejorar || "",
      visionLargoPlazo: defaultValues.visionLargoPlazo || "",
      expectativasEntidad: defaultValues.expectativasEntidad || "",
      familiaresPoliticos: defaultValues.familiaresPoliticos ?? false,
      familiaresPoliticosDetalle: defaultValues.familiaresPoliticosDetalle || "",
    },
  });

  const esPep = watch("familiaresPoliticos");

  async function mejorarCampo(
    campo: "aspectosPositivos" | "aspectosMejorar" | "visionLargoPlazo"
  ) {
    setLoadingField(campo);
    const actual = (watch(campo) || "").trim();
    const fallback =
      campo === "aspectosPositivos"
        ? "Persona responsable, puntual, honesta y comprometida con el trabajo en equipo"
        : campo === "aspectosMejorar"
        ? "Tendencia a la autoexigencia en el cumplimiento de metas"
        : "Culminar los estudios universitarios, crecer profesionalmente y consolidar patrimonio propio";

    try {
      const res = await fetch("/api/ai/extraer-campos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: actual || fallback,
          modo: "mejorar",
          campo,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.textoMejorado) {
          setValue(campo, data.textoMejorado, { shouldValidate: true });
        }
      }
    } catch {
      setValue(campo, actual || fallback, { shouldValidate: true });
    } finally {
      setLoadingField(null);
    }
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5" noValidate>
      <div className="flex items-center gap-3 border-b border-overlay0 pb-3.5">
        <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
            MÓDULO 04 // PERFIL PERSONAL
          </span>
          <h2 className="text-lg sm:text-xl font-black text-text">
            Cualidades, Logros y Exposición Política
          </h2>
        </div>
      </div>

      <AiStepAssistant
        stepNumber={4}
        stepTitle="Cualidades y Metas"
        placeholder="Dicte sus cualidades y metas personales para redactarlas automáticamente..."
        onApplyFields={(extracted) => {
          Object.entries(extracted).forEach(([k, v]) => {
            if (typeof v === "string" && k !== "_rawAiText") {
              setValue(k as keyof Paso4Data, v as never, { shouldValidate: true });
            }
          });
          if (typeof extracted._rawAiText === "string") {
            setValue("aspectosPositivos", extracted._rawAiText, {
              shouldValidate: true,
            });
          }
        }}
      />

      <div className="space-y-1">
        <Textarea
          label="Aspectos positivos como persona"
          rows={2}
          placeholder="Describa sus principales cualidades"
          {...register("aspectosPositivos")}
        />
        <button
          type="button"
          disabled={loadingField === "aspectosPositivos"}
          onClick={() => mejorarCampo("aspectosPositivos")}
          className="text-[11px] font-bold text-gold hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          {loadingField === "aspectosPositivos" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          <span>Mejorar redacción con IA</span>
        </button>
      </div>

      <div className="space-y-1">
        <Textarea
          label="Actitud a mejorar"
          rows={2}
          placeholder="Indique un aspecto o actitud que considere que puede mejorar"
          {...register("aspectosMejorar")}
        />
        <button
          type="button"
          disabled={loadingField === "aspectosMejorar"}
          onClick={() => mejorarCampo("aspectosMejorar")}
          className="text-[11px] font-bold text-gold hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          {loadingField === "aspectosMejorar" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          <span>Mejorar redacción con IA</span>
        </button>
      </div>

      <div className="space-y-1">
        <Textarea
          label="Logros personales que espera cumplir"
          rows={2}
          placeholder="Indique sus metas y proyectos personales"
          {...register("visionLargoPlazo")}
        />
        <button
          type="button"
          disabled={loadingField === "visionLargoPlazo"}
          onClick={() => mejorarCampo("visionLargoPlazo")}
          className="text-[11px] font-bold text-gold hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          {loadingField === "visionLargoPlazo" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          <span>Mejorar redacción con IA</span>
        </button>
      </div>

      <Toggle
        label="¿Está políticamente expuesto él/ella o su familia (PEP)?"
        checked={Boolean(esPep)}
        onChange={(val) => setValue("familiaresPoliticos", val)}
      />

      {esPep && (
        <Input
          label="Especifique el cargo público o vínculo político/sindical"
          placeholder="Detalle parentesco e institución"
          {...register("familiaresPoliticosDetalle")}
        />
      )}

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-overlay0">
        <Button type="button" variant="secondary" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <span>Siguiente: Datos Familiares</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
