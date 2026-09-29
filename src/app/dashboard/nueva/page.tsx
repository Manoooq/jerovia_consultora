"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Check, Copy, ExternalLink, Share2, 
  Building2, User, Phone, MapPin, ShieldCheck, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/FormFields";

const ENTIDADES_FRECUENTES = [
  { value: "Banco Continental", label: "Banco Continental" },
  { value: "Cooperativa Universitaria", label: "Cooperativa Universitaria" },
  { value: "Financiera Familiar", label: "Financiera Familiar" },
  { value: "Banco Itaú Paraguay", label: "Banco Itaú Paraguay" },
  { value: "Banco Basa", label: "Banco Basa" },
  { value: "Sudameris Bank", label: "Sudameris Bank" },
  { value: "Otra Entidad", label: "Otra Entidad (Personalizada)" },
];

const CIUDADES_PARAGUAY = [
  { value: "Luque", label: "Luque" },
  { value: "Asunción", label: "Asunción" },
  { value: "San Lorenzo", label: "San Lorenzo" },
  { value: "Fernando de la Mora", label: "Fernando de la Mora" },
  { value: "Lambaré", label: "Lambaré" },
  { value: "Capiatá", label: "Capiatá" },
  { value: "Ñemby", label: "Ñemby" },
  { value: "Mariano Roque Alonso", label: "Mariano Roque Alonso" },
  { value: "Villa Elisa", label: "Villa Elisa" },
  { value: "Otra Ciudad", label: "Otra Ciudad" },
];

export default function NuevaEntrevistaPage() {
  const router = useRouter();
  const [entidad, setEntidad] = useState("Banco Continental");
  const [entidadCustom, setEntidadCustom] = useState("");
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("Luque");
  const [evaluador, setEvaluador] = useState("Michelle Romero");

  const [loading, setLoading] = useState(false);
  const [creada, setCreada] = useState<{
    token: string;
    entidad: string;
    candidato: string;
    url: string;
  } | null>(null);
  const [copiado, setCopiado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const entidadFinal = entidad === "Otra Entidad" ? entidadCustom : entidad;

    try {
      const res = await fetch("/api/entrevista", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entidadSolicitante: entidadFinal,
        }),
      });

      if (!res.ok) throw new Error("Error al crear entrevista");
      const data = await res.json();

      // Actualizar datos preliminares del candidato
      await fetch(`/api/entrevista/${data.token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidatoNombre: nombre,
          datos: {
            nombre: nombre.split(" ")[0] || "",
            apellido: nombre.split(" ").slice(1).join(" ") || "",
            cedula,
            telefono,
            ciudad,
            consultorNombre: evaluador,
          },
        }),
      });

      const fullUrl = `${window.location.origin}/entrevista/${data.token}`;
      setCreada({
        token: data.token,
        entidad: entidadFinal,
        candidato: nombre,
        url: fullUrl,
      });
    } catch (err) {
      alert("No se pudo registrar la visita. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopiar() {
    if (!creada) return;
    navigator.clipboard.writeText(creada.url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  function generarMensajeWhatsApp(): string {
    if (!creada) return "";
    const msg = `Estimado/a ${creada.candidato || "postulante"}, le saluda el equipo de Jerovia Consultora.\n\nPara avanzar con su proceso y coordinar el estudio socioambiental solicitado por ${creada.entidad}, le facilitamos el siguiente enlace seguro para completar sus datos preliminares:\n\n🔗 ${creada.url}\n\nQuedamos a su disposición.`;
    const telLimpio = telefono.replace(/\D/g, "");
    const telParaguay = telLimpio.startsWith("595") ? telLimpio : `595${telLimpio.replace(/^0/, "")}`;
    return `https://wa.me/${telParaguay}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="min-h-screen bg-base">
      {/* Top Navbar */}
      <nav className="border-b border-overlay0/30 bg-mantle sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs text-subtext1 hover:text-text transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al panel
            </Link>
            <div className="h-4 w-px bg-overlay0/50" />
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-xs text-gold uppercase tracking-widest font-semibold hidden sm:inline">
              Nueva Asignación
            </span>
          </div>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1} className="max-w-3xl mx-auto px-4 sm:px-6 py-10 outline-none">
        {!creada ? (
          <div className="rounded-3xl border border-overlay0/40 bg-surface0 p-8 sm:p-10 shadow-2xl">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold mb-3">
                <Building2 className="h-3.5 w-3.5" />
                Estudio Socioambiental Confidencial
              </div>
              <h1 className="text-3xl font-black text-text">Generar Nueva Visita</h1>
              <p className="text-sm text-subtext1 mt-1">
                Registra los datos del postulante y la entidad solicitante para generar el acceso seguro de entrevista.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Entidad Solicitante */}
              <div className="rounded-2xl border border-overlay0/40 bg-surface1/60 p-5 space-y-4">
                <div className="flex items-center gap-2 text-text font-semibold text-sm">
                  <Building2 className="h-4 w-4 text-gold" />
                  <span>1. Entidad Solicitante</span>
                </div>

                <Select
                  label="Empresa / Institución Bancaria"
                  options={ENTIDADES_FRECUENTES}
                  value={entidad}
                  onChange={(e) => setEntidad(e.target.value)}
                  required
                />

                {entidad === "Otra Entidad" && (
                  <Input
                    label="Nombre de la Institución"
                    placeholder="Ej: Cooperativa San Cristóbal"
                    value={entidadCustom}
                    onChange={(e) => setEntidadCustom(e.target.value)}
                    required
                  />
                )}
              </div>

              {/* Datos del Candidato */}
              <div className="rounded-2xl border border-overlay0/40 bg-surface1/60 p-5 space-y-4">
                <div className="flex items-center gap-2 text-text font-semibold text-sm">
                  <User className="h-4 w-4 text-gold" />
                  <span>2. Datos del Postulante / Entrevistado</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nombre Completo"
                    placeholder="Ej: Tobias Maximiliano Sánchez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                  <Input
                    label="Cédula de Identidad (CI)"
                    placeholder="Ej: 5.551.895"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    required
                  />
                  <Input
                    label="Teléfono / WhatsApp"
                    placeholder="Ej: 0982 176890"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                  />
                  <Select
                    label="Ciudad de Residencia"
                    options={CIUDADES_PARAGUAY}
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Evaluador Responsable */}
              <div className="rounded-2xl border border-overlay0/40 bg-surface1/60 p-5 space-y-4">
                <div className="flex items-center gap-2 text-text font-semibold text-sm">
                  <ShieldCheck className="h-4 w-4 text-gold" />
                  <span>3. Perito / Evaluador Asignado</span>
                </div>

                <Input
                  label="Profesional Responsable de Jerovia"
                  placeholder="Ej: Michelle Romero"
                  value={evaluador}
                  onChange={(e) => setEvaluador(e.target.value)}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-overlay0/40">
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-overlay0 bg-surface1 px-5 py-3 text-sm font-semibold text-subtext1 hover:text-text transition-all"
                >
                  Cancelar
                </Link>
                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  className="bg-gold text-black hover:bg-gold-light font-bold px-8 shadow-xl shadow-gold/20"
                >
                  Generar Enlace de Visita
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation & Sharing Screen */
          <div className="rounded-3xl border border-gold/30 bg-surface0 p-8 sm:p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center">
                <Check className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-text">¡Visita Asignada con Éxito!</h2>
                <p className="text-xs text-subtext0 mt-0.5">
                  Se ha generado el token seguro e intransferible para {creada.candidato}.
                </p>
              </div>
            </div>

            {/* Resumen */}
            <div className="rounded-2xl border border-overlay0/40 bg-surface1/60 p-5 space-y-3">
              <div className="flex justify-between text-xs py-1 border-b border-overlay0/30">
                <span className="text-subtext0">Entidad Solicitante:</span>
                <span className="font-semibold text-text">{creada.entidad}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-overlay0/30">
                <span className="text-subtext0">Postulante:</span>
                <span className="font-semibold text-text">{creada.candidato}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-overlay0/30">
                <span className="text-subtext0">Ciudad:</span>
                <span className="font-semibold text-text">{ciudad}</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-subtext0">Evaluador Jerovia:</span>
                <span className="font-semibold text-gold">{evaluador}</span>
              </div>
            </div>

            {/* Link Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-subtext0 uppercase tracking-wider">
                Enlace Directo de la Visita
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-base border border-overlay0/60">
                <input
                  type="text"
                  readOnly
                  value={creada.url}
                  className="bg-transparent text-sm text-text font-mono flex-1 outline-none px-2"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCopiar}
                  className="shrink-0"
                >
                  {copiado ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* WhatsApp Integration Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={generarMensajeWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-green/90 hover:bg-green text-black font-bold px-6 py-3.5 text-sm transition-all shadow-lg shadow-green/20"
              >
                <Share2 className="h-4 w-4" />
                Enviar por WhatsApp
              </a>

              <Link
                href={`/entrevista/${creada.token}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-gold hover:bg-gold-light text-black font-bold px-6 py-3.5 text-sm transition-all shadow-lg shadow-gold/20"
              >
                <ExternalLink className="h-4 w-4" />
                Iniciar Entrevista Ahora
              </Link>
            </div>

            <div className="pt-4 border-t border-overlay0/30 text-center">
              <Link
                href="/dashboard"
                className="text-xs text-subtext0 hover:text-text transition-colors"
              >
                ← Volver al listado de entrevistas
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
