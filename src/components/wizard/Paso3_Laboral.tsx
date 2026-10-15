"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso3Schema, type Paso3Data } from "@/lib/validations";
import { Input, Select } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Briefcase, Building2 } from "lucide-react";

interface PasoProps {
  defaultValues?: Partial<Paso3Data>;
  onNext: (data: Paso3Data) => void;
  onPrev: () => void;
}

export function Paso3_Laboral({ defaultValues, onNext, onPrev }: PasoProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Paso3Data>({
    resolver: zodResolver(paso3Schema),
    defaultValues: { ...defaultValues },
  });

  const situacionActual = watch("situacionActual");
  const showPreviousJob =
    situacionActual !== "desempleado" &&
    situacionActual !== "estudiante" &&
    Boolean(situacionActual);

  const onSubmit: SubmitHandler<Paso3Data> = (data) => onNext(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit as SubmitHandler<Record<string, unknown>>)}
      className="flex flex-col gap-6"
      noValidate
    >
      <div className="flex items-center gap-3 pb-4 border-b border-overlay0/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 shrink-0">
          <Briefcase className="h-5 w-5 text-gold" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text">
            3. Situación Ocupacional y Trayectoria Laboral
          </h2>
          <p className="text-xs text-subtext0">
            Actividad económica actual, antigüedad y referencias comerciales
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Condición Ocupacional"
          required
          options={[
            { value: "empleado", label: "Asalariado / Dependiente" },
            { value: "independiente", label: "Profesional Independiente / RUC" },
            { value: "desempleado", label: "En transición laboral" },
            { value: "estudiante", label: "Estudiante / Pasantía" },
            { value: "otro", label: "Otra actividad" },
          ]}
          {...register("situacionActual")}
          error={errors.situacionActual?.message}
        />

        <Select
          label="Disponibilidad Horaria / Incorporación"
          options={[
            { value: "inmediata", label: "Inmediata" },
            { value: "15_dias", label: "Preaviso de 15 días" },
            { value: "30_dias", label: "Preaviso de 30 días" },
            { value: "mas_30_dias", label: "Mayor a 30 días" },
          ]}
          {...register("disponibilidad")}
          error={errors.disponibilidad?.message}
        />

        <Input
          label="Expectativa / Rango Salarial (Gs.)"
          inputMode="numeric"
          placeholder="Ej: 6.500.000"
          {...register("pretensionSalarial")}
          error={errors.pretensionSalarial?.message}
        />
      </div>

      {showPreviousJob && (
        <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-subtext1">
            <Building2 className="h-4 w-4 text-gold" aria-hidden="true" />
            <span>Detalle del Empleo o Actividad Principal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Empresa, Institución o Razón Social"
              placeholder="Ej: Banco / Comercial S.A."
              {...register("empresaAnterior")}
              error={errors.empresaAnterior?.message}
            />

            <Input
              label="Cargo o Función Desempeñada"
              placeholder="Ej: Analista Administrativo"
              {...register("cargoAnterior")}
              error={errors.cargoAnterior?.message}
            />

            <Input
              type="number"
              inputMode="numeric"
              min={0}
              label="Antigüedad en el puesto (en meses)"
              placeholder="Ej: 24"
              {...register("antiguedad", { valueAsNumber: true })}
              error={errors.antiguedad?.message}
            />

            <Input
              type="number"
              inputMode="numeric"
              min={0}
              label="Remuneración Mensual Percibida (Gs.)"
              placeholder="Ej: 5.500.000"
              {...register("salarioAnterior", { valueAsNumber: true })}
              error={errors.salarioAnterior?.message}
            />
          </div>
        </div>
      )}

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
