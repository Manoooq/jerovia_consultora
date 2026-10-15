"use client";

import { motion } from "framer-motion";
import { MapPin, Mic, Camera, FileSpreadsheet } from "lucide-react";

interface BentoItem {
  tag: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  span: string;
}

const FEATURES: BentoItem[] = [
  {
    tag: "TERRENO",
    title: "Ubicación GPS en Domicilio",
    desc: "Coordenadas y Plus Code registrados directamente desde el lugar de la entrevista.",
    icon: MapPin,
    span: "md:col-span-7",
  },
  {
    tag: "AGILIDAD",
    title: "Dictado por Voz",
    desc: "Carga rápida de observaciones para agilizar el trabajo del evaluador.",
    icon: Mic,
    span: "md:col-span-5",
  },
  {
    tag: "EVIDENCIA",
    title: "Registro Fotográfico",
    desc: "Captura de fachada y servicios optimizada para teléfonos móviles.",
    icon: Camera,
    span: "md:col-span-5",
  },
  {
    tag: "ENTREGABLE",
    title: "Presentación en 5 Láminas",
    desc: "Exportación inmediata en PowerPoint (.PPTX) y PDF con la identidad de Jerovia.",
    icon: FileSpreadsheet,
    span: "md:col-span-7",
  },
];

function SpotlightBentoCard({ item, index }: { item: BentoItem; index: number }) {
  const Icon = item.icon;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-3xl border border-overlay0/60 bg-surface0/80 backdrop-blur-xl p-6 sm:p-7 overflow-hidden transition-all duration-200 hover:border-gold/50 hover:-translate-y-0.5 ${item.span}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(380px circle at var(--x, 50%) var(--y, 50%), rgba(212, 175, 55, 0.13), transparent 45%)",
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold px-2.5 py-1 rounded-full border border-gold/30 bg-gold/10">
            {item.tag}
          </span>
          <div className="h-10 w-10 rounded-2xl bg-surface1 border border-overlay0/50 flex items-center justify-center text-gold group-hover:scale-105 transition-transform">
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-black text-text tracking-tight">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-subtext0 mt-1 leading-relaxed">
            {item.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function BentoFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {FEATURES.map((item, idx) => (
        <SpotlightBentoCard key={item.title} item={item} index={idx} />
      ))}
    </div>
  );
}
