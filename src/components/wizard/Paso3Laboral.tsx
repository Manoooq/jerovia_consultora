"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso3Schema, Paso3Data } from "@/lib/validations";
import { Input, Select, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { Briefcase, ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  defaultValues: Partial<Paso3Data>;
  onNext: (data: Paso3Data) => void;
  onBack: () => void;
}

export function Paso3Laboral({ defaultValues, onNext, onBack }: Props) {
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

  const famEntidad = watch("familiarEnEntidad");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5" noValidate>
      <div className="flex items-center gap-3 border-b border-overlay0 pb-3.5">
        <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
            MÓDULO 03 DE 09 // DATOS LABORALES
          </span>
          <h2 className="text-lg sm:text-xl font-black text-text">
            Trayectoria, Salarios y Postulación
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Situación laboral actual"
          options={[
            { value: "empleado", label: "Está trabajando actualmente" },
            { value: "desempleado", label: "Desempleado/a actualmente" },
            { value: "independiente", label: "Trabajador/a Independiente" },
            { value: "estudiante", label: "Estudiante / Primer Empleo" },
            { value: "otro", label: "Otro" },
          ]}
          {...register("situacionActual")}
        />
        <Input
          label="Lugar de empleo actual (o último)"
          placeholder="Ej: Negocios y servicios"
          {...register("empresaAnterior")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Cargo que ocupa actualmente (o último)"
          placeholder="Ej: Pago de salarios"
          {...register("cargoAnterior")}
        />
        <Input
          label="Motivo de salida o por qué desea cambiar de empleo"
          placeholder="Ej: Para pasar a formar parte del plantel del Banco"
          {...register("motivoSalida")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Antigüedad actual"
          placeholder="Ej: 5 meses"
          {...register("antiguedad")}
        />
        <Input
          label="Antigüedad anterior (si estaba trabajando)"
          placeholder="Ej: 1 año 7 meses"
          {...register("antiguedadAnterior")}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Cargo al que postula"
          placeholder="Ej: Atención al cliente"
          {...register("cargoPostula")}
        />
        <Input
          label="Pretensión salarial o monto acordado con RRHH"
          required
          placeholder="Ej: 4.917.731 (salario mínimo bancario)"
          {...register("pretensionSalarial")}
          error={errors.pretensionSalarial?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="¿Por qué eligió este Banco/Entidad?"
          placeholder="Ej: Oportunidades de crecimiento laboral"
          {...register("motivoEleccionEntidad")}
        />
        <Input
          label="Objetivos profesionales si se incorpora"
          placeholder="Ej: Trabajar en el área comercial"
          {...register("objetivosProfesionales")}
        />
        <Input
          label="¿Cómo sería su ambiente laboral ideal?"
          placeholder="Ej: Tranquilo y con buena comunicación"
          {...register("ambienteLaboralIdeal")}
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
