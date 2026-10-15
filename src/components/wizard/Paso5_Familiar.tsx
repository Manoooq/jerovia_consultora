"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso5Schema, type Paso5Data } from "@/lib/validations";
import { Input, Select, Textarea, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

interface PasoProps {
  defaultValues?: Partial<Paso5Data>;
  onNext: (data: Paso5Data) => void;
  onPrev: () => void;
}

export function Paso5_Familiar({ defaultValues, onNext, onPrev }: PasoProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Paso5Data>({
    resolver: zodResolver(paso5Schema),
    defaultValues: { ...defaultValues },
  });

  const hijos = Boolean(watch("hijos"));
  const onSubmit: SubmitHandler<Paso5Data> = (data) => onNext(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit as SubmitHandler<Record<string, unknown>>)}
      className="flex flex-col gap-6"
      noValidate
    >
      <div className="flex items-center gap-3 pb-4 border-b border-overlay0/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 shrink-0">
          <Users className="h-5 w-5 text-gold" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text">
            5. Composición y Entorno Familiar
          </h2>
          <p className="text-xs text-subtext0">
            Núcleo conviviente, dependientes económicos y referencias filiales
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Estado vincular de los padres"
          options={[
            { value: "casados", label: "Casados" },
            { value: "union_libre", label: "Unión de hecho / Convivientes" },
            { value: "separados", label: "Separados" },
            { value: "divorciados", label: "Divorciados" },
            { value: "fallecidos", label: "Fallecidos (uno o ambos)" },
            { value: "otro", label: "Otra situación" },
          ]}
          {...register("relacionPadres")}
          error={errors.relacionPadres?.message}
        />

        <Input
          type="number"
          inputMode="numeric"
          min={0}
          label="Cantidad de hermanos/as"
          placeholder="Ej: 2"
          {...register("cantidadHermanos", { valueAsNumber: true })}
          error={errors.cantidadHermanos?.message}
        />
      </div>

      <Textarea
        label="Composición del Grupo Conviviente Actual"
        placeholder="Indique quiénes habitan la vivienda con el postulante y la dinámica familiar..."
        rows={3}
        {...register("estructuraFamiliar")}
        error={errors.estructuraFamiliar?.message}
      />

      {/* Hijos / Dependientes */}
      <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-4 sm:p-5 space-y-4">
        <Toggle
          label="¿El postulante tiene hijos o dependientes directos?"
          checked={hijos}
          onChange={(val) => setValue("hijos", val, { shouldDirty: true })}
        />

        {hijos && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-overlay0/40">
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              label="Cantidad de hijos"
              placeholder="Ej: 2"
              {...register("cantidadHijos", { valueAsNumber: true })}
              error={errors.cantidadHijos?.message}
            />
            <Input
              label="Edades y escolaridad"
              placeholder="Ej: 6 y 9 años (escolarizados)"
              {...register("edadesHijos")}
              error={errors.edadesHijos?.message}
            />
          </div>
        )}
      </div>

      {/* Datos de los Padres */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-4 sm:p-5 space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gold">
            Referencia Paterna
          </h3>
          <Input
            label="Nombre Completo del Padre"
            {...register("nombrePadre")}
            error={errors.nombrePadre?.message}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              inputMode="numeric"
              label="Edad"
              {...register("edadPadre", { valueAsNumber: true })}
              error={errors.edadPadre?.message}
            />
            <Input
              label="Teléfono"
              type="tel"
              inputMode="tel"
              {...register("telefonoPadre")}
              error={errors.telefonoPadre?.message}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Ocupación / Actividad"
              {...register("ocupacionPadre")}
              error={errors.ocupacionPadre?.message}
            />
            <Input
              label="Ciudad de Residencia"
              {...register("ciudadPadre")}
              error={errors.ciudadPadre?.message}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-4 sm:p-5 space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gold">
            Referencia Materna
          </h3>
          <Input
            label="Nombre Completo de la Madre"
            {...register("nombreMadre")}
            error={errors.nombreMadre?.message}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              inputMode="numeric"
              label="Edad"
              {...register("edadMadre", { valueAsNumber: true })}
              error={errors.edadMadre?.message}
            />
            <Input
              label="Teléfono"
              type="tel"
              inputMode="tel"
              {...register("telefonoMadre")}
              error={errors.telefonoMadre?.message}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Ocupación / Actividad"
              {...register("ocupacionMadre")}
              error={errors.ocupacionMadre?.message}
            />
            <Input
              label="Ciudad de Residencia"
              {...register("ciudadMadre")}
              error={errors.ciudadMadre?.message}
            />
          </div>
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
