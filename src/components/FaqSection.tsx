"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Info } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: "Validez Normativa",
    question: "¿Qué valor legal y probatorio tienen los peritajes ante el BCP?",
    answer: "Todos los peritajes son elaborados y suscriptos por profesionales con Matrícula Pericial Oficial (Reg. N° 4.819). Cumplen estrictamente con los requerimientos de debida diligencia del Banco Central del Paraguay (BCP), constituyendo plena prueba documental.",
  },
  {
    category: "Tiempos de Respuesta",
    question: "¿Cuál es el tiempo de entrega garantizado (SLA)?",
    answer: "Para Asunción y Gran Asunción, el plazo estándar es inferior a 24 horas hábiles, con opción de relevamiento Express en el mismo día. Para Alto Paraná e Itapúa, la entrega se garantiza en un plazo de 24 a 48 horas.",
  },
  {
    category: "Privacidad",
    question: "¿Cómo se protege la información bajo la Ley N° 1682/01?",
    answer: "Operamos bajo estricto consentimiento informado y secreto profesional. Los datos recabados se custodian en servidores protegidos, con estricta prohibición de divulgación a terceros ajenos a la entidad contratante.",
  },
  {
    category: "Entregables",
    question: "¿En qué formatos se entrega el legajo pericial?",
    answer: "Se entrega el Legajo Ejecutivo de 5 Láminas en formato editable (.pptx) para su proyección directa, junto con el dictamen pericial consolidado en PDF con metadatos de georreferenciación GPS.",
  },
  {
    category: "Auditoría",
    question: "¿Cómo se auditan los medidores y condiciones de la vivienda?",
    answer: "Nuestros peritos realizan una inspección física directa en fachada, registrando el Número de Identificación de Suministro (NIS) para verificar que el servicio esté activo y descartando conexiones clandestinas.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="rounded-2xl border border-overlay0 bg-surface0 p-6 sm:p-10 shadow-lg">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-overlay0 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5 text-text" />
            <span className="text-sm font-semibold text-text uppercase tracking-wider">
              Consultas Frecuentes
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text">
            Información para Comités
          </h2>
        </div>
      </header>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all overflow-hidden ${
                isOpen
                  ? "border-overlay1 bg-surface1 shadow-sm"
                  : "border-overlay0 bg-surface0 hover:border-overlay1 hover:bg-surface1/50"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-subtext1 uppercase tracking-widest hidden sm:inline px-2 py-1 rounded-md bg-surface2 border border-overlay0">
                    {faq.category}
                  </span>
                  <span className="text-base font-medium text-text">{faq.question}</span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-subtext0 transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-text" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 text-sm text-subtext0 leading-relaxed border-t border-overlay0 pt-4 animate-in fade-in duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-overlay0 flex items-center gap-2 text-sm text-subtext0 font-medium">
        <Info className="h-5 w-5 text-subtext1 shrink-0" />
        <span>Cumplimiento garantizado conforme a normas BCP.</span>
      </div>
    </div>
  );
}
