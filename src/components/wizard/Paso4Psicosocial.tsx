"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso4Schema, Paso4Data } from "@/lib/validations";
import { Input, Textarea, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
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
    formState: { errors },
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

      <Textarea
        label="Aspectos positivos como persona"
        required
        rows={2}
        placeholder="Ej: Responsable, puntual y honesta"
        {...register("aspectosPositivos")}
        error={errors.aspectosPositivos?.message}
      />

      <Textarea
        label="Actitud a mejorar"
        required
        rows={2}
        placeholder="Ej: Autoexigirse demasiado"
        {...register("aspectosMejorar")}
        error={errors.aspectosMejorar?.message}
      />

      <Textarea
        label="Logros personales que espera cumplir"
        required
        rows={2}
        placeholder="Ej: Tener una casa y auto propio"
        {...register("visionLargoPlazo")}
        error={errors.visionLargoPlazo?.message}
      />

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
