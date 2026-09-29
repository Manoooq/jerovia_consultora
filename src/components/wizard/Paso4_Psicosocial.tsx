"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { paso4Schema, type Paso4Data } from "@/lib/validations";
import { Input, Select, Textarea, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Brain } from "lucide-react";
import { VoiceCapture } from "@/components/VoiceCapture";

interface PasoProps {
  defaultValues?: Partial<Paso4Data>;
  onNext: (data: Paso4Data) => void;
  onPrev: () => void;
}

export function Paso4_Psicosocial({ defaultValues, onNext, onPrev }: PasoProps) {
  const {
    register, handleSubmit, setValue, watch, formState: { errors },
  // @ts-expect-error — known zodResolver/RHF type mismatch with .optional().default()
  } = useForm<Paso4Data>({ resolver: zodResolver(paso4Schema), defaultValues: { ...defaultValues } });

  const familiaresPoliticos = watch("familiaresPoliticos");

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <form onSubmit={handleSubmit(onNext as any)} className="flex flex-col gap-6">
        <VoiceCapture onExtracted={(data) => {
          if (typeof data.aspectosPositivos === "string") setValue("aspectosPositivos", data.aspectosPositivos);
          if (typeof data.aspectosMejorar === "string") setValue("aspectosMejorar", data.aspectosMejorar);
          if (typeof data.visionLargoPlazo === "string") setValue("visionLargoPlazo", data.visionLargoPlazo);
          if (typeof data.expectativasEntidad === "string") setValue("expectativasEntidad", data.expectativasEntidad);
        }} />

        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Aspectos Psicosociales</h2>
        </div>

                <Textarea
          label="Aspectos Positivos"
          {...register("aspectosPositivos")}
          error={errors.aspectosPositivos?.message}
        />

                <Textarea
          label="Aspectos a Mejorar"
          {...register("aspectosMejorar")}
          error={errors.aspectosMejorar?.message}
        />

                <Textarea
          label="Visión a Largo Plazo"
          {...register("visionLargoPlazo")}
          error={errors.visionLargoPlazo?.message}
        />

                <Textarea
          label="Expectativas en la Entidad"
          {...register("expectativasEntidad")}
          error={errors.expectativasEntidad?.message}
        />

        <Toggle
          label="¿Tiene familiares políticos en la entidad?"
          checked={!!familiaresPoliticos}
          onChange={(val) => setValue("familiaresPoliticos", val)}

        />

        {familiaresPoliticos && (
          <Input
            label="Detalle de Familiares Políticos"
            {...register("familiaresPoliticosDetalle")}
            error={errors.familiaresPoliticosDetalle?.message}
          />
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
