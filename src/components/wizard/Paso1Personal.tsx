"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso1Schema, Paso1Data } from "@/lib/validations";
import { Input, Select, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { FotoUploader } from "@/components/FotoUploader";
import { AiStepAssistant } from "@/components/AiStepAssistant";
import { User, ArrowRight } from "lucide-react";

interface Props {
  defaultValues: Partial<Paso1Data>;
  onNext: (data: Paso1Data) => void;
}

export function Paso1Personal({ defaultValues, onNext }: Props) {
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
      medioTransporteSucursal: defaultValues.medioTransporteSucursal || "Ómnibus",
      tiempoViajeSucursal: defaultValues.tiempoViajeSucursal || "30 Minutos",
      tieneTatuajes: defaultValues.tieneTatuajes || "no",
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
            MÓDULO 01 DE 09 // DATOS PERSONALES
          </span>
          <h2 className="text-lg sm:text-xl font-black text-text">
            Identificación, Traslado y Redes
          </h2>
        </div>
      </div>

      <AiStepAssistant
        stepTitle="Datos Personales"
        placeholder="Ej: Me llamo Stefanie Lovera, CI 6260899, teléfono 0983603215..."
        onApplyFields={(extracted) => {
          Object.entries(extracted).forEach(([k, v]) => {
            if (typeof v === "string" && k !== "_rawAiText") {
              setValue(k as keyof Paso1Data, v as never, { shouldValidate: true });
            }
          });
        }}
      />

      <div className="space-y-1.5">
        <span className="text-xs font-bold text-text block">
          Fotografía del Postulante (Opcional)
        </span>
        <FotoUploader
          fotos={fotoActual ? [fotoActual] : []}
          onChange={(arr) => setValue("fotoCandidato", arr[0] || "")}
          maxFotos={1}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombres"
          required
          placeholder="Ej: Stefanie Raquel"
          {...register("nombre")}
          error={errors.nombre?.message}
        />
        <Input
          label="Apellidos"
          required
          placeholder="Ej: Lovera Ruíz Díaz"
          {...register("apellido")}
          error={errors.apellido?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Número de Cédula"
          required
          inputMode="numeric"
          placeholder="Ej: 6.260.899"
          {...register("cedula")}
          error={errors.cedula?.message}
        />
        <Input
          label="Fecha de Nacimiento"
          type="date"
          {...register("fechaNacimiento")}
        />
        <Input
          label="Número de Teléfono"
          type="tel"
          required
          placeholder="Ej: 0983 603215"
          {...register("telefono")}
          error={errors.telefono?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <Input
          label="Correo Electrónico (Opcional)"
          type="email"
          placeholder="postulante@correo.com"
          {...register("email")}
        />
      </div>

      <div className="space-y-3">
        <Toggle
          label="¿Tiene hijos/as?"
          checked={Boolean(tieneHijos)}
          onChange={(val) => setValue("hijos", val)}
        />
        {tieneHijos && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-2 border-l-2 border-gold">
            <Input
              label="Cantidad de hijos/as"
              type="number"
              min={1}
              {...register("cantidadHijos")}
            />
            <Input
              label="Edades de los hijos/as"
              placeholder="Ej: 4 y 7 años"
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
          placeholder="Ej: Automóvil Toyota Allion / Motocicleta"
          {...register("tipoMovilidad")}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="¿Con qué medio irá generalmente a la sucursal asignada?"
          placeholder="Ej: Ómnibus / Vehículo propio"
          {...register("medioTransporteSucursal")}
        />
        <Input
          label="¿Cuánto tiempo le toma ir de su casa a la sucursal asignada?"
          placeholder="Ej: 30 Minutos"
          {...register("tiempoViajeSucursal")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="¿Tiene tatuajes?"
          options={[
            { value: "no", label: "No" },
            { value: "si_no_visibles", label: "Sí - No son visibles" },
            { value: "si_visibles", label: "Sí - Son visibles" },
          ]}
          {...register("tieneTatuajes")}
        />
        {tatuajes !== "no" && (
          <Input
            label="Zona tatuada"
            placeholder="Ej: Hombro y antebrazo"
            {...register("zonaTatuada")}
          />
        )}
      </div>

      {/* Campo solicitado: "¿Red social que más uses?" */}
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
              { value: "Ninguna", label: "No utilizo redes sociales" },
            ]}
            {...register("redSocialPlataforma")}
          />
          <Input
            label="Tu usuario o perfil en esa red social"
            placeholder="Ej: Stefani-lovera"
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
