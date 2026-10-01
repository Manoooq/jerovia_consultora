"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Check, Copy, ExternalLink, Share2, 
  Building2, User, Phone, MapPin, ShieldCheck, ShieldAlert 
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
  const [evaluador, setEvaluador] = useState("Lic. Michelle Romero");
  const [evaluadoresList, setEvaluadoresList] = useState<{ value: string; label: string }[]>([
    { value: "Lic. Michelle Romero", label: "Lic. Michelle Romero (Evaluadora Senior)" },
    { value: "Lic. Carlos Benítez", label: "Lic. Carlos Benítez (Perito de Campo)" },
  ]);

  const [loading, setLoading] = useState(false);
  const [creada, setCreada] = useState<{
    token: string;
    entidad: string;
    candidato: string;
    evaluador: string;
    url: string;
  } | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [permisoDenegado, setPermisoDenegado] = useState(false);

  // Verificar rol de admin y cargar lista de evaluadores registrados
  useEffect(() => {
    async function checkRoleAndLoadUsers() {
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.user?.role !== "admin") {
            setPermisoDenegado(true);
            return;
          }
        }

        const usersRes = await fetch("/api/usuarios");
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          const mapped = usersData
            .filter((u: { activo: boolean }) => u.activo)
            .map((u: { name: string; role: string }) => ({
              value: u.name,
              label: `${u.name} (${u.role === "admin" ? "Administrador" : "Evaluador"})`,
            }));
          if (mapped.length > 0) {
            setEvaluadoresList(mapped);
          }
        }
      } catch {
        // En caso de fallo de red mantener los defaults
      }
    }
    checkRoleAndLoadUsers();
  }, []);

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
          evaluadorAsignado: evaluador,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al crear entrevista");
      }
      const data = await res.json();

      // Guardar datos preliminares del candidato
      await fetch(`/api/entrevista/${data.token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidatoNombre: nombre,
          evaluadorAsignado: evaluador,
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
        evaluador,
        url: fullUrl,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "No se pudo registrar la visita.";
      alert(msg);
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
    const msg = `Estimado/a ${creada.candidato || "postulante"}, le saluda el equipo de Jerovia Consultora.\n\nPara coordinar el estudio socioambiental solicitado por ${creada.entidad}, le facilitamos el siguiente enlace seguro para registrar sus datos preliminares:\n\n🔗 ${creada.url}\n\nPerito a cargo: ${creada.evaluador}\nQuedamos a su disposición.`;
    const telLimpio = telefono.replace(/\D/g, "");
    const telParaguay = telLimpio.startsWith("595") ? telLimpio : `595${telLimpio.replace(/^0/, "")}`;
    return `https://wa.me/${telParaguay}?text=${encodeURIComponent(msg)}`;
  }

  if (permisoDenegado) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl border border-red/30 bg-surface0 p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-red/10 text-red flex items-center justify-center mx-auto">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-text">Acceso Restringido</h2>
          <p className="text-xs text-subtext0 leading-relaxed">
            Únicamente los usuarios con rol de <strong>Administrador General</strong> pueden generar nuevos enlaces de visitas y asignaciones.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gold px-5 py-2.5 text-xs font-bold text-black"
          >
            ← Volver a mis visitas
          </Link>
        </div>
      </div>
    );
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
              Emisión de Enlace
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
                Registra los datos del postulante, la institución bancaria y el perito evaluador responsable.
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

              {/* Perito Asignado (Jerarquía de usuarios) */}
              <div className="rounded-2xl border border-overlay0/40 bg-surface1/60 p-5 space-y-4">
                <div className="flex items-center gap-2 text-text font-semibold text-sm">
                  <ShieldCheck className="h-4 w-4 text-gold" />
                  <span>3. Perito Evaluador Responsable</span>
                </div>

                <Select
                  label="Asignar al Perito"
                  options={evaluadoresList}
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
                <h2 className="text-2xl font-black text-text">¡Enlace de Visita Generado!</h2>
                <p className="text-xs text-subtext0 mt-0.5">
                  Token seguro asignado para {creada.candidato} bajo la supervisión de {creada.evaluador}.
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
                <span className="text-subtext0">Perito Asignado:</span>
                <span className="font-semibold text-gold">{creada.evaluador}</span>
              </div>
            </div>

            {/* Link Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-subtext0 uppercase tracking-wider">
                Enlace Directo para el Evaluador / Postulante
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
                Iniciar Evaluación
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
