"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  paso9Schema,
  type Paso9Data,
  type FormularioCompleto,
} from "@/lib/validations";
import { Input, Select, Textarea } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import {
  ChevronLeft,
  CheckCircle2,
  FileCheck,
  Scale,
  MapPin,
  UserCheck,
} from "lucide-react";

interface PasoProps {
  defaultValues?: Partial<Paso9Data>;
  data?: Partial<FormularioCompleto>;
  onNext: (data: Paso9Data) => void;
  onPrev: () => void;
}

export function Paso9_Conclusion({
  defaultValues,
  data,
  onNext,
  onPrev,
}: PasoProps) {
  const [sintetizando, setSintetizando] = useState(false);

  const todayIso = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Paso9Data>({
    // @ts-expect-error — RHF + Zod optional default inference compatibility
    resolver: zodResolver(paso9Schema),
    defaultValues: {
      fechaVisita: defaultValues?.fechaVisita || todayIso,
      consultorNombre:
        defaultValues?.consultorNombre || "Lic. Michelle Romero",
      ...defaultValues,
    },
  });

  async function handleSintetizar() {
    setSintetizando(true);
    try {
      const response = await fetch("/api/ai/sintetizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datosCompletos: data,
          observacionActual: watch("observacionesEntrevista"),
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.sintesis) {
          setValue("observacionesEntrevista", result.sintesis, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    } catch (e) {
      console.error("Error al sintetizar dictamen:", e);
    } finally {
      setSintetizando(false);
    }
  }

  const onSubmit: SubmitHandler<Paso9Data> = (formData) => onNext(formData);

  return (
    <form
      onSubmit={handleSubmit(onSubmit as SubmitHandler<Record<string, unknown>>)}
      className="flex flex-col gap-6"
      noValidate
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-overlay0/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 shrink-0">
            <Scale className="h-5 w-5 text-gold" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-text">
              9. Conclusión y Dictamen Pericial
            </h2>
            <p className="text-xs text-subtext0">
              Valoración técnica final para el Comité de Riesgos
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSintetizar}
          loading={sintetizando}
          className="self-start sm:self-auto"
        >
          <FileCheck className="h-4 w-4 text-gold" />
          <span>
            {sintetizando
              ? "Generando síntesis..."
              : "Redactar Borrador con Datos Relevados"}
          </span>
        </Button>
      </div>

      {/* Tarjeta de Resumen Pre-Emisión */}
      {data && (
        <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-gold shrink-0" />
            <div className="truncate">
              <span className="text-subtext0 block">Postulante</span>
              <span className="font-bold text-text truncate">
                {data.nombre || "Sin nombre"} {data.apellido || ""}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gold shrink-0" />
            <div className="truncate">
              <span className="text-subtext0 block">Ubicación Relevada</span>
              <span className="font-bold text-text truncate">
                {data.ciudad || "Gran Asunción"}{" "}
                {data.barrio ? `• ${data.barrio}` : ""}
              </span>
            </div>
          </div>
          <div className="truncate">
            <span className="text-subtext0 block">Coordenada GPS</span>
            <span className="font-mono font-bold text-gold tabular-nums">
              {data.coordenadas || "Pendiente de fijar"}
            </span>
          </div>
        </div>
      )}

      <Textarea
        label="Dictamen Técnico y Concepto Integral de la Visita"
        required
        rows={6}
        placeholder="Fundamente la verificación domiciliaria, el arraigo vecinal constatado, la coherencia socioeconómica y la recomendación final..."
        {...register("observacionesEntrevista")}
        error={errors.observacionesEntrevista?.message}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Desenvolvimiento y Comunicación del Entrevistado"
          options={[
            { value: "fluida", label: "Fluida, transparente y colaborativa" },
            { value: "coherente", label: "Coherente y precisa" },
            { value: "segura", label: "Segura y asertiva" },
            { value: "timida", label: "Reservada / Escueta" },
            { value: "otro", label: "Con contradicciones (detallar abajo)" },
          ]}
          {...register("diccion")}
          error={errors.diccion?.message}
        />

        <Select
          label="Calificación del Estado Físico del Inmueble"
          options={[
            {
              value: "excelente",
              label: "Excelente (Materiales nobles y óptimo mantenimiento)",
            },
            {
              value: "bueno",
              label: "Bueno (Estructura sólida y habitable)",
            },
            {
              value: "regular",
              label: "Regular (Mantenimiento diferido)",
            },
            {
              value: "deficiente",
              label: "Deficiente (Precariedad o deterioro severo)",
            },
          ]}
          {...register("estadoVivienda")}
          error={errors.estadoVivienda?.message}
        />
      </div>

      <Input
        label="Personas Presentes Durante la Inspección"
        placeholder="Ej: Titular y cónyuge"
        {...register("quienesPresentes")}
        error={errors.quienesPresentes?.message}
      />

      <Textarea
        label="Referencias Vecinales y Observaciones del Entorno"
        rows={3}
        placeholder="Concepto de vecinos consultados en la cuadra, seguridad de la zona y servicios básicos..."
        {...register("otrasObservaciones")}
        error={errors.otrasObservaciones?.message}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Fecha Efectiva de Inspección"
          {...register("fechaVisita")}
          error={errors.fechaVisita?.message}
        />
        <Input
          label="Perito Evaluador Actuante (Firma)"
          {...register("consultorNombre")}
          error={errors.consultorNombre?.message}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-overlay0/50">
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
          className="w-full sm:w-auto min-w-[220px]"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Emitir Dictamen Final</span>
        </Button>
      </div>
    </form>
  );
}
