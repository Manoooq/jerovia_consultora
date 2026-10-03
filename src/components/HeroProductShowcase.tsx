"use client";

import { useState } from "react";
import { DossierInteractiveViewer } from "@/components/DossierInteractiveViewer";
import { 
  FileText, Tablet, ShieldAlert, BarChart3, 
  Zap, Compass, Mic, CheckCircle2, AlertTriangle, 
  RefreshCw, Check, ArrowRight, Activity, Radio,
  Sparkles, Layers, ShieldCheck
} from "lucide-react";

export function HeroProductShowcase() {
  const [activeTab, setActiveTab] = useState<"dossier" | "terminal" | "inconsistencias" | "consola">("dossier");

  // Estados interactivos para Terminal en Campo
  const [meterScanActive, setMeterScanActive] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(true);
  const [recordingAudio, setRecordingAudio] = useState(false);

  // Estados interactivos para Motor Anti-Fraude
  const [scenario, setScenario] = useState<"clean" | "risk">("risk");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(100);

  const handleRunAudit = (targetScenario: "clean" | "risk") => {
    setScenario(targetScenario);
    setIsAuditing(true);
    setAuditProgress(15);
    setTimeout(() => setAuditProgress(60), 400);
    setTimeout(() => {
      setAuditProgress(100);
      setIsAuditing(false);
    }, 900);
  };

  return (
    <div className="rounded-3xl border border-overlay0/60 bg-surface0 overflow-hidden shadow-2xl">
      {/* ══ BARRA SUPERIOR DE WORKSTATION TIPO MACOS/LINUX ENTERPRISE ══ */}
      <div className="bg-mantle px-4 sm:px-6 py-3 border-b border-overlay0/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <div className="h-3 w-3 rounded-full bg-red/80 border border-red/40" />
            <div className="h-3 w-3 rounded-full bg-yellow/80 border border-yellow/40" />
            <div className="h-3 w-3 rounded-full bg-green/80 border border-green/40" />
          </div>
          <div className="h-4 w-px bg-overlay0/40 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text">
              Consola Pericial Unificada · EXP-2026-0841
            </span>
          </div>
        </div>

        {/* SELECTOR DE MODO INTERACTIVO */}
        <div className="flex items-center gap-1 bg-surface1 p-1 rounded-2xl border border-overlay0/40 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("dossier")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === "dossier"
                ? "bg-surface0 text-gold shadow-sm border border-gold/40 font-bold"
                : "text-subtext0 hover:text-text"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>1. Legajo 5 Láminas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("terminal")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === "terminal"
                ? "bg-surface0 text-gold shadow-sm border border-gold/40 font-bold"
                : "text-subtext0 hover:text-text"
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
            <span>2. Telemetría de Campo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inconsistencias")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === "inconsistencias"
                ? "bg-surface0 text-gold shadow-sm border border-gold/40 font-bold"
                : "text-subtext0 hover:text-text"
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>3. Motor Anti-Fraude IA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("consola")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === "consola"
                ? "bg-surface0 text-gold shadow-sm border border-gold/40 font-bold"
                : "text-subtext0 hover:text-text"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>4. Consola Comité</span>
          </button>
        </div>
      </div>

      {/* ══ CONTENIDO SEGÚN LA PESTAÑA SELECCIONADA ══ */}
      <div>
        {/* PESTAÑA 1: LEGAJO OFICIAL EN 5 LÁMINAS */}
        {activeTab === "dossier" && (
          <div className="animate-in fade-in duration-200">
            <DossierInteractiveViewer />
          </div>
        )}

        {/* PESTAÑA 2: TELEMETRÍA EN CAMPO EN VIVO */}
        {activeTab === "terminal" && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-overlay0/30">
              <div>
                <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider">
                  Relevamiento Presencial en Terreno
                </span>
                <h3 className="text-xl font-black text-text mt-0.5">
                  Instrumental de Inspección In Situ
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green/15 text-green border border-green/30 font-mono self-start sm:self-auto flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green animate-ping" />
                CONEXIÓN ENCRIPTADA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* WIDGET 1: MEDIDOR ANDE CON ESCANER OCR */}
              <div className="p-5 rounded-2xl bg-surface1 border border-overlay0/40 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-gold/15 text-gold flex items-center justify-center">
                        <Zap className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-text">Medidor ANDE (NIS)</span>
                    </div>
                    <span className="text-[10px] font-mono text-green bg-green/10 border border-green/30 px-2 py-0.5 rounded-full">
                      ACTIVO
                    </span>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-surface0 border border-white/[0.06] font-mono space-y-1.5 text-xs">
                    <div className="text-[10px] text-subtext0 uppercase">Lectura Digital Odómetro</div>
                    <div className="text-xl font-black text-text tracking-widest text-center py-1.5 bg-surface2/60 rounded-lg border border-white/[0.04] relative overflow-hidden">
                      {meterScanActive && (
                        <div className="absolute inset-0 bg-gold/20 animate-pulse flex items-center justify-center text-xs font-sans text-gold font-bold">
                          Escaner OCR activo...
                        </div>
                      )}
                      0 4 8 9 1 2 <span className="text-[10px] font-sans text-gold">kWh</span>
                    </div>
                    <div className="flex justify-between text-[11px] pt-1 text-subtext0">
                      <span>NIS cotejado:</span>
                      <strong className="text-text font-bold">2489102</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-subtext0">
                      <span>Suministro:</span>
                      <span className="text-green font-bold">Residencial B-01</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMeterScanActive(true);
                    setTimeout(() => setMeterScanActive(false), 1500);
                  }}
                  className="w-full py-2.5 rounded-xl border border-overlay0/60 bg-surface0 hover:border-gold text-xs font-bold text-text flex items-center justify-center gap-1.5 transition-all"
                >
                  {meterScanActive ? (
                    <span className="text-gold flex items-center gap-1.5">
                      <RefreshCw className="h-3 w-3 animate-spin" /> Procesando OCR...
                    </span>
                  ) : (
                    <span>Probar Escaneo OCR</span>
                  )}
                </button>
              </div>

              {/* WIDGET 2: GPS SATELITAL & PLUS CODE */}
              <div className="p-5 rounded-2xl bg-surface1 border border-overlay0/40 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-blue/15 text-blue flex items-center justify-center">
                        <Compass className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-text">Geolocalización GPS</span>
                    </div>
                    <span className="text-[10px] font-mono text-blue bg-blue/10 border border-blue/30 px-2 py-0.5 rounded-full">
                      ± 3.8m
                    </span>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-surface0 border border-white/[0.06] font-mono space-y-1.5 text-xs">
                    <div className="text-[10px] text-subtext0 uppercase">Coordenadas en Fachada</div>
                    <div className="text-xs font-bold text-text bg-surface2/60 p-2 rounded-lg border border-white/[0.04]">
                      -25.269932, -57.489012
                    </div>
                    <div className="flex justify-between text-[11px] text-subtext0 pt-1">
                      <span>Plus Code:</span>
                      <strong className="text-gold font-bold">6867+XQ Luque</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-subtext0">
                      <span>Vía de Acceso:</span>
                      <span className="text-text">Asfalto / Calle empedrada</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setGpsLocked((prev) => !prev)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    gpsLocked
                      ? "bg-green/10 text-green border-green/30"
                      : "bg-surface0 hover:border-gold text-text border-overlay0/60"
                  }`}
                >
                  {gpsLocked ? "✓ Coordenada Certificada" : "Fijar Coordenada"}
                </button>
              </div>

              {/* WIDGET 3: DICTADO Y TRANSCRIPCIÓN DE VOZ */}
              <div className="p-5 rounded-2xl bg-surface1 border border-overlay0/40 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-mauve/15 text-mauve flex items-center justify-center">
                        <Mic className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-text">Audio Dictado Pericial</span>
                    </div>
                    <span className="text-[10px] font-mono text-mauve bg-mauve/10 border border-mauve/30 px-2 py-0.5 rounded-full">
                      WEB SPEECH
                    </span>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-surface0 border border-white/[0.06] space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-subtext0 uppercase font-mono">
                      <span>Espectro de Frecuencia</span>
                      <span>0ms Latencia</span>
                    </div>
                    <div className="flex items-end justify-center gap-1 h-8 py-1">
                      {[40, 70, 95, 45, 80, 100, 60, 85, 30, 90, 65, 45].map((h, i) => (
                        <div
                          key={i}
                          className={`w-1.5 rounded-full transition-all ${
                            recordingAudio ? "bg-mauve animate-pulse" : "bg-overlay0"
                          }`}
                          style={{ height: recordingAudio ? `${h}%` : "30%" }}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-subtext0 italic bg-surface1/60 p-1.5 rounded-lg border border-white/[0.04]">
                      {recordingAudio
                        ? "“Residencia sólida de mampostería, medidor ANDE operativo sin derivaciones clandestinas...”"
                        : "Dictado listo para transcribir observaciones de campo en tiempo real."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setRecordingAudio((prev) => !prev)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    recordingAudio
                      ? "bg-red/10 text-red border-red/40"
                      : "bg-surface0 hover:border-gold text-text border-overlay0/60"
                  }`}
                >
                  {recordingAudio ? "■ Detener Transcripción" : "▶ Iniciar Dictado de Voz"}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* PESTAÑA 3: MOTOR IA ANTI-FRAUDE E INCONSISTENCIAS (KILLER FEATURE) */}
        {activeTab === "inconsistencias" && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-overlay0/30">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-gold" />
                  <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider">
                    Auditoría Algorítmica de Riesgo Crediticio
                  </span>
                </div>
                <h3 className="text-xl font-black text-text mt-0.5">
                  Detección de Contradicciones y Señales de Alerta
                </h3>
              </div>

              {/* Botones de Escenarios */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRunAudit("risk")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    scenario === "risk"
                      ? "bg-red/15 text-red border-red/40 shadow-sm"
                      : "bg-surface1 text-subtext0 border-overlay0/40 hover:text-text"
                  }`}
                >
                  Escenario A: Riesgo Crítico
                </button>
                <button
                  type="button"
                  onClick={() => handleRunAudit("clean")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    scenario === "clean"
                      ? "bg-green/15 text-green border-green/40 shadow-sm"
                      : "bg-surface1 text-subtext0 border-overlay0/40 hover:text-text"
                  }`}
                >
                  Escenario B: Coherente
                </button>
              </div>
            </div>

            {/* BARRA DE PROGRESO DE AUDITORÍA */}
            {isAuditing && (
              <div className="p-3 rounded-2xl bg-surface1 border border-gold/30 space-y-2">
                <div className="flex justify-between text-xs font-mono text-gold font-bold">
                  <span>Auditando cruce de 68 variables periciales...</span>
                  <span>{auditProgress}%</span>
                </div>
                <div className="w-full bg-surface2 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gold h-full transition-all duration-300"
                    style={{ width: `${auditProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* RESULTADOS DE LA AUDITORÍA HEURÍSTICA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Tarjetas de Inconsistencias (8 cols) */}
              <div className="lg:col-span-8 space-y-3">
                {scenario === "risk" ? (
                  <>
                    <div className="p-4 rounded-2xl bg-red/10 border border-red/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-red flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4" /> Alerta de Capacidad de Pago (Ratio 56%)
                        </span>
                        <span className="text-[10px] font-mono bg-red/20 text-red px-2 py-0.5 rounded-full font-bold">
                          ALTO RIESGO
                        </span>
                      </div>
                      <p className="text-xs text-text">
                        El costo de alquiler declarado in situ (4.200.000 Gs.) insume el 56% del salario demostrado (7.500.000 Gs.), sobrepasando ampliamente el límite prudencial reglamentario del 30%.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-yellow/10 border border-yellow/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-yellow flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4" /> Titularidad del Suministro Eléctrico
                        </span>
                        <span className="text-[10px] font-mono bg-yellow/20 text-yellow px-2 py-0.5 rounded-full font-bold">
                          OBSERVACIÓN
                        </span>
                      </div>
                      <p className="text-xs text-text">
                        Medidor ANDE NIS N° 2489102 se encuentra registrado a nombre de un tercero sin parentesco consanguíneo ni contrato de subalquiler protocolizado presentado.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-green/10 border border-green/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-green flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> Coincidencia Geográfica In Situ
                        </span>
                        <span className="text-[10px] font-mono bg-green/20 text-green px-2 py-0.5 rounded-full font-bold">
                          RATIFICADO
                        </span>
                      </div>
                      <p className="text-xs text-text">
                        Fijación satelital GPS coincide en un 100% con la fachada domiciliaria fotografiada y los registros de la manzana catastral en Luque.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-2xl bg-green/10 border border-green/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-green flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> Coherencia Económica Plena (Ratio 21%)
                        </span>
                        <span className="text-[10px] font-mono bg-green/20 text-green px-2 py-0.5 rounded-full font-bold">
                          ÓPTIMO
                        </span>
                      </div>
                      <p className="text-xs text-text">
                        Ingresos familiares demostrados (11.000.000 Gs.) cubren holgadamente los compromisos declarados con un nivel de endeudamiento del 21%.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-green/10 border border-green/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-green flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> NIS ANDE y Servicios al Día
                        </span>
                        <span className="text-[10px] font-mono bg-green/20 text-green px-2 py-0.5 rounded-full font-bold">
                          VERIFICADO
                        </span>
                      </div>
                      <p className="text-xs text-text">
                        Suministro activo sin cortes ni moras registradas. Titularidad del medidor coincide con el postulante verificado.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-green/10 border border-green/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-green flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> Arraigo Domiciliario Demostrado
                        </span>
                        <span className="text-[10px] font-mono bg-green/20 text-green px-2 py-0.5 rounded-full font-bold">
                          SÓLIDO
                        </span>
                      </div>
                      <p className="text-xs text-text">
                        Vivienda propia con más de 6 años de ocupación continua, entorno barrial consolidado y referencias vecinales ratificadas.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Panel de Veredicto de Crédito (4 cols) */}
              <div className="lg:col-span-4 p-5 rounded-2xl bg-surface1 border border-overlay0/40 space-y-4">
                <span className="text-[10px] font-mono uppercase text-subtext0 font-bold block">
                  Dictamen Automatizado
                </span>

                <div className="text-center py-3 bg-surface0 rounded-xl border border-white/[0.06]">
                  <span className="text-xs text-subtext0 block font-mono">Índice de Confiabilidad</span>
                  <div
                    className={`text-3xl font-black font-mono mt-1 ${
                      scenario === "risk" ? "text-red" : "text-green"
                    }`}
                  >
                    {scenario === "risk" ? "48.2 / 100" : "94.6 / 100"}
                  </div>
                  <span
                    className={`text-[11px] font-bold uppercase mt-1 inline-block px-2.5 py-0.5 rounded-full ${
                      scenario === "risk"
                        ? "bg-red/15 text-red"
                        : "bg-green/15 text-green"
                    }`}
                  >
                    {scenario === "risk" ? "Observado / Requiere Aval" : "Favorable Recomendado"}
                  </span>
                </div>

                <div className="text-xs text-subtext0 space-y-1.5 font-mono pt-1 border-t border-overlay0/20">
                  <div className="flex justify-between">
                    <span>Cruce Catastral:</span>
                    <strong className="text-text">{scenario === "risk" ? "Observado" : "Conforme"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Aporte IPS:</span>
                    <strong className="text-text">3a 8m continuos</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Sello Pericial:</span>
                    <strong className="text-gold font-bold">Reg. N° 4.819</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* PESTAÑA 4: CONSOLA DE COMITÉ (PORTFOLIO KPIS) */}
        {activeTab === "consola" && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-overlay0/30">
              <div>
                <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider">
                  Métricas de Operación para Comités
                </span>
                <h3 className="text-xl font-black text-text mt-0.5">
                  Rendimiento y Cumplimiento de Acuerdos de Nivel de Servicio (SLA)
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green/15 text-green border border-green/30 font-mono self-start sm:self-auto">
                SLA 99.4% A TIEMPO
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/40 space-y-1">
                <span className="text-[10px] text-subtext0 uppercase font-bold font-mono">Expedientes Mes</span>
                <div className="text-3xl font-black font-mono text-text">124</div>
                <span className="text-[11px] text-green font-bold">100% Auditados</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/40 space-y-1">
                <span className="text-[10px] text-subtext0 uppercase font-bold font-mono">Dictámenes Favorables</span>
                <div className="text-3xl font-black font-mono text-green">78%</div>
                <span className="text-[11px] text-subtext0">Apto Directo</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/40 space-y-1">
                <span className="text-[10px] text-subtext0 uppercase font-bold font-mono">Con Observación</span>
                <div className="text-3xl font-black font-mono text-yellow">16%</div>
                <span className="text-[11px] text-subtext0">Garantía / Codeudor</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/40 space-y-1">
                <span className="text-[10px] text-subtext0 uppercase font-bold font-mono">Tiempo Medio Entrega</span>
                <div className="text-3xl font-black font-mono text-gold">14.8h</div>
                <span className="text-[11px] text-green font-bold">Compromiso &lt; 24h</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface1/60 border border-overlay0/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-subtext0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gold shrink-0" />
                <span>Auditoría de visitas domiciliarias conforme a normativas de prevención de fraude del BCP.</span>
              </div>
              <span className="font-mono text-text font-bold">Actualizado: Octubre 2026</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
