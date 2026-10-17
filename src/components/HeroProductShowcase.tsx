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
  Wallet,
  Home,
  Scale,
  ArrowRight,
} from "lucide-react";

interface LaminaPreview {
  num: string;
  short: string;
  title: string;
  modulo: string;
  icon: React.ElementType;
  rows: { label: string; value: string }[];
  highlight: string;
}

const LAMINAS: LaminaPreview[] = [
  {
    num: "01",
    short: "Lámina 01",
    title: "Información Personal, Académica y Laboral",
    modulo: "Módulos 01 al 03",
    icon: UserCheck,
    rows: [
      { label: "Postulante Evaluado", value: "Rodrigo Benítez Martínez (CI: 4.892.150)" },
      { label: "Nivel Académico", value: "Lic. en Administración — UNA (Finalizado)" },
      { label: "Situación Ocupacional", value: "Encargado de Logística (48 meses)" },
      { label: "Movilidad y Contacto", value: "Vehículo propio • Teléfono verificado" },
    ],
    highlight: "Datos filiatorios y referencias laborales contrastadas.",
  },
  {
    num: "02",
    short: "Lámina 02",
    title: "Perfil Psicolaboral y Proyección",
    modulo: "Módulo 04",
    icon: CheckCircle2,
    rows: [
      { label: "Fortalezas Observadas", value: "Compromiso operativo, liderazgo y puntualidad" },
      { label: "Oportunidades de Mejora", value: "Herramientas avanzadas de reportería" },
      { label: "Proyección a Mediano Plazo", value: "Consolidación profesional y patrimonial" },
      { label: "Vínculos en la Entidad", value: "Sin conflictos de interés declarados" },
    ],
    highlight: "Síntesis cualitativa estructurada durante la entrevista.",
  },
  {
    num: "03",
    short: "Lámina 03",
    title: "Entorno Familiar y Cobertura de Salud",
    modulo: "Módulos 05 y 06",
    icon: Home,
    rows: [
      { label: "Grupo Conviviente", value: "Cónyuge e hijo menor (3 integrantes)" },
      { label: "Referencias Filiales", value: "Padres residentes en Luque con arraigo" },
      { label: "Cobertura Sanitaria", value: "Instituto de Previsión Social (IPS) activo" },
      { label: "Condiciones Preexistentes", value: "Sin tratamientos de alta complejidad" },
    ],
    highlight: "Estabilidad del núcleo familiar y previsión médica.",
  },
  {
    num: "04",
    short: "Lámina 04",
    title: "Balance Económico e Inspección de Vivienda",
    modulo: "Módulos 07 y 08",
    icon: Wallet,
    rows: [
      { label: "Ingresos Totales del Hogar", value: "Gs. 12.500.000 mensuales verificados" },
      { label: "Egresos Operativos", value: "Gs. 5.800.000 (Compromiso del 46%)" },
      { label: "Tenencia y Materiales", value: "Vivienda Propia • Ladrillo, tejas y cerámica" },
      { label: "Coordenada GPS Capturada", value: "-25.269932, -57.489012 (Plus Code 6867+XQ)" },
    ],
    highlight: "Cruce automático de liquidez y georreferenciación in situ.",
  },
  {
    num: "05",
    short: "Lámina 05",
    title: "Conclusiones Generales y Dictamen Pericial",
    modulo: "Módulo 09",
    icon: Scale,
    rows: [
      { label: "Concepto del Inmueble", value: "Óptimo estado de conservación y orden" },
      { label: "Comunicación y Trato", value: "Fluida, colaborativa y consistente" },
      { label: "Perito Evaluador", value: "Lic. Michelle Romero — Jerovia Consultora" },
      { label: "Resultado de la Visita", value: "FAVORABLE PARA CONTINUAR PROCESO" },
    ],
    highlight: "Dictamen final firmado listo para archivo en comité.",
  },
];

export function HeroProductShowcase() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = LAMINAS[selectedIdx];
  const Icon = active.icon;

  return (
    <div className="recessed-well rounded-3xl p-3.5 sm:p-5 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-overlay0">
        <div
          role="tablist"
          aria-label="Láminas del informe ejecutivo"
          className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full lg:w-auto"
        >
          {LAMINAS.map((lam, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={lam.num}
                role="tab"
                aria-selected={isSelected}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer border flex items-center justify-center gap-2 ${
                  isSelected
                    ? "bg-gold border-gold shadow-sm"
                    : "bg-surface0 text-subtext1 border-overlay1 hover:border-gold/60 hover:text-text"
                }`}
              >
                <span>{lam.short}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="/api/exportar/demo?formato=pptx"
            className="min-h-[40px] px-4 rounded-xl bg-gold hover:bg-gold-light font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Descargar .PPTX</span>
          </a>
          <a
            href="/api/exportar/demo?formato=pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[40px] px-4 rounded-xl border border-overlay1 bg-surface0 hover:border-gold text-text font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <FileText className="h-4 w-4 text-gold" />
            <span>Ver PDF A4</span>
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
                      LÁMINA OFICIAL {active.num} // {active.modulo}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-text mt-0.5">
                      {active.title}
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-subtext1 bg-surface1 px-2.5 py-1 rounded-lg border border-overlay0">
                  16:9 Widescreen + A4
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
                  Jerovia Consultora
                </span>
              </div>
            </SpotlightCard>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <SpotlightCard sinkIntensity={6} className="p-5 flex flex-col justify-between flex-1">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
                  FLUJO EJECUTIVO
                </span>
                <h4 className="text-base font-black text-text">
                  Emisión inmediata al concluir la visita
                </h4>
                <p className="text-xs font-medium text-subtext1 leading-relaxed">
                  Los 9 módulos del relevamiento se consolidan automáticamente en 5 diapositivas corporativas y documento A4.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-overlay0 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-subtext1 font-medium">Ubicación Demo</span>
                  <span className="font-mono font-bold text-text flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gold" /> Luque, Central
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
