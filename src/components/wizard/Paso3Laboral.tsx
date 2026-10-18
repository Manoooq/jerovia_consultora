"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso3Schema, Paso3Data } from "@/lib/validations";
import { Input, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { AiStepAssistant } from "@/components/AiStepAssistant";
import { useInterviewMode } from "@/components/InterviewModeContext";
import {
  Briefcase,
  ArrowLeft,
  ArrowRight,
  Building2,
  Clock,
  GraduationCap,
  Rocket,
} from "lucide-react";

interface Props {
  defaultValues: Partial<Paso3Data>;
  onNext: (data: Paso3Data) => void;
  onBack: () => void;
}

const OPCIONES_OCUPACIONALES = [
  {
    id: "empleado",
    title: "Actualmente estoy trabajando",
    subtitle: "Indicar dónde estás trabajando y tu puesto actual",
    icon: Building2,
  },
  {
    id: "desempleado",
    title: "Actualmente no estoy trabajando",
    subtitle: "Completar los datos de tu última experiencia laboral",
    icon: Clock,
  },
  {
    id: "pasantia",
    title: "Solo realicé pasantía",
    subtitle: "Indicar dónde realizaste tu pasantía y tareas",
    icon: GraduationCap,
  },
  {
    id: "primera_experiencia",
    title: "Primera experiencia laboral",
    subtitle: "Postulando a mi primer empleo formal",
    icon: Rocket,
  },
];

export function Paso3Laboral({ defaultValues, onNext, onBack }: Props) {
  const { shouldHideField } = useInterviewMode();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Paso3Data>({
    resolver: zodResolver(paso3Schema),
    defaultValues: {
      situacionActual: defaultValues.situacionActual || "empleado",
      empresaAnterior: defaultValues.empresaAnterior || "",
      motivoSalida: defaultValues.motivoSalida || "",
      cargoAnterior: defaultValues.cargoAnterior || "",
      antiguedad: defaultValues.antiguedad || "",
      antiguedadAnterior: defaultValues.antiguedadAnterior || "",
      salarioBruto: defaultValues.salarioBruto || "",
      aportesDescuentos: defaultValues.aportesDescuentos || "",
      cargoPostula: defaultValues.cargoPostula || "",
      pretensionSalarial: defaultValues.pretensionSalarial || "",
      motivoEleccionEntidad: defaultValues.motivoEleccionEntidad || "",
      objetivosProfesionales: defaultValues.objetivosProfesionales || "",
      ambienteLaboralIdeal: defaultValues.ambienteLaboralIdeal || "",
      familiarEnEntidad: defaultValues.familiarEnEntidad ?? false,
      familiarEnEntidadDetalle: defaultValues.familiarEnEntidadDetalle || "",
    },
  });

  const situacion = watch("situacionActual") || "empleado";
  const famEntidad = watch("familiarEnEntidad");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5" noValidate>
      <div className="flex items-center gap-3 border-b border-overlay0 pb-3.5">
        <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
            MÓDULO 03 // EXPERIENCIA LABORAL
          </span>
          <h2 className="text-lg sm:text-xl font-black text-text">
            Condición Ocupacional y Postulación
          </h2>
        </div>
      </div>

      <AiStepAssistant
        stepNumber={3}
        stepTitle="Experiencia Laboral"
        placeholder="Dicte o escriba su situación laboral actual y el cargo al que postula..."
        onApplyFields={(extracted) => {
          Object.entries(extracted).forEach(([k, v]) => {
            if (typeof v === "string" && k !== "_rawAiText") {
              setValue(k as keyof Paso3Data, v as never, { shouldValidate: true });
            }
          });
        }}
      />

      {!shouldHideField("situacionActual") && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-text block">
            Seleccione su condición ocupacional:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {OPCIONES_OCUPACIONALES.map((op) => {
              const Icon = op.icon;
              const active = situacion === op.id;
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => {
                    setValue("situacionActual", op.id, { shouldValidate: true });
                    if (op.id === "primera_experiencia") {
                      setValue("empresaAnterior", "Primera experiencia laboral");
                      setValue("cargoAnterior", "-");
                      setValue("antiguedad", "-");
                      setValue("salarioBruto", "-");
                    }
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
                  <div>
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
        </div>
      )}

      {/* 1. ACTUALMENTE ESTOY TRABAJANDO */}
      {situacion === "empleado" && (
        <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-4">
          <span className="text-xs font-mono font-bold uppercase text-gold block">
            ACTUALMENTE ESTOY TRABAJANDO — DATOS DEL EMPLEO ACTUAL
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!shouldHideField("empresaAnterior") && (
              <Input
                label="¿Dónde estás trabajando actualmente?"
                placeholder="Nombre de la empresa o institución"
                {...register("empresaAnterior")}
                error={errors.empresaAnterior?.message}
              />
            )}
            {!shouldHideField("cargoAnterior") && (
              <Input
                label="Cargo que ocupas actualmente"
                placeholder="Indique su puesto o función"
                {...register("cargoAnterior")}
                error={errors.cargoAnterior?.message}
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Antigüedad actual"
              placeholder="Tiempo en el empleo actual"
              {...register("antiguedad")}
            />
            <Input
              label="Antigüedad anterior (si estaba trabajando antes)"
              placeholder="Tiempo en su empleo previo"
              {...register("antiguedadAnterior")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {!shouldHideField("salarioBruto") && (
              <Input
                label="Salario (Gs.)"
                placeholder="Ingrese monto mensual en Gs."
                {...register("salarioBruto")}
              />
            )}
            <Input
              label="Aportes / Descuentos"
              placeholder="IPS / Factura / Otro"
              {...register("aportesDescuentos")}
            />
            <Input
              label="Motivo por el que quiere cambiar de empleo"
              placeholder="Indique el motivo"
              {...register("motivoSalida")}
            />
          </div>
        </div>
      )}

      {/* 2. ACTUALMENTE NO ESTOY TRABAJANDO */}
      {situacion === "desempleado" && (
        <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-4">
          <span className="text-xs font-mono font-bold uppercase text-gold block">
            ACTUALMENTE NO ESTOY TRABAJANDO — ÚLTIMA EXPERIENCIA LABORAL
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Último lugar de empleo"
              placeholder="Nombre de la última empresa donde trabajó"
              {...register("empresaAnterior")}
                error={errors.empresaAnterior?.message}
            />
            <Input
              label="Último cargo ocupado"
              placeholder="Puesto o función desempeñada"
              {...register("cargoAnterior")}
                error={errors.cargoAnterior?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Antigüedad en su último empleo"
              placeholder="Tiempo que trabajó allí"
              {...register("antiguedadAnterior")}
            />
            <Input
              label="Último Salario (Gs.)"
              placeholder="Monto mensual que percibía"
              {...register("salarioBruto")}
            />
            <Input
              label="Motivo de salida de su anterior empleo"
              placeholder="Indique el motivo de desvinculación"
              {...register("motivoSalida")}
            />
          </div>
        </div>
      )}

      {/* 3. SOLO REALICÉ PASANTÍA */}
      {situacion === "pasantia" && (
        <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-4">
          <span className="text-xs font-mono font-bold uppercase text-gold block">
            SOLO REALICÉ PASANTÍA — DATOS DE LA PASANTÍA
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Empresa o institución de la pasantía"
              placeholder="Dónde realizó la pasantía"
              {...register("empresaAnterior")}
                error={errors.empresaAnterior?.message}
            />
            <Input
              label="Área o tareas realizadas"
              placeholder="Funciones desempeñadas"
              {...register("cargoAnterior")}
                error={errors.cargoAnterior?.message}
            />
            <Input
              label="Duración de la pasantía"
              placeholder="Tiempo o cantidad de horas"
              {...register("antiguedad")}
            />
          </div>
          <Input
            label="Salario o ayuda económica recibida (Gs. - Opcional)"
            placeholder="Monto en Gs."
            {...register("salarioBruto")}
          />
        </div>
      )}

      {/* 4. PRIMERA EXPERIENCIA LABORAL */}
      {situacion === "primera_experiencia" && (
        <div className="rounded-2xl border border-[#85987a]/60 bg-[#536c45]/10 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#536c45] text-white flex items-center justify-center shrink-0">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-black text-text">
              Primera Experiencia Laboral Registrada
            </p>
            <p className="text-xs text-subtext1">
              No necesita completar empleos anteriores. Complete a continuación los datos del puesto al que postula.
            </p>
          </div>
        </div>
      )}

      {/* Datos de Postulación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!shouldHideField("cargoPostula") && (
          <Input
            label="Cargo al que postula"
            placeholder="Indique el puesto al que postula"
            {...register("cargoPostula")}
            error={errors.cargoPostula?.message}
          />
        )}
        {!shouldHideField("pretensionSalarial") && (
          <Input
            label="Pretensión salarial o monto acordado con RRHH"
            placeholder="Ingrese monto en Gs."
            {...register("pretensionSalarial")}
            error={errors.pretensionSalarial?.message}
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="¿Por qué eligió este Banco para trabajar?"
          placeholder="Escriba su motivación"
          {...register("motivoEleccionEntidad")}
          error={errors.motivoEleccionEntidad?.message}
        />

        <Input
          label="Objetivos profesionales si se incorpora"
          placeholder="Indique sus metas laborales"
          {...register("objetivosProfesionales")}
          error={errors.objetivosProfesionales?.message}
        />

        <Input
          label="¿Cómo sería su ambiente laboral ideal?"
          placeholder="Describa su entorno ideal"
          {...register("ambienteLaboralIdeal")}
          error={errors.ambienteLaboralIdeal?.message}
        />
      </div>

      <Toggle
        label="¿Posee algún familiar y/o conocido en la entidad donde se postula?"
        checked={Boolean(famEntidad)}
        onChange={(val) => setValue("familiarEnEntidad", val)}
      />
      {famEntidad && (
        <Input
          label="Indique nombre y parentesco/vínculo en la entidad"
          placeholder="Detalle nombre y área"
          {...register("familiarEnEntidadDetalle")}
        />
      )}

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-overlay0">
        <Button type="button" variant="secondary" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <span>Siguiente: Aspectos Personales</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
