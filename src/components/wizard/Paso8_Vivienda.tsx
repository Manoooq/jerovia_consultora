"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { paso8Schema, type Paso8Data } from "@/lib/validations";
import { Input, Select, Textarea, Toggle } from "@/components/ui/FormFields";
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
    register, handleSubmit, setValue, watch, formState: { errors },
  // @ts-expect-error — known zodResolver/RHF type mismatch with .optional().default()
  } = useForm<Paso8Data>({ resolver: zodResolver(paso8Schema), defaultValues: { ...defaultValues } });

  const tenenciaVivienda = watch("tenenciaVivienda");
  const cocina = watch("cocina");
  const sala = watch("sala");

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <form onSubmit={handleSubmit(onNext as any)} className="flex flex-col gap-6">
        <div className="flex items-center gap-2 mb-2">
          <Home className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Datos de la Vivienda</h2>
        </div>

        <GeoCapture 
          onCapturado={(data: {coordenadas: string; plusCode: string; ciudad?: string}) => {
            setValue("coordenadas", data.coordenadas);
            setValue("plusCode", data.plusCode);
            if (data.ciudad) setValue("ciudad", data.ciudad);
          }}
        />

        <FotoUploader 
          tipo="vivienda"
          onAnalizado={(data: Record<string, unknown>) => {
            // Ejemplo de uso de datos analizados, si corresponde
            if (typeof data.techo === "string") setValue("techo", data.techo as any);
            if (typeof data.paredes === "string") setValue("paredes", data.paredes as any);
            if (typeof data.pisos === "string") setValue("pisos", data.pisos as any);
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Ciudad" {...register("ciudad")} error={errors.ciudad?.message} />
          <Input label="Barrio" {...register("barrio")} error={errors.barrio?.message} />
          <Input label="Dirección" {...register("direccion")} error={errors.direccion?.message} />
          <Input label="Coordenadas" {...register("coordenadas")} error={errors.coordenadas?.message} />
          <Input label="Plus Code" {...register("plusCode")} error={errors.plusCode?.message} />
          
          <Select
            label="Tipo de Camino"
            options={[
              { value: "asfalto", label: "Asfalto" },
              { value: "empedrado", label: "Empedrado" },
              { value: "tierra", label: "Tierra" },
            ]}
            {...register("tipoCamino")}
            error={errors.tipoCamino?.message}
          />
        </div>

        <Select
          label="Tenencia de la Vivienda"
          options={[
            { value: "propia", label: "Propia" },
            { value: "alquilada", label: "Alquilada" },
            { value: "prestada", label: "Prestada" },
            { value: "familiar", label: "Familiar" },
          ]}
          {...register("tenenciaVivienda")}
          error={errors.tenenciaVivienda?.message}
        />

        {tenenciaVivienda === "alquilada" && (
          <Input type="number" label="Costo de Alquiler" {...register("costoAlquiler", { valueAsNumber: true })} error={errors.costoAlquiler?.message} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input type="number" label="Cantidad de Personas" {...register("cantidadPersonas", { valueAsNumber: true })} error={errors.cantidadPersonas?.message} />
          <Input type="number" label="Habitaciones" {...register("habitaciones", { valueAsNumber: true })} error={errors.habitaciones?.message} />
          <Input type="number" label="Baños" {...register("banos", { valueAsNumber: true })} error={errors.banos?.message} />
        </div>

        <div className="flex gap-4">
          <Toggle label="¿Tiene cocina?" checked={!!cocina} onChange={(val) => setValue("cocina", val)} />
          <Toggle label="¿Tiene sala?" checked={!!sala} onChange={(val) => setValue("sala", val)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Material del Techo"
            options={[
              { value: "tejas", label: "Tejas" },
              { value: "chapa", label: "Chapa" },
              { value: "losa", label: "Losa" },
              { value: "otro", label: "Otro" },
            ]}
            {...register("techo")}
            error={errors.techo?.message}
          />
          <Select
            label="Material de las Paredes"
            options={[
              { value: "ladrillo", label: "Ladrillo" },
              { value: "madera", label: "Madera" },
              { value: "prefabricado", label: "Prefabricado" },
              { value: "otro", label: "Otro" },
            ]}
            {...register("paredes")}
            error={errors.paredes?.message}
          />
          <Select
            label="Material de los Pisos"
            options={[
              { value: "ceramica", label: "Cerámica" },
              { value: "cemento", label: "Cemento" },
              { value: "mosaico", label: "Mosaico" },
              { value: "otro", label: "Otro" },
            ]}
            {...register("pisos")}
            error={errors.pisos?.message}
          />
        </div>
        
        <Input type="number" label="Número de Plantas" {...register("plantas", { valueAsNumber: true })} error={errors.plantas?.message} />

        <div className="flex justify-between pt-2">
          <Button type="button" variant="secondary" size="lg" onClick={onPrev}>
            <ChevronLeft className="h-5 w-5 mr-2" /> Anterior
          </Button>
          <Button type="submit" size="lg">
            Siguiente <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
