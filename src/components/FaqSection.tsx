"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "¿Cómo funciona el proceso de relevamiento?",
    a: "El administrador genera un enlace único para la visita. El evaluador registra los 9 módulos en campo con fotos y ubicación GPS, y descarga el informe final.",
  },
  {
    q: "¿Qué incluye el informe entregado?",
    a: "Un dossier ejecutivo de 5 láminas en formato PowerPoint (.PPTX) editable y una versión en PDF lista para archivar.",
  },
  {
    q: "¿Se puede utilizar desde el teléfono móvil?",
    a: "Sí. Toda la plataforma está optimizada para celulares, permitiendo tomar fotografías, capturar el punto GPS y guardar avances automáticamente.",
  },
  {
    q: "¿Cómo se resguarda la información?",
    a: "El acceso al panel está restringido por usuario y rol (Administrador y Evaluador), manteniendo registro de actividad y confidencialidad de los datos.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="rounded-3xl border border-overlay0/60 bg-surface0/85 backdrop-blur-2xl p-6 sm:p-8 shadow-xl">
      <div className="pb-5 border-b border-overlay0/40 mb-6">
        <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-widest">
          PREGUNTAS FRECUENTES
        </span>
        <h2 className="text-2xl font-black text-text tracking-tight mt-0.5">
          Operativa de Jerovia
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.q}
              className={`rounded-2xl border transition-colors overflow-hidden self-start ${
                isOpen
                  ? "border-gold/50 bg-surface1/80"
                  : "border-overlay0/50 bg-surface1/30 hover:border-overlay1"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-bold text-text">{faq.q}</span>
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
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 text-xs text-subtext0 leading-relaxed border-t border-overlay0/30">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
