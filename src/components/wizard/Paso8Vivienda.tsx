"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso8Schema, Paso8Data } from "@/lib/validations";
import { Input, Select } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { GeoCapture } from "@/components/GeoCapture";
import { FotoUploader } from "@/components/FotoUploader";
import { AiStepAssistant } from "@/components/AiStepAssistant";
import { useInterviewMode } from "@/components/InterviewModeContext";
import {
  Home,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BedDouble,
  Sofa,
  Bath,
  Utensils,
  Layers,
  Hammer,
  Save,
} from "lucide-react";

interface Props {
  defaultValues: Partial<Paso8Data>;
  onAutoSave?: (partial: Record<string, unknown>) => Promise<void>;
  onNext: (data: Paso8Data) => void;
  onBack: () => void;
}

export function Paso8Vivienda({ defaultValues, onAutoSave, onNext, onBack }: Props) {
  const { isEvaluator, shouldHideField } = useInterviewMode();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Paso8Data>({
    resolver: zodResolver(paso8Schema),
    defaultValues: {
      ciudad: defaultValues.ciudad || "",
      barrio: defaultValues.barrio || "",
      direccion: defaultValues.direccion || "",
      coordenadas: defaultValues.coordenadas || "",
      plusCode: defaultValues.plusCode || "",
      tipoCamino: defaultValues.tipoCamino || "asfalto",
      tenenciaVivienda: defaultValues.tenenciaVivienda || "propia",
      cantidadPersonas: defaultValues.cantidadPersonas ?? 1,
      quienesVivenCasa: defaultValues.quienesVivenCasa || "",
      habitaciones: defaultValues.habitaciones ?? 1,
      salaCantidad: defaultValues.salaCantidad ?? 1,
      banos: defaultValues.banos ?? 1,
      cocinaCantidad: defaultValues.cocinaCantidad ?? 1,
      plantas: defaultValues.plantas ?? 1,
      paredesDetalle: defaultValues.paredesDetalle || "",
      techoDetalle: defaultValues.techoDetalle || "",
      pisosDetalle: defaultValues.pisosDetalle || "",
      fotosVivienda: defaultValues.fotosVivienda || [],
    },
  });

  const fotos = watch("fotosVivienda") || [];

  function handleFormBlur() {
    if (onAutoSave) {
      void onAutoSave(watch());
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onNext)}
      onBlur={handleFormBlur}
      className="space-y-6"
      noValidate
    >
      <div className="flex items-center justify-between border-b border-overlay0 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
              MÓDULO 08 // DATOS DE LA VIVIENDA
            </span>
            <h2 className="text-lg sm:text-xl font-black text-text">
              Ubicación, Dependencias y Materiales
            </h2>
          </div>
        </div>

        {onAutoSave && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              if (onAutoSave) void onAutoSave(watch());
            }}
          >
            <Save className="h-3.5 w-3.5 text-gold" />
            <span>Guardar Cambios</span>
          </Button>
        )}
      </div>

      <AiStepAssistant
        stepNumber={8}
        stepTitle="Datos de la Vivienda"
        placeholder="Dicte su ciudad, barrio, dirección y con quiénes vive..."
        onApplyFields={(extracted) => {
          Object.entries(extracted).forEach(([k, v]) => {
            if (typeof v === "string" && k !== "_rawAiText") {
              setValue(k as keyof Paso8Data, v as never, { shouldValidate: true });
            }
          });
        }}
      />

      <GeoCapture
        coordenadas={watch("coordenadas")}
        plusCode={watch("plusCode")}
        onCaptured={(data) => {
          setValue("coordenadas", data.coordenadas);
          setValue("plusCode", data.plusCode);
          if (data.ciudad && !watch("ciudad")) setValue("ciudad", data.ciudad);
          if (data.barrio && !watch("barrio")) setValue("barrio", data.barrio);
          if (onAutoSave) {
            void onAutoSave({
              ...watch(),
              coordenadas: data.coordenadas,
              plusCode: data.plusCode,
              ...(data.ciudad && !watch("ciudad") ? { ciudad: data.ciudad } : {}),
              ...(data.barrio && !watch("barrio") ? { barrio: data.barrio } : {}),
            });
          }
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {!shouldHideField("ciudad") && (
          <Input
            label="Ciudad"
            placeholder="Ingrese ciudad"
            {...register("ciudad")}
            error={errors.ciudad?.message}
          />
        )}
        {!shouldHideField("barrio") && (
          <Input
            label="Barrio"
            placeholder="Ingrese barrio"
            {...register("barrio")}
            error={errors.barrio?.message}
          />
        )}
        {!shouldHideField("direccion") && (
          <Input
            label="Dirección"
            placeholder="Ingrese calle y número"
            {...register("direccion")}
            error={errors.direccion?.message}
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Trayecto a la vivienda"
          options={[
            { value: "asfalto", label: "Camino asfaltado" },
            { value: "empedrado", label: "Camino empedrado" },
            { value: "tierra", label: "Camino de tierra" },
          ]}
          {...register("tipoCamino")}
        />
        <Select
          label="Propiedad de la vivienda"
          options={[
            { value: "propia", label: "Propia" },
            { value: "familiar", label: "De un familiar" },
            { value: "alquilada", label: "Alquilada" },
            { value: "prestada", label: "Prestada / Cedida" },
          ]}
          {...register("tenenciaVivienda")}
        />
        <Input
          label="Cantidad de habitantes en la casa"
          type="number"
          min={1}
          inputMode="numeric"
          {...register("cantidadPersonas")}
        />
      </div>

      {watch("tenenciaVivienda") === "alquilada" && (
        <Input
          label="Costo de Alquiler Mensual en Gs. (Si es alquilada)"
          placeholder="Ej: 1.800.000 Gs."
          type="number"
          min={0}
          inputMode="numeric"
          {...register("costoAlquiler", { valueAsNumber: true })}
        />
      )}

      <Input
        label="¿Quién vive en la casa junto a la persona entrevistada?"
        placeholder="Indique quiénes habitan en la vivienda"
        {...register("quienesVivenCasa")}
        error={errors.quienesVivenCasa?.message}
      />

      {/* Dependencias con íconos visuales para cada ambiente */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gold">
          <Home className="h-4 w-4" />
          <span>DEPENDENCIAS DE LA VIVIENDA Y PISOS</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-2.5 rounded-xl bg-surface0 border border-overlay0 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gold">
              <BedDouble className="h-3.5 w-3.5" /> Dormitorios
            </span>
            <Input type="number" min={0} {...register("habitaciones")} />
          </div>
          <div className="p-2.5 rounded-xl bg-surface0 border border-overlay0 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gold">
              <Sofa className="h-3.5 w-3.5" /> Salas
            </span>
            <Input type="number" min={0} {...register("salaCantidad")} />
          </div>
          <div className="p-2.5 rounded-xl bg-surface0 border border-overlay0 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gold">
              <Bath className="h-3.5 w-3.5" /> Baños
            </span>
            <Input type="number" min={0} {...register("banos")} />
          </div>
          <div className="p-2.5 rounded-xl bg-surface0 border border-overlay0 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gold">
              <Utensils className="h-3.5 w-3.5" /> Cocinas
            </span>
            <Input type="number" min={0} {...register("cocinaCantidad")} />
          </div>
          <div className="p-2.5 rounded-xl bg-surface0 border border-overlay0 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gold">
              <Layers className="h-3.5 w-3.5" /> Nº de Pisos
            </span>
            <Input type="number" min={1} {...register("plantas")} />
          </div>
        </div>
      </div>

      {/* Materiales con ícono */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gold">
          <Hammer className="h-4 w-4" />
          <span>MATERIALES DE CONSTRUCCIÓN</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Material de las paredes"
            placeholder="Indique material de paredes"
            {...register("paredesDetalle")}
            error={errors.paredesDetalle?.message}
          />
          <Input
            label="Material del techo"
            placeholder="Indique material del techo"
            {...register("techoDetalle")}
            error={errors.techoDetalle?.message}
          />
          <Input
            label="Material del piso"
            placeholder="Indique material del piso"
            {...register("pisosDetalle")}
            error={errors.pisosDetalle?.message}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gold/40 bg-surface1/60 p-4 space-y-2">
        <span className="text-xs font-mono font-bold uppercase text-gold block">
          FOTOGRAFÍAS DE LA FACHADA / VIVIENDA (SE INSERTAN COMPLETAS EN EL INFORME)
        </span>
        <FotoUploader
          fotos={fotos}
          onChange={(nuevas) => {
            setValue("fotosVivienda", nuevas, { shouldDirty: true, shouldValidate: true });
            if (onAutoSave) {
              void onAutoSave({ ...watch(), fotosVivienda: nuevas });
            }
          }}
          maxFotos={4}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-overlay0">
        <Button type="button" variant="secondary" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {onAutoSave && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (onAutoSave) void onAutoSave(watch());
              }}
              className="w-full sm:w-auto"
            >
              <Save className="h-4 w-4 text-gold" />
              <span>Guardar</span>
            </Button>
          )}
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            {isEvaluator ? (
              <>
                <span>Siguiente: Observaciones del Evaluador</span>
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Finalizar y Enviar Mis Datos</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
