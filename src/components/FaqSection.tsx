"use client";

import { useState } from "react";
import { ChevronDown, ShieldCheck, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: "Validez Normativa",
    question: "¿Qué valor legal y probatorio tienen los peritajes ante el BCP y SEPRELAD?",
    answer: "Todos los peritajes de Jerovia Consultora son elaborados y suscriptos por profesionales con Matrícula Pericial Oficial (Reg. N° 4.819). Cumplen estrictamente con los requerimientos de debida diligencia del Banco Central del Paraguay (BCP) y los manuales de prevención de lavado de dinero de SEPRELAD, constituyendo plena prueba documental de constatación presencial.",
  },
  {
    category: "Tiempos de Respuesta",
    question: "¿Cuál es el tiempo de entrega garantizado (SLA) para Asunción y el interior?",
    answer: "Para Asunción y Gran Asunción (Luque, San Lorenzo, Lambaré, Fernando de la Mora, Capiatá), el plazo estándar es inferior a 24 horas hábiles, con opción de relevamiento Express en el mismo día (< 10 horas). Para Alto Paraná (CDE) e Itapúa (Encarnación), la entrega se garantiza en un plazo de 24 a 48 horas.",
  },
  {
    category: "Privacidad y Cumplimiento",
    question: "¿Cómo se protege la información sensible bajo la Ley N° 1682/01?",
    answer: "Operamos bajo estricto consentimiento informado y secreto profesional conforme a la Ley N° 1682/01 'Que reglamenta la información de carácter privado'. Los datos recabados se custodian en servidores protegidos con cifrado de grado militar (AES-256 en reposo y TLS 1.3 en tránsito), con estricta prohibición de divulgación a terceros ajenos a la entidad contratante.",
  },
  {
    category: "Entregables del Comité",
    question: "¿En qué formatos se entrega el legajo pericial para el comité de crédito?",
    answer: "Se entrega el Legajo Ejecutivo de 5 Láminas en formato editable (.pptx) para su proyección directa en la reunión del comité de aprobación, junto con el dictamen pericial consolidado en PDF firmado digitalmente con metadatos de georreferenciación GPS y sellos temporales.",
  },
  {
    category: "Auditoría en Terreno",
    question: "¿Cómo se auditan los medidores ANDE y las condiciones de la vivienda?",
    answer: "Nuestros peritos realizan una inspección física directa en fachada, fotografían el medidor y su odómetro digital, y registran el Número de Identificación de Suministro (NIS) para verificar que el servicio esté activo y a nombre correspondiente, descartando conexiones clandestinas o irregularidades.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="rounded-3xl glass-panel p-6 sm:p-10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/[0.08] mb-8">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-gold" />
            <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider">
              Consultas Institucionales
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-text mt-0.5">
            Preguntas Frecuentes para Comités de Riesgo
          </h2>
        </div>
        <span className="text-xs text-subtext0 font-mono">
          Estándares Bancarios y Cooperativos
        </span>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? "border-gold/40 bg-surface1/80 shadow-md"
                  : "border-white/[0.06] bg-surface1/30 hover:border-white/[0.12]"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-widest hidden sm:inline px-2 py-0.5 rounded bg-surface0 border border-white/[0.06]">
                    {faq.category}
                  </span>
                  <span className="text-sm font-bold text-text">{faq.question}</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-subtext0 transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-gold" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 text-xs text-subtext0 leading-relaxed border-t border-white/[0.06] pt-3 animate-in fade-in duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-subtext0 font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
          <span>Cumplimiento garantizado conforme a normas BCP y SEPRELAD</span>
        </div>
        <span className="text-text font-bold">Jerovia Consultora · Asunción, Paraguay</span>
      </div>
    </div>
  );
}
