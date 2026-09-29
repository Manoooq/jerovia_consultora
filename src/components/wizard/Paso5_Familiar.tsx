"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
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
    register, handleSubmit, setValue, watch, formState: { errors },
  // @ts-expect-error — known zodResolver/RHF type mismatch with .optional().default()
  } = useForm<Paso5Data>({ resolver: zodResolver(paso5Schema), defaultValues: { ...defaultValues } });

  const hijos = watch("hijos");

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <form onSubmit={handleSubmit(onNext as any)} className="flex flex-col gap-6">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Estructura Familiar</h2>
        </div>

        <Select
          label="Relación de los Padres"
          options={[
            { value: "casados", label: "Casados" },
            { value: "separados", label: "Separados" },
            { value: "divorciados", label: "Divorciados" },
            { value: "union_libre", label: "Unión Libre" },
            { value: "fallecidos", label: "Fallecidos" },
            { value: "otro", label: "Otro" },
          ]}
          {...register("relacionPadres")}
          error={errors.relacionPadres?.message}
        />

        <Textarea
          label="Estructura Familiar"
          {...register("estructuraFamiliar")}
          error={errors.estructuraFamiliar?.message}
        />

        <Toggle
          label="¿Tiene hijos?"
          checked={!!hijos}
          onChange={(val) => setValue("hijos", val)}

        />

        {hijos && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Cantidad de Hijos"
              {...register("cantidadHijos", { valueAsNumber: true })}
              error={errors.cantidadHijos?.message}
            />
            <Input
              label="Edades de Hijos"
              {...register("edadesHijos")}
              error={errors.edadesHijos?.message}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-surface">
          <h3 className="col-span-full font-medium text-text/80">Datos del Padre</h3>
          <Input label="Nombre del Padre" {...register("nombrePadre")} error={errors.nombrePadre?.message} />
          <Input type="number" label="Edad" {...register("edadPadre", { valueAsNumber: true })} error={errors.edadPadre?.message} />
          <Input label="Ocupación" {...register("ocupacionPadre")} error={errors.ocupacionPadre?.message} />
          <Input label="Teléfono" {...register("telefonoPadre")} error={errors.telefonoPadre?.message} />
          <Input label="Ciudad" {...register("ciudadPadre")} error={errors.ciudadPadre?.message} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-surface">
          <h3 className="col-span-full font-medium text-text/80">Datos de la Madre</h3>
          <Input label="Nombre de la Madre" {...register("nombreMadre")} error={errors.nombreMadre?.message} />
          <Input type="number" label="Edad" {...register("edadMadre", { valueAsNumber: true })} error={errors.edadMadre?.message} />
          <Input label="Ocupación" {...register("ocupacionMadre")} error={errors.ocupacionMadre?.message} />
          <Input label="Teléfono" {...register("telefonoMadre")} error={errors.telefonoMadre?.message} />
          <Input label="Ciudad" {...register("ciudadMadre")} error={errors.ciudadMadre?.message} />
        </div>

        <Input
          type="number"
          label="Cantidad de Hermanos"
          {...register("cantidadHermanos", { valueAsNumber: true })}
          error={errors.cantidadHermanos?.message}
        />

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
