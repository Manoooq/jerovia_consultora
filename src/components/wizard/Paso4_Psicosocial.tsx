"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso4Schema, type Paso4Data } from "@/lib/validations";
import { Input, Textarea, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Brain } from "lucide-react";
import { VoiceCapture } from "@/components/VoiceCapture";

interface PasoProps {
  defaultValues?: Partial<Paso4Data>;
  onNext: (data: Paso4Data) => void;
  onPrev: () => void;
}

export function Paso4_Psicosocial({ defaultValues, onNext, onPrev }: PasoProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Paso4Data>({
    // @ts-expect-error — RHF + Zod optional default inference compatibility
    resolver: zodResolver(paso4Schema),
    defaultValues: { ...defaultValues },
  });

  const familiaresPoliticos = Boolean(watch("familiaresPoliticos"));
  const onSubmit: SubmitHandler<Paso4Data> = (data) => onNext(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit as SubmitHandler<Record<string, unknown>>)}
      className="flex flex-col gap-6"
      noValidate
    >
      <div className="flex items-center gap-3 pb-4 border-b border-overlay0/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 shrink-0">
          <Brain className="h-5 w-5 text-gold" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text">
            4. Perfil Psicosocial y Proyección Personal
          </h2>
          <p className="text-xs text-subtext0">
            Fortalezas, competencias interpersonales y metas a mediano plazo
          </p>
        </div>
      </div>

      <VoiceCapture
        onExtracted={(data) => {
          if (typeof data.aspectosPositivos === "string")
            setValue("aspectosPositivos", data.aspectosPositivos, { shouldDirty: true });
          if (typeof data.aspectosMejorar === "string")
            setValue("aspectosMejorar", data.aspectosMejorar, { shouldDirty: true });
          if (typeof data.visionLargoPlazo === "string")
            setValue("visionLargoPlazo", data.visionLargoPlazo, { shouldDirty: true });
          if (typeof data.expectativasEntidad === "string")
            setValue("expectativasEntidad", data.expectativasEntidad, { shouldDirty: true });
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Textarea
          label="Principales Fortalezas y Aspectos Positivos"
          placeholder="Ej: Responsabilidad, puntualidad, trabajo en equipo..."
          rows={3}
          {...register("aspectosPositivos")}
          error={errors.aspectosPositivos?.message}
        />

        <Textarea
          label="Oportunidades de Mejora Reconocidas"
          placeholder="Ej: Manejo de la ansiedad ante plazos cortos, delegación..."
          rows={3}
          {...register("aspectosMejorar")}
          error={errors.aspectosMejorar?.message}
        />

        <Textarea
          label="Proyección y Metas a Largo Plazo (3 a 5 años)"
          placeholder="Ej:Culminación de carrera universitaria, consolidación patrimonial..."
          rows={3}
          {...register("visionLargoPlazo")}
          error={errors.visionLargoPlazo?.message}
        />

        <Textarea
          label="Motivación y Expectativas respecto a la Entidad"
          placeholder="Ej: Crecimiento profesional, estabilidad y solvencia..."
          rows={3}
          {...register("expectativasEntidad")}
          error={errors.expectativasEntidad?.message}
        />
      </div>

      <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-4 sm:p-5 space-y-3">
        <Toggle
          label="¿Posee parientes por afinidad (familiares políticos) vinculados a la entidad?"
          checked={familiaresPoliticos}
          onChange={(val) => setValue("familiaresPoliticos", val, { shouldDirty: true })}
        />

        {familiaresPoliticos && (
          <div className="pt-2">
            <Input
              label="Detalle de Familiares Políticos (Nombre y cargo)"
              placeholder="Ej: Cuñado/a en sucursal Centro"
              {...register("familiaresPoliticosDetalle")}
              error={errors.familiaresPoliticosDetalle?.message}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-overlay0/40">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onPrev}
          className="w-full sm:w-auto"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto min-w-[180px]"
        >
          <span>Guardar y Continuar</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
