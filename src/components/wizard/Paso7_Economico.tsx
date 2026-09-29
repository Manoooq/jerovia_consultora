"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { paso7Schema, type Paso7Data } from "@/lib/validations";
import { Input, Select, Textarea, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, DollarSign } from "lucide-react";

interface PasoProps {
  defaultValues?: Partial<Paso7Data>;
  onNext: (data: Paso7Data) => void;
  onPrev: () => void;
}

export function Paso7_Economico({ defaultValues, onNext, onPrev }: PasoProps) {
  const {
    register, handleSubmit, setValue, watch, formState: { errors },
  // @ts-expect-error — known zodResolver/RHF type mismatch with .optional().default()
  } = useForm<Paso7Data>({ resolver: zodResolver(paso7Schema), defaultValues: { ...defaultValues } });

  const productosEntidad = watch("productosEntidad");
  const familiaresProductosEntidad = watch("familiaresProductosEntidad");
  const prestamos = watch("prestamos");

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <form onSubmit={handleSubmit(onNext as any)} className="flex flex-col gap-6">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Situación Económica</h2>
        </div>

        <Toggle
          label="¿Tiene productos en la entidad?"
          checked={!!productosEntidad}
          onChange={(val) => setValue("productosEntidad", val)}

        />
        {productosEntidad && (
          <Input label="Tipos de Productos" {...register("tiposProductosEntidad")} error={errors.tiposProductosEntidad?.message} />
        )}

        <Toggle
          label="¿Familiares con productos en la entidad?"
          checked={!!familiaresProductosEntidad}
          onChange={(val) => setValue("familiaresProductosEntidad", val)}

        />

        <Input label="Ingresos Familiares" {...register("ingresosFamiliares")} error={errors.ingresosFamiliares?.message} />
        
        <Input label="Otros Ingresos (Opcional)" {...register("otrosIngresos")} error={errors.otrosIngresos?.message} />
        
        <Input label="Egresos Mensuales (Aprox.)" {...register("egresosMensuales")} error={errors.egresosMensuales?.message} />

        <Toggle
          label="¿Tiene préstamos o deudas?"
          checked={!!prestamos}
          onChange={(val) => setValue("prestamos", val)}

        />
        {prestamos && (
          <Textarea label="Detalle de Préstamos" {...register("prestamosDetalle")} error={errors.prestamosDetalle?.message} />
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
