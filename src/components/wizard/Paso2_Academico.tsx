"use client";

import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso2Schema, type Paso2Data } from "@/lib/validations";
import { Input, Select, Textarea } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Plus,
  Trash2,
  Languages,
} from "lucide-react";

interface PasoProps {
  defaultValues?: Partial<Paso2Data>;
  onNext: (data: Paso2Data) => void;
  onPrev: () => void;
}

const NIVEL_OPTS = [
  { value: "basico", label: "Básico" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
  { value: "nativo", label: "Nativo / Bilingüe" },
];

export function Paso2Academico({ defaultValues, onNext, onPrev }: PasoProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Paso2Data>({
    // @ts-expect-error — RHF + Zod optional default inference compatibility
    resolver: zodResolver(paso2Schema),
    defaultValues: { idiomas: [], ...defaultValues },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "idiomas",
  });

  const onSubmit: SubmitHandler<Paso2Data> = (data) => onNext(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit as SubmitHandler<Record<string, unknown>>)}
      className="flex flex-col gap-6"
      noValidate
    >
      <div className="flex items-center gap-3 pb-4 border-b border-overlay0/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 shrink-0">
          <GraduationCap className="h-5 w-5 text-gold" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text">
            2. Nivel Educativo y Formación Académica
          </h2>
          <p className="text-xs text-subtext0">
            Estudios superiores, técnicos, manejo de idiomas y capacitaciones
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Carrera, Bachillerato o Especialidad"
          required
          error={errors.carrera?.message}
          {...register("carrera")}
          placeholder="Ej: Lic. en Administración / Contabilidad"
        />
        <Input
          label="Institución Educativa / Universidad"
          required
          error={errors.universidad?.message}
          {...register("universidad")}
          placeholder="Ej: Universidad Nacional de Asunción (UNA)"
        />
        <Input
          label="Años de estudio cursados"
          type="number"
          inputMode="numeric"
          min={0}
          max={25}
          required
          error={errors.aniosEstudio?.message}
          {...register("aniosEstudio", { valueAsNumber: true })}
          placeholder="Ej: 4"
        />
        <Select
          label="Situación Académica Actual"
          required
          options={[
            { value: "finalizado", label: "Finalizado / Egresado" },
            { value: "en_curso", label: "En curso actualmente" },
            { value: "interrumpido", label: "Pausado / Interrumpido" },
          ]}
          error={errors.estadoEstudios?.message}
          {...register("estadoEstudios")}
        />
      </div>

      {/* Idiomas */}
      <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-subtext1">
            <Languages className="h-4 w-4 text-gold" aria-hidden="true" />
            <span>Idiomas (Guaraní, Inglés, Portugués, otros)</span>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ idioma: "", nivel: "intermedio" })}
          >
            <Plus className="h-3.5 w-3.5 text-gold" />
            <span>Añadir idioma</span>
          </Button>
        </div>

        {fields.length === 0 ? (
          <p className="text-xs text-subtext0">
            No se han añadido idiomas adicionales. Toque &ldquo;Añadir idioma&rdquo; para registrar conocimientos lingüísticos.
          </p>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end bg-surface0 p-3 rounded-xl border border-overlay0/50"
              >
                <div className="sm:col-span-6">
                  <Input
                    label={index === 0 ? "Idioma" : undefined}
                    placeholder="Ej: Guaraní / Inglés / Portugués"
                    {...register(`idiomas.${index}.idioma`)}
                  />
                </div>
                <div className="sm:col-span-5">
                  <Select
                    label={index === 0 ? "Nivel de dominio" : undefined}
                    options={NIVEL_OPTS}
                    {...register(`idiomas.${index}.nivel` as const)}
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    aria-label="Eliminar idioma"
                  >
                    <Trash2 className="h-4 w-4 text-red" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Textarea
        label="Cursos Técnicos, Certificaciones o Seminarios Relevantes (Opcional)"
        {...register("cursos")}
        rows={3}
        placeholder="Ej: Excel Avanzado, Atención al Cliente, Gestión de Riesgos, SNPP..."
      />

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
