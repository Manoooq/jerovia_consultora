"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso8Schema, type Paso8Data } from "@/lib/validations";
import { Input, Select, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { GeoCapture } from "@/components/GeoCapture";
import { FotoUploader } from "@/components/FotoUploader";

interface PasoProps {
  defaultValues?: Partial<Paso8Data>;
  onNext: (data: Paso8Data) => void;
  onPrev: () => void;
}

export function Paso8_Vivienda({ defaultValues, onNext, onPrev }: PasoProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Paso8Data>({
    resolver: zodResolver(paso8Schema),
    defaultValues: { cocina: true, sala: true, plantas: 1, ...defaultValues },
  });

  const tenenciaVivienda = watch("tenenciaVivienda");
  const cocina = Boolean(watch("cocina"));
  const sala = Boolean(watch("sala"));

  const onSubmit: SubmitHandler<Paso8Data> = (data) => onNext(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit as SubmitHandler<Record<string, unknown>>)}
      className="flex flex-col gap-6"
      noValidate
    >
      <div className="flex items-center gap-3 pb-4 border-b border-overlay0/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 shrink-0">
          <Home className="h-5 w-5 text-gold" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text">
            8. Inspección Física del Inmueble y Georreferenciación
          </h2>
          <p className="text-xs text-subtext0">
            Coordenadas GPS in situ, evidencia fotográfica y calidad constructiva
          </p>
        </div>
      </div>

      {/* 1. Captura Satelital GPS */}
      <GeoCapture
        ciudad={watch("ciudad")}
        coordenadas={watch("coordenadas")}
        onCapturado={(geo) => {
          setValue("coordenadas", geo.coordenadas, { shouldValidate: true, shouldDirty: true });
          setValue("plusCode", geo.plusCode, { shouldDirty: true });
          if (geo.ciudad) {
            setValue("ciudad", geo.ciudad, { shouldValidate: true, shouldDirty: true });
          }
        }}
      />

      {/* 2. Fotografía de Fachada y Suministro ANDE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FotoUploader
          tipo="vivienda"
          onAnalizado={(data) => {
            if (typeof data.techo === "string")
              setValue("techo", data.techo as Paso8Data["techo"], { shouldDirty: true });
            if (typeof data.paredes === "string")
              setValue("paredes", data.paredes as Paso8Data["paredes"], { shouldDirty: true });
            if (typeof data.pisos === "string")
              setValue("pisos", data.pisos as Paso8Data["pisos"], { shouldDirty: true });
          }}
        />

        <FotoUploader
          tipo="factura"
          onAnalizado={(data) => {
            if (typeof data.direccion === "string" && !watch("direccion")) {
              setValue("direccion", data.direccion, { shouldDirty: true });
            }
          }}
        />
      </div>

      {/* 3. Localización Postal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Ciudad / Municipio"
          required
          placeholder="Ej: Asunción / Luque"
          {...register("ciudad")}
          error={errors.ciudad?.message}
        />
        <Input
          label="Barrio o Compañía"
          required
          placeholder="Ej: Villa Morra"
          {...register("barrio")}
          error={errors.barrio?.message}
        />
        <div className="sm:col-span-2">
          <Input
            label="Dirección Exacta (Calle, número de casa y referencias)"
            required
            placeholder="Ej: Avda. Mariscal López N° 1420 casi Charles de Gaulle"
            {...register("direccion")}
            error={errors.direccion?.message}
          />
        </div>
        <Input
          label="Coordenadas GPS (Lat, Lng)"
          placeholder="-25.286700, -57.647000"
          className="font-mono tabular-nums"
          {...register("coordenadas")}
          error={errors.coordenadas?.message}
        />
        <Input
          label="Código Postal / Plus Code"
          placeholder="Ej: 79FM+8R PY"
          className="font-mono"
          {...register("plusCode")}
          error={errors.plusCode?.message}
        />
      </div>

      {/* 4. Régimen de Tenencia y Vía de Acceso */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Régimen de Tenencia de la Vivienda"
          required
          options={[
            { value: "propia", label: "Propia (Titulada / En pago)" },
            { value: "familiar", label: "Propiedad Familiar" },
            { value: "alquilada", label: "Alquilada / Arrendada" },
            { value: "prestada", label: "Cedida / Prestada" },
          ]}
          {...register("tenenciaVivienda")}
          error={errors.tenenciaVivienda?.message}
        />

        <Select
          label="Pavimentación de la Vía de Acceso"
          options={[
            { value: "asfalto", label: "Pavimento Asfáltico / Hormigón" },
            { value: "empedrado", label: "Empedrado / Adoquinado" },
            { value: "tierra", label: "Camino de Tierra / Enripiado" },
          ]}
          {...register("tipoCamino")}
          error={errors.tipoCamino?.message}
        />

        {tenenciaVivienda === "alquilada" && (
          <div className="sm:col-span-2">
            <Input
              type="number"
              inputMode="numeric"
              label="Canon Mensual de Alquiler (Gs.)"
              placeholder="Ej: 2.200.000"
              {...register("costoAlquiler", { valueAsNumber: true })}
              error={errors.costoAlquiler?.message}
            />
          </div>
        )}
      </div>

      {/* 5. Distribución y Materiales Constructivos */}
      <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-4 sm:p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-subtext1">
          Capacidad Habitacional y Materiales Constructivos
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            label="Habitantes"
            {...register("cantidadPersonas", { valueAsNumber: true })}
            error={errors.cantidadPersonas?.message}
          />
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            label="Dormitorios"
            {...register("habitaciones", { valueAsNumber: true })}
            error={errors.habitaciones?.message}
          />
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            label="Sanitarios"
            {...register("banos", { valueAsNumber: true })}
            error={errors.banos?.message}
          />
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            label="N° Plantas"
            {...register("plantas", { valueAsNumber: true })}
            error={errors.plantas?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Cubierta / Techo"
            options={[
              { value: "tejas", label: "Tejas cerámicas / coloniales" },
              { value: "losa", label: "Losa de hormigón armado" },
              { value: "chapa", label: "Chapa termoacústica / zinc" },
              { value: "otro", label: "Otro material" },
            ]}
            {...register("techo")}
            error={errors.techo?.message}
          />
          <Select
            label="Mampostería / Paredes"
            options={[
              { value: "ladrillo", label: "Ladrillo revocado / visto" },
              { value: "prefabricado", label: "Bloque / Prefabricado" },
              { value: "madera", label: "Madera" },
              { value: "otro", label: "Otro material" },
            ]}
            {...register("paredes")}
            error={errors.paredes?.message}
          />
          <Select
            label="Solado / Pisos"
            options={[
              { value: "ceramica", label: "Cerámico / Porcelanato" },
              { value: "mosaico", label: "Granito / Mosaico" },
              { value: "cemento", label: "Alisado de cemento" },
              { value: "otro", label: "Otro material" },
            ]}
            {...register("pisos")}
            error={errors.pisos?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-overlay0/40">
          <Toggle
            label="Cuenta con ambiente de cocina independiente equipada"
            checked={cocina}
            onChange={(val) => setValue("cocina", val, { shouldDirty: true })}
          />
          <Toggle
            label="Cuenta con sala de estar / comedor diferenciado"
            checked={sala}
            onChange={(val) => setValue("sala", val, { shouldDirty: true })}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-overlay0/40">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onPrev}
          className="w-full sm:w-auto"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto min-w-[180px]"
        >
          <span>Guardar y Continuar</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
