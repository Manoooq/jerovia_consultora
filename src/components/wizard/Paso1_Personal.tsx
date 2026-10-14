"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso1Schema, type Paso1Data } from "@/lib/validations";
import { Input, Select, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { VoiceCapture } from "@/components/VoiceCapture";
import { ChevronRight, User, Car, Users } from "lucide-react";

const ESTADO_CIVIL_OPTS = [
  { value: "soltero", label: "Soltero/a" },
  { value: "casado", label: "Casado/a" },
  { value: "conviviente", label: "Unión de hecho / Conviviente" },
  { value: "divorciado", label: "Divorciado/a" },
  { value: "viudo", label: "Viudo/a" },
];

interface Paso1Props {
  defaultValues?: Partial<Paso1Data>;
  onNext: (data: Paso1Data) => void;
}

export function Paso1Personal({ defaultValues, onNext }: Paso1Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Paso1Data>({
    // @ts-expect-error — RHF + Zod optional default inference compatibility
    resolver: zodResolver(paso1Schema),
    defaultValues: {
      licenciaConducir: false,
      movilidadPropia: false,
      vinculosFamiliares: false,
      ...defaultValues,
    },
  });

  const licencia = Boolean(watch("licenciaConducir"));
  const movilidad = Boolean(watch("movilidadPropia"));
  const vinculos = Boolean(watch("vinculosFamiliares"));

  function handleVoice(data: Record<string, unknown>) {
    const fields: (keyof Paso1Data)[] = [
      "nombre",
      "apellido",
      "cedula",
      "telefono",
      "email",
    ];
    fields.forEach((f) => {
      if (typeof data[f] === "string" && data[f]) {
        setValue(f, data[f] as string, { shouldValidate: true, shouldDirty: true });
      }
    });
    if (typeof data.estadoCivil === "string" && data.estadoCivil) {
      setValue("estadoCivil", data.estadoCivil as Paso1Data["estadoCivil"], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }

  const onSubmit: SubmitHandler<Paso1Data> = (formData) => {
    onNext(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit as SubmitHandler<Record<string, unknown>>)}
      className="flex flex-col gap-6"
      noValidate
    >
      {/* Cabecera del Módulo */}
      <div className="flex items-center gap-3 pb-4 border-b border-overlay0/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 shrink-0">
          <User className="h-5 w-5 text-gold" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text">
            1. Identificación y Datos Personales
          </h2>
          <p className="text-xs text-subtext0">
            Filiación, documento de identidad y canales de contacto del postulante
          </p>
        </div>
      </div>

      {/* Dictado por Voz asistido */}
      <VoiceCapture onExtracted={handleVoice} />

      {/* Bloque 1: Filiación y Contacto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombres"
          required
          autoComplete="given-name"
          error={errors.nombre?.message}
          {...register("nombre")}
          placeholder="Ej: Tobías Maximiliano"
        />
        <Input
          label="Apellidos"
          required
          autoComplete="family-name"
          error={errors.apellido?.message}
          {...register("apellido")}
          placeholder="Ej: Sánchez Alvarenga"
        />
        <Input
          label="Cédula de Identidad Civil (CI)"
          required
          inputMode="numeric"
          error={errors.cedula?.message}
          {...register("cedula")}
          placeholder="Ej: 5.551.895"
        />
        <Input
          label="Fecha de Nacimiento"
          type="date"
          required
          error={errors.fechaNacimiento?.message}
          {...register("fechaNacimiento")}
        />
        <Select
          label="Estado Civil"
          required
          options={ESTADO_CIVIL_OPTS}
          error={errors.estadoCivil?.message}
          {...register("estadoCivil")}
        />
        <Input
          label="Teléfono / WhatsApp Activo"
          type="tel"
          inputMode="tel"
          required
          autoComplete="tel"
          error={errors.telefono?.message}
          {...register("telefono")}
          placeholder="Ej: 0982 176890"
        />
        <div className="sm:col-span-2">
          <Input
            label="Correo Electrónico"
            type="email"
            inputMode="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
            placeholder="postulante@correo.com"
          />
        </div>
      </div>

      {/* Bloque 2: Presencia Digital */}
      <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-4 sm:p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-subtext1">
          Presencia Digital (Opcional)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Plataforma Principal"
            options={[
              { value: "ninguna", label: "No utiliza redes sociales" },
              { value: "instagram", label: "Instagram" },
              { value: "facebook", label: "Facebook" },
              { value: "linkedin", label: "LinkedIn" },
              { value: "tiktok", label: "TikTok" },
              { value: "twitter", label: "X / Twitter" },
            ]}
            {...register("redSocialPlataforma")}
          />
          <Input
            label="Usuario o Perfil"
            {...register("redSocial")}
            placeholder="Ej: @usuario"
          />
        </div>
      </div>

      {/* Bloque 3: Movilidad */}
      <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-subtext1">
          <Car className="h-4 w-4 text-gold" aria-hidden="true" />
          <span>Movilidad y Desplazamiento</span>
        </div>

        <Toggle
          label="Posee registro de conducir vigente"
          checked={licencia}
          onChange={(v) => setValue("licenciaConducir", v, { shouldDirty: true })}
        />

        <Toggle
          label="Dispone de vehículo o movilidad propia"
          checked={movilidad}
          onChange={(v) => setValue("movilidadPropia", v, { shouldDirty: true })}
        />

        {movilidad && (
          <div className="pt-2">
            <Input
              label="Detalle del vehículo (Tipo, marca y año aproximado)"
              {...register("tipoMovilidad")}
              placeholder="Ej: Automóvil Toyota Vitz 2018 / Motocicleta Kenton"
            />
          </div>
        )}
      </div>

      {/* Bloque 4: Conflicto de Intereses / Vínculos en la Entidad */}
      <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-subtext1">
          <Users className="h-4 w-4 text-gold" aria-hidden="true" />
          <span>Declaración de Vínculos Institucionales</span>
        </div>

        <Toggle
          label="Posee familiares o allegados trabajando en la entidad solicitante"
          checked={vinculos}
          onChange={(v) => setValue("vinculosFamiliares", v, { shouldDirty: true })}
          description="Requerido para auditoría de cumplimiento e independencia"
        />

        {vinculos && (
          <div className="pt-2">
            <Input
              label="Nombre del familiar, grado de parentesco y cargo"
              {...register("vinculosFamiliaresDetalle")}
              placeholder="Ej: Juan Pérez (Primo - Oficial de Crédito)"
            />
          </div>
        )}
      </div>

      {/* Barra Inferior de Avance */}
      <div className="flex items-center justify-end pt-3 border-t border-overlay0/40">
        <Button type="submit" size="lg" className="w-full sm:w-auto min-w-[180px]">
          <span>Guardar y Continuar</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
