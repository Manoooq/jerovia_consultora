"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso1Schema, Paso1Data } from "@/lib/validations";
import { Input, Select, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { FotoUploader } from "@/components/FotoUploader";
import { AiStepAssistant } from "@/components/AiStepAssistant";
import { useInterviewMode } from "@/components/InterviewModeContext";
import { User, ArrowRight } from "lucide-react";

interface Props {
  defaultValues: Partial<Paso1Data>;
  onNext: (data: Paso1Data) => void;
}

export function Paso1Personal({ defaultValues, onNext }: Props) {
  const { isEvaluator, shouldHideField } = useInterviewMode();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Paso1Data>({
    resolver: zodResolver(paso1Schema),
    defaultValues: {
      nombre: defaultValues.nombre || "",
      apellido: defaultValues.apellido || "",
      fotoCandidato: defaultValues.fotoCandidato || "",
      cedula: defaultValues.cedula || "",
      fechaNacimiento: defaultValues.fechaNacimiento || "",
      telefono: defaultValues.telefono || "",
      email: defaultValues.email || "",
      estadoCivil: defaultValues.estadoCivil || "soltero",
      hijos: defaultValues.hijos ?? false,
      cantidadHijos: defaultValues.cantidadHijos ?? 0,
      edadesHijos: defaultValues.edadesHijos || "",
      licenciaConducir: defaultValues.licenciaConducir ?? false,
      movilidadPropia: defaultValues.movilidadPropia ?? false,
      tipoMovilidad: defaultValues.tipoMovilidad || "",
      medioTransporteSucursal: defaultValues.medioTransporteSucursal || "",
      tiempoViajeSucursal: defaultValues.tiempoViajeSucursal || "",
      tieneTatuajes: defaultValues.tieneTatuajes || "no",
      tatuajesVisibles: defaultValues.tatuajesVisibles || "no_visibles",
      zonaTatuada: defaultValues.zonaTatuada || "",
      redSocialPlataforma: defaultValues.redSocialPlataforma || "Instagram",
      redSocial: defaultValues.redSocial || "",
    },
  });

  const tieneHijos = watch("hijos");
  const movilidad = watch("movilidadPropia");
  const tatuajes = watch("tieneTatuajes");
  const fotoActual = watch("fotoCandidato");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5" noValidate>
      <div className="flex items-center gap-3 border-b border-overlay0 pb-3.5">
        <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
          <User className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
            MÓDULO 01 // DATOS PERSONALES
          </span>
          <h2 className="text-lg sm:text-xl font-black text-text">
            Identificación, Traslado y Redes
          </h2>
        </div>
      </div>

      <AiStepAssistant
        stepNumber={1}
        stepTitle="Datos Personales"
        placeholder="Dicte o escriba sus datos personales para autocompletar las casillas..."
        onApplyFields={(extracted) => {
          Object.entries(extracted).forEach(([k, v]) => {
            if (v !== undefined && k !== "_rawAiText") {
              setValue(k as keyof Paso1Data, v as never, { shouldValidate: true });
            }
          });
        }}
      />

      {/* La fotografía solo puede verla y subirla el Evaluador */}
      {isEvaluator && (
        <div className="rounded-2xl border border-gold/40 bg-surface1/60 p-4 space-y-2">
          <span className="text-xs font-mono font-bold uppercase text-gold block">
            FOTOGRAFÍA DEL POSTULANTE (EXCLUSIVO EVALUADOR)
          </span>
          <FotoUploader
            fotos={fotoActual ? [fotoActual] : []}
            onChange={(arr) => setValue("fotoCandidato", arr[0] || "")}
            maxFotos={1}
          />
        </div>
      )}

      {(!shouldHideField("nombre") || !shouldHideField("apellido")) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!shouldHideField("nombre") && (
            <Input
              label="Nombres"
              required
              placeholder="Ingrese sus nombres"
              {...register("nombre")}
              error={errors.nombre?.message}
            />
          )}
          {!shouldHideField("apellido") && (
            <Input
              label="Apellidos"
              required
              placeholder="Ingrese sus apellidos"
              {...register("apellido")}
              error={errors.apellido?.message}
            />
          )}
        </div>
      )}

      {(!shouldHideField("cedula") ||
        !shouldHideField("fechaNacimiento") ||
        !shouldHideField("telefono")) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {!shouldHideField("cedula") && (
            <Input
              label="Número de Cédula"
              required
              inputMode="numeric"
              placeholder="Ingrese número de documento"
              {...register("cedula")}
              error={errors.cedula?.message}
            />
          )}
          {!shouldHideField("fechaNacimiento") && (
            <Input
              label="Fecha de Nacimiento"
              type="date"
              {...register("fechaNacimiento")}
            />
          )}
          {!shouldHideField("telefono") && (
            <Input
              label="Número de Teléfono"
              type="tel"
              required
              placeholder="Ingrese número de contacto"
              {...register("telefono")}
              error={errors.telefono?.message}
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!shouldHideField("estadoCivil") && (
          <Select
            label="Estado Civil"
            options={[
              { value: "soltero", label: "Soltero/a" },
              { value: "casado", label: "Casado/a" },
              { value: "conviviente", label: "Conviviente / Unión Libre" },
              { value: "divorciado", label: "Divorciado/a" },
              { value: "viudo", label: "Viudo/a" },
            ]}
            {...register("estadoCivil")}
          />
        )}
        {!shouldHideField("email") && (
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="Ingrese correo electrónico"
            {...register("email")}
          />
        )}
      </div>

      <div className="space-y-3">
        <Toggle
          label="¿Tiene hijos/as?"
          checked={Boolean(tieneHijos)}
          onChange={(val) => setValue("hijos", val)}
        />
        {tieneHijos && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-3 border-l-2 border-gold">
            <Input
              label="Cantidad de hijos/as"
              type="number"
              min={1}
              {...register("cantidadHijos")}
            />
            <Input
              label="Edades de los hijos/as"
              placeholder="Indique las edades"
              {...register("edadesHijos")}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Toggle
          label="¿Cuenta con movilidad propia?"
          checked={Boolean(movilidad)}
          onChange={(val) => setValue("movilidadPropia", val)}
        />
        <Toggle
          label="¿Posee licencia de conducir vigente?"
          checked={Boolean(watch("licenciaConducir"))}
          onChange={(val) => setValue("licenciaConducir", val)}
        />
      </div>

      {movilidad && (
        <Input
          label="Tipo y características de su movilidad propia"
          placeholder="Indique tipo de vehículo y modelo"
          {...register("tipoMovilidad")}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="¿Con qué medio irá generalmente a la sucursal asignada?"
          placeholder="Indique medio de transporte habitual"
          {...register("medioTransporteSucursal")}
        />
        <Input
          label="¿Cuánto tiempo le toma ir de su casa a la sucursal asignada?"
          placeholder="Indique tiempo estimado de viaje"
          {...register("tiempoViajeSucursal")}
        />
      </div>

      {/* Bloque completo de preguntas sobre Tatuajes */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <span className="text-xs font-mono font-bold uppercase text-gold block">
          TATUAJES
        </span>
        <Toggle
          label="¿Tiene tatuajes?"
          checked={tatuajes !== "no"}
          onChange={(val) => {
            setValue("tieneTatuajes", val ? "si" : "no");
            if (!val) {
              setValue("zonaTatuada", "");
            }
          }}
        />

        {tatuajes !== "no" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-overlay0">
            <Select
              label="¿Los tatuajes son visibles con vestimenta formal?"
              options={[
                { value: "no_visibles", label: "No son visibles" },
                { value: "visibles", label: "Sí, son visibles" },
              ]}
              {...register("tatuajesVisibles")}
            />
            <Input
              label="¿En qué zona tiene los tatuajes?"
              placeholder="Indique la zona tatuada"
              {...register("zonaTatuada")}
            />
          </div>
        )}
      </div>

      {/* ¿Red social que más uses? */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <span className="text-xs font-mono font-bold uppercase text-gold block">
          ¿RED SOCIAL QUE MÁS USES?
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="¿Red social que más uses?"
            options={[
              { value: "Instagram", label: "Instagram" },
              { value: "Facebook", label: "Facebook" },
              { value: "TikTok", label: "TikTok" },
              { value: "LinkedIn", label: "LinkedIn" },
              { value: "Otra", label: "Otra red social" },
              { value: "Ninguna", label: "No utilizo redes sociales" },
            ]}
            {...register("redSocialPlataforma")}
          />
          <Input
            label="Usuario o nombre de perfil"
            placeholder="Ingrese su usuario"
            {...register("redSocial")}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-overlay0">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <span>Siguiente: Estudios e Idiomas</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
