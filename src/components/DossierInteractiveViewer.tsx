"use client";

import { useState } from "react";
import { 
  ShieldCheck, MapPin,
  Check, Stamp, ChevronRight, ChevronLeft
} from "lucide-react";

export function DossierInteractiveViewer() {
  const [currentSlide, setCurrentSlide] = useState(1);

  const slides = [
    { id: 1, name: "Carátula" },
    { id: 2, name: "Historial Laboral" },
    { id: 3, name: "Balance Económico" },
    { id: 4, name: "Auditoría Habitacional" },
    { id: 5, name: "Dictamen Técnico" },
  ];

  return (
    <div className="flex flex-col bg-surface0">
      <div className="bg-surface1 px-4 py-2 border-b border-overlay0 flex items-center gap-2 overflow-x-auto">
        {slides.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrentSlide(s.id)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
              currentSlide === s.id
                ? "bg-surface0 text-text shadow-sm border border-overlay1"
                : "text-subtext0 hover:text-text hover:bg-surface2/50"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8 min-h-[400px] flex flex-col justify-between">
        
        {currentSlide === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <header className="border-b border-overlay0 pb-4">
              <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                Expediente Pericial
              </span>
              <h3 className="text-2xl font-bold text-text mt-1">Informe de Verificación Domiciliaria</h3>
              <p className="text-sm text-subtext0 mt-1">Relevamiento presencial para Comité de Crédito</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-subtext0 uppercase tracking-wider">Postulante</h4>
                <div className="p-4 rounded-xl bg-surface1 border border-overlay0 space-y-2">
                  <p className="font-medium text-text">M.A.B.P. (Identidad Reservada)</p>
                  <div className="text-sm text-subtext0 space-y-1">
                    <p>C.I. N°: 4.891.***</p>
                    <p>Estado Civil: Conviviente</p>
                    <p>Dependientes: 2 hijos menores</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-subtext0 uppercase tracking-wider">Inspección</h4>
                <div className="p-4 rounded-xl bg-surface1 border border-overlay0 space-y-2">
                  <p className="font-medium text-text">Entidad Bancaria de Primera Línea</p>
                  <div className="text-sm text-subtext0 space-y-1">
                    <p>Zona: Luque</p>
                    <p>Fecha visita: Octubre 2026</p>
                    <p>Perito: Lic. Romero (Reg. 4.819)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-subtext0 bg-surface1 p-3 rounded-lg border border-overlay0">
              <ShieldCheck className="h-5 w-5 text-gold" />
              <span>Conforme a normativas de reserva de información del BCP.</span>
            </div>
          </div>
        )}

        {currentSlide === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
             <header className="flex items-center justify-between border-b border-overlay0 pb-4">
              <div>
                <span className="text-xs font-semibold text-gold uppercase tracking-wider">Lámina 02</span>
                <h3 className="text-2xl font-bold text-text mt-1">Historial Laboral y Aportes</h3>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-green bg-green/10 px-3 py-1 rounded-full border border-green/20">
                <Check className="h-4 w-4" /> IPS Verificado
              </span>
            </header>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-surface1 border border-overlay0">
                <h4 className="font-medium text-text text-base mb-3">Empresa del Sector Logístico e Importación</h4>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div>
                    <span className="text-subtext0 block">Cargo</span>
                    <span className="font-medium text-text">Analista Operativo</span>
                  </div>
                  <div>
                    <span className="text-subtext0 block">Antigüedad</span>
                    <span className="font-medium text-text">3 años 8 meses</span>
                  </div>
                  <div>
                    <span className="text-subtext0 block">Salario</span>
                    <span className="font-medium text-text">4.850.000 Gs.</span>
                  </div>
                  <div>
                    <span className="text-subtext0 block">Aporte IPS</span>
                    <span className="font-medium text-text">Al día</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-overlay0 bg-surface0">
                <h4 className="text-sm font-semibold text-subtext0 mb-2">Verificación de Referencias</h4>
                <p className="text-sm text-text leading-relaxed">
                  Contacto con Gerencia de RRHH. Se confirma conducta intachable, sin apercibimientos ni sanciones en legajo.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentSlide === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
             <header className="flex items-center justify-between border-b border-overlay0 pb-4">
              <div>
                <span className="text-xs font-semibold text-gold uppercase tracking-wider">Lámina 03</span>
                <h3 className="text-2xl font-bold text-text mt-1">Balance Socioeconómico</h3>
              </div>
              <span className="text-sm font-medium text-text bg-surface1 px-3 py-1 rounded-full border border-overlay0">
                Endeudamiento: 24.2%
              </span>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-surface1 border border-overlay0 space-y-4">
                <h4 className="font-semibold text-green flex items-center justify-between">
                  <span>Ingresos Familiares</span>
                  <span>7.350.000 Gs.</span>
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-subtext0">Sueldo Titular:</span>
                    <span className="font-medium text-text">4.850.000 Gs.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-subtext0">Ingreso Cónyuge:</span>
                    <span className="font-medium text-text">2.500.000 Gs.</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-surface1 border border-overlay0 space-y-4">
                <h4 className="font-semibold text-yellow flex items-center justify-between">
                  <span>Egresos Fijos</span>
                  <span>3.780.000 Gs.</span>
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-subtext0">Alquiler:</span>
                    <span className="font-medium text-text">1.200.000 Gs.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-subtext0">Servicios:</span>
                    <span className="font-medium text-text">380.000 Gs.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-subtext0">Manutención:</span>
                    <span className="font-medium text-text">2.200.000 Gs.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
                <p className="text-lg font-semibold text-text">
                  <span className="text-subtext0 text-sm font-normal mr-2">Superávit Disponible:</span>
                  3.570.000 Gs.
                </p>
            </div>
          </div>
        )}

        {currentSlide === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
             <header className="flex items-center justify-between border-b border-overlay0 pb-4">
              <div>
                <span className="text-xs font-semibold text-gold uppercase tracking-wider">Lámina 04</span>
                <h3 className="text-2xl font-bold text-text mt-1">Auditoría Habitacional</h3>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-subtext0">Tipología</h4>
                <p className="text-sm font-medium text-text">Mampostería de Ladrillo</p>
                <p className="text-sm text-subtext1">Techo de tejas, piso cerámico.</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-subtext0">Medidor ANDE</h4>
                <p className="text-sm font-medium text-text">NIS 2489102</p>
                <p className="text-sm text-subtext1">Titularidad coincidente. Sin mora.</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-subtext0">Acceso</h4>
                <p className="text-sm font-medium text-text">Camino Empedrado</p>
                <p className="text-sm text-subtext1">Transitable todo el tiempo.</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-surface1 border border-overlay0 rounded-xl flex items-center justify-between">
               <div className="flex items-center gap-2 text-sm text-text">
                <MapPin className="h-5 w-5 text-gold" />
                <span>Coordenadas: -25.269932, -57.489012</span>
              </div>
              <span className="text-sm font-medium text-green">Presencia In Situ Confirmada</span>
            </div>
          </div>
        )}

        {currentSlide === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
             <header className="flex items-center justify-between border-b border-overlay0 pb-4">
              <div>
                <span className="text-xs font-semibold text-gold uppercase tracking-wider">Lámina 05</span>
                <h3 className="text-2xl font-bold text-text mt-1">Dictamen Técnico Resolutivo</h3>
              </div>
              <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-green text-white shadow-sm">
                FAVORABLE
              </span>
            </header>

            <div className="space-y-4 text-sm text-text leading-relaxed">
              <p>
                En base a la visita domiciliaria y cotejo documental, se concluye:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-subtext0">
                <li>Coherencia plena entre el estilo de vida constatado y los ingresos declarados.</li>
                <li>Arraigo domiciliario sólido con referencias vecinales positivas.</li>
                <li>Sin antecedentes de litigios ni alertas en la inspección ocular.</li>
              </ul>
              <p className="font-medium pt-2">
                Se recomienda dar curso favorable a la solicitud.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-overlay0 flex items-center justify-between">
              <div>
                <p className="font-semibold text-text">Lic. Michelle Romero</p>
                <p className="text-sm text-subtext0">Perito Evaluadora · Matrícula 4.819</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-green">
                <Stamp className="h-5 w-5 text-gold" />
                <span>Firma Homologada</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 mt-6 border-t border-overlay0">
          <button
            type="button"
            disabled={currentSlide === 1}
            onClick={() => setCurrentSlide((s) => Math.max(1, s - 1))}
            className="flex items-center gap-1 text-sm font-medium text-text hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Anterior</span>
          </button>

          <span className="text-sm font-medium text-subtext0">
            {currentSlide} / 5
          </span>

          <button
            type="button"
            disabled={currentSlide === 5}
            onClick={() => setCurrentSlide((s) => Math.min(5, s + 1))}
            className="flex items-center gap-1 text-sm font-medium text-text hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span>Siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
