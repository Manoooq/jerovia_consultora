"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso7Schema, Paso7Data } from "@/lib/validations";
import { Input, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { Wallet, Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  defaultValues: Partial<Paso7Data>;
  onNext: (data: Paso7Data) => void;
  onBack: () => void;
}

export function Paso7Economico({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
  } = useForm<Paso7Data>({
    resolver: zodResolver(paso7Schema),
    defaultValues: {
      productosEntidad: defaultValues.productosEntidad ?? true,
      tiposProductosEntidad:
        defaultValues.tiposProductosEntidad ||
        "Tarjeta de débito, Tarjeta de crédito",
      ingresosCubrenDeudas: defaultValues.ingresosCubrenDeudas ?? true,
      tieneDependientesEconomicos:
        defaultValues.tieneDependientesEconomicos ?? false,
      dependientesEconomicosDetalle:
        defaultValues.dependientesEconomicosDetalle || "",
      ingresosFamiliares: defaultValues.ingresosFamiliares || "3.044.000",
      otrosIngresos: defaultValues.otrosIngresos || "",
      egresosMensuales: defaultValues.egresosMensuales || "1.181.000",
      cantidadEgresos:
        defaultValues.cantidadEgresos ??
        (defaultValues.listaEgresos?.length || 0),
      listaEgresos: defaultValues.listaEgresos || [
        { empresa: "Facultad", monto: "490.000" },
        { empresa: "Plan Telefonía", monto: "91.000" },
      ],
      prestamos: defaultValues.prestamos ?? false,
      cantidadPrestamos:
        defaultValues.cantidadPrestamos ??
        (defaultValues.listaPrestamos?.length || 0),
      listaPrestamos: defaultValues.listaPrestamos || [],
    },
  });

  const {
    fields: egresosFields,
    append: appendEgreso,
    remove: removeEgreso,
  } = useFieldArray({
    control,
    name: "listaEgresos",
  });

  const {
    fields: prestamosFields,
    append: appendPrestamo,
    remove: removePrestamo,
  } = useFieldArray({
    control,
    name: "listaPrestamos",
  });

  const poseeProductos = watch("productosEntidad");
  const tienePrestamos = watch("prestamos");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6" noValidate>
      <div className="flex items-center gap-3 border-b border-overlay0 pb-3.5">
        <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
          <Wallet className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
            MÓDULO 07 DE 09 // DATOS ECONÓMICOS DE LA PERSONA
          </span>
          <h2 className="text-lg sm:text-xl font-black text-text">
            Productos Bancarios, Egresos y Préstamos
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        <Toggle
          label="¿La persona entrevistada posee algún producto del Banco / Entidad?"
          checked={Boolean(poseeProductos)}
          onChange={(val) => setValue("productosEntidad", val)}
        />
        {poseeProductos && (
          <Input
            label="Tipo/s de producto/s"
            placeholder="Ej: Tarjeta de débito, Tarjeta de crédito"
            {...register("tiposProductosEntidad")}
          />
        )}

        <Toggle
          label="¿Actualmente, sus ingresos cubren todas sus deudas o gastos?"
          checked={Boolean(watch("ingresosCubrenDeudas"))}
          onChange={(val) => setValue("ingresosCubrenDeudas", val)}
        />

        <Toggle
          label="¿Tiene personas que dependen económicamente de sus ingresos?"
          checked={Boolean(watch("tieneDependientesEconomicos"))}
          onChange={(val) => setValue("tieneDependientesEconomicos", val)}
        />
      </div>

      {/* Desglose de Egresos Mensuales */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold uppercase text-gold">
            CANTIDAD DE EGRESOS A NOMBRE DEL ENTREVISTADO/A ({egresosFields.length})
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              appendEgreso({ empresa: "", monto: "" });
              setValue("cantidadEgresos", egresosFields.length + 1);
            }}
          >
            <Plus className="h-3.5 w-3.5 text-gold" />
            <span>Agregar Egreso</span>
          </Button>
        </div>

        <div className="space-y-2.5">
          {egresosFields.map((field, idx) => (
            <div
              key={field.id}
              className="p-3 rounded-xl bg-surface0 border border-overlay0 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
            >
              <div className="sm:col-span-6">
                <Input
                  label={`${idx + 1}. Empresa / Concepto`}
                  placeholder="Ej: Facultad / Plan Telefonía / Bristol"
                  {...register(`listaEgresos.${idx}.empresa`)}
                />
              </div>
              <div className="sm:col-span-5">
                <Input
                  label="Monto del pago mensual (Gs.)"
                  placeholder="Ej: 490.000"
                  {...register(`listaEgresos.${idx}.monto`)}
                />
              </div>
              <div className="sm:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    removeEgreso(idx);
                    setValue("cantidadEgresos", Math.max(0, egresosFields.length - 1));
                  }}
                  className="min-h-[42px] min-w-[42px] rounded-xl border border-overlay1 hover:border-red text-subtext1 hover:text-red flex items-center justify-center cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desglose de Préstamos */}
      <div className="space-y-3">
        <Toggle
          label="¿Tiene préstamos a su nombre?"
          checked={Boolean(tienePrestamos)}
          onChange={(val) => {
            setValue("prestamos", val);
            if (val && prestamosFields.length === 0) {
              appendPrestamo({ entidad: "Credimarket", cuota: "500.000" });
              setValue("cantidadPrestamos", 1);
            }
          }}
        />

        {tienePrestamos && (
          <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold uppercase text-gold">
                PRÉSTAMOS ACTIVOS ({prestamosFields.length})
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  appendPrestamo({ entidad: "", cuota: "" });
                  setValue("cantidadPrestamos", prestamosFields.length + 1);
                }}
              >
                <Plus className="h-3.5 w-3.5 text-gold" />
                <span>Agregar Préstamo</span>
              </Button>
            </div>

            <div className="space-y-2.5">
              {prestamosFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-3 rounded-xl bg-surface0 border border-overlay0 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                >
                  <div className="sm:col-span-6">
                    <Input
                      label={`${idx + 1}. Nombre del Banco / Entidad`}
                      placeholder="Ej: Credimarket"
                      {...register(`listaPrestamos.${idx}.entidad`)}
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <Input
                      label="Valor de la cuota en Gs."
                      placeholder="Ej: 500.000"
                      {...register(`listaPrestamos.${idx}.cuota`)}
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        removePrestamo(idx);
                        setValue(
                          "cantidadPrestamos",
                          Math.max(0, prestamosFields.length - 1)
                        );
                      }}
                      className="min-h-[42px] min-w-[42px] rounded-xl border border-overlay1 hover:border-red text-subtext1 hover:text-red flex items-center justify-center cursor-pointer"
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

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-overlay0">
        <Button type="button" variant="secondary" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <span>Siguiente: Vivienda y GPS</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
