"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso9Schema, Paso9Data } from "@/lib/validations";
import { Input, Select, Textarea, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { SignaturePad } from "@/components/SignaturePad";
import { FotoUploader } from "@/components/FotoUploader";
import {
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  Scale,
  Camera,
  Loader2,
} from "lucide-react";

interface Props {
  defaultValues: Partial<Paso9Data> & {
    fotoCandidato?: string;
    fotosVivienda?: string[];
  };
  allData: Record<string, unknown>;
  token: string;
  onAutoSave?: (partial: Record<string, unknown>) => Promise<void>;
  onComplete: (
    data: Paso9Data & { fotoCandidato?: string; fotosVivienda?: string[] }
  ) => void;
  onBack: () => void;
}

export function Paso9Observaciones({
  defaultValues,
  allData,
  token,
  onAutoSave,
  onComplete,
  onBack,
}: Props) {
  const [aiLoading, setAiLoading] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<
    "pdf" | "pptx" | null
  >(null);
  const [fotoCandidato, setFotoCandidato] = useState<string>(
    (defaultValues.fotoCandidato as string) ||
      (allData.fotoCandidato as string) ||
      ""
  );
  const [fotosVivienda, setFotosVivienda] = useState<string[]>(
    Array.isArray(defaultValues.fotosVivienda)
      ? defaultValues.fotosVivienda
      : Array.isArray(allData.fotosVivienda)
      ? (allData.fotosVivienda as string[])
      : []
  );

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
        "Respetuoso y acorde a la situación",
      diccion: defaultValues.diccion || "fluida",
      estadoVivienda: defaultValues.estadoVivienda || "bueno",
      zonaFacilAcceso: defaultValues.zonaFacilAcceso ?? true,
      observacionesEntrevista:
        defaultValues.observacionesEntrevista ||
        "La persona entrevistada se muestra respetuosa y colaboradora. Vivienda ordenada y limpia.",
      otrasObservaciones: defaultValues.otrasObservaciones || "Ninguna",
      entrevistadorNombre:
        defaultValues.entrevistadorNombre || "Lic. Michelle Romero",
      fechaVisita:
        defaultValues.fechaVisita || new Date().toISOString().slice(0, 10),
      horaVisita: defaultValues.horaVisita || "19:00",
      consultorNombre:
        defaultValues.consultorNombre || "Lic. Michelle Romero",
      firmaEvaluador: defaultValues.firmaEvaluador || "",
    },
  });

  const firmaActual = watch("firmaEvaluador");

  async function handleFotoCandidatoChange(arr: string[]) {
    const nueva = arr[0] || "";
    setFotoCandidato(nueva);
    if (onAutoSave) {
      await onAutoSave({ ...watch(), fotoCandidato: nueva, fotosVivienda });
    }
  }

  async function handleFotosViviendaChange(nuevas: string[]) {
    setFotosVivienda(nuevas);
    if (onAutoSave) {
      await onAutoSave({ ...watch(), fotoCandidato, fotosVivienda: nuevas });
    }
  }

  async function handleOpenReport(formato: "pdf" | "pptx") {
    setExportingFormat(formato);
    try {
      if (onAutoSave) {
        await onAutoSave({
          ...watch(),
          fotoCandidato,
          fotosVivienda,
        });
      }
      const url = `/api/exportar/${token}?formato=${formato}&t=${Date.now()}`;
      if (formato === "pdf") {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = url;
      }
    } finally {
      setExportingFormat(null);
    }
  }

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
    <form
      onSubmit={handleSubmit((formData) =>
        onComplete({
          ...formData,
          fotoCandidato,
          fotosVivienda,
        })
      )}
      className="space-y-6"
      noValidate
    >
      <div className="flex items-center justify-between border-b border-overlay0 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
              MÓDULO 09 // EXCLUSIVO EVALUADOR
            </span>
            <h2 className="text-lg sm:text-xl font-black text-text">
              Fotografías, Observaciones y Firma
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

      <div className="rounded-2xl border border-gold/50 bg-surface1/70 p-4 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gold">
          <Camera className="h-4 w-4" />
          <span>REGISTRO FOTOGRÁFICO PARA EL INFORME (PDF Y PPTX)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 space-y-1.5">
            <span className="text-xs font-bold text-text block">
              1. Foto del Postulante (Sale en Pág. 1)
            </span>
            <FotoUploader
              fotos={fotoCandidato ? [fotoCandidato] : []}
              onChange={handleFotoCandidatoChange}
              maxFotos={1}
            />
          </div>

          <div className="md:col-span-8 space-y-1.5">
            <span className="text-xs font-bold text-text block">
              2. Fotos de la Vivienda y Ubicación (Salen en Pág. 3)
            </span>
            <FotoUploader
              fotos={fotosVivienda}
              onChange={handleFotosViviendaChange}
              maxFotos={4}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Limpieza y orden de la vivienda"
          placeholder="Ordenada y limpia"
          {...register("limpiezaOrdenVivienda")}
        />
        <Input
          label="Presencia de otras personas durante la entrevista"
          placeholder="Ninguno"
          {...register("quienesPresentes")}
        />
        <Input
          label="Vocabulario utilizado por la persona entrevistada"
          placeholder="Respetuoso y acorde a la situación"
          {...register("vocabularioEntrevistado")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Dicción y expresión del entrevistado/a"
          options={[
            { value: "fluida", label: "Fluida y elocuente" },
            { value: "coherente", label: "Coherente y precisa" },
            { value: "segura", label: "Segura y asertiva" },
            { value: "timida", label: "Tímida o reservada" },
            { value: "otro", label: "Otra observación" },
          ]}
          {...register("diccion")}
        />
        <Select
          label="Estado físico y conservación de la vivienda"
          options={[
            {
              value: "excelente",
              label: "Excelente (Materiales nobles, óptimo mantenimiento)",
            },
            { value: "bueno", label: "Bueno (Habitable, estructura sólida)" },
            {
              value: "regular",
              label: "Regular (Mantenimiento diferido o detalles menores)",
            },
            {
              value: "deficiente",
              label: "Deficiente (Hacinamiento o deterioro severo)",
            },
          ]}
          {...register("estadoVivienda")}
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
        placeholder="Ninguna"
        {...register("otrasObservaciones")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Input
          label="Entrevistador/a"
          placeholder="Nombre del entrevistador/a"
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
          placeholder="Nombre del firmante"
          {...register("consultorNombre")}
          error={errors.consultorNombre?.message}
        />
      </div>

      <SignaturePad
        value={firmaActual}
        onChange={async (dataUrl) => {
          setValue("firmaEvaluador", dataUrl);
          if (onAutoSave) {
            await onAutoSave({
              ...watch(),
              firmaEvaluador: dataUrl,
              fotoCandidato,
              fotosVivienda,
            });
          }
        }}
      />

      <div className="rounded-2xl border border-overlay1 bg-surface1/70 p-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-subtext1">
          Exportar informe oficial de 5 páginas con fotos y firma:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={exportingFormat !== null}
            onClick={() => handleOpenReport("pdf")}
            className="min-h-[38px] px-4 rounded-xl bg-gold text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {exportingFormat === "pdf" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FileText className="h-3.5 w-3.5" />
            )}
            <span>Ver PDF (5 Páginas)</span>
          </button>

          <button
            type="button"
            disabled={exportingFormat !== null}
            onClick={() => handleOpenReport("pptx")}
            className="min-h-[38px] px-4 rounded-xl border border-overlay1 bg-surface0 hover:border-gold text-xs font-bold text-text inline-flex items-center gap-1.5 cursor-pointer"
          >
            {exportingFormat === "pptx" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-gold" />
            ) : (
              <FileSpreadsheet className="h-3.5 w-3.5 text-gold" />
            )}
            <span>Descargar .PPTX (5 Páginas)</span>
          </button>
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
