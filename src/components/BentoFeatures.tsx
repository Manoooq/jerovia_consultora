"use client";

import { motion } from "framer-motion";
import { MapPin, Mic, Camera, FileCheck2 } from "lucide-react";

interface BentoItem {
  tag: string;
  title: string;
  metric: string;
  desc: string;
  icon: React.ElementType;
  span: string;
}

const FEATURES: BentoItem[] = [
  {
    tag: "GEOLOCALIZACIÓN",
    title: "Coordenadas Inviolables",
    metric: "100% In Situ",
    desc: "Captura satelital obligatoria desde el domicilio del postulante.",
    icon: MapPin,
    span: "md:col-span-7",
  },
  {
    tag: "TRANSCRIPCIÓN IA",
    title: "Voz a Datos Estructurados",
    metric: "-70% Tiempo",
    desc: "El perito dicta la entrevista y Gemini completa los campos.",
    icon: Mic,
    span: "md:col-span-5",
  },
  {
    tag: "VISIÓN COMPUTACIONAL",
    title: "Peritaje Fotográfico",
    metric: "Auto-Scoring",
    desc: "Evaluación automática de fachada, materiales y entorno.",
    icon: Camera,
    span: "md:col-span-5",
  },
  {
    tag: "ENTREGABLE EJECUTIVO",
    title: "5 Láminas Corporativas",
    metric: ".PPTX + PDF",
    desc: "Dossier estandarizado para bancos, financieras y cooperativas.",
    icon: FileCheck2,
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-3xl border border-overlay0/60 bg-surface0/80 backdrop-blur-xl p-6 sm:p-8 overflow-hidden transition-all duration-300 hover:border-gold/50 hover:-translate-y-1 ${item.span}`}
    >
      {/* Luz radial que persigue al cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgba(229, 192, 123, 0.14), transparent 45%)",
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold px-2.5 py-1 rounded-full border border-gold/30 bg-gold/10">
            {item.tag}
          </span>
          <div className="h-10 w-10 rounded-2xl bg-surface1 border border-overlay0/50 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <h3 className="text-xl sm:text-2xl font-black text-text tracking-tight">
              {item.title}
            </h3>
            <span className="text-sm font-mono font-extrabold text-gold">
              {item.metric}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-subtext0 leading-relaxed max-w-md">
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
