"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso5Schema, Paso5Data } from "@/lib/validations";
import { Input, Select, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { Users, Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";

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
      relacionPadres: defaultValues.relacionPadres || "separados",
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
            MÓDULO 05 DE 09 // DATOS FAMILIARES
          </span>
          <h2 className="text-lg sm:text-xl font-black text-text">
            Padres, Pareja Conviviente y Hermanos
          </h2>
        </div>
      </div>

      <Select
        label="Relación de sus padres"
        options={[
          { value: "separados", label: "Separados" },
          { value: "casados", label: "Casados" },
          { value: "divorciados", label: "Divorciados" },
          { value: "union_libre", label: "Unión libre" },
          { value: "fallecidos", label: "Fallecidos" },
          { value: "otro", label: "Otro" },
        ]}
        {...register("relacionPadres")}
      />

      {/* Ficha de la Madre */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <span className="text-xs font-mono font-bold uppercase text-gold block">
          DATOS DE LA MADRE
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input label="Su madre es la Sra." placeholder="Ej: Raquel Ruiz Diaz" {...register("nombreMadre")} />
          <Input label="Edad en años" type="number" {...register("edadMadre")} />
          <Input label="Ocupación" placeholder="Ej: Enfermera" {...register("ocupacionMadre")} />
          <Input label="Empresa o Institución" placeholder="Ej: Independiente" {...register("empresaMadre")} />
          <Input label="Salario aproximado" placeholder="Ej: 4.000.000" {...register("salarioMadre")} />
          <Input label="Vive en (Ciudad)" placeholder="Ej: Villa Elisa" {...register("ciudadMadre")} />
          <Input label="Teléfono" placeholder="Ej: 0981 661702" {...register("telefonoMadre")} />
        </div>
      </div>

      {/* Ficha del Padre */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <span className="text-xs font-mono font-bold uppercase text-gold block">
          DATOS DEL PADRE
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input label="Su padre es el Sr." placeholder="Ej: Miguel Lovera" {...register("nombrePadre")} />
          <Input label="Edad en años" type="number" {...register("edadPadre")} />
          <Input label="Ocupación" placeholder="Ej: Empleado Público" {...register("ocupacionPadre")} />
          <Input label="Empresa o Institución" placeholder="Ej: ANDE" {...register("empresaPadre")} />
          <Input label="Salario aproximado" placeholder="Ej: 15.000.000" {...register("salarioPadre")} />
          <Input label="Vive en (Ciudad)" placeholder="Ej: Asunción" {...register("ciudadPadre")} />
          <Input label="Teléfono" placeholder="Ej: 0981 448401" {...register("telefonoPadre")} />
        </div>
      </div>

      {/* Pareja del Padre/Madre */}
      <div className="space-y-3">
        <Toggle
          label="¿Su padre/madre tiene pareja viviendo en la casa?"
          checked={Boolean(tieneParejaCasa)}
          onChange={(val) => setValue("parejaPadreMadreViveCasa", val)}
        />
        {tieneParejaCasa && (
          <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-gold block">
              DATOS DE LA PAREJA DEL PADRE / MADRE
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input label="Nombre y Apellido" placeholder="Ej: Silvana Rios" {...register("nombrePareja")} />
              <Input label="Edad en años" type="number" {...register("edadPareja")} />
              <Input label="Ocupación" placeholder="Ej: Abogada" {...register("ocupacionPareja")} />
              <Input label="Empresa o Institución" placeholder="Ej: ANDE" {...register("empresaPareja")} />
              <Input label="Salario aproximado" placeholder="Ej: 15.000.000" {...register("salarioPareja")} />
              <Input label="Vive en (Ciudad)" placeholder="Ej: Asunción" {...register("ciudadPareja")} />
              <Input label="Teléfono" placeholder="Ej: 0981 200456" {...register("telefonoPareja")} />
            </div>
          </div>
        )}
      </div>

      {/* Hermanos */}
      <div className="space-y-3">
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
          <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold uppercase text-gold">
                NÓMINA DE HERMANOS ({fields.length})
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
                      placeholder="Ej: José Lovera"
                      {...register(`listaHermanos.${idx}.nombre`)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Edad"
                      placeholder="Ej: 23"
                      {...register(`listaHermanos.${idx}.edad`)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Ocupación"
                      placeholder="Ej: Estudiante"
                      {...register(`listaHermanos.${idx}.ocupacion`)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Empresa/Inst."
                      placeholder="Ej: BMW"
                      {...register(`listaHermanos.${idx}.empresa`)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Domicilio"
                      placeholder="Ej: Asunción"
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

      {/* Productos de familiares en el Banco */}
      <div className="space-y-3">
        <Toggle
          label="¿Algún/os miembro/s de la familia tiene/n productos del Banco / Entidad?"
          checked={Boolean(famProductos)}
          onChange={(val) => setValue("familiaresProductosEntidad", val)}
        />
        {famProductos && (
          <Input
            label="Familiar con producto/s y tipo de producto"
            placeholder="Ej: Padre, Madre - Tarjeta de débito"
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
