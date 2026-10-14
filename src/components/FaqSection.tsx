"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShieldCheck } from "lucide-react";

interface FaqItem {
  badge: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    badge: "BCP & SEPRELAD",
    question: "¿Qué validez tienen los dictámenes ante auditorías bancarias?",
    answer:
      "Cada legajo lleva firma profesional con Matrícula Pericial N° 4.819, coordenadas GPS inmutables y respaldo fotográfico para debida diligencia.",
  },
  {
    badge: "SLA < 24 HS",
    question: "¿En cuánto tiempo se entrega el informe al comité de crédito?",
    answer:
      "En Asunción y Central entregamos en menos de 24 horas hábiles (opción Express en el día < 10 hs). En CDE y Encarnación, entre 24 y 48 horas.",
  },
  {
    badge: "LEY N° 6534/20",
    question: "¿Cómo garantizan la confidencialidad de los datos crediticios?",
    answer:
      "Operamos bajo consentimiento informado conforme a las Leyes N° 6534/20 y 1682/01, con sesiones cifradas TLS 1.3 y acceso restringido por rol.",
  },
  {
    badge: "5 LÁMINAS .PPTX",
    question: "¿En qué formato recibe el comité el resultado de la visita?",
    answer:
      "En una presentación ejecutiva de 5 láminas (.PPTX y PDF) lista para proyectar en directorio, con score de arraigo, flujo de caja y fotos.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className="rounded-3xl border border-overlay0/60 bg-surface0/85 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-5 border-b border-overlay0/40 mb-6">
        <div>
          <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-widest">
            NORMATIVA Y CUMPLIMIENTO
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight mt-0.5">
            Respaldo Institucional
          </h2>
        </div>
        <span className="text-xs text-subtext0 font-mono flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-gold" /> Estándar Bancario y Cooperativo
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.question}
              className={`rounded-2xl border transition-all overflow-hidden self-start ${
                isOpen
                  ? "border-gold/50 bg-surface1/80 shadow-md"
                  : "border-overlay0/50 bg-surface1/30 hover:border-overlay1"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="space-y-1">
                  <span className="inline-block text-[10px] font-mono text-gold font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-gold/10 border border-gold/30">
                    {faq.badge}
                  </span>
                  <p className="text-sm font-black text-text">{faq.question}</p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-subtext0 transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-gold" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-5 sm:px-5 pt-2 text-xs text-subtext0 leading-relaxed border-t border-overlay0/30">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
