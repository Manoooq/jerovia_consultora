"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso2Schema, Paso2Data } from "@/lib/validations";
import { Input, Select, Textarea } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { GraduationCap, ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  defaultValues: Partial<Paso2Data>;
  onNext: (data: Paso2Data) => void;
  onBack: () => void;
}

export function Paso2Academico({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Paso2Data>({
    resolver: zodResolver(paso2Schema),
    defaultValues: {
      profesion: defaultValues.profesion || "Estudiante Activo",
      carrera: defaultValues.carrera || "",
      cursoActual: defaultValues.cursoActual || "2do año",
      aniosEstudio: defaultValues.aniosEstudio ?? 2,
      universidad: defaultValues.universidad || "",
      estadoEstudios: defaultValues.estadoEstudios || "en_curso",
      idiomasTexto: defaultValues.idiomasTexto || "Castellano, Guaraní",
      cursos: defaultValues.cursos || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5" noValidate>
      <div className="flex items-center gap-3 border-b border-overlay0 pb-3.5">
        <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
            MÓDULO 02 DE 09 // FORMACIÓN ACADÉMICA
          </span>
          <h2 className="text-lg sm:text-xl font-black text-text">
            Profesión, Estudios e Idiomas
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Profesión / Actividad Principal"
          placeholder="Ej: Estudiante Activo / Licenciado"
          {...register("profesion")}
        />
        <Input
          label="Carrera"
          required
          placeholder="Ej: Administración de Empresas"
          {...register("carrera")}
          error={errors.carrera?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Cursando actualmente el"
          placeholder="Ej: 2do año / Finalizado"
          {...register("cursoActual")}
        />
        <Input
          label="Institución / Universidad"
          required
          placeholder="Ej: Universidad Autónoma del Paraguay"
          {...register("universidad")}
          error={errors.universidad?.message}
        />
        <Select
          label="Estado de los estudios"
          options={[
            { value: "en_curso", label: "En curso" },
            { value: "finalizado", label: "Culminado / Graduado" },
            { value: "interrumpido", label: "Pausado" },
          ]}
          {...register("estadoEstudios")}
        />
      </div>

      <Input
        label="Idiomas que habla"
        placeholder="Ej: Castellano, Guaraní, Inglés"
        {...register("idiomasTexto")}
      />

      <Textarea
        label="Cursos adicionales o especializaciones (Opcional)"
        rows={2}
        placeholder="Ej: Atención al cliente, Excel financiero, Cajero bancario..."
        {...register("cursos")}
      />

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-overlay0">
        <Button type="button" variant="secondary" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <span>Siguiente: Datos Laborales</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
