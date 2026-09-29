"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { paso6Schema, type Paso6Data } from "@/lib/validations";
import { Input, Select, Textarea, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Activity } from "lucide-react";

interface PasoProps {
  defaultValues?: Partial<Paso6Data>;
  onNext: (data: Paso6Data) => void;
  onPrev: () => void;
}

export function Paso6_Salud({ defaultValues, onNext, onPrev }: PasoProps) {
  const {
    register, handleSubmit, setValue, watch, formState: { errors },
  // @ts-expect-error — known zodResolver/RHF type mismatch with .optional().default()
  } = useForm<Paso6Data>({ resolver: zodResolver(paso6Schema), defaultValues: { ...defaultValues } });

  const enfermedadBase = watch("enfermedadBase");
  const familiaresEnfermedad = watch("familiaresEnfermedad");
  const tratamientos = watch("tratamientos");
  const consumoTabaco = watch("consumoTabaco");

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <form onSubmit={handleSubmit(onNext as any)} className="flex flex-col gap-6">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Salud y Hábitos</h2>
        </div>

        <Toggle
          label="¿Tiene alguna enfermedad de base?"
          checked={!!enfermedadBase}
          onChange={(val) => setValue("enfermedadBase", val)}

        />
        {enfermedadBase && (
          <Textarea label="Detalle de Enfermedad" {...register("enfermedadBaseDetalle")} error={errors.enfermedadBaseDetalle?.message} />
        )}

        <Toggle
          label="¿Familiares con enfermedad grave?"
          checked={!!familiaresEnfermedad}
          onChange={(val) => setValue("familiaresEnfermedad", val)}

        />
        {familiaresEnfermedad && (
          <Textarea label="Detalle de Familiares con Enfermedad" {...register("familiaresEnfermedadDetalle")} error={errors.familiaresEnfermedadDetalle?.message} />
        )}

        <Select
          label="Seguro Médico"
          options={[
            { value: "ninguno", label: "Ninguno" },
            { value: "ips", label: "IPS" },
            { value: "privado", label: "Privado" },
            { value: "ambos", label: "Ambos" },
          ]}
          {...register("seguroMedico")}
          error={errors.seguroMedico?.message}
        />

        <Toggle
          label="¿Sigue tratamientos médicos?"
          checked={!!tratamientos}
          onChange={(val) => setValue("tratamientos", val)}

        />
        {tratamientos && (
          <Textarea label="Detalle de Tratamientos" {...register("tratamientosDetalle")} error={errors.tratamientosDetalle?.message} />
        )}

        <Select
          label="Consumo de Alcohol"
          options={[
            { value: "no", label: "No" },
            { value: "ocasional", label: "Ocasional" },
            { value: "social", label: "Social" },
            { value: "frecuente", label: "Frecuente" },
          ]}
          {...register("consumoAlcohol")}
          error={errors.consumoAlcohol?.message}
        />

        <Toggle
          label="¿Consume Tabaco?"
          checked={!!consumoTabaco}
          onChange={(val) => setValue("consumoTabaco", val)}

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
