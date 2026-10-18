"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso3Schema, Paso3Data } from "@/lib/validations";
import { Input, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { AiStepAssistant } from "@/components/AiStepAssistant";
import {
  Briefcase,
  ArrowLeft,
  ArrowRight,
  Building2,
  Clock,
  GraduationCap,
  Sparkles,
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
    subtitle: "Indicar dónde estás trabajando actualmente y tu puesto",
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
    subtitle: "Indicar dónde realizaste tu pasantía y tareas desempeñadas",
    icon: GraduationCap,
  },
];

export function Paso3Laboral({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
      salarioNeto: defaultValues.salarioNeto || "",
      aportesDescuentos: defaultValues.aportesDescuentos || "IPS",
      cargoPostula: defaultValues.cargoPostula || "Atención al cliente",
      pretensionSalarial:
        defaultValues.pretensionSalarial ||
        "4.917.731 (salario mínimo bancario)",
      motivoEleccionEntidad: defaultValues.motivoEleccionEntidad || "",
      objetivosProfesionales: defaultValues.objetivosProfesionales || "",
      ambienteLaboralIdeal: defaultValues.ambienteLaboralIdeal || "",
      familiarEnEntidad: defaultValues.familiarEnEntidad ?? false,
      familiarEnEntidadDetalle: defaultValues.familiarEnEntidadDetalle || "",
    },
  });

  const situacion = watch("situacionActual") || "empleado";
  const famEntidad = watch("familiarEnEntidad");

  function mejorarTextoLaboral(campo: "motivoEleccionEntidad" | "objetivosProfesionales" | "ambienteLaboralIdeal") {
    const val = (watch(campo) || "").trim();
    if (campo === "motivoEleccionEntidad") {
      setValue(
        campo,
        val
          ? `${val}. Por su solidez institucional y las oportunidades de crecimiento laboral y profesional.`
          : "Por el prestigio de la institución y las oportunidades de crecimiento laboral y profesional.",
        { shouldValidate: true }
      );
    } else if (campo === "objetivosProfesionales") {
      setValue(
        campo,
        val
          ? `${val}, aportando compromiso y eficiencia al equipo.`
          : "Desarrollar carrera dentro del área comercial y operativa, cumpliendo las metas institucionales.",
        { shouldValidate: true }
      );
    } else {
      setValue(
        campo,
        val
          ? `${val}, basado en el respeto mutuo y trabajo en equipo.`
          : "Un ambiente organizado, tranquilo, con buena comunicación y trabajo en equipo.",
        { shouldValidate: true }
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5" noValidate>
      <div className="flex items-center gap-3 border-b border-overlay0 pb-3.5">
        <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
            MÓDULO 03 DE 09 // CONDICIÓN OCUPACIONAL
          </span>
          <h2 className="text-lg sm:text-xl font-black text-text">
            Situación Laboral y Postulación
          </h2>
        </div>
      </div>

      <AiStepAssistant
        stepTitle="Situación Laboral"
        placeholder="Ej: Actualmente estoy trabajando en Negocios y Servicios hace 5 meses como Pago de salarios, gano 3.044.000..."
        onApplyFields={(extracted) => {
          Object.entries(extracted).forEach(([k, v]) => {
            if (typeof v === "string" && k !== "_rawAiText") {
              setValue(k as keyof Paso3Data, v as never, { shouldValidate: true });
            }
          });
        }}
      />

      {/* Selector visual de las 3 opciones ocupacionales solicitadas */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-text block">
          Seleccione su condición ocupacional actual:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {OPCIONES_OCUPACIONALES.map((op) => {
            const Icon = op.icon;
            const active = situacion === op.id;
            return (
              <button
                key={op.id}
                type="button"
                onClick={() => setValue("situacionActual", op.id, { shouldValidate: true })}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  active
                    ? "bg-[#536c45] text-white border-[#536c45] shadow-md"
                    : "bg-surface0 text-text border-overlay1 hover:border-gold"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`h-5 w-5 ${active ? "text-[#d5ddd1]" : "text-gold"}`} />
                  <span
                    className={`h-3 w-3 rounded-full border ${
                      active ? "bg-white border-white" : "border-overlay2"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black leading-snug">
                    {op.title}
                  </p>
                  <p
                    className={`text-[11px] mt-1 leading-snug ${
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

      {/* OPCIÓN 1: ACTUALMENTE ESTOY TRABAJANDO */}
      {situacion === "empleado" && (
        <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-4">
          <span className="text-xs font-mono font-bold uppercase text-gold block">
            DATOS DE TU TRABAJO ACTUAL
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="¿Dónde estás trabajando actualmente? (Empresa / Lugar)"
              placeholder="Ej: Negocios y servicios"
              {...register("empresaAnterior")}
            />
            <Input
              label="Cargo que ocupas actualmente"
              placeholder="Ej: Pago de salarios / Atención al cliente"
              {...register("cargoAnterior")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Antigüedad en tu empleo actual"
              placeholder="Ej: 5 meses"
              {...register("antiguedad")}
            />
            <Input
              label="Antigüedad en empleo anterior (si tuviste)"
              placeholder="Ej: 1 año 7 meses"
              {...register("antiguedadAnterior")}
            />
            <Input
              label="Motivo por el que deseas cambiar de empleo"
              placeholder="Ej: Para formar parte del plantel del Banco"
              {...register("motivoSalida")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Salario Bruto (sin descuentos)"
              placeholder="Ej: 3.044.000"
              {...register("salarioBruto")}
            />
            <Input
              label="Salario Neto (con descuentos)"
              placeholder="Ej: 2.770.040"
              {...register("salarioNeto")}
            />
            <Input
              label="Aportes / Descuentos"
              placeholder="Ej: IPS / Factura"
              {...register("aportesDescuentos")}
            />
          </div>
        </div>
      )}

      {/* OPCIÓN 2: ACTUALMENTE NO ESTOY TRABAJANDO (Pide última experiencia laboral) */}
      {situacion === "desempleado" && (
        <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-4">
          <span className="text-xs font-mono font-bold uppercase text-gold block">
            DATOS DE TU ÚLTIMA EXPERIENCIA LABORAL
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="¿Dónde trabajaste por última vez? (Última empresa o lugar)"
              placeholder="Ej: Comercio / Estudio Contable (o 'Sin experiencia previa')"
              {...register("empresaAnterior")}
            />
            <Input
              label="Último cargo desempeñado"
              placeholder="Ej: Auxiliar administrativo / Ventas"
              {...register("cargoAnterior")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Tiempo que trabajaste allí (Antigüedad)"
              placeholder="Ej: 1 año 2 meses"
              {...register("antiguedadAnterior")}
            />
            <Input
              label="Último salario percibido (Gs.)"
              placeholder="Ej: 2.800.000"
              {...register("salarioBruto")}
            />
            <Input
              label="Motivo de salida de tu último empleo"
              placeholder="Ej: Finalización de contrato / Estudios"
              {...register("motivoSalida")}
            />
          </div>
        </div>
      )}

      {/* OPCIÓN 3: SOLO REALICÉ PASANTÍA */}
      {situacion === "pasantia" && (
        <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-4">
          <span className="text-xs font-mono font-bold uppercase text-gold block">
            DATOS DE TU PASANTÍA REALIZADA
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Empresa o Institución donde realizaste la pasantía"
              placeholder="Ej: Cooperativa / Municipalidad / Empresa"
              {...register("empresaAnterior")}
            />
            <Input
              label="Área o tareas desempeñadas en la pasantía"
              placeholder="Ej: Auxiliar contable / Atención"
              {...register("cargoAnterior")}
            />
            <Input
              label="Duración de la pasantía"
              placeholder="Ej: 3 meses / 240 horas"
              {...register("antiguedad")}
            />
          </div>
        </div>
      )}

      {/* Datos de Postulación a la Entidad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Cargo al que postula"
          placeholder="Ej: Atención al cliente"
          {...register("cargoPostula")}
        />
        <Input
          label="Pretensión salarial o monto acordado con RRHH"
          placeholder="Ej: 4.917.731 (salario mínimo bancario)"
          {...register("pretensionSalarial")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Input
            label="¿Por qué eligió esta entidad para trabajar?"
            placeholder="Ej: Oportunidades de crecimiento"
            {...register("motivoEleccionEntidad")}
          />
          <button
            type="button"
            onClick={() => mejorarTextoLaboral("motivoEleccionEntidad")}
            className="text-[11px] font-bold text-gold hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="h-3 w-3" /> Completar con IA
          </button>
        </div>

        <div className="space-y-1">
          <Input
            label="Objetivos profesionales si se incorpora"
            placeholder="Ej: Trabajar en el área comercial"
            {...register("objetivosProfesionales")}
          />
          <button
            type="button"
            onClick={() => mejorarTextoLaboral("objetivosProfesionales")}
            className="text-[11px] font-bold text-gold hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="h-3 w-3" /> Completar con IA
          </button>
        </div>

        <div className="space-y-1">
          <Input
            label="¿Cómo sería su ambiente laboral ideal?"
            placeholder="Ej: Tranquilo y con buena comunicación"
            {...register("ambienteLaboralIdeal")}
          />
          <button
            type="button"
            onClick={() => mejorarTextoLaboral("ambienteLaboralIdeal")}
            className="text-[11px] font-bold text-gold hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="h-3 w-3" /> Completar con IA
          </button>
        </div>
      </div>

      <Toggle
        label="¿Posee algún familiar y/o conocido en la entidad donde se postula?"
        checked={Boolean(famEntidad)}
        onChange={(val) => setValue("familiarEnEntidad", val)}
      />
      {famEntidad && (
        <Input
          label="Indique nombre y parentesco/vínculo en la entidad"
          placeholder="Ej: Primo en sucursal centro"
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
