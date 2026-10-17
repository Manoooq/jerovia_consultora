"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso9Schema, Paso9Data } from "@/lib/validations";
import { Input, Select, Textarea } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { SignaturePad } from "@/components/SignaturePad";
import {
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  Scale,
} from "lucide-react";

interface Props {
  defaultValues: Partial<Paso9Data>;
  allData: Record<string, unknown>;
  token: string;
  onComplete: (data: Paso9Data) => void;
  onBack: () => void;
}

export function Paso9Observaciones({
  defaultValues,
  allData,
  token,
  onComplete,
  onBack,
}: Props) {
  const [aiLoading, setAiLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Paso9Data>({
    resolver: zodResolver(paso9Schema),
    defaultValues: {
      observacionesEntrevista: defaultValues.observacionesEntrevista || "",
      diccion: defaultValues.diccion || "fluida",
      estadoVivienda: defaultValues.estadoVivienda || "bueno",
      quienesPresentes:
        defaultValues.quienesPresentes ||
        "En el momento de la visita, se encontraba solo en la vivienda.",
      otrasObservaciones:
        defaultValues.otrasObservaciones ||
        "La vivienda se encontró en orden y limpieza.",
      fechaVisita:
        defaultValues.fechaVisita || new Date().toISOString().slice(0, 10),
      consultorNombre: defaultValues.consultorNombre || "Michelle Romero",
      firmaEvaluador: defaultValues.firmaEvaluador || "",
    },
  });

  const firmaActual = watch("firmaEvaluador");

  async function handleGenerarSintesisIA() {
    setAiLoading(true);
    try {
      const currentValues = watch();
      const res = await fetch("/api/ai/sintetizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datosCompletos: { ...allData, ...currentValues },
        }),
      });
      const json = await res.json();
      if (json.sintesis) {
        setValue("observacionesEntrevista", json.sintesis, {
          shouldValidate: true,
        });
      }
    } catch (e) {
      console.error("Error generando síntesis:", e);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onComplete)} className="space-y-6" noValidate>
      <div className="flex items-center justify-between border-b border-overlay0 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
              MÓDULO 09 DE 09 // CIERRE PERICIAL
            </span>
            <h2 className="text-lg sm:text-xl font-black text-text">
              Observaciones de la Visita y Firma
            </h2>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          loading={aiLoading}
          onClick={handleGenerarSintesisIA}
        >
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          <span>Redactar con IA</span>
        </Button>
      </div>

      <Textarea
        label="Observaciones durante la entrevista"
        required
        rows={4}
        placeholder="Ej: Se muestra como una persona amable y cooperadora..."
        {...register("observacionesEntrevista")}
        error={errors.observacionesEntrevista?.message}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Personas presentes en la vivienda"
          placeholder="Ej: En el momento de la visita, se encontraba solo en la vivienda."
          {...register("quienesPresentes")}
        />
        <Select
          label="Dicción y Comunicación"
          required
          options={[
            { value: "fluida", label: "Fluida y coherente" },
            { value: "coherente", label: "Coherente" },
            { value: "segura", label: "Segura" },
            { value: "timida", label: "Tímida / Reservada" },
            { value: "otro", label: "Otro" },
          ]}
          {...register("diccion")}
          error={errors.diccion?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Otras observaciones (Orden y limpieza)"
          placeholder="Ej: La vivienda se encontró en orden y limpieza."
          {...register("otrasObservaciones")}
        />
        <Select
          label="Estado General de la Vivienda"
          required
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Visita realizada en (Fecha)"
          type="date"
          required
          {...register("fechaVisita")}
          error={errors.fechaVisita?.message}
        />
        <Input
          label="Realizado por (Nombre del Perito)"
          required
          placeholder="Michelle Romero"
          {...register("consultorNombre")}
          error={errors.consultorNombre?.message}
        />
      </div>

      {/* Pad de Firma Táctil */}
      <SignaturePad
        value={firmaActual}
        onChange={(dataUrl) => setValue("firmaEvaluador", dataUrl)}
      />

      {/* Botones rápidos de previsualización del informe */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/70 p-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-subtext1">
          Vista previa del informe confidencial de 5 páginas:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`/api/exportar/${token}?formato=pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[38px] px-3.5 rounded-xl border border-overlay1 bg-surface0 hover:border-gold text-xs font-bold text-text inline-flex items-center gap-1.5"
          >
            <FileText className="h-3.5 w-3.5 text-gold" />
            <span>Ver PDF (5 Páginas)</span>
          </a>
          <a
            href={`/api/exportar/${token}?formato=pptx`}
            className="min-h-[38px] px-3.5 rounded-xl border border-overlay1 bg-surface0 hover:border-gold text-xs font-bold text-text inline-flex items-center gap-1.5"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-gold" />
            <span>Descargar .PPTX</span>
          </a>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-overlay0">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <CheckCircle2 className="h-4 w-4" />
          <span>Finalizar y Guardar Informe</span>
        </Button>
      </div>
    </form>
  );
}
