"use client";

import { useState } from "react";
import { 
  Zap, MapPin, Scale, ShieldCheck, 
  Search, CheckCircle2, AlertTriangle, 
  Copy, Check, RefreshCw, Hash, FileCheck
} from "lucide-react";

export function BentoFeatures() {
  // Estado para el verificador interactivo de NIS ANDE
  const [nisInput, setNisInput] = useState("2489102");
  const [isVerifyingNis, setIsVerifyingNis] = useState(false);
  const [nisVerified, setNisVerified] = useState(true);

  // Estado para el slider de ratio de endeudamiento
  const [ingreso, setIngreso] = useState(7500000);
  const [cuota, setCuota] = useState(1800000);
  const ratio = Math.round((cuota / (ingreso || 1)) * 100);
  const nivelRiesgo = ratio <= 30 ? "optimo" : ratio <= 45 ? "observado" : "critico";

  // Estado para el generador de Hash SHA-256 de evidencias
  const [evidenciaHash, setEvidenciaHash] = useState("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  const [hashCopied, setHashCopied] = useState(false);

  const handleVerifyNis = () => {
    setIsVerifyingNis(true);
    setTimeout(() => {
      setIsVerifyingNis(false);
      setNisVerified(true);
    }, 800);
  };

  const handleRegenerateHash = () => {
    const randomHex = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    setEvidenciaHash(randomHex);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(evidenciaHash);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
      
      {/* ══ BENTO CARD 1: COTEJO DIGITAL ANDE & NIS (7 COLS) ══ */}
      <div className="lg:col-span-7 rounded-3xl glass-panel p-6 sm:p-8 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gold/15 text-gold flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider block">
                  Servicios Básicos In Situ
                </span>
                <h3 className="text-lg font-black text-text">
                  Cotejo de Suministro Eléctrico ANDE
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono text-green bg-green/10 border border-green/30 px-3 py-1 rounded-full font-bold">
              CONEXIÓN DIRECTA
            </span>
          </div>

          <p className="text-xs text-subtext0 mt-4 leading-relaxed">
            Verificamos in situ el Número de Identificación de Suministro (NIS) físico en fachada. Ratificamos que el inmueble cuenta con medidor legal activo, descartando conexiones clandestinas o deudas que afecten la habitabilidad.
          </p>

          {/* Herramienta de Testeo Interactivo de NIS */}
          <div className="mt-5 p-4 rounded-2xl bg-surface1 border border-white/[0.08] space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={nisInput}
                  onChange={(e) => setNisInput(e.target.value)}
                  placeholder="Ingrese N° de NIS (Ej: 2489102)"
                  className="w-full bg-surface0 border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs font-mono text-text focus:outline-none focus:border-gold"
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyNis}
                disabled={isVerifyingNis || !nisInput}
                className="px-4 py-2 rounded-xl bg-gold text-black text-xs font-bold hover:bg-gold-light transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                {isVerifyingNis ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Verificando...
                  </>
                ) : (
                  <>
                    <Search className="h-3.5 w-3.5" /> Cotejar NIS
                  </>
                )}
              </button>
            </div>

            {/* Chips de ejemplo */}
            <div className="flex items-center gap-2 text-[11px] text-subtext0 font-mono">
              <span>Probar NIS:</span>
              <button
                type="button"
                onClick={() => setNisInput("2489102")}
                className="hover:text-gold underline"
              >
                2489102 (Luque)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setNisInput("1984210")}
                className="hover:text-gold underline"
              >
                1984210 (San Lorenzo)
              </button>
            </div>

            {/* Resultado del cotejo */}
            {nisVerified && (
              <div className="p-3 rounded-xl bg-surface0 border border-green/30 text-xs font-mono space-y-1 animate-in fade-in duration-150">
                <div className="flex justify-between items-center text-green font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> NIS {nisInput} Homologado
                  </span>
                  <span className="text-[10px] bg-green/20 px-2 py-0.5 rounded-full">AL DÍA</span>
                </div>
                <div className="text-[11px] text-subtext0 flex justify-between pt-1">
                  <span>Categoría Tarifaria:</span>
                  <strong className="text-text">Residencial Monofásica B-01</strong>
                </div>
                <div className="text-[11px] text-subtext0 flex justify-between">
                  <span>Consumo Promedio:</span>
                  <strong className="text-text">460 kWh / mes (Coherente)</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-[11px] text-subtext0 font-mono flex items-center justify-between pt-2 border-t border-white/[0.08]">
          <span>Garantía de Suministro</span>
          <span className="text-text font-bold">Inspección física obligatoria</span>
        </div>
      </div>

      {/* ══ BENTO CARD 2: GEOLOCALIZACIÓN SATELITAL & PLUS CODES (5 COLS) ══ */}
      <div className="lg:col-span-5 rounded-3xl glass-panel p-6 sm:p-8 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-blue/15 text-blue flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-blue font-bold uppercase tracking-wider block">
                  Georreferenciación
                </span>
                <h3 className="text-lg font-black text-text">
                  Fijación GPS & Plus Code
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono text-blue bg-blue/10 border border-blue/30 px-3 py-1 rounded-full font-bold">
              ± 3.8m
            </span>
          </div>

          <p className="text-xs text-subtext0 mt-4 leading-relaxed">
            Localización exacta para calles sin denominación oficial o zonas en desarrollo en Central e Interior, garantizando certeza registral para la garantía hipotecaria o prendaria.
          </p>

          <div className="mt-5 p-4 rounded-2xl bg-surface1 border border-white/[0.08] space-y-2.5 font-mono text-xs">
            <div className="text-[10px] text-subtext0 uppercase">Coordenadas en Fachada</div>
            <div className="p-2.5 rounded-xl bg-surface0 border border-white/[0.06] text-text font-bold">
              -25.269932, -57.489012
            </div>
            <div className="flex justify-between text-[11px] text-subtext0 pt-1">
              <span>Open Location Code:</span>
              <strong className="text-gold font-bold">6867+XQ Luque</strong>
            </div>
            <div className="flex justify-between text-[11px] text-subtext0">
              <span>Estado de la Vía:</span>
              <span className="text-green font-bold">Asfalto / Transitable todo el año</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-subtext0 font-mono flex items-center justify-between pt-2 border-t border-white/[0.08]">
          <span>Cotejo Catastral</span>
          <span className="text-blue font-bold">Validado con Google Maps Pro</span>
        </div>
      </div>

      {/* ══ BENTO CARD 3: RATIO DE ENDEUDAMIENTO Y REGLA DEL 30% (6 COLS) ══ */}
      <div className="lg:col-span-6 rounded-3xl glass-panel p-6 sm:p-8 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-green/15 text-green flex items-center justify-center">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-green font-bold uppercase tracking-wider block">
                  Regla Prudencial BCP
                </span>
                <h3 className="text-lg font-black text-text">
                  Capacidad de Pago y Solvencia
                </h3>
              </div>
            </div>
            <span
              className={`text-xs font-mono px-3 py-1 rounded-full font-bold border ${
                nivelRiesgo === "optimo"
                  ? "bg-green/15 text-green border-green/30"
                  : nivelRiesgo === "observado"
                  ? "bg-yellow/15 text-yellow border-yellow/30"
                  : "bg-red/15 text-red border-red/30"
              }`}
            >
              {ratio}% ENDEUDAMIENTO
            </span>
          </div>

          <p className="text-xs text-subtext0 mt-4 leading-relaxed">
            Evaluamos la relación entre compromisos fijos (alquiler/préstamos) y los ingresos familiares netos demostrados en terreno.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-subtext0 mb-1.5">
                <span>Alquiler / Pasivo Fijo Mensual:</span>
                <strong className="text-text font-bold">
                  {(cuota / 1000000).toFixed(1)}M Gs.
                </strong>
              </div>
              <input
                type="range"
                min="800000"
                max="4500000"
                step="100000"
                value={cuota}
                onChange={(e) => setCuota(Number(e.target.value))}
                className="w-full accent-gold cursor-pointer h-2 bg-surface2 rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-surface1 border border-white/[0.08] text-center font-mono">
              <span className="text-[10px] text-subtext0 uppercase block">Veredicto Financiero para Comité</span>
              <span
                className={`text-sm font-black mt-0.5 block ${
                  nivelRiesgo === "optimo"
                    ? "text-green"
                    : nivelRiesgo === "observado"
                    ? "text-yellow"
                    : "text-red"
                }`}
              >
                {nivelRiesgo === "optimo"
                  ? "Capacidad de Pago Óptima (Apto Directo)"
                  : nivelRiesgo === "observado"
                  ? "Capacidad Comprometida (Requiere Codeudor)"
                  : "Riesgo Elevado de Mora (Rechazo Sugerido)"}
              </span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-subtext0 font-mono flex items-center justify-between pt-2 border-t border-white/[0.08]">
          <span>Umbral Máximo de Seguridad:</span>
          <span className="text-text font-bold">30% del ingreso demostrado</span>
        </div>
      </div>

      {/* ══ BENTO CARD 4: CADENA DE CUSTODIA & SHA-256 (6 COLS) ══ */}
      <div className="lg:col-span-6 rounded-3xl glass-panel p-6 sm:p-8 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gold/15 text-gold flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider block">
                  Seguridad Jurídica
                </span>
                <h3 className="text-lg font-black text-text">
                  Cadena de Custodia Criptográfica
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full font-bold">
              SHA-256 INMUTABLE
            </span>
          </div>

          <p className="text-xs text-subtext0 mt-4 leading-relaxed">
            Cada evidencia fotográfica (fachada, medidor ANDE, entorno, dependencias) es sellada criptográficamente con fecha, hora satelital y hash inmutable, garantizando que el expediente no sufra alteraciones post-visita.
          </p>

          <div className="mt-5 p-4 rounded-2xl bg-surface1 border border-white/[0.08] space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-subtext0 font-mono">
              <span className="flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-gold" /> Hash de Verificación
              </span>
              <button
                type="button"
                onClick={handleRegenerateHash}
                className="text-[10px] text-gold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" /> Regenerar
              </button>
            </div>
            <div className="p-2.5 rounded-xl bg-surface0 border border-white/[0.06] font-mono text-[11px] text-subtext0 break-all select-all flex items-center justify-between gap-2">
              <span className="truncate">{evidenciaHash}</span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="text-text hover:text-gold shrink-0 p-1"
                title="Copiar Hash SHA-256"
              >
                {hashCopied ? <Check className="h-3.5 w-3.5 text-green" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-subtext0 pt-1 font-mono">
              <span>Marco Legal:</span>
              <strong className="text-text">Ley N° 1682/01 de Información Privada</strong>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-subtext0 font-mono flex items-center justify-between pt-2 border-t border-white/[0.08]">
          <span>Matrícula Pericial:</span>
          <span className="text-gold font-bold">Reg. Oficial N° 4.819</span>
        </div>
      </div>

    </div>
  );
}
