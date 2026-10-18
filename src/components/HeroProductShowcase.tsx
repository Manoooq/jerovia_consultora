"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  MapPin,
  UserCheck,
  Home,
  HeartPulse,
  Scale,
  ArrowRight,
} from "lucide-react";

interface PaginaPreview {
  num: string;
  short: string;
  title: string;
  modulo: string;
  icon: React.ElementType;
  rows: { label: string; value: string }[];
  highlight: string;
}

const PAGINAS: PaginaPreview[] = [
  {
    num: "01",
    short: "Página 01",
    title: "Filiación, Formación Académica y Empleo",
    modulo: "Nombre, Edad, CI, Estudios y Laboral",
    icon: UserCheck,
    rows: [
      { label: "Ficha Principal", value: "Nombre, Edad, Fecha de Nac., CI, Estado Civil y Contacto" },
      { label: "Formación Académica", value: "Carrera, Universidad, Años cursados e Idiomas" },
      { label: "Trayectoria Laboral", value: "Situación actual, Empresa, Cargo y Antigüedad" },
      { label: "Pretensión y Vínculos", value: "Disponibilidad horaria y familiares en la entidad" },
    ],
    highlight: "Encabezado ejecutivo con cálculo automático de edad.",
  },
  {
    num: "02",
    short: "Página 02",
    title: "Perfil Psicosocial, Redes y Movilidad",
    modulo: "Fortalezas, Visión, Redes y Vehículo",
    icon: CheckCircle2,
    rows: [
      { label: "Aspectos Positivos y Mejora", value: "Inteligente, empático, seguro · Áreas de crecimiento" },
      { label: "Visión y Expectativas", value: "Metas a largo plazo y motivación hacia la entidad" },
      { label: "Red Social y Licencia", value: "Plataforma principal (Instagram/otra) y registro de conducir" },
      { label: "Movilidad y Vínculos", value: "Movilidad propia, características y sindicatos/política" },
    ],
    highlight: "Orden idéntico al protocolo confidencial de entrevista.",
  },
  {
    num: "03",
    short: "Página 03",
    title: "Estado de Salud y Estructura Familiar",
    modulo: "Alergias, Seguro Médico y Padres",
    icon: HeartPulse,
    rows: [
      { label: "Salud y Seguro Médico", value: "Enfermedad de base/alergias, IPS/Privado y tratamientos" },
      { label: "Hábitos Declarados", value: "Consumo de bebidas alcohólicas y tabaco/vapeo" },
      { label: "Composición Conviviente", value: "Hijos, relación de los padres y estructura del hogar" },
      { label: "Referencias Filiales", value: "Nombre, edad, ocupación, ciudad y teléfono de Padre y Madre" },
    ],
    highlight: "Relevamiento integral sanitario y del grupo familiar.",
  },
  {
    num: "04",
    short: "Página 04",
    title: "Vivienda (Arriba) y Situación Económica (Abajo)",
    modulo: "Coordenadas GPS, Ambientes e Ingresos",
    icon: Home,
    rows: [
      { label: "Ubicación y Coordenadas", value: "Ciudad, Barrio, Dirección exacta, Camino y GPS" },
      { label: "Composición y Construcción", value: "Habitaciones, baños, cocina, sala, techo, pisos y paredes" },
      { label: "Productos en la Entidad", value: "Titular, miembros de la familia y tipos de productos" },
      { label: "Flujo Económico Mensual", value: "Ingresos familiares, otros ingresos, egresos y préstamos" },
    ],
    highlight: "Inspección habitacional seguida del balance financiero.",
  },
  {
    num: "05",
    short: "Página 05",
    title: "Observaciones de la Visita y Firma",
    modulo: "Concepto, Orden/Limpieza y Firma",
    icon: Scale,
    rows: [
      { label: "Observaciones de Entrevista", value: "Predisposición, personas presentes y dicción" },
      { label: "Otras Observaciones", value: "Condiciones de orden, limpieza y entorno vecinal" },
      { label: "Fecha Efectiva de Visita", value: "Registro de fecha exacta de constatación en terreno" },
      { label: "Firma de Realización", value: "Realizado por Michelle Romero · Jerovia Consultora" },
    ],
    highlight: "Cierre con firma digitalizada listo para imprimir en A4.",
  },
];

export function HeroProductShowcase() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = PAGINAS[selectedIdx];
  const Icon = active.icon;

  return (
    <div className="recessed-well rounded-3xl p-3.5 sm:p-5 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-overlay0">
        <div
          role="tablist"
          aria-label="Páginas del informe confidencial"
          className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full lg:w-auto"
        >
          {PAGINAS.map((pag, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={pag.num}
                role="tab"
                aria-selected={isSelected}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer border flex items-center justify-center gap-2 ${
                  isSelected
                    ? "bg-gold border-gold text-white shadow-sm"
                    : "bg-surface0 text-text border-overlay1 hover:border-gold hover:text-gold"
                }`}
              >
                <span>{pag.short}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="/api/exportar/demo?formato=pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[40px] px-4 rounded-xl bg-gold hover:bg-gold-light font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
          >
            <FileText className="h-4 w-4" />
            <span>Abrir Informe 5 Páginas (PDF)</span>
          </a>
          <a
            href="/api/exportar/demo?formato=pptx"
            className="min-h-[40px] px-4 rounded-xl border border-overlay1 bg-surface0 hover:border-gold text-text font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-gold" />
            <span>Descargar .PPTX</span>
          </a>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.num}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch"
        >
          <div className="lg:col-span-8">
            <SpotlightCard sinkIntensity={4} className="p-5 sm:p-7 flex flex-col justify-between space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-overlay0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-gold">
                      PÁGINA {active.num} DE 5 // {active.modulo}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-text mt-0.5">
                      {active.title}
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-text bg-surface1 px-2.5 py-1 rounded-lg border border-overlay0">
                  A4 Retrato + PPTX
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {active.rows.map((r) => (
                  <div
                    key={r.label}
                    className="p-3.5 rounded-xl bg-surface1 border border-overlay0 space-y-1"
                  >
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-subtext0 block">
                      {r.label}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-text">
                      {r.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-overlay0 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-green flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  {active.highlight}
                </span>
                <span className="font-mono text-subtext1">
                  Realizado por Michelle Romero
                </span>
              </div>
            </SpotlightCard>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <SpotlightCard sinkIntensity={6} className="p-5 flex flex-col justify-between flex-1">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
                  FORMATO HOMOLOGADO
                </span>
                <h4 className="text-base font-black text-text">
                  5 páginas A4 con ondas arquitectónicas en Verde Oliva
                </h4>
                <p className="text-xs font-medium text-subtext1 leading-relaxed">
                  Respeta exactamente el orden de tu plantilla confidencial, con cálculo automático de edad y cierre firmado por Michelle Romero.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-overlay0 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-subtext1 font-medium">Ubicación Demo</span>
                  <span className="font-mono font-bold text-text flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gold" /> Asunción / Luque
                  </span>
                </div>
                <Link
                  href="/entrevista/demo"
                  className="min-h-[42px] w-full rounded-xl bg-gold hover:bg-gold-light font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-2"
                >
                  <span>Probar Relevamiento en Vivo</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </SpotlightCard>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
