import Link from "next/link";
import { obtenerEntrevista, crearEntrevista } from "@/lib/store";
import { Wizard } from "@/components/Wizard";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QuestionnaireShell } from "@/components/QuestionnaireShell";
import { ShieldAlert } from "lucide-react";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function EntrevistaPage({ params }: PageProps) {
  const { token } = await params;

  let entrevista = obtenerEntrevista(token);

  if (!entrevista && token === "demo") {
    entrevista = crearEntrevista(
      "Banco Continental (Demo)",
      "demo",
      "Lic. Michelle Romero",
      "system"
    );
  }

  if (!entrevista) {
    return (
      <div className="min-h-screen bg-base text-text flex flex-col justify-between p-4 sm:p-6">
        <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-2">
          <Logo size="sm" />
          <ThemeToggle />
        </header>
        <main className="max-w-md w-full mx-auto my-auto rounded-2xl sm:rounded-3xl border border-red/30 bg-surface0 p-6 sm:p-8 text-center space-y-4 shadow-xl">
          <div className="h-12 w-12 rounded-2xl bg-red/10 text-red flex items-center justify-center mx-auto">
            <ShieldAlert className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-text">Enlace de Visita No Válido</h1>
          <p className="text-xs text-subtext0 leading-relaxed">
            El código de expediente solicitado no existe, ha expirado o fue dado de baja por la administración de Jerovia Consultora.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <Link
              href="/"
              className="min-h-[44px] rounded-xl border border-overlay0/60 bg-surface1 px-5 py-2.5 text-xs font-semibold text-text hover:border-gold flex items-center justify-center transition-colors"
            >
              Ir a Inicio
            </Link>
            <Link
              href="/entrevista/demo"
              className="min-h-[44px] rounded-xl bg-gold px-5 py-2.5 text-xs font-bold text-black hover:bg-gold-light flex items-center justify-center transition-colors"
            >
              Explorar Formulario Demo
            </Link>
          </div>
        </main>
        <footer className="text-center py-4 text-[11px] text-subtext0 font-mono">
          Jerovia Consultora • Cumplimiento Ley N° 6534/20
        </footer>
      </div>
    );
  }

  return (
    <QuestionnaireShell
      entidadSolicitante={entrevista.entidadSolicitante}
      candidatoNombre={entrevista.candidatoNombre}
      evaluadorAsignado={entrevista.evaluadorAsignado}
    >
      <Wizard
        token={entrevista.token}
        initialData={entrevista.datos}
        initialPaso={entrevista.pasoActual}
      />
    </QuestionnaireShell>
  );
}
