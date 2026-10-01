import Link from "next/link";
import { obtenerEntrevista, crearEntrevista } from "@/lib/store";
import { Wizard } from "@/components/Wizard";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { generateToken } from "@/lib/utils";
import { Lock, Save, Smartphone, ArrowLeft, ShieldCheck } from "lucide-react";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function EntrevistaPage({ params }: PageProps) {
  const { token } = await params;

  let entrevista = obtenerEntrevista(token);
  if (!entrevista) {
    entrevista = crearEntrevista("Entidad Solicitante", token || generateToken());
  }

  return (
    <div className="min-h-screen bg-base text-text">
      {/* Header corporativo */}
      <header className="border-b border-overlay0/40 bg-mantle sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs text-subtext1 hover:text-text transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Volver al panel</span>
            </Link>
            <div className="h-4 w-px bg-overlay0/50 hidden sm:block" />
            <Logo size="sm" />
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-[10px] text-subtext0 font-semibold uppercase tracking-wider">Entidad Solicitante</p>
              <p className="text-xs font-bold text-text">{entrevista.entidadSolicitante}</p>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="max-w-3xl mx-auto px-4 sm:px-6 py-8 outline-none space-y-6">
        {/* Banner de Expediente */}
        {entrevista.candidatoNombre && (
          <div className="rounded-2xl border border-overlay0/40 bg-surface1/60 px-5 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold" />
              <span>Expediente: <strong className="text-text">{entrevista.candidatoNombre}</strong></span>
            </div>
            {entrevista.evaluadorAsignado && (
              <span className="text-subtext0">Perito: <strong className="text-gold">{entrevista.evaluadorAsignado}</strong></span>
            )}
          </div>
        )}

        {/* Card del formulario */}
        <div className="rounded-3xl border border-overlay0/50 bg-surface0 shadow-2xl p-6 sm:p-10">
          <Wizard
            token={entrevista.token}
            initialData={entrevista.datos}
            initialPaso={entrevista.pasoActual}
          />
        </div>

        {/* Sellos de confianza y confidencialidad */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold text-subtext0 pt-2">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-gold" />
            <span>Datos Cifrados de Extremo a Extremo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Save className="h-3.5 w-3.5 text-gold" />
            <span>Guardado Automático Continuo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-gold" />
            <span>Optimizado para Inspección Móvil</span>
          </div>
        </div>
      </main>
    </div>
  );
}
