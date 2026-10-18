"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso2Schema, Paso2Data } from "@/lib/validations";
import { Input, Select, Textarea } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { AiStepAssistant } from "@/components/AiStepAssistant";
import { useInterviewMode } from "@/components/InterviewModeContext";
import {
  GraduationCap,
  BookOpen,
  Award,
  Languages,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Check,
} from "lucide-react";

interface Props {
  defaultValues: Partial<Paso2Data>;
  onNext: (data: Paso2Data) => void;
  onBack: () => void;
}

const OPCIONES_CONDICION_ESTUDIO = [
  {
    id: "Estudiante",
    title: "Estudiante",
    subtitle: "Cursando actualmente una carrera o estudios",
    icon: GraduationCap,
  },
  {
    id: "Aspirante a estudiar",
    title: "Aspirante a estudiar",
    subtitle: "Próximo a iniciar o postulando a una carrera",
    icon: BookOpen,
  },
  {
    id: "Profesional / Graduado",
    title: "Estudios culminados",
    subtitle: "Carrera o formación académica finalizada",
    icon: Award,
  },
];

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
      profesion: defaultValues.profesion || "Estudiante",
      carrera: defaultValues.carrera || "",
      cursoActual: defaultValues.cursoActual || "",
      aniosEstudio: defaultValues.aniosEstudio ?? 0,
      universidad: defaultValues.universidad || "",
      estadoEstudios: defaultValues.estadoEstudios || "en_curso",
      idiomasTexto: defaultValues.idiomasTexto || "",
      cursos: defaultValues.cursos || "",
    },
  });

  const condicionEstudio = watch("profesion") || "Estudiante";
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
            Situación de Estudios e Idiomas
          </h2>
        </div>
      </div>

      <AiStepAssistant
        stepNumber={2}
        stepTitle="Estudios e Idiomas"
        placeholder="Dicte o escriba su carrera, institución y qué idiomas maneja..."
        onApplyFields={(extracted) => {
          Object.entries(extracted).forEach(([k, v]) => {
            if (typeof v === "string" && k !== "_rawAiText") {
              setValue(k as keyof Paso2Data, v as never, { shouldValidate: true });
            }
          });
        }}
      />

      {/* Selector visual: Estudiante o Aspirante a estudiar */}
      {!shouldHideField("profesion") && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-text block">
            Seleccione su situación académica actual:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {OPCIONES_CONDICION_ESTUDIO.map((op) => {
              const Icon = op.icon;
              const active = condicionEstudio === op.id;
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => {
                    setValue("profesion", op.id, { shouldValidate: true });
                    if (op.id === "Profesional / Graduado") {
                      setValue("estadoEstudios", "finalizado");
                    } else {
                      setValue("estadoEstudios", "en_curso");
                    }
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    active
                      ? "bg-[#536c45] text-white border-[#536c45] shadow-md"
                      : "bg-surface0 text-text border-overlay1 hover:border-gold"
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                      active
                        ? "bg-white/15 text-white"
                        : "bg-gold/15 text-gold border border-gold/30"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-black leading-snug">
                      {op.title}
                    </p>
                    <p
                      className={`text-[11px] mt-0.5 leading-snug ${
                        active ? "text-[#e2e8de]" : "text-subtext1"
                      }`}
                    >
                      {op.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {!shouldHideField("carrera") && (
            <Input
              label={
                condicionEstudio === "Aspirante a estudiar"
                  ? "Carrera a la que aspira ingresar"
                  : "Carrera o Nivel de Estudios"
              }
              placeholder="Indique la carrera o bachillerato"
              {...register("carrera")}
            />
          )}
          {!shouldHideField("cursoActual") && (
            <Input
              label={
                condicionEstudio === "Aspirante a estudiar"
                  ? "Año / Turno al que postula"
                  : "Cursando actualmente el"
              }
              placeholder="Ej: Ingreso / 1er año / 2do año"
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
        </div>
      </div>

      {/* ¿Idiomas que manejas? con ícono y opción de escribir cualquiera */}
      {!shouldHideField("idiomasTexto") && (
        <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-gold">
            <Languages className="h-4 w-4" />
            <span>¿IDIOMAS QUE MANEJAS? (PUEDE ESCRIBIR CUALQUIER IDIOMA)</span>
          </div>

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
              placeholder="Escribir otro idioma y presionar Agregar..."
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
            label="Idiomas que manejas"
            placeholder="Lista de idiomas que maneja"
            {...register("idiomasTexto")}
          />
        </div>
      )}

      <Textarea
        label="Cursos adicionales o capacitaciones (Opcional)"
        rows={2}
        placeholder="Detalle cursos o conocimientos adicionales"
        {...register("cursos")}
      />

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-overlay0">
        <Button type="button" variant="secondary" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <span>Siguiente: Experiencia Laboral</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
