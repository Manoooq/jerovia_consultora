"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { paso9Schema, type Paso9Data, type FormularioCompleto } from "@/lib/validations";
import { Input, Select, Textarea, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, CheckCircle, Wand2 } from "lucide-react";

interface PasoProps {
  defaultValues?: Partial<Paso9Data>;
  data?: Partial<FormularioCompleto>;
  onNext: (data: Paso9Data) => void;
  onPrev: () => void;
}

export function Paso9_Conclusion({ defaultValues, data, onNext, onPrev }: PasoProps) {
  const {
    register, handleSubmit, setValue, watch, formState: { errors },
  // @ts-expect-error — known zodResolver/RHF type mismatch with .optional().default()
  } = useForm<Paso9Data>({ resolver: zodResolver(paso9Schema), defaultValues: { ...defaultValues }, ...({ f: 1 } as unknown) });

  const handleSintetizar = async () => {
    try {
      const response = await fetch("/api/ai/sintetizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datosCompletos: data, observacionActual: watch("observacionesEntrevista") })
      });
      const result = await response.json();
      if (result.sintesis) {
        setValue("observacionesEntrevista", result.sintesis);
      }
    } catch (e) {
      console.error("Error al sintetizar:", e);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <form onSubmit={handleSubmit(onNext as any)} className="flex flex-col gap-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Conclusión de la Entrevista</h2>
          </div>
          <Button type="button" variant="secondary" onClick={handleSintetizar}>
            <Wand2 className="w-4 h-4 mr-2" /> Sintetizar con AI
          </Button>
        </div>

        <Textarea
          label="Observaciones de la Entrevista"
          {...register("observacionesEntrevista")}
          error={errors.observacionesEntrevista?.message}
          rows={6}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Dicción"
            options={[
              { value: "fluida", label: "Fluida" },
              { value: "coherente", label: "Coherente" },
              { value: "segura", label: "Segura" },
              { value: "timida", label: "Tímida" },
              { value: "otro", label: "Otro" },
            ]}
            {...register("diccion")}
            error={errors.diccion?.message}
          />

          <Select
            label="Estado de la Vivienda"
            options={[
              { value: "excelente", label: "Excelente" },
              { value: "bueno", label: "Bueno" },
              { value: "regular", label: "Regular" },
              { value: "deficiente", label: "Deficiente" },
            ]}
            {...register("estadoVivienda")}
            error={errors.estadoVivienda?.message}
          />
        </div>

        <Input label="¿Quiénes estaban presentes?" {...register("quienesPresentes")} error={errors.quienesPresentes?.message} />
        
        <Textarea label="Otras Observaciones" {...register("otrasObservaciones")} error={errors.otrasObservaciones?.message} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input type="date" label="Fecha de la Visita" {...register("fechaVisita")} error={errors.fechaVisita?.message} />
          <Input label="Nombre del Consultor" {...register("consultorNombre")} error={errors.consultorNombre?.message} />
        </div>

        <div className="flex justify-between pt-2">
          <Button type="button" variant="secondary" size="lg" onClick={onPrev}>
            <ChevronLeft className="h-5 w-5 mr-2" /> Anterior
          </Button>
          <Button type="submit" size="lg">
            Completar Entrevista <CheckCircle className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
