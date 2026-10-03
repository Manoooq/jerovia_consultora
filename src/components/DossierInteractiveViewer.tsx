"use client";

import { useState } from "react";
import { 
  FileText, ShieldCheck, CheckCircle2, MapPin, 
  Building2, UserCheck, Calendar, Zap, AlertTriangle,
  ChevronRight, ChevronLeft, Stamp, Award, Check
} from "lucide-react";

export function DossierInteractiveViewer() {
  const [currentSlide, setCurrentSlide] = useState(1);

  const slides = [
    {
      id: 1,
      name: "Carátula y Filiación",
      tag: "Lámina 01",
      title: "Expediente Pericial Socioambiental",
    },
    {
      id: 2,
      name: "Historial Laboral y Aportes",
      tag: "Lámina 02",
      title: "Trayectoria Profesional e IPS",
    },
    {
      id: 3,
      name: "Balance Económico",
      tag: "Lámina 03",
      title: "Cálculo de Ingresos y Solvencia",
    },
    {
      id: 4,
      name: "Auditoría Habitacional y GPS",
      tag: "Lámina 04",
      title: "Inspección Ocular y Suministros",
    },
    {
      id: 5,
      name: "Dictamen Técnico Resolutivo",
      tag: "Lámina 05",
      title: "Conclusión Pericial Oficial",
    },
  ];

  return (
    <div className="rounded-3xl border border-overlay0/60 bg-surface0 overflow-hidden shadow-2xl flex flex-col">
      {/* Barra superior de expediente corporativo */}
      <div className="bg-mantle px-5 py-3.5 border-b border-overlay0/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-green" />
          <span className="font-mono font-bold text-text">EXP-2026-0841-CONFIDENCIAL</span>
          <span className="text-subtext0">·</span>
          <span className="text-subtext0 text-[11px]">Asunción, Paraguay</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded-md border border-gold/30">
            Formato Oficial PPTX / PDF
          </span>
          <span className="text-subtext0 font-mono text-[11px] hidden sm:inline">
            Lámina {currentSlide} de 5
          </span>
        </div>
      </div>

      {/* Selector de Láminas interactivo */}
      <div className="bg-surface1/60 border-b border-overlay0/30 px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
        {slides.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrentSlide(s.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentSlide === s.id
                ? "bg-surface0 text-gold shadow-sm border border-gold/40"
                : "text-subtext0 hover:text-text hover:bg-surface0/60"
            }`}
          >
            <span className="font-mono text-[10px] opacity-70">0{s.id}</span>
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {/* Contenedor de la lámina (Aspect Ratio 16:9 con datos técnicos reales de Paraguay) */}
      <div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-between bg-gradient-to-b from-surface0 to-surface1/30">
        
        {/* LÁMINA 1: CARÁTULA Y FILIACIÓN */}
        {currentSlide === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-overlay0/30">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
                  JEROVIA CONSULTORA · PERITAJES SOCIOAMBIENTALES
                </span>
                <h3 className="text-2xl font-black text-text mt-1">Informe de Verificación Domiciliaria</h3>
                <p className="text-xs text-subtext0 mt-0.5">
                  Relevamiento presencial para Comité de Crédito y Recursos Humanos
                </p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green/15 text-green border border-green/30">
                  Verificación Completada
                </span>
                <p className="text-[10px] font-mono text-subtext0 mt-1">SLA: 16 horas en terreno</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/40 space-y-2">
                <span className="text-[10px] font-mono uppercase text-subtext0 font-semibold">Postulante Verificado</span>
                <p className="text-sm font-bold text-text">M.A.B.P. (Identidad Reservada)</p>
                <div className="text-[11px] text-subtext0 space-y-1 pt-1 border-t border-overlay0/20 font-mono">
                  <div>C.I. N°: 4.891.*** · Estado Civil: Conviviente</div>
                  <div>Dependientes a cargo: 2 hijos menores</div>
                  <div>Nacionalidad: Paraguaya · Edad: 34 años</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/40 space-y-2">
                <span className="text-[10px] font-mono uppercase text-subtext0 font-semibold">Entidad e Inspección</span>
                <p className="text-sm font-bold text-text">Entidad Bancaria de Primera Línea</p>
                <div className="text-[11px] text-subtext0 space-y-1 pt-1 border-t border-overlay0/20 font-mono">
                  <div>Zona: Luque (Barrio Bella Vista)</div>
                  <div>Fecha visita: 01 de Octubre de 2026</div>
                  <div>Perito responsable: Lic. Michelle Romero (Reg. 4.819)</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gold/5 border border-gold/30 text-[11px] text-subtext0 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
              <span>Conforme a la Ley N° 1682/01 y normativas de reserva de información financiera del BCP.</span>
            </div>
          </div>
        )}

        {/* LÁMINA 2: HISTORIAL LABORAL Y APORTES */}
        {currentSlide === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">Lámina 02 / Trayectoria</span>
                <h3 className="text-xl font-black text-text">Historial Laboral y Aportes a la Seguridad Social</h3>
              </div>
              <span className="text-xs font-mono font-bold text-green flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> IPS Verificado
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/40 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-text">Empresa del Sector Logístico e Importación</strong>
                  <span className="text-[11px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded-md">Vigente</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-subtext0 pt-1 font-mono">
                  <div>Cargo: Analista Operativo</div>
                  <div>Antigüedad: 3 años 8 meses</div>
                  <div>Salario: 4.850.000 Gs.</div>
                  <div>Aporte IPS: Al día (Continuo)</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/40 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-subtext0 font-semibold">Verificación de Referencias Laborales</span>
                <p className="text-text font-medium text-xs leading-relaxed">
                  Contacto mantenido con Lic. Raúl Mendoza (Gerencia de RRHH). Se confirma conducta intachable, puntualidad, sin apercibimientos ni sanciones en legajo laboral.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LÁMINA 3: BALANCE ECONÓMICO */}
        {currentSlide === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">Lámina 03 / Solvencia</span>
                <h3 className="text-xl font-black text-text">Balance Socioeconómico y Capacidad de Pago</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green/15 text-green border border-green/30">
                Endeudamiento: 24.2% (Óptimo)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/40 space-y-2">
                <span className="text-[10px] uppercase text-green font-bold">Ingresos Familiares Mensuales</span>
                <div className="space-y-1.5 text-[11px] text-subtext0">
                  <div className="flex justify-between">
                    <span>Sueldo Titular (Comprobado):</span>
                    <strong className="text-text">4.850.000 Gs.</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Ingreso Cónyuge (Comercio):</span>
                    <strong className="text-text">2.500.000 Gs.</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-overlay0/30 text-text font-bold">
                    <span>Total Ingresos Hogar:</span>
                    <span className="text-green">7.350.000 Gs.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/40 space-y-2">
                <span className="text-[10px] uppercase text-yellow font-bold">Egresos y Compromisos Fijos</span>
                <div className="space-y-1.5 text-[11px] text-subtext0">
                  <div className="flex justify-between">
                    <span>Alquiler de Vivienda:</span>
                    <strong className="text-text">1.200.000 Gs.</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Servicios (ANDE, ESSAP, Internet):</span>
                    <strong className="text-text">380.000 Gs.</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Alimentación y manutención:</span>
                    <strong className="text-text">2.200.000 Gs.</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-overlay0/30 text-text font-bold">
                    <span>Superávit Disponible:</span>
                    <span className="text-gold">3.570.000 Gs.</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-subtext0 italic">
              * El postulante presenta un flujo de fondos neto positivo, con capacidad holgada para afrontar la cuota proyectada.
            </p>
          </div>
        )}

        {/* LÁMINA 4: AUDITORÍA HABITACIONAL Y GPS */}
        {currentSlide === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">Lámina 04 / Peritaje Domiciliario</span>
                <h3 className="text-xl font-black text-text">Inspección Ocular de Inmueble y Servicios</h3>
              </div>
              <span className="text-xs font-mono font-bold text-green flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-gold" /> GPS Certificado
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-surface1 border border-overlay0/40 space-y-1">
                <span className="text-[10px] uppercase text-subtext0 font-semibold">Tipología Constructiva</span>
                <p className="text-text font-bold text-xs">Mampostería de Ladrillo</p>
                <p className="text-[11px] text-subtext0">Techo de tejas, piso cerámico, muralla con portón de hierro.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface1 border border-overlay0/40 space-y-1">
                <span className="text-[10px] uppercase text-subtext0 font-semibold">Medidor ANDE Verificado</span>
                <p className="text-text font-bold text-xs">NIS 2489102</p>
                <p className="text-[11px] text-subtext0">Titularidad coincidente con propietario arrendador. Sin mora.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface1 border border-overlay0/40 space-y-1">
                <span className="text-[10px] uppercase text-subtext0 font-semibold">Vía de Acceso</span>
                <p className="text-text font-bold text-xs">Camino Empedrado</p>
                <p className="text-[11px] text-subtext0">A 150m de avenida asfaltada principal. Acceso transitable todo tiempo.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface1/80 border border-overlay0/30 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold shrink-0" />
                <span className="font-mono text-[11px] text-subtext0">
                  Coordenadas: -25.269932, -57.489012 · Plus Code: 6867+XQ Luque
                </span>
              </div>
              <span className="text-green text-[11px] font-bold font-mono">Presencia In Situ Acreditada</span>
            </div>
          </div>
        )}

        {/* LÁMINA 5: DICTAMEN TÉCNICO RESOLUTIVO */}
        {currentSlide === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">Lámina 05 / Resolución Final</span>
                <h3 className="text-xl font-black text-text">Dictamen Técnico Pericial Conclusivo</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-green text-black shadow-md">
                DICTAMEN FAVORABLE
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-surface1 border border-green/30 space-y-3 text-xs leading-relaxed text-text">
              <p className="font-medium">
                En atención al relevamiento socioambiental presencial practicado en el domicilio del postulante, al cotejo documental de sus ingresos, situación registral de la vivienda y constatación in situ de sus referencias laborales y vecinales, esta perito concluye:
              </p>
              <div className="p-3.5 rounded-xl bg-surface0 border border-overlay0/40 space-y-1 font-mono text-[11px]">
                <div>• Coherencia plena entre el estilo de vida constatado y los ingresos declarados.</div>
                <div>• Arraigo domiciliario sólido (más de 4 años en la zona) con referencias vecinales positivas.</div>
                <div>• Sin antecedentes de litigios ni alertas patrimoniales en la inspección ocular.</div>
              </div>
              <p className="text-[11px] text-subtext0">
                Se recomienda dar curso favorable a la solicitud bajo las condiciones estándar de la entidad.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-overlay0/30 text-xs">
              <div>
                <div className="font-bold text-text">Lic. Michelle Romero</div>
                <div className="text-[11px] text-subtext0 font-mono">Perito Evaluadora Socioambiental · Matrícula 4.819</div>
              </div>
              <div className="flex items-center gap-1.5 text-green text-[11px] font-mono font-bold">
                <Stamp className="h-4 w-4 text-gold" />
                <span>Firma y Sello Homologado</span>
              </div>
            </div>
          </div>
        )}

        {/* Controles de Navegación de la Lámina */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-overlay0/30 text-xs">
          <button
            type="button"
            disabled={currentSlide === 1}
            onClick={() => setCurrentSlide((s) => Math.max(1, s - 1))}
            className="flex items-center gap-1 font-semibold text-subtext0 hover:text-text disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Lámina Anterior</span>
          </button>

          <span className="text-[11px] font-mono text-subtext0">
            {currentSlide} de 5 láminas ejecutivas
          </span>

          <button
            type="button"
            disabled={currentSlide === 5}
            onClick={() => setCurrentSlide((s) => Math.min(5, s + 1))}
            className="flex items-center gap-1 font-semibold text-gold hover:text-gold-light disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span>Siguiente Lámina</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
