"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Calculator, CheckCircle2, Clock, 
  MapPin, Copy, Check, ArrowRight
} from "lucide-react";

interface TipoPeritaje {
  id: string;
  name: string;
  basePrice: number;
}

interface ZonaRecargo {
  id: string;
  name: string;
  recargo: number;
  slaBase: number;
}

interface Urgencia {
  id: string;
  name: string;
  factor: number;
  slaFactor: number;
}

const TIPOS_PERITAJE: TipoPeritaje[] = [
  { id: "consumo", name: "Crédito de Consumo / Personal", basePrice: 280000 },
  { id: "hipotecario", name: "Crédito Hipotecario / Inmueble", basePrice: 420000 },
  { id: "comercial", name: "Comercial / PYMES", basePrice: 550000 },
  { id: "rrhh", name: "Auditoría de Confianza (RRHH)", basePrice: 320000 },
];

const ZONAS: ZonaRecargo[] = [
  { id: "asuncion", name: "Gran Asunción (Capital, Luque, San Lorenzo)", recargo: 0, slaBase: 24 },
  { id: "central_ext", name: "Central Exterior (Capiatá, Itauguá, Ypacaraí)", recargo: 45000, slaBase: 28 },
  { id: "alto_parana", name: "Alto Paraná (CDE, Hernandarias)", recargo: 110000, slaBase: 48 },
  { id: "itapua", name: "Itapúa (Encarnación, Colonias)", recargo: 135000, slaBase: 48 },
  { id: "caaguazu", name: "Caaguazú y Cordillera (Oviedo, Caacupé)", recargo: 80000, slaBase: 36 },
];

const URGENCIAS: Urgencia[] = [
  { id: "estandar", name: "Estándar (24 - 48 hs)", factor: 1.0, slaFactor: 1.0 },
  { id: "prioritario", name: "Prioritario (< 18 hs)", factor: 1.25, slaFactor: 0.65 },
  { id: "mismo_dia", name: "Express Mismo Día (< 10 hs)", factor: 1.5, slaFactor: 0.4 },
];

export function PeritajeCalculator() {
  const [tipo, setTipo] = useState<string>("consumo");
  const [zona, setZona] = useState<string>("asuncion");
  const [urgencia, setUrgencia] = useState<string>("estandar");
  const [copied, setCopied] = useState(false);

  const calculo = useMemo(() => {
    const t = TIPOS_PERITAJE.find((item) => item.id === tipo) || TIPOS_PERITAJE[0];
    const z = ZONAS.find((item) => item.id === zona) || ZONAS[0];
    const u = URGENCIAS.find((item) => item.id === urgencia) || URGENCIAS[0];

    const subtotal = Math.round((t.basePrice + z.recargo) * u.factor);
    const iva = Math.round(subtotal * 0.1);
    const total = subtotal + iva;
    const tiempoHoras = Math.round(z.slaBase * u.slaFactor);

    return {
      tipoObj: t,
      zonaObj: z,
      urgenciaObj: u,
      subtotal,
      iva,
      total,
      tiempoHoras,
    };
  }, [tipo, zona, urgencia]);

  const handleCopyBudget = () => {
    const texto = `PRESUPUESTO PERICIAL OFICIAL
Jerovia Consultora · Asunción, Paraguay
--------------------------------------------------
Servicio: ${calculo.tipoObj.name}
Zona: ${calculo.zonaObj.name}
Plazo: ${calculo.urgenciaObj.name} (< ${calculo.tiempoHoras}hs)
Total con IVA (10%): ${calculo.total.toLocaleString("es-PY")} Gs.
--------------------------------------------------
Incluye: Legajo 5 láminas (.pptx/PDF), GPS satelital, ANDE verificado y dictamen firmado.`;

    navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="simulador" className="rounded-3xl border border-overlay0/40 bg-surface0 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-overlay0/30 mb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
            Simulador de Aranceles
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-text">
            Cotización oficial por expediente
          </h2>
        </div>
        <span className="text-xs text-subtext0 font-mono">Aranceles oficiales con IVA</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Parámetros de Selección (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1. Tipo */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-subtext0 mb-2 block">
              1. Tipo de Evaluación
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TIPOS_PERITAJE.map((item) => {
                const isSelected = tipo === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTipo(item.id)}
                    className={`p-3 rounded-xl text-left border transition-all text-xs ${
                      isSelected
                        ? "border-gold bg-gold/10 text-text font-bold"
                        : "border-overlay0/30 bg-surface1/60 hover:bg-surface1 text-subtext0 hover:text-text"
                    }`}
                  >
                    <span className="text-text">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Zona */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-subtext0 mb-2 block">
              2. Zona Geográfica
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ZONAS.map((item) => {
                const isSelected = zona === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setZona(item.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? "border-gold bg-gold/10 text-text font-bold"
                        : "border-overlay0/30 bg-surface1/40 hover:bg-surface1 text-subtext0 hover:text-text"
                    }`}
                  >
                    <span className="truncate pr-1">{item.name.split("(")[0]}</span>
                    <span className="font-mono text-[10px] text-subtext0 shrink-0">
                      {item.recargo === 0 ? "Sin viático" : `+${item.recargo.toLocaleString("es-PY")}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Modalidad de Urgencia */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-subtext0 mb-2 block">
              3. Plazo de Entrega
            </label>
            <div className="grid grid-cols-3 gap-2">
              {URGENCIAS.map((item) => {
                const isSelected = urgencia === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUrgencia(item.id)}
                    className={`p-2.5 rounded-xl text-center border transition-all text-xs ${
                      isSelected
                        ? "border-gold bg-gold/10 text-text font-bold"
                        : "border-overlay0/30 bg-surface1/40 hover:bg-surface1 text-subtext0 hover:text-text"
                    }`}
                  >
                    <div className="font-bold text-[11px] text-text">{item.name.split("(")[0]}</div>
                    <div className="text-[10px] text-subtext0 mt-0.5 font-mono">{item.name.includes("(") ? item.name.split("(")[1].replace(")", "") : ""}</div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Resumen de Liquidación (5 cols) */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-overlay0/60 bg-surface1 p-5 space-y-4 shadow-sm">
            
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
                Total Estimado
              </span>
              <div className="text-3xl font-black text-text font-mono tracking-tight mt-0.5">
                {calculo.total.toLocaleString("es-PY")}{" "}
                <span className="text-xs font-sans text-subtext0 font-semibold">Gs.</span>
              </div>
              <div className="flex items-center gap-1.5 text-green text-xs font-mono font-bold mt-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Entrega en &lt; {calculo.tiempoHoras} horas hábiles</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-overlay0/20 text-subtext0">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-text">{calculo.subtotal.toLocaleString("es-PY")} Gs.</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (10%):</span>
                <span className="text-text">{calculo.iva.toLocaleString("es-PY")} Gs.</span>
              </div>
            </div>

            <div className="pt-2 border-t border-overlay0/20 space-y-1.5 text-[11px] text-subtext0">
              <div className="flex items-center gap-1.5 text-text font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0" />
                <span>Legajo 5 láminas (.pptx + PDF)</span>
              </div>
              <div className="flex items-center gap-1.5 text-text font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0" />
                <span>GPS satelital + Medidor ANDE verificado</span>
              </div>
              <div className="flex items-center gap-1.5 text-text font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0" />
                <span>Dictamen firmado (Matrícula N° 4.819)</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleCopyBudget}
                className="w-full py-2 rounded-xl border border-overlay0/60 bg-surface0 hover:border-gold text-xs font-bold text-text flex items-center justify-center gap-1.5 transition-all"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green" /> : <Copy className="h-3.5 w-3.5 text-gold" />}
                <span>{copied ? "¡Copiado!" : "Copiar Presupuesto"}</span>
              </button>

              <Link
                href="/entrevista/demo"
                className="w-full py-2.5 rounded-xl bg-gold text-black font-bold text-xs hover:bg-gold-light flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <span>Probar Formulario</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
