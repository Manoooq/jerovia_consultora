"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { paso2Schema, type Paso2Data } from "@/lib/validations";
import { Input, Select, Textarea } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, GraduationCap, Plus, Trash2 } from "lucide-react";

interface PasoProps {
  defaultValues?: Partial<Paso2Data>;
  onNext: (data: Paso2Data) => void;
  onPrev: () => void;
}

const NIVEL_OPTS = [
  { value: "basico", label: "Básico" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
  { value: "nativo", label: "Nativo" },
];

export function Paso2Academico({ defaultValues, onNext, onPrev }: PasoProps) {
  const {
    register, handleSubmit, control, formState: { errors },
  // @ts-expect-error — known zodResolver/RHF type mismatch with .optional().default()
  } = useForm<Paso2Data>({ resolver: zodResolver(paso2Schema), defaultValues: { idiomas: [], ...defaultValues } });

  const { fields, append, remove } = useFieldArray({ control, name: "idiomas" });

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <form onSubmit={handleSubmit(onNext as any)} className="flex flex-col gap-6">
        <div className="flex items-center gap-3 pb-4 border-b border-overlay0/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue/10">
            <GraduationCap className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text">Formación Académica</h2>
            <p className="text-sm text-subtext0">Estudios, idiomas y capacitaciones</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Carrera / Especialidad" required error={errors.carrera?.message} {...register("carrera")} placeholder="Economía, Administración..." />
          <Input label="Años de estudio cursados" type="number" required error={errors.aniosEstudio?.message} {...register("aniosEstudio", { valueAsNumber: true })} placeholder="2" />
          <Input label="Universidad / Institución" required error={errors.universidad?.message} {...register("universidad")} placeholder="Universidad Americana" />
          <Select
            label="Estado de los estudios"
            required
            options={[
              { value: "en_curso", label: "En curso" },
              { value: "finalizado", label: "Finalizado" },
              { value: "interrumpido", label: "Interrumpido" },
            ]}
            error={errors.estadoEstudios?.message}
            {...register("estadoEstudios")}
          />
        </div>

        {/* Idiomas dinámicos */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-surface1 border border-overlay0/50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text">Idiomas</p>
            <Button type="button" variant="secondary" size="sm" onClick={() => append({ idioma: "", nivel: "basico" })}>
              <Plus className="h-4 w-4" /> Agregar idioma
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <Input placeholder="Inglés, Portugués..." {...register(`idiomas.${index}.idioma`)} />
              <Select
                options={NIVEL_OPTS}
                {...register(`idiomas.${index}.nivel` as const)}
              />
              <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4 text-red" />
              </Button>
            </div>
          ))}
          {fields.length === 0 && <p className="text-xs text-overlay1">Sin idiomas adicionales registrados.</p>}
        </div>

        <Textarea label="Otros cursos o capacitaciones (Opcional)" {...register("cursos")} rows={3} />

        <div className="flex justify-between pt-2">
          <Button type="button" variant="secondary" size="lg" onClick={onPrev}>
            <ChevronLeft className="h-5 w-5 mr-2" /> Anterior
          </Button>
          <Button type="submit" size="lg">
            Siguiente <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
