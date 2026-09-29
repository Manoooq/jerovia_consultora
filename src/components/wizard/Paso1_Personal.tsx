"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { paso1Schema, type Paso1Data } from "@/lib/validations";
import { Input, Select, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { VoiceCapture } from "@/components/VoiceCapture";
import { ChevronRight, User } from "lucide-react";

const ESTADO_CIVIL_OPTS = [
  { value: "soltero", label: "Soltero/a" },
  { value: "casado", label: "Casado/a" },
  { value: "conviviente", label: "Conviviente" },
  { value: "divorciado", label: "Divorciado/a" },
  { value: "viudo", label: "Viudo/a" },
];

interface Paso1Props {
  defaultValues?: Partial<Paso1Data>;
  onNext: (data: Paso1Data) => void;
}

export function Paso1Personal({ defaultValues, onNext }: Paso1Props) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Paso1Data>({
    // @ts-expect-error — zodResolver input/output mismatch: known RHF+Zod issue with .optional().default()
    resolver: zodResolver(paso1Schema),
    defaultValues: { licenciaConducir: false, movilidadPropia: false, vinculosFamiliares: false, ...defaultValues },
  });

  const licencia = watch("licenciaConducir");
  const movilidad = watch("movilidadPropia");
  const vinculos = watch("vinculosFamiliares");

  function handleVoice(data: Record<string, unknown>) {
    const fields: (keyof Paso1Data)[] = ["nombre", "apellido", "cedula", "telefono"];
    fields.forEach((f) => { if (data[f]) setValue(f, data[f] as string); });
    if (data.estadoCivil) setValue("estadoCivil", data.estadoCivil as Paso1Data["estadoCivil"]);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onNext as any)} className="flex flex-col gap-6">
        {/* Cabecera del paso */}
        <div className="flex items-center gap-3 pb-4 border-b border-overlay0/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
            <User className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text">Información Personal</h2>
            <p className="text-sm text-subtext0">Datos de identificación y contacto del entrevistado</p>
          </div>
        </div>

        {/* Asistente de voz */}
        <VoiceCapture onExtracted={handleVoice} />

        {/* Campos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nombre" required error={errors.nombre?.message} {...register("nombre")} placeholder="Tobias" />
          <Input label="Apellido" required error={errors.apellido?.message} {...register("apellido")} placeholder="Sánchez Alvarenga" />
          <Input label="Fecha de Nacimiento" type="date" required error={errors.fechaNacimiento?.message} {...register("fechaNacimiento")} />
          <Input label="Cédula de Identidad (CI)" required error={errors.cedula?.message} {...register("cedula")} placeholder="5.551.895" />
          <Select
            label="Estado Civil"
            required
            options={ESTADO_CIVIL_OPTS}
            error={errors.estadoCivil?.message}
            {...register("estadoCivil")}
          />
          <Input label="Teléfono" required error={errors.telefono?.message} {...register("telefono")} placeholder="0982 176890" />
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} placeholder="email@ejemplo.com" />
        </div>

        {/* Redes sociales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Red Social Principal"
            options={[
              { value: "instagram", label: "Instagram" },
              { value: "facebook", label: "Facebook" },
              { value: "tiktok", label: "TikTok" },
              { value: "whatsapp", label: "WhatsApp" },
              { value: "twitter", label: "X / Twitter" },
              { value: "ninguna", label: "No usa redes" },
            ]}
            {...register("redSocialPlataforma")}
          />
          <Input label="Usuario / Arroba" {...register("redSocial")} placeholder="@tobias6749" />
        </div>

        {/* Movilidad */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-surface1 border border-overlay0/50">
          <p className="text-sm font-semibold text-text">Movilidad</p>
          <Toggle
            label="Posee licencia de conducir"
            checked={licencia}
            onChange={(v) => setValue("licenciaConducir", v)}
          />
          <Toggle
            label="Posee movilidad propia"
            checked={movilidad}
            onChange={(v) => setValue("movilidadPropia", v)}
          />
          {movilidad && (
            <Input label="Tipo de vehículo" {...register("tipoMovilidad")} placeholder="Moto, Auto, Camioneta..." />
          )}
        </div>

        {/* Vínculos */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-surface1 border border-overlay0/50">
          <Toggle
            label="Posee familiares en la entidad a la que postula"
            checked={vinculos}
            onChange={(v) => setValue("vinculosFamiliares", v)}
            description="Parientes que trabajan actualmente en la institución"
          />
          {vinculos && (
            <Input label="Detalle del vínculo" {...register("vinculosFamiliaresDetalle")} placeholder="Nombre, parentesco y cargo" />
          )}
        </div>

        {/* Navegación */}
        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg">
            Siguiente <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
