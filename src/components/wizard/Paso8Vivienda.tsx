"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso8Schema, Paso8Data } from "@/lib/validations";
import { Input, Select } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { GeoCapture } from "@/components/GeoCapture";
import { FotoUploader } from "@/components/FotoUploader";
import { Home, ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  defaultValues: Partial<Paso8Data>;
  onNext: (data: Paso8Data) => void;
  onBack: () => void;
}

export function Paso8Vivienda({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Paso8Data>({
    resolver: zodResolver(paso8Schema),
    defaultValues: {
      ciudad: defaultValues.ciudad || "Asunción",
      barrio: defaultValues.barrio || "",
      direccion: defaultValues.direccion || "",
      coordenadas: defaultValues.coordenadas || "",
      plusCode: defaultValues.plusCode || "",
      tipoCamino: defaultValues.tipoCamino || "empedrado",
      tenenciaVivienda: defaultValues.tenenciaVivienda || "familiar",
      cantidadPersonas: defaultValues.cantidadPersonas ?? 4,
      quienesVivenCasa:
        defaultValues.quienesVivenCasa || "Padre, madrastra y hermanos",
      habitaciones: defaultValues.habitaciones ?? 3,
      salaCantidad: defaultValues.salaCantidad ?? 1,
      banos: defaultValues.banos ?? 2,
      cocinaCantidad: defaultValues.cocinaCantidad ?? 1,
      plantas: defaultValues.plantas ?? 1,
      paredesDetalle: defaultValues.paredesDetalle || "Ladrillos revocados",
      techoDetalle: defaultValues.techoDetalle || "Teja",
      pisosDetalle: defaultValues.pisosDetalle || "Baldosa",
      fotosVivienda: defaultValues.fotosVivienda || [],
    },
  });

  const fotos = watch("fotosVivienda") || [];

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6" noValidate>
      <div className="flex items-center gap-3 border-b border-overlay0 pb-3.5">
        <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
          <Home className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
            MÓDULO 08 DE 09 // DATOS DE LA VIVIENDA
          </span>
          <h2 className="text-lg sm:text-xl font-black text-text">
            Ubicación GPS, Fachada y Dependencias
          </h2>
        </div>
      </div>

      <GeoCapture
        coordenadas={watch("coordenadas")}
        plusCode={watch("plusCode")}
        onCaptured={(data) => {
          setValue("coordenadas", data.coordenadas);
          setValue("plusCode", data.plusCode);
          if (data.ciudad && !watch("ciudad")) setValue("ciudad", data.ciudad);
          if (data.barrio && !watch("barrio")) setValue("barrio", data.barrio);
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Ciudad"
          required
          placeholder="Ej: Asunción"
          {...register("ciudad")}
          error={errors.ciudad?.message}
        />
        <Input
          label="Barrio"
          required
          placeholder="Ej: Hipódromo"
          {...register("barrio")}
          error={errors.barrio?.message}
        />
        <Input
          label="Dirección"
          required
          placeholder="Ej: Calle Encarnación #1143"
          {...register("direccion")}
          error={errors.direccion?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Trayecto a la vivienda"
          options={[
            { value: "empedrado", label: "Camino empedrado" },
            { value: "asfalto", label: "Camino asfaltado" },
            { value: "tierra", label: "Camino de tierra" },
          ]}
          {...register("tipoCamino")}
        />
        <Select
          label="Propiedad de la vivienda"
          options={[
            { value: "familiar", label: "De un familiar" },
            { value: "propia", label: "Propia" },
            { value: "alquilada", label: "Alquilada" },
            { value: "prestada", label: "Prestada / Cedida" },
          ]}
          {...register("tenenciaVivienda")}
        />
        <Input
          label="Cantidad de habitantes en la casa"
          type="number"
          min={1}
          {...register("cantidadPersonas")}
        />
      </div>

      <Input
        label="¿Quién vive en la casa junto a la persona entrevistada?"
        placeholder="Ej: Padre, madrastra y hermanos"
        {...register("quienesVivenCasa")}
      />

      {/* Dependencias de la vivienda */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <span className="text-xs font-mono font-bold uppercase text-gold block">
          DEPENDENCIAS DE LA VIVIENDA Y PISOS
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Input label="Dormitorios" type="number" min={0} {...register("habitaciones")} />
          <Input label="Salas" type="number" min={0} {...register("salaCantidad")} />
          <Input label="Baños" type="number" min={0} {...register("banos")} />
          <Input label="Cocinas" type="number" min={0} {...register("cocinaCantidad")} />
          <Input label="¿De cuántos pisos es?" type="number" min={1} {...register("plantas")} />
        </div>
      </div>

      {/* Materiales constructivos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Material de las paredes"
          placeholder="Ej: Ladrillos revocados"
          {...register("paredesDetalle")}
        />
        <Input
          label="Material del techo"
          placeholder="Ej: Teja"
          {...register("techoDetalle")}
        />
        <Input
          label="Material del piso"
          placeholder="Ej: Baldosa"
          {...register("pisosDetalle")}
        />
      </div>

      {/* Fotografías de la fachada y croquis satelital */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-text block">
          Fotografías de la Fachada y Captura Satelital de Ubicación
        </span>
        <FotoUploader
          fotos={fotos}
          onChange={(nuevas) => setValue("fotosVivienda", nuevas)}
          maxFotos={4}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-overlay0">
        <Button type="button" variant="secondary" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <span>Siguiente: Observaciones y Firma</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
