"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso6Schema, type Paso6Data } from "@/lib/validations";
import { Select, Textarea, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Activity } from "lucide-react";

interface PasoProps {
  defaultValues?: Partial<Paso6Data>;
  onNext: (data: Paso6Data) => void;
  onPrev: () => void;
}

export function Paso6_Salud({ defaultValues, onNext, onPrev }: PasoProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Paso6Data>({
    resolver: zodResolver(paso6Schema),
    defaultValues: { ...defaultValues },
  });

  const enfermedadBase = Boolean(watch("enfermedadBase"));
  const familiaresEnfermedad = Boolean(watch("familiaresEnfermedad"));
  const tratamientos = Boolean(watch("tratamientos"));
  const consumoTabaco = Boolean(watch("consumoTabaco"));

  const onSubmit: SubmitHandler<Paso6Data> = (data) => onNext(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit as SubmitHandler<Record<string, unknown>>)}
      className="flex flex-col gap-6"
      noValidate
    >
      <div className="flex items-center gap-3 pb-4 border-b border-overlay0/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 shrink-0">
          <Activity className="h-5 w-5 text-gold" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text">
            6. Cobertura Sanitaria y Estado de Salud
          </h2>
          <p className="text-xs text-subtext0">
            Previsión médica, condiciones preexistentes y hábitos de vida
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Cobertura de Seguro Médico"
          options={[
            { value: "ips", label: "Instituto de Previsión Social (IPS)" },
            { value: "privado", label: "Medicina Prepaga / Seguro Privado" },
            { value: "ambos", label: "Doble cobertura (IPS + Privado)" },
            { value: "ninguno", label: "Sin cobertura médica activa" },
          ]}
          {...register("seguroMedico")}
          error={errors.seguroMedico?.message}
        />

        <Select
          label="Frecuencia de Consumo de Bebidas Alcohólicas"
          options={[
            { value: "no", label: "Abstemio / No consume" },
            { value: "ocasional", label: "Ocasional (eventos puntuales)" },
            { value: "social", label: "Social moderado" },
            { value: "frecuente", label: "Frecuente" },
          ]}
          {...register("consumoAlcohol")}
          error={errors.consumoAlcohol?.message}
        />
      </div>

      <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-4 sm:p-5 space-y-3.5">
        <Toggle
          label="¿Presenta alguna afección o enfermedad de base diagnosticada?"
          checked={enfermedadBase}
          onChange={(val) => setValue("enfermedadBase", val, { shouldDirty: true })}
        />
        {enfermedadBase && (
          <Textarea
            label="Detalle de la condición médica"
            placeholder="Especifique diagnóstico y control médico..."
            rows={2}
            {...register("enfermedadBaseDetalle")}
            error={errors.enfermedadBaseDetalle?.message}
          />
        )}

        <div className="border-t border-overlay0/40 pt-2">
          <Toggle
            label="¿Se encuentra bajo tratamiento médico o farmacológico permanente?"
            checked={tratamientos}
            onChange={(val) => setValue("tratamientos", val, { shouldDirty: true })}
          />
          {tratamientos && (
            <div className="pt-2">
              <Textarea
                label="Detalle del tratamiento e impacto mensual estimado"
                rows={2}
                {...register("tratamientosDetalle")}
                error={errors.tratamientosDetalle?.message}
              />
            </div>
          )}
        </div>

        <div className="border-t border-overlay0/40 pt-2">
          <Toggle
            label="¿Algún integrante del hogar padece enfermedad de alta complejidad?"
            checked={familiaresEnfermedad}
            onChange={(val) => setValue("familiaresEnfermedad", val, { shouldDirty: true })}
            description="Relevante para evaluar gastos médicos extraordinarios en el hogar"
          />
          {familiaresEnfermedad && (
            <div className="pt-2">
              <Textarea
                label="Detalle de familiar y cobertura"
                rows={2}
                {...register("familiaresEnfermedadDetalle")}
                error={errors.familiaresEnfermedadDetalle?.message}
              />
            </div>
          )}
        </div>

        <div className="border-t border-overlay0/40 pt-2">
          <Toggle
            label="¿Hábito de consumo de tabaco o vapeadores?"
            checked={consumoTabaco}
            onChange={(val) => setValue("consumoTabaco", val, { shouldDirty: true })}
          />
        </div>
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
