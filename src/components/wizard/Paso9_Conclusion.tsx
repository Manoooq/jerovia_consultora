"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { paso9Schema, type Paso9Data, type FormularioCompleto } from "@/lib/validations";
import { Input, Select, Textarea } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, CheckCircle, FileCheck, Loader2, Scale } from "lucide-react";

interface PasoProps {
  defaultValues?: Partial<Paso9Data>;
  data?: Partial<FormularioCompleto>;
  onNext: (data: Paso9Data) => void;
  onPrev: () => void;
}

export function Paso9_Conclusion({ defaultValues, data, onNext, onPrev }: PasoProps) {
  const [sintetizando, setSintetizando] = useState(false);

  const {
    register, handleSubmit, setValue, watch, formState: { errors },
  // @ts-expect-error — known zodResolver/RHF type mismatch with .optional().default()
  } = useForm<Paso9Data>({ resolver: zodResolver(paso9Schema), defaultValues: { ...defaultValues }, ...({ f: 1 } as unknown) });

  const handleSintetizar = async () => {
    setSintetizando(true);
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
    } finally {
      setSintetizando(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <form onSubmit={handleSubmit(onNext as any)} className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-overlay0/30">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text">Conclusión y Dictamen Pericial</h2>
              <p className="text-[11px] text-subtext0">Dictamen final del evaluador para homologación institucional</p>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSintetizar}
            loading={sintetizando}
            className="border-gold/30 hover:border-gold text-xs font-semibold self-start sm:self-auto"
          >
            {sintetizando ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-gold" />
                Redactando dictamen...
              </>
            ) : (
              <>
                <FileCheck className="w-3.5 h-3.5 mr-1.5 text-gold" />
                Borrador de Dictamen Sugerido
              </>
            )}
          </Button>
        </div>

        <Textarea
          label="Dictamen y Observaciones de la Visita"
          {...register("observacionesEntrevista")}
          error={errors.observacionesEntrevista?.message}
          rows={6}
          placeholder="Describa la actitud, consistencia de las declaraciones, entorno vecinal y justificación del dictamen..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Dicción y Expresión"
            options={[
              { value: "fluida", label: "Fluida y elocuente" },
              { value: "coherente", label: "Coherente y precisa" },
              { value: "segura", label: "Segura y asertiva" },
              { value: "timida", label: "Tímida o reservada" },
              { value: "otro", label: "Otra observación" },
            ]}
            {...register("diccion")}
            error={errors.diccion?.message}
          />

          <Select
            label="Estado Físico de la Vivienda"
            options={[
              { value: "excelente", label: "Excelente (Materiales nobles, óptimo mantenimiento)" },
              { value: "bueno", label: "Bueno (Habitable, estructura sólida)" },
              { value: "regular", label: "Regular (Mantenimiento diferido o detalles menores)" },
              { value: "deficiente", label: "Deficiente (Hacinamiento o deterioro severo)" },
            ]}
            {...register("estadoVivienda")}
            error={errors.estadoVivienda?.message}
          />
        </div>

        <Input
          label="Personas Presentes Durante la Entrevista"
          placeholder="Ej: Postulante y su cónyuge"
          {...register("quienesPresentes")}
          error={errors.quienesPresentes?.message}
        />
        
        <Textarea
          label="Otras Observaciones o Verificación Vecinal"
          placeholder="Referencias de vecinos, acceso al barrio, seguridad de la zona..."
          {...register("otrasObservaciones")}
          error={errors.otrasObservaciones?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input type="date" label="Fecha de la Visita" {...register("fechaVisita")} error={errors.fechaVisita?.message} />
          <Input label="Firma / Nombre del Perito Consultor" {...register("consultorNombre")} error={errors.consultorNombre?.message} />
        </div>

        <div className="flex justify-between pt-4 border-t border-overlay0/30">
          <Button type="button" variant="secondary" size="lg" onClick={onPrev}>
            <ChevronLeft className="h-5 w-5 mr-2" /> Anterior
          </Button>
          <Button type="submit" size="lg" className="bg-gold text-black hover:bg-gold-light font-bold px-8 shadow-xl shadow-gold/20">
            Completar Entrevista <CheckCircle className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
