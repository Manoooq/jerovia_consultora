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
  { id: "consumo", name: "Crédito de Consumo", basePrice: 280000 },
  { id: "hipotecario", name: "Crédito Hipotecario", basePrice: 420000 },
  { id: "comercial", name: "Comercial / PYMES", basePrice: 550000 },
  { id: "rrhh", name: "Auditoría de Confianza", basePrice: 320000 },
];

const ZONAS: ZonaRecargo[] = [
  { id: "asuncion", name: "Gran Asunción", recargo: 0, slaBase: 24 },
  { id: "central_ext", name: "Central Exterior", recargo: 45000, slaBase: 28 },
  { id: "alto_parana", name: "Alto Paraná", recargo: 110000, slaBase: 48 },
  { id: "itapua", name: "Itapúa", recargo: 135000, slaBase: 48 },
  { id: "caaguazu", name: "Caaguazú y Cordillera", recargo: 80000, slaBase: 36 },
];

const URGENCIAS: Urgencia[] = [
  { id: "estandar", name: "Estándar (24-48 hs)", factor: 1.0, slaFactor: 1.0 },
  { id: "prioritario", name: "Prioritario (< 18 hs)", factor: 1.25, slaFactor: 0.65 },
  { id: "mismo_dia", name: "Express (< 10 hs)", factor: 1.5, slaFactor: 0.4 },
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
Incluye: Legajo 5 láminas, GPS satelital, ANDE verificado y dictamen firmado.`;

    navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-overlay0 bg-surface0 p-6 sm:p-10 shadow-lg">
      <header className="pb-8 border-b border-overlay0 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-text">
          Cotización Oficial
        </h2>
        <p className="text-sm text-subtext0 mt-2">Aranceles transparentes para servicios periciales (IVA Incluido)</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Parámetros de Selección */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider">1. Tipo de Evaluación</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TIPOS_PERITAJE.map((item) => {
                const isSelected = tipo === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTipo(item.id)}
                    className={`p-4 rounded-xl text-left border transition-all text-sm ${
                      isSelected
                        ? "border-text bg-surface1 text-text font-medium shadow-sm"
                        : "border-overlay0 bg-surface0 hover:bg-surface1 text-subtext0"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider">2. Zona Geográfica</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ZONAS.map((item) => {
                const isSelected = zona === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setZona(item.id)}
                    className={`p-4 rounded-xl text-left border transition-all text-sm ${
                      isSelected
                        ? "border-text bg-surface1 text-text font-medium shadow-sm"
                        : "border-overlay0 bg-surface0 hover:bg-surface1 text-subtext0"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                       <span>{item.name}</span>
                       <span className="text-xs text-subtext1">
                         {item.recargo === 0 ? "Base" : `+${(item.recargo/1000).toFixed(0)}k`}
                       </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider">3. Modalidad de Urgencia</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {URGENCIAS.map((item) => {
                const isSelected = urgencia === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUrgencia(item.id)}
                    className={`p-4 rounded-xl text-center border transition-all text-sm ${
                      isSelected
                        ? "border-text bg-surface1 text-text font-medium shadow-sm"
                        : "border-overlay0 bg-surface0 hover:bg-surface1 text-subtext0"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Resumen de Liquidación */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-overlay0 bg-surface1 p-6 sm:p-8 space-y-6 sticky top-24">
            
            <div className="space-y-2 pb-6 border-b border-overlay0">
              <span className="text-sm font-medium text-subtext0">Total Estimado</span>
              <div className="text-4xl font-bold text-text tracking-tight">
                {calculo.total.toLocaleString("es-PY")} <span className="text-xl text-subtext0 font-normal">Gs.</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green font-medium pt-2">
                <Clock className="h-4 w-4" />
                <span>Entrega en &lt; {calculo.tiempoHoras} hs</span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-subtext0 pb-6 border-b border-overlay0">
               <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-text shrink-0" />
                  <span>Legajo 5 láminas (.pptx + PDF)</span>
               </div>
               <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-text shrink-0" />
                  <span>GPS satelital + Medidor ANDE verificado</span>
               </div>
               <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-text shrink-0" />
                  <span>Dictamen firmado (Matrícula N° 4.819)</span>
               </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleCopyBudget}
                className="w-full py-3 rounded-xl border border-overlay0 bg-surface0 hover:bg-surface2 text-sm font-medium text-text flex items-center justify-center gap-2 transition-all"
              >
                {copied ? <Check className="h-4 w-4 text-green" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "Presupuesto Copiado" : "Copiar Presupuesto"}</span>
              </button>

              <Link
                href="/entrevista/demo"
                className="w-full py-3 rounded-xl bg-text text-base font-medium text-surface0 hover:opacity-90 flex items-center justify-center gap-2 transition-opacity text-center"
              >
                <span>Solicitar Servicio</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
