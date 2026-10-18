"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input, Select } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { AntigravityBackground } from "@/components/ui/AntigravityBackground";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { QrCodeBox } from "@/components/ui/QrCodeModal";
import {
  ArrowLeft,
  PlusCircle,
  Copy,
  Check,
  ExternalLink,
  Share2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";

interface EvaluadorOption {
  value: string;
  label: string;
}

export default function NuevaVisitaPage() {
  const [candidatoNombre, setCandidatoNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [entidadSolicitante, setEntidadSolicitante] = useState("");
  const [evaluadorAsignado, setEvaluadorAsignado] = useState(
    "Lic. Michelle Romero"
  );

  // Campos adicionales que el evaluador puede pre-llenar para que no le aparezcan al evaluado
  const [mostrarMasDatos, setMostrarMasDatos] = useState(false);
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [email, setEmail] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [barrio, setBarrio] = useState("");
  const [direccion, setDireccion] = useState("");
  const [profesion, setProfesion] = useState("");
  const [carrera, setCarrera] = useState("");
  const [universidad, setUniversidad] = useState("");
  const [empresaAnterior, setEmpresaAnterior] = useState("");
  const [cargoAnterior, setCargoAnterior] = useState("");
  const [salarioBruto, setSalarioBruto] = useState("");
  const [cargoPostula, setCargoPostula] = useState("");
  const [pretensionSalarial, setPretensionSalarial] = useState("");

  const [evaluadores, setEvaluadores] = useState<EvaluadorOption[]>([
    { value: "Lic. Michelle Romero", label: "Lic. Michelle Romero" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/usuarios")
      .then((r) => (r.ok ? r.json() : null))
      .then((users) => {
        if (Array.isArray(users) && users.length > 0) {
          const opts = users
            .filter((u) => u.activo)
            .map((u) => ({ value: u.name, label: `${u.name} (${u.role})` }));
          if (opts.length > 0) setEvaluadores(opts);
        }
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!candidatoNombre.trim() || !entidadSolicitante.trim()) {
      setError("Complete el nombre del postulante y la entidad solicitante.");
      return;
    }

    setLoading(true);
    setError(null);

    const datosAdicionales: Record<string, string> = {};
    if (fechaNacimiento.trim()) datosAdicionales.fechaNacimiento = fechaNacimiento.trim();
    if (email.trim()) datosAdicionales.email = email.trim();
    if (estadoCivil.trim()) datosAdicionales.estadoCivil = estadoCivil.trim();
    if (barrio.trim()) datosAdicionales.barrio = barrio.trim();
    if (direccion.trim()) datosAdicionales.direccion = direccion.trim();
    if (profesion.trim()) datosAdicionales.profesion = profesion.trim();
    if (carrera.trim()) datosAdicionales.carrera = carrera.trim();
    if (universidad.trim()) datosAdicionales.universidad = universidad.trim();
    if (empresaAnterior.trim()) datosAdicionales.empresaAnterior = empresaAnterior.trim();
    if (cargoAnterior.trim()) datosAdicionales.cargoAnterior = cargoAnterior.trim();
    if (salarioBruto.trim()) datosAdicionales.salarioBruto = salarioBruto.trim();
    if (cargoPostula.trim()) datosAdicionales.cargoPostula = cargoPostula.trim();
    if (pretensionSalarial.trim())
      datosAdicionales.pretensionSalarial = pretensionSalarial.trim();

    try {
      const res = await fetch("/api/entrevista", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidatoNombre: candidatoNombre.trim(),
          cedula: cedula.trim(),
          telefono: telefono.trim(),
          ciudad: ciudad.trim(),
          entidadSolicitante: entidadSolicitante.trim(),
          evaluadorAsignado: evaluadorAsignado.trim(),
          datosAdicionales,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo generar el expediente.");
      }

      setCreatedToken(data.token);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al crear la visita."
      );
    } finally {
      setLoading(false);
    }
  }

  const interviewUrl =
    createdToken && typeof window !== "undefined"
      ? `${window.location.origin}/entrevista/${createdToken}`
      : "";

  function handleCopy() {
    if (!interviewUrl) return;
    navigator.clipboard.writeText(interviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function getWhatsAppHref(): string {
    const msg = `Estimado/a ${candidatoNombre}, le saluda Jerovia Consultora. Para completar sus datos del estudio socioambiental solicitado por ${entidadSolicitante}, ingrese a: ${interviewUrl}`;
    const digits = telefono.replace(/\D/g, "");
    const cleanPhone = digits
      ? digits.startsWith("595")
        ? digits
        : `595${digits.replace(/^0/, "")}`
      : "";
    return cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="relative min-h-screen bg-base text-text flex flex-col justify-between overflow-x-hidden">
      <AntigravityBackground />

      <header className="glass-panel sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="min-h-[38px] px-3 rounded-xl border border-overlay1 bg-surface1 hover:border-gold text-xs font-bold text-text flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-gold" />
              <span>Volver al Panel</span>
            </Link>
            <Logo size="sm" />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 w-full max-w-3xl mx-auto px-4 py-8 my-auto outline-none"
      >
        <div className="recessed-well rounded-3xl p-3 sm:p-4">
          <SpotlightCard sinkIntensity={2.5} className="p-6 sm:p-8">
            {createdToken ? (
              <div className="space-y-6 text-center py-2">
                <div className="h-14 w-14 rounded-2xl bg-green/15 border border-green/30 text-green flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-7 w-7" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
                    EXPEDIENTE Y QR HABILITADOS
                  </span>
                  <h1 className="text-2xl font-black text-text">
                    {candidatoNombre}
                  </h1>
                  <p className="text-xs text-subtext1">
                    Los datos que usted ya completó están guardados y no se le volverán a pedir al postulante.
                  </p>
                </div>

                <QrCodeBox url={interviewUrl} title={candidatoNombre} />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <Button type="button" variant="secondary" onClick={handleCopy}>
                    {copied ? (
                      <Check className="h-4 w-4 text-green" />
                    ) : (
                      <Copy className="h-4 w-4 text-gold" />
                    )}
                    <span>{copied ? "Copiado" : "Copiar Link"}</span>
                  </Button>

                  <a
                    href={getWhatsAppHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] rounded-xl border border-green/40 bg-green/10 hover:bg-green/20 text-green font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Enviar por WhatsApp</span>
                  </a>

                  <Link
                    href={`/entrevista/${createdToken}`}
                    className="min-h-[44px] rounded-xl bg-gold hover:bg-gold-light text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Abrir como Evaluador</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>

                <div className="pt-4 border-t border-overlay0/50 flex justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setCreatedToken(null);
                      setCandidatoNombre("");
                      setCedula("");
                      setTelefono("");
                    }}
                    className="text-subtext1 hover:text-gold font-bold cursor-pointer"
                  >
                    + Crear otra ficha
                  </button>
                  <Link href="/dashboard" className="text-gold font-bold hover:underline">
                    Ir a Cartera General →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-overlay0/60">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
                      NUEVA FICHA Y QR
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-text mt-0.5">
                      Habilitar Expediente Socioambiental
                    </h1>
                    <p className="text-xs text-subtext1 mt-0.5">
                      Los campos que rellene aquí ya no le aparecerán al postulante en su enlace.
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
                    <PlusCircle className="h-5 w-5" />
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red/40 bg-red/10 p-3.5 text-xs font-semibold text-red flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Nombre y Apellido del Postulante"
                      required
                      value={candidatoNombre}
                      onChange={(e) => setCandidatoNombre(e.target.value)}
                      placeholder="Ingrese nombre y apellido"
                    />
                    <Input
                      label="Entidad Solicitante"
                      required
                      value={entidadSolicitante}
                      onChange={(e) => setEntidadSolicitante(e.target.value)}
                      placeholder="Ingrese banco, cooperativa o empresa"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Número de Cédula (Si ya lo tiene)"
                      inputMode="numeric"
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value)}
                      placeholder="Opcional"
                    />
                    <Input
                      label="Teléfono / WhatsApp (Si ya lo tiene)"
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="Opcional"
                    />
                    <Input
                      label="Ciudad (Si ya la tiene)"
                      value={ciudad}
                      onChange={(e) => setCiudad(e.target.value)}
                      placeholder="Opcional"
                    />
                  </div>

                  <Select
                    label="Perito Evaluador Asignado"
                    required
                    value={evaluadorAsignado}
                    onChange={(e) => setEvaluadorAsignado(e.target.value)}
                    options={evaluadores}
                  />

                  {/* Botón para pre-llenar más datos del postulante */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setMostrarMasDatos(!mostrarMasDatos)}
                      className="w-full min-h-[42px] px-4 py-2.5 rounded-xl border border-[#85987a]/60 bg-[#536c45]/10 hover:bg-[#536c45]/15 text-xs font-bold text-text flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-gold" />
                        <span>
                          Rellenar más datos que ya tenga del postulante (Se ocultarán al evaluado)
                        </span>
                      </span>
                      {mostrarMasDatos ? (
                        <ChevronUp className="h-4 w-4 text-gold" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gold" />
                      )}
                    </button>
                  </div>

                  {mostrarMasDatos && (
                    <div className="rounded-2xl border border-overlay1 bg-surface1/60 p-4 space-y-4">
                      <span className="text-[11px] font-mono font-bold uppercase text-gold block">
                        PRE-CARGA DEL EVALUADOR (TODO CAMPO RELLENADO AQUÍ NO LE SALDRÁ AL POSTULANTE)
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Input
                          label="Fecha de Nacimiento"
                          type="date"
                          value={fechaNacimiento}
                          onChange={(e) => setFechaNacimiento(e.target.value)}
                        />
                        <Select
                          label="Estado Civil"
                          value={estadoCivil}
                          onChange={(e) => setEstadoCivil(e.target.value)}
                          options={[
                            { value: "soltero", label: "Soltero/a" },
                            { value: "casado", label: "Casado/a" },
                            { value: "conviviente", label: "Conviviente" },
                            { value: "divorciado", label: "Divorciado/a" },
                            { value: "viudo", label: "Viudo/a" },
                          ]}
                        />
                        <Input
                          label="Correo Electrónico"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Opcional"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Input
                          label="Profesión"
                          value={profesion}
                          onChange={(e) => setProfesion(e.target.value)}
                          placeholder="Opcional"
                        />
                        <Input
                          label="Carrera / Estudios"
                          value={carrera}
                          onChange={(e) => setCarrera(e.target.value)}
                          placeholder="Opcional"
                        />
                        <Input
                          label="Universidad / Institución"
                          value={universidad}
                          onChange={(e) => setUniversidad(e.target.value)}
                          placeholder="Opcional"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Input
                          label="Lugar de trabajo actual"
                          value={empresaAnterior}
                          onChange={(e) => setEmpresaAnterior(e.target.value)}
                          placeholder="Opcional"
                        />
                        <Input
                          label="Cargo actual"
                          value={cargoAnterior}
                          onChange={(e) => setCargoAnterior(e.target.value)}
                          placeholder="Opcional"
                        />
                        <Input
                          label="Salario (Gs.)"
                          value={salarioBruto}
                          onChange={(e) => setSalarioBruto(e.target.value)}
                          placeholder="Opcional"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Cargo al que postula"
                          value={cargoPostula}
                          onChange={(e) => setCargoPostula(e.target.value)}
                          placeholder="Opcional"
                        />
                        <Input
                          label="Pretensión salarial (Gs.)"
                          value={pretensionSalarial}
                          onChange={(e) => setPretensionSalarial(e.target.value)}
                          placeholder="Opcional"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Barrio"
                          value={barrio}
                          onChange={(e) => setBarrio(e.target.value)}
                          placeholder="Opcional"
                        />
                        <Input
                          label="Dirección"
                          value={direccion}
                          onChange={(e) => setDireccion(e.target.value)}
                          placeholder="Opcional"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-overlay0/50 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                    <Link
                      href="/dashboard"
                      className="min-h-[44px] w-full sm:w-auto px-5 rounded-xl border border-overlay1 bg-surface1 text-xs font-bold text-text flex items-center justify-center hover:border-gold transition-colors"
                    >
                      Cancelar
                    </Link>
                    <Button
                      type="submit"
                      size="lg"
                      loading={loading}
                      className="w-full sm:w-auto min-w-[220px]"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Generar Ficha y QR</span>
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </SpotlightCard>
        </div>
      </main>

      <footer className="relative z-10 border-t border-overlay0/40 py-4 bg-mantle/80 backdrop-blur-md text-center text-xs text-subtext1 font-mono">
        Jerovia Consultora • Paraguay
      </footer>
    </div>
  );
}
