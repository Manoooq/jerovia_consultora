"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { paso3Schema, type Paso3Data } from "@/lib/validations";
import { Input, Select, Textarea, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Briefcase } from "lucide-react";

interface PasoProps {
  defaultValues?: Partial<Paso3Data>;
  onNext: (data: Paso3Data) => void;
  onPrev: () => void;
}

export function Paso3_Laboral({ defaultValues, onNext, onPrev }: PasoProps) {
  const {
    register, handleSubmit, setValue, watch, formState: { errors },
  // @ts-expect-error — known zodResolver/RHF type mismatch with .optional().default()
  } = useForm<Paso3Data>({ resolver: zodResolver(paso3Schema), defaultValues: { ...defaultValues } });

  const situacionActual = watch("situacionActual");
  const showPreviousJob = situacionActual !== "desempleado" && situacionActual !== "estudiante" && !!situacionActual;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <form onSubmit={handleSubmit(onNext as any)} className="flex flex-col gap-6">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Situación Laboral</h2>
        </div>

        <Select
          label="Situación Actual"
          options={[
            { value: "empleado", label: "Empleado" },
            { value: "desempleado", label: "Desempleado" },
            { value: "independiente", label: "Independiente" },
            { value: "estudiante", label: "Estudiante" },
            { value: "otro", label: "Otro" },
          ]}
          {...register("situacionActual")}
          error={errors.situacionActual?.message}
        />

        <Select
          label="Disponibilidad"
          options={[
            { value: "inmediata", label: "Inmediata" },
            { value: "15_dias", label: "15 Días" },
            { value: "30_dias", label: "30 Días" },
            { value: "mas_30_dias", label: "Más de 30 Días" },
          ]}
          {...register("disponibilidad")}
          error={errors.disponibilidad?.message}
        />

        <Input
          label="Pretensión Salarial"
          {...register("pretensionSalarial")}
          error={errors.pretensionSalarial?.message}
        />

        {showPreviousJob && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-surface">
            <h3 className="col-span-full font-medium text-text/80 mb-2">Datos de Empleo (Anterior o Actual)</h3>
            
            <Input
              label="Empresa Anterior/Actual"
              {...register("empresaAnterior")}
              error={errors.empresaAnterior?.message}
            />
            
            <Input
              label="Cargo"
              {...register("cargoAnterior")}
              error={errors.cargoAnterior?.message}
            />
            
            <Input
              type="number"
              label="Antigüedad (meses)"
              {...register("antiguedad", { valueAsNumber: true })}
              error={errors.antiguedad?.message}
            />
            
            <Input
              type="number"
              label="Salario"
              {...register("salarioAnterior", { valueAsNumber: true })}
              error={errors.salarioAnterior?.message}
            />
          </div>
        )}

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
