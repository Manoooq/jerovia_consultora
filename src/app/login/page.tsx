"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AntigravityBackground } from "@/components/ui/AntigravityBackground";
import {
  Shield,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

function sanitizeRedirect(raw: string | null): string {
  if (!raw) return "/dashboard";
  const trimmed = raw.trim();
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.includes("\\")
  ) {
    return trimmed;
  }
  return "/dashboard";
}

function DiagonalLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = sanitizeRedirect(searchParams.get("redirect"));

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [capsLock, setCapsLock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el || window.innerWidth < 1024) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const hasFocus = el.matches(":focus-within");
      const maxTilt = hasFocus ? 0.7 : 2.2;

      const rx = (((cy - y) / cy) * maxTilt).toFixed(2);
      const ry = (((x - cx) / cx) * maxTilt).toFixed(2);

      el.style.setProperty("--mx", `${x.toFixed(0)}px`);
      el.style.setProperty("--my", `${y.toFixed(0)}px`);
      el.style.transform = `perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0px)`;
    });
  }

  function handleMouseLeave() {
    const el = cardRef.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    el.style.transform =
      "perspective(1400px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  }

  function handleKeyEvent(e: React.KeyboardEvent<HTMLInputElement>) {
    if (typeof e.getModifierState === "function") {
      setCapsLock(e.getModifierState("CapsLock"));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Ingrese su usuario y contraseña.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
          remember,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Credenciales inválidas.");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al iniciar sesión."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-[#eef2f6] dark:bg-[#090d16] text-text flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Fondo Exterior con Corte Diagonal Arquitectónico */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 hidden lg:block transition-colors duration-500 bg-[#0b1326] dark:bg-[#04060b]"
        style={{
          clipPath: "polygon(55% 0%, 100% 0%, 100% 100%, 41% 100%)",
        }}
      />

      {/* Línea dorada sutil en el corte exterior */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(104deg, transparent 47.9%, rgba(212,175,55,0.22) 48%, transparent 48.2%)",
        }}
      />

      {/* Partículas interactivas suaves */}
      <AntigravityBackground />

      {/* Barra Flotante Superior Minimalista */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-5 flex items-center justify-between">
        <Link
          href="/"
          className="min-h-[38px] px-3.5 rounded-xl border border-overlay1 bg-surface0/85 backdrop-blur-md hover:border-gold text-xs font-bold text-text flex items-center gap-2 shadow-sm transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-gold" />
          <span>Volver a Inicio</span>
        </Link>

        <ThemeToggle />
      </header>

      {/* 2. Panel Panorámico Central con Corte Diagonal (Estilo NSOC adaptado a Jerovia) */}
      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 my-auto py-6 outline-none"
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform:
                "perspective(1400px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
            }}
            className="group relative w-full min-h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden border border-black/10 dark:border-white/15 shadow-[0_32px_90px_-15px_rgba(0,0,0,0.55)] transition-transform duration-150 ease-out will-change-transform grid grid-cols-1 lg:grid-cols-12 bg-[#ffffff] dark:bg-[#111726]"
          >
            {/* Fondo diagonal interno del lado derecho (Desktop) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden lg:block bg-gradient-to-br from-[#0c162c] via-[#091020] to-[#050811] dark:from-[#070a12] dark:via-[#05070d] dark:to-[#030408]"
              style={{
                clipPath: "polygon(54% 0%, 100% 0%, 100% 100%, 40% 100%)",
              }}
            />

            {/* Iluminación reactiva al cursor sobre el panel derecho */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(520px circle at var(--mx, 75%) var(--my, 50%), rgba(245, 196, 81, 0.14), transparent 60%)",
              }}
            />

            {/* Filo Diagonal Animado con Haz de Luz Serio (Desktop) */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full hidden lg:block z-10"
            >
              <defs>
                <linearGradient id="jerovia-edge" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(212,175,55,0.15)" />
                  <stop offset="50%" stopColor="rgba(245,196,81,0.85)" />
                  <stop offset="100%" stopColor="rgba(212,175,55,0.15)" />
                </linearGradient>
              </defs>
              <line
                x1="54"
                y1="0"
                x2="40"
                y2="100"
                stroke="url(#jerovia-edge)"
                strokeWidth="0.35"
              />
            </svg>

            {/* ALA IZQUIERDA: Emblema e Identidad Institucional */}
            <div className="relative z-20 lg:col-span-6 p-8 sm:p-12 flex flex-col items-center justify-center text-center bg-[#ffffff] dark:bg-[#111726] lg:bg-transparent lg:dark:bg-transparent lg:pr-16">
              {/* Emblema con movimiento geométrico sobrio */}
              <div className="relative flex items-center justify-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
                  className="absolute h-28 w-28 rounded-full border border-dashed border-[#b47800]/30 dark:border-[#f5c451]/30"
                />
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.35, 0.65, 0.35] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute h-22 w-22 rounded-full bg-[#eab308]/10 dark:bg-[#f5c451]/10"
                />
                <div className="relative h-18 w-18 rounded-2xl bg-gradient-to-br from-[#f5c451] to-[#b47800] p-[1.5px] shadow-xl">
                  <div className="h-full w-full rounded-[15px] bg-[#0b1326] flex items-center justify-center">
                    <Shield className="h-9 w-9 text-[#f5c451] stroke-[2]" />
                  </div>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-[0.08em] uppercase text-[#090d16] dark:text-white">
                JEROVIA DASHBOARD
              </h1>

              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent my-3" />

              <p className="text-xs sm:text-sm font-medium text-[#334155] dark:text-[#cbd5e1] max-w-[260px] leading-relaxed">
                Verificación Domiciliaria e Informes Socioambientales
              </p>

              {/* Indicador de estado operativo discreto */}
              <div className="mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1f5f9] dark:bg-[#1a2336] border border-black/10 dark:border-white/10 text-[10px] font-mono font-bold uppercase tracking-widest text-[#334155] dark:text-[#cbd5e1]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>SISTEMA PERICIAL • PARAGUAY</span>
              </div>
            </div>

            {/* ALA DERECHA: Formulario de Autenticación Limpio */}
            <div className="relative z-20 lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-gradient-to-br from-[#0c162c] via-[#091020] to-[#050811] lg:bg-none text-white">
              <div className="w-full max-w-sm mx-auto space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#f5c451]">
                    AUTENTICACIÓN DE PERSONAL
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Iniciar Sesión
                  </h2>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="rounded-xl border border-red-400/40 bg-red-500/15 p-3 text-xs font-semibold text-red-200 flex items-start gap-2"
                  >
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Campo Usuario estilo limpio */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="login-user"
                      className="block text-xs font-semibold text-slate-200 tracking-wide"
                    >
                      Usuario o Correo
                    </label>
                    <input
                      id="login-user"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ingrese su usuario..."
                      className="w-full min-h-[44px] rounded-lg bg-white text-[#090d16] placeholder:text-slate-400 px-3.5 py-2.5 text-sm font-semibold border border-white/20 shadow-inner outline-none transition-all focus:ring-2 focus:ring-[#f5c451]"
                    />
                  </div>

                  {/* Campo Contraseña */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="login-pass"
                      className="block text-xs font-semibold text-slate-200 tracking-wide"
                    >
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="login-pass"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyUp={handleKeyEvent}
                        onKeyDown={handleKeyEvent}
                        placeholder="••••••••••••"
                        className="w-full min-h-[44px] rounded-lg bg-white text-[#090d16] placeholder:text-slate-400 px-3.5 py-2.5 pr-10 text-sm font-semibold border border-white/20 shadow-inner outline-none transition-all focus:ring-2 focus:ring-[#f5c451]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md text-slate-500 hover:text-[#090d16] flex items-center justify-center cursor-pointer"
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {capsLock && (
                      <p className="text-[11px] font-mono font-bold text-[#fbbf24] flex items-center gap-1.5 pt-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Bloq Mayús activado</span>
                      </p>
                    )}
                  </div>

                  {/* Fila Remember Me + Acceso Demo (Igual a la referencia) */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 rounded border-white/30 text-[#eab308] focus:ring-[#f5c451]"
                      />
                      <span className="font-medium">Mantener sesión</span>
                    </label>

                    <Link
                      href="/entrevista/demo"
                      className="text-[#f5c451] hover:underline font-semibold"
                    >
                      Explorar Demo →
                    </Link>
                  </div>

                  {/* Botón Principal de Acción */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full min-h-[46px] rounded-lg bg-[#eab308] hover:bg-[#facc15] text-[#090d16] font-black text-xs uppercase tracking-[0.14em] shadow-lg shadow-black/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>VERIFICANDO...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5" />
                          <span>INGRESAR</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#f5c451]" />
                    Acceso Cifrado
                  </span>
                  <span>Jerovia v2.6</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Pie de página sutil */}
      <footer className="relative z-20 py-4 text-center text-[11px] font-mono text-[#334155] dark:text-slate-400">
        © 2026 Jerovia Consultora • Asunción, Paraguay
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090d16]" />}>
      <DiagonalLoginContent />
    </Suspense>
  );
}
