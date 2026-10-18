"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso1Schema, Paso1Data } from "@/lib/validations";
import { Input, Select, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { FotoUploader } from "@/components/FotoUploader";
import { AiStepAssistant } from "@/components/AiStepAssistant";
import { useInterviewMode } from "@/components/InterviewModeContext";
import {
  User,
  ArrowRight,
  Car,
  CarFront,
  Bus,
  Baby,
  Sparkles,
  Share2,
  Clock,
  CreditCard,
} from "lucide-react";

interface Props {
  defaultValues: Partial<Paso1Data>;
  onNext: (data: Paso1Data) => void;
}

const OPCIONES_MOVILIDAD = [
  {
    id: "propia",
    title: "Movilidad Propia",
    subtitle: "Automóvil o motocicleta propia",
    icon: Car,
  },
  {
    id: "familiar",
    title: "Movilidad Familiar",
    subtitle: "Vehículo compartido de la familia",
    icon: CarFront,
  },
  {
    id: "no",
    title: "Sin movilidad vehicular",
    subtitle: "Uso de transporte público u otro",
    icon: Bus,
  },
];

export function Paso1Personal({ defaultValues, onNext }: Props) {
  const { isEvaluator, shouldHideField } = useInterviewMode();

  const initialTenencia =
    defaultValues.tenenciaMovilidad ||
    (defaultValues.movilidadPropia ? "propia" : "no");

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
      tenenciaMovilidad: initialTenencia,
      movilidadPropia: initialTenencia === "propia" || initialTenencia === "familiar",
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
  const tenenciaMovilidad = watch("tenenciaMovilidad") || "no";
  const tieneVehiculo =
    tenenciaMovilidad === "propia" || tenenciaMovilidad === "familiar";
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
            Identificación, Movilidad y Redes
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
              error={errors.fechaNacimiento?.message}
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

      {/* Hijos con ícono ilustrativo */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gold">
          <Baby className="h-4 w-4" />
          <span>HIJOS / DEPENDIENTES</span>
        </div>
        <Toggle
          label="¿Tiene hijos/as?"
          checked={Boolean(tieneHijos)}
          onChange={(val) => setValue("hijos", val)}
        />
        {tieneHijos && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-overlay0">
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

      {/* MOVILIDAD CON EL AUTITO: Propia, Familiar o Sin vehículo */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gold">
          <Car className="h-4 w-4" />
          <span>MOVILIDAD Y VEHÍCULO (PROPIA O FAMILIAR)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {OPCIONES_MOVILIDAD.map((op) => {
            const Icon = op.icon;
            const active = tenenciaMovilidad === op.id;
            return (
              <button
                key={op.id}
                type="button"
                onClick={() => {
                  setValue("tenenciaMovilidad", op.id, { shouldValidate: true });
                  setValue(
                    "movilidadPropia",
                    op.id === "propia" || op.id === "familiar"
                  );
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  active
                    ? "bg-[#536c45] text-white border-[#536c45] shadow-md"
                    : "bg-surface0 text-text border-overlay1 hover:border-gold"
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    active
                      ? "bg-white/15 text-white"
                      : "bg-gold/15 text-gold border border-gold/30"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black leading-snug">
                    {op.title}
                  </p>
                  <p
                    className={`text-[11px] mt-0.5 leading-snug ${
                      active ? "text-[#e2e8de]" : "text-subtext1"
                    }`}
                  >
                    {op.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* En ambas situaciones (Propia o Familiar) pide las características del auto y licencia */}
        {tieneVehiculo && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-overlay0">
            <Input
              label={`Características del vehículo (${
                tenenciaMovilidad === "propia" ? "Movilidad Propia" : "Movilidad Familiar"
              })`}
              placeholder="Indique tipo (auto/moto), marca, modelo y año"
              {...register("tipoMovilidad")}
              error={errors.tipoMovilidad?.message}
            />
            <div className="flex flex-col justify-end">
              <Toggle
                label="¿Posee licencia de conducir vigente?"
                checked={Boolean(watch("licenciaConducir"))}
                onChange={(val) => setValue("licenciaConducir", val)}
              />
            </div>
          </div>
        )}

        {!tieneVehiculo && (
          <Toggle
            label="¿Posee licencia de conducir vigente?"
            checked={Boolean(watch("licenciaConducir"))}
            onChange={(val) => setValue("licenciaConducir", val)}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-overlay0">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gold">
              <Bus className="h-3.5 w-3.5" /> Traslado a la sucursal
            </span>
            <Input
              label="¿Con qué medio irá generalmente a la sucursal asignada?"
              placeholder="Ómnibus, vehículo propio, vehículo familiar..."
              {...register("medioTransporteSucursal")}
              error={errors.medioTransporteSucursal?.message}
            />
          </div>
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gold">
              <Clock className="h-3.5 w-3.5" /> Tiempo estimado
            </span>
            <Input
              label="¿Cuánto tiempo le toma ir de su casa a la sucursal asignada?"
              placeholder="Indique tiempo en minutos u horas"
              {...register("tiempoViajeSucursal")}
              error={errors.tiempoViajeSucursal?.message}
            />
          </div>
        </div>
      </div>

      {/* Tatuajes con ícono */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gold">
          <Sparkles className="h-4 w-4" />
          <span>TATUAJES</span>
        </div>
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
              error={errors.zonaTatuada?.message}
            />
          </div>
        )}
      </div>

      {/* ¿Red social que más uses? con ícono */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gold">
          <Share2 className="h-4 w-4" />
          <span>¿RED SOCIAL QUE MÁS USES?</span>
        </div>
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
