"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso9Schema, Paso9Data } from "@/lib/validations";
import { Input, Textarea, Toggle } from "@/components/ui/FormFields";
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
      limpiezaOrdenVivienda:
        defaultValues.limpiezaOrdenVivienda || "Ordenada y limpia",
      quienesPresentes: defaultValues.quienesPresentes || "Ninguno",
      vocabularioEntrevistado:
        defaultValues.vocabularioEntrevistado ||
        "Respetuosa y acorde a la situación",
      zonaFacilAcceso: defaultValues.zonaFacilAcceso ?? true,
      observacionesEntrevista:
        defaultValues.observacionesEntrevista ||
        "La persona entrevistada se muestra respetuosa y colaboradora. Vivienda ordenada y limpia.",
      otrasObservaciones: defaultValues.otrasObservaciones || "Ninguna",
      entrevistadorNombre:
        defaultValues.entrevistadorNombre || "Michelle Romero",
      fechaVisita:
        defaultValues.fechaVisita || new Date().toISOString().slice(0, 10),
      horaVisita: defaultValues.horaVisita || "19:03",
      consultorNombre:
        defaultValues.consultorNombre || "Lic. Michelle Romero",
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
    <form onSubmit={handleSubmit(onComplete)} className="space-y-5" noValidate>
      <div className="flex items-center justify-between border-b border-overlay0 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
              MÓDULO 09 DE 09 // OBSERVACIONES GENERALES
            </span>
            <h2 className="text-lg sm:text-xl font-black text-text">
              Constatación Final y Firma
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
          <span>Síntesis IA</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Limpieza y orden de la vivienda"
          placeholder="Ej: Ordenada y limpia"
          {...register("limpiezaOrdenVivienda")}
        />
        <Input
          label="Presencia de otras personas durante la entrevista"
          placeholder="Ej: Ninguno"
          {...register("quienesPresentes")}
        />
        <Input
          label="Vocabulario utilizado por la persona entrevistada"
          placeholder="Ej: Respetuosa y acorde a la situación"
          {...register("vocabularioEntrevistado")}
        />
      </div>

      <Toggle
        label="¿La zona es de fácil acceso?"
        checked={Boolean(watch("zonaFacilAcceso"))}
        onChange={(val) => setValue("zonaFacilAcceso", val)}
      />

      <Textarea
        label="Concepto / Observaciones de la entrevista"
        required
        rows={3}
        {...register("observacionesEntrevista")}
        error={errors.observacionesEntrevista?.message}
      />

      <Input
        label="Otras observaciones"
        placeholder="Ej: Ninguna"
        {...register("otrasObservaciones")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Input
          label="Entrevistador/a"
          placeholder="Ej: Michelle Romero"
          {...register("entrevistadorNombre")}
        />
        <Input
          label="Fecha de la visita"
          type="date"
          required
          {...register("fechaVisita")}
        />
        <Input
          label="Hora de la visita"
          type="time"
          {...register("horaVisita")}
        />
        <Input
          label="Licenciado/a Firmante"
          required
          placeholder="Ej: Lic. Michelle Romero"
          {...register("consultorNombre")}
          error={errors.consultorNombre?.message}
        />
      </div>

      <SignaturePad
        value={firmaActual}
        onChange={(dataUrl) => setValue("firmaEvaluador", dataUrl)}
      />

      <div className="rounded-2xl border border-overlay1 bg-surface1/70 p-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-subtext1">
          Descargar informe con todos los campos completados:
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
        <Button type="button" variant="secondary" onClick={onBack} className="w-full sm:w-auto">
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
