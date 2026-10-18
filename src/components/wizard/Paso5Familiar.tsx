"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso5Schema, Paso5Data } from "@/lib/validations";
import { Input, Select, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { AiStepAssistant } from "@/components/AiStepAssistant";
import {
  Users,
  UserRound,
  HeartHandshake,
  CreditCard,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface Props {
  defaultValues: Partial<Paso5Data>;
  onNext: (data: Paso5Data) => void;
  onBack: () => void;
}

export function Paso5Familiar({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
  } = useForm<Paso5Data>({
    resolver: zodResolver(paso5Schema),
    defaultValues: {
      relacionPadres: defaultValues.relacionPadres || "casados",
      estructuraFamiliar: defaultValues.estructuraFamiliar || "",
      nombreMadre: defaultValues.nombreMadre || "",
      edadMadre: defaultValues.edadMadre ?? 0,
      ocupacionMadre: defaultValues.ocupacionMadre || "",
      empresaMadre: defaultValues.empresaMadre || "",
      salarioMadre: defaultValues.salarioMadre || "",
      ciudadMadre: defaultValues.ciudadMadre || "",
      telefonoMadre: defaultValues.telefonoMadre || "",
      nombrePadre: defaultValues.nombrePadre || "",
      edadPadre: defaultValues.edadPadre ?? 0,
      ocupacionPadre: defaultValues.ocupacionPadre || "",
      empresaPadre: defaultValues.empresaPadre || "",
      salarioPadre: defaultValues.salarioPadre || "",
      ciudadPadre: defaultValues.ciudadPadre || "",
      telefonoPadre: defaultValues.telefonoPadre || "",
      parejaPadreMadreViveCasa: defaultValues.parejaPadreMadreViveCasa ?? false,
      nombrePareja: defaultValues.nombrePareja || "",
      edadPareja: defaultValues.edadPareja ?? 0,
      ocupacionPareja: defaultValues.ocupacionPareja || "",
      empresaPareja: defaultValues.empresaPareja || "",
      salarioPareja: defaultValues.salarioPareja || "",
      ciudadPareja: defaultValues.ciudadPareja || "",
      telefonoPareja: defaultValues.telefonoPareja || "",
      tieneHermanos: defaultValues.tieneHermanos ?? false,
      cantidadHermanos: defaultValues.cantidadHermanos ?? 0,
      listaHermanos: defaultValues.listaHermanos || [],
      familiaresProductosEntidad: defaultValues.familiaresProductosEntidad ?? false,
      familiarConProductosDetalle: defaultValues.familiarConProductosDetalle || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "listaHermanos",
  });

  const relacionPadres = watch("relacionPadres");
  const padresEstanSeparados =
    relacionPadres === "separados" || relacionPadres === "divorciados";
  const tieneParejaCasa = watch("parejaPadreMadreViveCasa");
  const tieneHermanos = watch("tieneHermanos");
  const famProductos = watch("familiaresProductosEntidad");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6" noValidate>
      <div className="flex items-center gap-3 border-b border-overlay0 pb-3.5">
        <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
            MÓDULO 05 // DATOS FAMILIARES
          </span>
          <h2 className="text-lg sm:text-xl font-black text-text">
            Padres y Grupo Familiar
          </h2>
        </div>
      </div>

      <AiStepAssistant
        stepNumber={5}
        stepTitle="Datos Familiares"
        placeholder="Dicte los datos de sus padres o hermanos para autocompletar..."
        onApplyFields={(extracted) => {
          Object.entries(extracted).forEach(([k, v]) => {
            if (typeof v === "string" && k !== "_rawAiText") {
              setValue(k as keyof Paso5Data, v as never, { shouldValidate: true });
            }
          });
        }}
      />

      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gold">
          <HeartHandshake className="h-4 w-4" />
          <span>ESTADO CIVIL DE LOS PADRES</span>
        </div>
        <Select
          label="Relación de sus padres"
          options={[
            { value: "casados", label: "Casados" },
            { value: "separados", label: "Separados" },
            { value: "divorciados", label: "Divorciados" },
            { value: "union_libre", label: "Unión libre" },
            { value: "fallecidos", label: "Fallecidos" },
            { value: "otro", label: "Otro" },
          ]}
          {...register("relacionPadres", {
            onChange: (e) => {
              const val = e.target.value;
              if (val !== "separados" && val !== "divorciados") {
                setValue("parejaPadreMadreViveCasa", false);
              }
            },
          })}
        />
      </div>

      {/* Ficha de la Madre */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gold">
          <UserRound className="h-4 w-4" />
          <span>DATOS DE LA MADRE</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input label="Nombre y apellido de la madre" placeholder="Ingrese nombre y apellido" {...register("nombreMadre")} />
          <Input label="Edad en años" type="number" {...register("edadMadre")} />
          <Input label="Ocupación" placeholder="Ingrese ocupación" {...register("ocupacionMadre")} />
          <Input label="Empresa o Institución" placeholder="Ingrese lugar de trabajo" {...register("empresaMadre")} />
          <Input label="Salario aproximado (Gs.)" placeholder="Ingrese monto en Gs." {...register("salarioMadre")} />
          <Input label="Vive en (Ciudad)" placeholder="Ingrese ciudad" {...register("ciudadMadre")} />
          <Input label="Teléfono" placeholder="Ingrese teléfono" {...register("telefonoMadre")} />
        </div>
      </div>

      {/* Ficha del Padre */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gold">
          <UserRound className="h-4 w-4" />
          <span>DATOS DEL PADRE</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input label="Nombre y apellido del padre" placeholder="Ingrese nombre y apellido" {...register("nombrePadre")} />
          <Input label="Edad en años" type="number" {...register("edadPadre")} />
          <Input label="Ocupación" placeholder="Ingrese ocupación" {...register("ocupacionPadre")} />
          <Input label="Empresa o Institución" placeholder="Ingrese lugar de trabajo" {...register("empresaPadre")} />
          <Input label="Salario aproximado (Gs.)" placeholder="Ingrese monto en Gs." {...register("salarioPadre")} />
          <Input label="Vive en (Ciudad)" placeholder="Ingrese ciudad" {...register("ciudadPadre")} />
          <Input label="Teléfono" placeholder="Ingrese teléfono" {...register("telefonoPadre")} />
        </div>
      </div>

      {/* Solo aparece si la persona dice que sus padres están separados o divorciados */}
      {padresEstanSeparados && (
        <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gold">
            <HeartHandshake className="h-4 w-4" />
            <span>PAREJA CONVIVIENTE DEL PADRE / MADRE</span>
          </div>
          <Toggle
            label="¿Su padre o madre tiene pareja viviendo en la casa?"
            checked={Boolean(tieneParejaCasa)}
            onChange={(val) => setValue("parejaPadreMadreViveCasa", val)}
          />
          {tieneParejaCasa && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-overlay0">
              <Input label="Nombre y Apellido" placeholder="Ingrese nombre y apellido" {...register("nombrePareja")} />
              <Input label="Edad en años" type="number" {...register("edadPareja")} />
              <Input label="Ocupación" placeholder="Ingrese ocupación" {...register("ocupacionPareja")} />
              <Input label="Empresa o Institución" placeholder="Ingrese empresa" {...register("empresaPareja")} />
              <Input label="Salario aproximado (Gs.)" placeholder="Ingrese monto en Gs." {...register("salarioPareja")} />
              <Input label="Vive en (Ciudad)" placeholder="Ingrese ciudad" {...register("ciudadPareja")} />
              <Input label="Teléfono" placeholder="Ingrese teléfono" {...register("telefonoPareja")} />
            </div>
          )}
        </div>
      )}

      {/* Hermanos */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gold">
          <Users className="h-4 w-4" />
          <span>HERMANOS / AS</span>
        </div>
        <Toggle
          label="¿Tiene hermanos/as?"
          checked={Boolean(tieneHermanos)}
          onChange={(val) => {
            setValue("tieneHermanos", val);
            if (val && fields.length === 0) {
              append({ nombre: "", edad: "", ocupacion: "", empresa: "", domicilio: "" });
            }
          }}
        />
        {tieneHermanos && (
          <div className="space-y-3 pt-2 border-t border-overlay0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold uppercase text-gold">
                NÓMINA DE HERMANOS/AS ({fields.length})
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  append({ nombre: "", edad: "", ocupacion: "", empresa: "", domicilio: "" });
                  setValue("cantidadHermanos", fields.length + 1);
                }}
              >
                <Plus className="h-3.5 w-3.5 text-gold" />
                <span>Agregar Hermano/a</span>
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-3 rounded-xl bg-surface0 border border-overlay0 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end"
                >
                  <div className="sm:col-span-3">
                    <Input
                      label={`#${idx + 1} Nombre y apellido`}
                      placeholder="Nombre y apellido"
                      {...register(`listaHermanos.${idx}.nombre`)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Edad"
                      placeholder="Edad"
                      {...register(`listaHermanos.${idx}.edad`)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Ocupación"
                      placeholder="Ocupación"
                      {...register(`listaHermanos.${idx}.ocupacion`)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Empresa/Inst."
                      placeholder="Lugar"
                      {...register(`listaHermanos.${idx}.empresa`)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Domicilio"
                      placeholder="Ciudad"
                      {...register(`listaHermanos.${idx}.domicilio`)}
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        remove(idx);
                        setValue("cantidadHermanos", Math.max(0, fields.length - 1));
                      }}
                      className="min-h-[42px] min-w-[42px] rounded-xl border border-overlay1 hover:border-red text-subtext1 hover:text-red flex items-center justify-center cursor-pointer"
                      aria-label="Eliminar hermano"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Última pregunta del 5to apartado exacta solicitada */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gold">
          <CreditCard className="h-4 w-4" />
          <span>PRODUCTOS BANCARIOS FAMILIARES</span>
        </div>
        <Toggle
          label="¿Tienes algún familiar que tenga algún producto del Banco Continental?"
          checked={Boolean(famProductos)}
          onChange={(val) => setValue("familiaresProductosEntidad", val)}
        />
        {famProductos && (
          <Input
            label="Familiar con producto/s y tipo de producto"
            placeholder="Indique parentesco y tipo de producto (ej: Tarjeta de débito, cuenta...)"
            {...register("familiarConProductosDetalle")}
          />
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-overlay0">
        <Button type="button" variant="secondary" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <span>Siguiente: Datos de la Salud</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
