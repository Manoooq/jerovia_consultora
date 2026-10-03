"use client";

import { useState } from "react";
import { 
  Building2, MapPin, Zap, Scale, FileText, 
  CheckCircle2, ArrowRight, ShieldCheck, Check
} from "lucide-react";

interface Step {
  id: number;
  phase: string;
  title: string;
  badge: string;
  icon: typeof Building2;
  action: string;
  details: string[];
  deliverable: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    phase: "Fase 01",
    title: "Solicitud y Token Criptográfico",
    badge: "Secreto Bancario",
    icon: Building2,
    action: "La entidad financiera emite la orden de peritaje. Se genera un token de acceso temporal de un solo uso para evitar la exposición pública de los datos del postulante.",
    details: [
      "Generación de expediente determinístico (EXP-2026-XXXX).",
      "Asignación de perito homologado según zona geográfica.",
      "Protección estricta bajo Ley N° 1682/01 y normativas del BCP.",
    ],
    deliverable: "Enlace criptográfico único asignado al evaluador de campo.",
  },
  {
    id: 2,
    phase: "Fase 02",
    title: "Despliegue y Georreferenciación Satelital",
    badge: "Presencia In Situ",
    icon: MapPin,
    action: "El perito se traslada físicamente a la dirección declarada en Asunción o el interior del país, certificando las coordenadas GPS inalterables en puerta.",
    details: [
      "Lectura GPS con tolerancia máxima de 8 metros.",
      "Cálculo del código satelital Plus Code de Google Maps.",
      "Constatación del tipo de camino (asfalto, empedrado o tierra).",
    ],
    deliverable: "Coordenadas satelitales y Plus Code vinculados al expediente.",
  },
  {
    id: 3,
    phase: "Fase 03",
    title: "Inspección Habitacional y Medidor ANDE",
    badge: "Cotejo de Suministros",
    icon: Zap,
    action: "Inspección ocular de la vivienda y cotejo del medidor eléctrico oficial para verificar si el suministro está activo, sin mora y a nombre de quién se encuentra.",
    details: [
      "Registro del número de NIS de la ANDE y estado del medidor.",
      "Comprobación de mampostería, techo de tejas/chapa y pisos.",
      "Verificación de muralla perimetral y seguridad vecinal.",
    ],
    deliverable: "Ficha técnica constructiva y comprobante de suministro.",
  },
  {
    id: 4,
    phase: "Fase 04",
    title: "Cruce Algorítmico de Solvencia",
    badge: "Control de Consistencia",
    icon: Scale,
    action: "Análisis financiero entre los ingresos declarados por el postulante y su costo de vida observable en el hogar para advertir inconsistencias.",
    details: [
      "Detección de alertas: Alquiler > 50% de ingresos familiares.",
      "Detección de alertas: Egresos declarados superiores a los ingresos.",
      "Verificación de aportes continuos a IPS y estabilidad laboral.",
    ],
    deliverable: "Semáforo de consistencia financiera (Coherente / Alerta).",
  },
  {
    id: 5,
    phase: "Fase 05",
    title: "Dictamen Pericial y Legajo en 5 Láminas",
    badge: "Resolución Oficial",
    icon: FileText,
    action: "Redacción del dictamen formal (Favorable / Con Observaciones / Desfavorable) con firma de la perito y generación inmediata del archivo .pptx y PDF.",
    details: [
      "Presentación en 5 diapositivas ejecutivas 16:9.",
      "Firma y matrícula profesional N° 4.819 homologada.",
      "Listo para su inclusión en la carpeta del Comité de Créditos.",
    ],
    deliverable: "Archivo PowerPoint (.pptx) editable y PDF final.",
  },
];

export function WorkflowStepper() {
  const [activeStep, setActiveStep] = useState(1);
  const current = STEPS.find((s) => s.id === activeStep) || STEPS[0];

  return (
    <div className="rounded-3xl border border-overlay0/40 bg-surface0 p-6 sm:p-8 shadow-sm">
      <div className="max-w-2xl mb-8">
        <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
          Flujo de Auditoría Pericial
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight mt-1">
          De la solicitud del banco a la resolución del comité
        </h2>
        <p className="text-xs sm:text-sm text-subtext0 mt-1 leading-relaxed">
          Un proceso trazable y estandarizado en 5 etapas para asegurar la máxima calidad probatoria en cada expediente.
        </p>
      </div>

      {/* Stepper Horizontal Interactivo */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pb-6 border-b border-overlay0/30">
        {STEPS.map((s) => {
          const isSelected = activeStep === s.id;
          const isPast = activeStep > s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveStep(s.id)}
              className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? "border-gold bg-gold/10 text-text font-bold shadow-sm"
                  : isPast
                  ? "border-green/30 bg-surface1 text-text"
                  : "border-overlay0/30 bg-surface1/40 hover:bg-surface1 text-subtext0 hover:text-text"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-mono text-[10px] font-bold ${isSelected ? "text-gold" : isPast ? "text-green" : "text-subtext0"}`}>
                  {s.phase}
                </span>
                <s.icon className={`h-4 w-4 ${isSelected ? "text-gold" : isPast ? "text-green" : "text-subtext0"}`} />
              </div>
              <div className="text-xs font-bold text-text truncate">{s.title}</div>
            </button>
          );
        })}
      </div>

      {/* Detalle de la Etapa Seleccionada */}
      <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold/15 text-gold border border-gold/30">
              {current.badge}
            </span>
            <span className="font-mono text-xs text-subtext0 font-semibold">{current.phase} de 5</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-text">{current.title}</h3>
          <p className="text-xs sm:text-sm text-subtext0 leading-relaxed font-normal">
            {current.action}
          </p>

          <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/30 space-y-2">
            <span className="text-xs font-bold text-text block">Controles probatorios en esta fase:</span>
            {current.details.map((d) => (
              <div key={d} className="flex items-center gap-2 text-xs text-subtext1">
                <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0" />
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="p-6 rounded-2xl border border-gold/30 bg-gold/5 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold" />
              <span className="text-xs font-bold uppercase tracking-wider text-text">Entregable de la Fase</span>
            </div>
            <p className="text-sm font-bold text-text font-mono leading-snug">
              {current.deliverable}
            </p>
            <div className="pt-3 border-t border-gold/20 flex items-center justify-between text-xs">
              <span className="text-subtext0">Garantía de Cadena de Custodia</span>
              <span className="text-green font-bold flex items-center gap-1 font-mono">
                <Check className="h-3.5 w-3.5" /> Verificado
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
