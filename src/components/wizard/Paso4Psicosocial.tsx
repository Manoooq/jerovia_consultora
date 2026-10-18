"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso4Schema, Paso4Data } from "@/lib/validations";
import { Input, Textarea, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { AiStepAssistant } from "@/components/AiStepAssistant";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  defaultValues: Partial<Paso4Data>;
  onNext: (data: Paso4Data) => void;
  onBack: () => void;
}

export function Paso4Psicosocial({ defaultValues, onNext, onBack }: Props) {
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

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5" noValidate>
      <div className="flex items-center gap-3 border-b border-overlay0 pb-3.5">
        <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
            MÓDULO 04 DE 09 // PERFIL PERSONAL Y PEP
          </span>
          <h2 className="text-lg sm:text-xl font-black text-text">
            Cualidades, Logros y Exposición Política
          </h2>
        </div>
      </div>

      <AiStepAssistant
        stepTitle="Cualidades y Metas"
        placeholder="Dicte sus cualidades y metas y la IA redactará las respuestas..."
        onApplyFields={(extracted) => {
          if (typeof extracted._rawAiText === "string") {
            setValue("aspectosPositivos", extracted._rawAiText, { shouldValidate: true });
          }
        }}
      />

      <div className="space-y-1">
        <Textarea
          label="Aspectos positivos como persona"
          rows={2}
          placeholder="Ej: Responsable, puntual y honesta"
          {...register("aspectosPositivos")}
        />
        <button
          type="button"
          onClick={() =>
            setValue(
              "aspectosPositivos",
              watch("aspectosPositivos")
                ? `${watch("aspectosPositivos")}, con vocación de servicio y compromiso.`
                : "Responsable, puntual, honesta y con facilidad para el trabajo en equipo.",
              { shouldValidate: true }
            )
          }
          className="text-[11px] font-bold text-gold hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="h-3 w-3" /> Sugerir redacción formal con IA
        </button>
      </div>

      <div className="space-y-1">
        <Textarea
          label="Actitud a mejorar"
          rows={2}
          placeholder="Ej: Autoexigirse demasiado"
          {...register("aspectosMejorar")}
        />
        <button
          type="button"
          onClick={() =>
            setValue(
              "aspectosMejorar",
              watch("aspectosMejorar") || "Autoexigirse demasiado en el cumplimiento de metas.",
              { shouldValidate: true }
            )
          }
          className="text-[11px] font-bold text-gold hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="h-3 w-3" /> Sugerir con IA
        </button>
      </div>

      <div className="space-y-1">
        <Textarea
          label="Logros personales que espera cumplir"
          rows={2}
          placeholder="Ej: Tener una casa y auto propio, culminar la carrera universitaria"
          {...register("visionLargoPlazo")}
        />
        <button
          type="button"
          onClick={() =>
            setValue(
              "visionLargoPlazo",
              watch("visionLargoPlazo") ||
                "Culminar la carrera universitaria, consolidarse profesionalmente y adquirir vivienda y movilidad propia.",
              { shouldValidate: true }
            )
          }
          className="text-[11px] font-bold text-gold hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="h-3 w-3" /> Sugerir con IA
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
          placeholder="Detalle nombre del familiar e institución"
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
