"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso2Schema, Paso2Data } from "@/lib/validations";
import { Input, Select, Textarea } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { AiStepAssistant } from "@/components/AiStepAssistant";
import { useInterviewMode } from "@/components/InterviewModeContext";
import { GraduationCap, ArrowLeft, ArrowRight, Plus, X, Check } from "lucide-react";

interface Props {
  defaultValues: Partial<Paso2Data>;
  onNext: (data: Paso2Data) => void;
  onBack: () => void;
}

const SUGERENCIAS_IDIOMAS = ["Castellano", "Guaraní", "Inglés", "Portugués"];

export function Paso2Academico({ defaultValues, onNext, onBack }: Props) {
  const { shouldHideField } = useInterviewMode();
  const [nuevoIdioma, setNuevoIdioma] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<Paso2Data>({
    resolver: zodResolver(paso2Schema),
    defaultValues: {
      profesion: defaultValues.profesion || "",
      carrera: defaultValues.carrera || "",
      cursoActual: defaultValues.cursoActual || "",
      aniosEstudio: defaultValues.aniosEstudio ?? 0,
      universidad: defaultValues.universidad || "",
      estadoEstudios: defaultValues.estadoEstudios || "en_curso",
      idiomasTexto: defaultValues.idiomasTexto || "",
      cursos: defaultValues.cursos || "",
    },
  });

  const idiomasTexto = watch("idiomasTexto") || "";
  const listaIdiomasActuales = idiomasTexto
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  function toggleOrAddIdioma(lang: string) {
    const clean = lang.trim();
    if (!clean) return;
    const exists = listaIdiomasActuales.some(
      (i) => i.toLowerCase() === clean.toLowerCase()
    );
    const nextList = exists
      ? listaIdiomasActuales.filter(
          (i) => i.toLowerCase() !== clean.toLowerCase()
        )
      : [...listaIdiomasActuales, clean];

    setValue("idiomasTexto", nextList.join(", "), { shouldValidate: true });
  }

  function handleAddCustomIdioma() {
    if (!nuevoIdioma.trim()) return;
    const exists = listaIdiomasActuales.some(
      (i) => i.toLowerCase() === nuevoIdioma.trim().toLowerCase()
    );
    if (!exists) {
      const nextList = [...listaIdiomasActuales, nuevoIdioma.trim()];
      setValue("idiomasTexto", nextList.join(", "), { shouldValidate: true });
    }
    setNuevoIdioma("");
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5" noValidate>
      <div className="flex items-center gap-3 border-b border-overlay0 pb-3.5">
        <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
            MÓDULO 02 // FORMACIÓN ACADÉMICA E IDIOMAS
          </span>
          <h2 className="text-lg sm:text-xl font-black text-text">
            Estudios y ¿Qué Idiomas Manejas?
          </h2>
        </div>
      </div>

      <AiStepAssistant
        stepNumber={2}
        stepTitle="Estudios e Idiomas"
        placeholder="Dicte o escriba qué carrera estudia, en qué institución y qué idiomas maneja..."
        onApplyFields={(extracted) => {
          Object.entries(extracted).forEach(([k, v]) => {
            if (typeof v === "string" && k !== "_rawAiText") {
              setValue(k as keyof Paso2Data, v as never, { shouldValidate: true });
            }
          });
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!shouldHideField("profesion") && (
          <Input
            label="Profesión o Actividad Principal"
            placeholder="Indique su profesión o actividad"
            {...register("profesion")}
          />
        )}
        {!shouldHideField("carrera") && (
          <Input
            label="Carrera o Nivel de Estudios"
            placeholder="Indique la carrera o bachillerato"
            {...register("carrera")}
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {!shouldHideField("cursoActual") && (
          <Input
            label="Cursando actualmente el"
            placeholder="Indique año o semestre actual"
            {...register("cursoActual")}
          />
        )}
        {!shouldHideField("universidad") && (
          <Input
            label="Institución / Universidad"
            placeholder="Indique nombre de la institución"
            {...register("universidad")}
          />
        )}
        {!shouldHideField("estadoEstudios") && (
          <Select
            label="Estado de los estudios"
            options={[
              { value: "en_curso", label: "En curso" },
              { value: "finalizado", label: "Culminado / Graduado" },
              { value: "interrumpido", label: "Pausado" },
            ]}
            {...register("estadoEstudios")}
          />
        )}
      </div>

      {/* ¿Idiomas que manejas?: Permite cualquier idioma libremente */}
      {!shouldHideField("idiomasTexto") && (
        <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
          <span className="text-xs font-mono font-bold uppercase text-gold block">
            ¿IDIOMAS QUE MANEJAS? (PUEDE AGREGAR CUALQUIER IDIOMA)
          </span>

          {/* Sugerencias rápidas + etiquetas de idiomas agregados */}
          <div className="flex flex-wrap gap-2">
            {SUGERENCIAS_IDIOMAS.map((lang) => {
              const active = listaIdiomasActuales.some(
                (i) => i.toLowerCase() === lang.toLowerCase()
              );
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleOrAddIdioma(lang)}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 cursor-pointer transition-all ${
                    active
                      ? "bg-[#536c45] text-white border-[#536c45]"
                      : "bg-surface0 text-text border-overlay1 hover:border-gold"
                  }`}
                >
                  {active && <Check className="h-3.5 w-3.5" />}
                  <span>{lang}</span>
                </button>
              );
            })}

            {listaIdiomasActuales
              .filter(
                (i) =>
                  !SUGERENCIAS_IDIOMAS.some(
                    (s) => s.toLowerCase() === i.toLowerCase()
                  )
              )
              .map((customLang) => (
                <span
                  key={customLang}
                  className="min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#536c45] text-white border border-[#536c45] inline-flex items-center gap-1.5"
                >
                  <span>{customLang}</span>
                  <button
                    type="button"
                    onClick={() => toggleOrAddIdioma(customLang)}
                    className="hover:opacity-75 cursor-pointer"
                    aria-label={`Quitar ${customLang}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
          </div>

          {/* Entrada para escribir y añadir cualquier otro idioma (Alemán, Francés, Italiano, Coreano, etc.) */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nuevoIdioma}
              onChange={(e) => setNuevoIdioma(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomIdioma();
                }
              }}
              placeholder="Escribir otro idioma (ej: Alemán, Francés, Italiano...) y presionar Agregar"
              className="flex-1 min-h-[42px] rounded-xl tactile-input px-3.5 py-2 text-xs sm:text-sm font-semibold outline-none"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddCustomIdioma}
            >
              <Plus className="h-4 w-4 text-gold" />
              <span>Agregar Idioma</span>
            </Button>
          </div>

          <Input
            label="Lista completa de idiomas que manejas"
            placeholder="Escriba o edite libremente todos los idiomas que maneja"
            {...register("idiomasTexto")}
          />
        </div>
      )}

      <Textarea
        label="Cursos adicionales o capacitaciones (Opcional)"
        rows={2}
        placeholder="Detalle cursos o conocimientos técnicos adicionales"
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
