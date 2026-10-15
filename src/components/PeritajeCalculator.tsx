"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  Clock,
  Copy,
  Check,
  ArrowRight,
  Building2,
  Home,
  Briefcase,
  UserCheck,
} from "lucide-react";

const TIPOS = [
  { id: "consumo", name: "Socioambiental Personal", basePrice: 280000, icon: UserCheck },
  { id: "hipotecario", name: "Verificación de Vivienda", basePrice: 420000, icon: Home },
  { id: "comercial", name: "Comercial / PYMES", basePrice: 550000, icon: Building2 },
  { id: "rrhh", name: "Pre-Empleo Laboral", basePrice: 320000, icon: Briefcase },
];

const ZONAS = [
  { id: "asuncion", name: "Gran Asunción", recargo: 0, slaBase: 24 },
  { id: "central_ext", name: "Central Exterior", recargo: 45000, slaBase: 28 },
  { id: "caaguazu", name: "Cordillera / Caaguazú", recargo: 80000, slaBase: 36 },
  { id: "alto_parana", name: "Alto Paraná", recargo: 110000, slaBase: 48 },
  { id: "itapua", name: "Itapúa", recargo: 135000, slaBase: 48 },
];

const URGENCIAS = [
  { id: "estandar", name: "Estándar", slaLabel: "24-48h", factor: 1.0, slaFactor: 1.0 },
  { id: "prioritario", name: "Prioritario", slaLabel: "< 18h", factor: 1.25, slaFactor: 0.65 },
  { id: "mismo_dia", name: "Urgente", slaLabel: "< 10h", factor: 1.5, slaFactor: 0.4 },
];

export function PeritajeCalculator() {
  const [tipo, setTipo] = useState("consumo");
  const [zona, setZona] = useState("asuncion");
  const [urgencia, setUrgencia] = useState("estandar");
  const [copied, setCopied] = useState(false);

  const calculo = useMemo(() => {
    const t = TIPOS.find((item) => item.id === tipo) || TIPOS[0];
    const z = ZONAS.find((item) => item.id === zona) || ZONAS[0];
    const u = URGENCIAS.find((item) => item.id === urgencia) || URGENCIAS[0];

    const subtotal = Math.round((t.basePrice + z.recargo) * u.factor);
    const iva = Math.round(subtotal * 0.1);
    const total = subtotal + iva;
    const tiempoHoras = Math.round(z.slaBase * u.slaFactor);

    return { tipoObj: t, zonaObj: z, urgenciaObj: u, subtotal, iva, total, tiempoHoras };
  }, [tipo, zona, urgencia]);

  function handleCopy() {
    const texto = `Jerovia Consultora — ${calculo.tipoObj.name} | ${calculo.zonaObj.name} | Plazo < ${calculo.tiempoHoras}h | Total IVA incl.: Gs. ${calculo.total.toLocaleString("es-PY")}`;
    navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
      {/* Controles en Cavidad Hundida */}
      <div className="lg:col-span-7 recessed-well rounded-3xl p-5 sm:p-6 space-y-5">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-subtext1 block mb-2.5">
            01 // MODALIDAD
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TIPOS.map((item) => {
              const Icon = item.icon;
              const active = tipo === item.id;
              return (
                <SpotlightCard
                  key={item.id}
                  sinkIntensity={5}
                  pressable
                  onClick={() => setTipo(item.id)}
                  className={`p-3.5 ${
                    active ? "border-gold/80 bg-gold/10" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2.5 text-xs font-bold text-text">
                      <Icon className={`h-4 w-4 ${active ? "text-gold" : "text-subtext0"}`} />
                      <span>{item.name}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-gold tabular-nums">
                      {(item.basePrice / 1000).toFixed(0)}k
                    </span>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-subtext1 block mb-2.5">
            02 // ZONA GEOGRÁFICA
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ZONAS.map((item) => {
              const active = zona === item.id;
              return (
                <SpotlightCard
                  key={item.id}
                  sinkIntensity={5}
                  pressable
                  onClick={() => setZona(item.id)}
                  className={`p-3 ${
                    active ? "border-gold/80 bg-gold/10" : ""
                  }`}
                >
                  <p className="text-xs font-bold text-text truncate">{item.name}</p>
                  <p className="text-[11px] font-mono text-subtext1 mt-0.5 tabular-nums">
                    {item.recargo === 0 ? "Base" : `+${(item.recargo / 1000).toFixed(0)}k`}
                  </p>
                </SpotlightCard>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-subtext1 block mb-2.5">
            03 // PLAZO DE ENTREGA
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {URGENCIAS.map((item) => {
              const active = urgencia === item.id;
              return (
                <SpotlightCard
                  key={item.id}
                  sinkIntensity={5}
                  pressable
                  onClick={() => setUrgencia(item.id)}
                  className={`p-3 text-center ${
                    active ? "border-gold/80 bg-gold/10" : ""
                  }`}
                >
                  <p className="text-xs font-bold text-text">{item.name}</p>
                  <p className="text-[11px] font-mono font-bold text-gold mt-0.5 tabular-nums">
                    {item.slaLabel}
                  </p>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel de Liquidación */}
      <div className="lg:col-span-5">
        <SpotlightCard sinkIntensity={3.5} className="p-6 sm:p-7 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold">
                ARANCEL ESTIMADO
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-green tabular-nums">
                <Clock className="h-3.5 w-3.5" /> &lt; {calculo.tiempoHoras}h
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={calculo.total}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.14 }}
                className="text-3xl sm:text-4xl font-black text-text font-mono tabular-nums pt-1"
              >
                Gs. {calculo.total.toLocaleString("es-PY")}
              </motion.div>
            </AnimatePresence>

            <div className="space-y-2 text-xs font-mono pt-4 border-t border-overlay0/60 text-subtext1 tabular-nums">
              <div className="flex justify-between">
                <span>Arancel Neto</span>
                <span className="text-text font-bold">
                  Gs. {calculo.subtotal.toLocaleString("es-PY")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>IVA (10%)</span>
                <span className="text-text font-bold">
                  Gs. {calculo.iva.toLocaleString("es-PY")}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-overlay0/40">
                <span>Entregable</span>
                <span className="text-gold font-bold">5 Láminas (.PPTX + PDF)</span>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-2.5">
            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[44px] w-full rounded-xl border border-overlay1 bg-surface1 hover:border-gold text-xs font-bold text-text flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-green" /> : <Copy className="h-4 w-4 text-gold" />}
              <span>{copied ? "Cotización Copiada" : "Copiar Cotización"}</span>
            </button>
            <Link
              href="/entrevista/demo"
              className="min-h-[44px] w-full rounded-xl bg-gold text-black font-bold text-xs hover:bg-gold-light flex items-center justify-center gap-2 transition-colors"
            >
              <span>Iniciar Relevamiento</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
