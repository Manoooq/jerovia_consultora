"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso6Schema, Paso6Data } from "@/lib/validations";
import { Input, Select, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { AiStepAssistant } from "@/components/AiStepAssistant";
import { HeartPulse, ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  defaultValues: Partial<Paso6Data>;
  onNext: (data: Paso6Data) => void;
  onBack: () => void;
}

export function Paso6Salud({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Paso6Data>({
    resolver: zodResolver(paso6Schema),
    defaultValues: {
      enfermedadBase: defaultValues.enfermedadBase ?? false,
      enfermedadBaseDetalle: defaultValues.enfermedadBaseDetalle || "",
      consumeMedicamentos: defaultValues.consumeMedicamentos ?? false,
      consumeMedicamentosDetalle: defaultValues.consumeMedicamentosDetalle || "",
      tieneFobias: defaultValues.tieneFobias ?? false,
      tieneFobiasDetalle: defaultValues.tieneFobiasDetalle || "",
      seguroMedico: defaultValues.seguroMedico || "ninguno",
      seguroMedicoDetalle: defaultValues.seguroMedicoDetalle || "",
      consumoAlcohol: defaultValues.consumoAlcohol || "no",
      consumoTabaco: defaultValues.consumoTabaco ?? false,
      familiaresEnfermedad: defaultValues.familiaresEnfermedad ?? false,
      familiaresEnfermedadDetalle: defaultValues.familiaresEnfermedadDetalle || "",
      condicionDiferenteVivienda: defaultValues.condicionDiferenteVivienda || "Ninguno",
      tratamientos: defaultValues.tratamientos ?? false,
      tratamientosDetalle: defaultValues.tratamientosDetalle || "",
    },
  });

  const condEspecial = watch("enfermedadBase");
  const medicamentos = watch("consumeMedicamentos");
  const fobias = watch("tieneFobias");
  const seguro = watch("seguroMedico");
  const tieneSeguroPrivado = seguro === "privado" || seguro === "ambos";
  const famSalud = watch("familiaresEnfermedad");
  const tratamiento = watch("tratamientos");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5" noValidate>
      <div className="flex items-center gap-3 border-b border-overlay0 pb-3.5">
        <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
          <HeartPulse className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
            MÓDULO 06 // DATOS DE LA SALUD
          </span>
          <h2 className="text-lg sm:text-xl font-black text-text">
            Condiciones Médicas, Cobertura y Hábitos
          </h2>
        </div>
      </div>

      <AiStepAssistant
        stepNumber={6}
        stepTitle="Datos de la Salud"
        placeholder="Dicte su cobertura médica o antecedentes de salud..."
        onApplyFields={(extracted) => {
          Object.entries(extracted).forEach(([k, v]) => {
            if (typeof v === "string" && k !== "_rawAiText") {
              setValue(k as keyof Paso6Data, v as never, { shouldValidate: true });
            }
          });
        }}
      />

      <div className="space-y-3">
        <Toggle
          label="¿Cuentas con algún problema de salud o alergia?"
          checked={Boolean(condEspecial)}
          onChange={(val) => setValue("enfermedadBase", val)}
        />
        {condEspecial && (
          <Input
            label="Especifique el problema de salud o alergia"
            placeholder="Detalle la condición"
            {...register("enfermedadBaseDetalle")}
            error={errors.enfermedadBaseDetalle?.message}
          />
        )}

        <Toggle
          label="¿Consume algún medicamento con fines cognitivos, tranquilizantes u hormonales?"
          checked={Boolean(medicamentos)}
          onChange={(val) => setValue("consumeMedicamentos", val)}
        />
        {medicamentos && (
          <Input
            label="Indique qué medicamento consume"
            placeholder="Detalle el medicamento"
            {...register("consumeMedicamentosDetalle")}
          />
        )}

        <Toggle
          label="¿Tiene fobias, pánicos, claustrofobias, etc.?"
          checked={Boolean(fobias)}
          onChange={(val) => setValue("tieneFobias", val)}
        />
        {fobias && (
          <Input
            label="Especifique el tipo de fobia o pánico"
            placeholder="Detalle cuál"
            {...register("tieneFobiasDetalle")}
          />
        )}
      </div>

      {/* Seguro Médico: Si coloca Seguro Privado, permite escribir cuál es */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="¿Posee seguro médico?"
            options={[
              { value: "ninguno", label: "No posee" },
              { value: "ips", label: "IPS" },
              { value: "privado", label: "Seguro Privado" },
              { value: "ambos", label: "IPS + Seguro Privado" },
            ]}
            {...register("seguroMedico")}
          />
          <Select
            label="¿Consume bebidas alcohólicas?"
            options={[
              { value: "no", label: "No" },
              { value: "ocasional", label: "Ocasionalmente" },
              { value: "social", label: "Socialmente" },
              { value: "frecuente", label: "Frecuentemente" },
            ]}
            {...register("consumoAlcohol")}
          />
        </div>

        {tieneSeguroPrivado && (
          <Input
            label="¿Cuál seguro médico privado posee?"
            placeholder="Escriba el nombre de su seguro médico privado"
            {...register("seguroMedicoDetalle")}
            error={errors.seguroMedicoDetalle?.message}
          />
        )}
      </div>

      <Toggle
        label="¿Fuma o vapea?"
        checked={Boolean(watch("consumoTabaco"))}
        onChange={(val) => setValue("consumoTabaco", val)}
      />

      <div className="space-y-3">
        <Toggle
          label="¿Tiene algún familiar con problemas de salud?"
          checked={Boolean(famSalud)}
          onChange={(val) => setValue("familiaresEnfermedad", val)}
        />
        {famSalud && (
          <Input
            label="Especifique familiar y problema de salud"
            placeholder="Indique parentesco y condición de salud"
            {...register("familiaresEnfermedadDetalle")}
          />
        )}
      </div>

      <Input
        label="¿En la vivienda hay alguna persona que tenga alguna condición diferente (intelectual, física, etc.)?"
        placeholder="Indique Ninguno o especifique"
        {...register("condicionDiferenteVivienda")}
      />

      <div className="space-y-3">
        <Toggle
          label="¿Realiza algún tratamiento médico actualmente?"
          checked={Boolean(tratamiento)}
          onChange={(val) => setValue("tratamientos", val)}
        />
        {tratamiento && (
          <Input
            label="Detalle el tratamiento médico"
            placeholder="Especifique el tratamiento"
            {...register("tratamientosDetalle")}
          />
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-overlay0">
        <Button type="button" variant="secondary" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <span>Siguiente: Datos Económicos</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
