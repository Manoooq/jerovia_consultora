"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso2Schema, Paso2Data } from "@/lib/validations";
import { Input, Select, Textarea } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { AiStepAssistant } from "@/components/AiStepAssistant";
import { GraduationCap, ArrowLeft, ArrowRight, Check } from "lucide-react";

interface Props {
  defaultValues: Partial<Paso2Data>;
  onNext: (data: Paso2Data) => void;
  onBack: () => void;
}

const IDIOMAS_DISPONIBLES = ["CASTELLANO", "GUARANÍ", "INGLÉS", "PORTUGUÉS"];

export function Paso2Academico({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

  const idiomasActual = watch("idiomasTexto") || "";

  function toggleIdiomaChip(idiomaLabel: string) {
    const formatted =
      idiomaLabel.charAt(0).toUpperCase() + idiomaLabel.slice(1).toLowerCase();
    const parts = idiomasActual
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const exists = parts.some(
      (p) => p.toLowerCase() === formatted.toLowerCase()
    );
    const updated = exists
      ? parts.filter((p) => p.toLowerCase() !== formatted.toLowerCase())
      : [...parts, formatted];

    setValue("idiomasTexto", updated.join(", "), { shouldValidate: true });
  }

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
            Estudios y ¿Qué Idiomas Manejas?
          </h2>
        </div>
      </div>

      <AiStepAssistant
        stepTitle="Formación e Idiomas"
        placeholder="Ej: Estudio Administración de Empresas 2do año en la UAP, manejo Castellano y Guaraní..."
        onApplyFields={(extracted) => {
          Object.entries(extracted).forEach(([k, v]) => {
            if (typeof v === "string" && k !== "_rawAiText") {
              setValue(k as keyof Paso2Data, v as never, { shouldValidate: true });
            }
          });
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Profesión / Actividad Principal"
          placeholder="Ej: Estudiante Activo / Licenciado"
          {...register("profesion")}
        />
        <Input
          label="Carrera o Nivel de Estudios"
          placeholder="Ej: Administración de Empresas / Bachiller"
          {...register("carrera")}
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
          placeholder="Ej: Universidad Autónoma del Paraguay"
          {...register("universidad")}
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

      {/* Campo solicitado: "¿Idiomas que manejas? (GUARANÍ, INGLÉS, PORTUGUÉS)" */}
      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
        <span className="text-xs font-mono font-bold uppercase text-gold block">
          ¿IDIOMAS QUE MANEJAS? (TOQUE PARA SELECCIONAR)
        </span>

        <div className="flex flex-wrap gap-2">
          {IDIOMAS_DISPONIBLES.map((lang) => {
            const active = idiomasActual
              .toLowerCase()
              .includes(lang.toLowerCase());
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleIdiomaChip(lang)}
                className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 cursor-pointer transition-all ${
                  active
                    ? "bg-[#536c45] text-white border-[#536c45] shadow-xs"
                    : "bg-surface0 text-text border-overlay1 hover:border-gold"
                }`}
              >
                {active && <Check className="h-3.5 w-3.5" />}
                <span>{lang}</span>
              </button>
            );
          })}
        </div>

        <Input
          label="¿Idiomas que manejas?"
          placeholder="Ej: Castellano, Guaraní, Inglés, Portugués"
          {...register("idiomasTexto")}
        />
      </div>

      <Textarea
        label="Cursos adicionales o capacitaciones (Opcional)"
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
          <span>Siguiente: Condición Ocupacional</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
