"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AntigravityBackground } from "@/components/ui/AntigravityBackground";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
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
      const maxTilt = hasFocus ? 0.6 : 2.2;

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
    <div className="relative min-h-screen w-full bg-[#f3f5f0] dark:bg-[#090d09] text-text flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Fondo Exterior con Corte Diagonal Verde Oliva Ejecutivo */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 hidden lg:block bg-[#2e4716] dark:bg-[#15240b] transition-colors duration-500"
        style={{
          clipPath: "polygon(55% 0%, 100% 0%, 100% 100%, 40% 100%)",
        }}
      />

      <AntigravityBackground />

      {/* Barra Superior */}
      <header className="relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 flex items-center justify-between">
        <Link
          href="/"
          className="min-h-[38px] px-3.5 rounded-xl border border-overlay1 bg-surface0/90 backdrop-blur-md hover:border-gold text-xs font-bold text-text flex items-center gap-2 shadow-sm transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-gold" />
          <span>Inicio</span>
        </Link>

        <ThemeToggle />
      </header>

      {/* 2. Panel Panorámico Central con Corte Diagonal Blanco / Verde Oliva */}
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
            className="group relative w-full min-h-[510px] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_30px_80px_-12px_rgba(15,28,12,0.45)] border border-overlay1 transition-transform duration-150 ease-out will-change-transform grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#111911]"
          >
            {/* Corte Diagonal Verde Oliva dentro de la tarjeta (Desktop) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden lg:block bg-gradient-to-br from-[#3a5a1c] via-[#2e4716] to-[#1f310e]"
              style={{
                clipPath: "polygon(54% 0%, 100% 0%, 100% 100%, 39% 100%)",
              }}
            />

            {/* Brillo especular interactivo sobre el ala verde oliva */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(480px circle at var(--mx, 75%) var(--my, 50%), rgba(163, 230, 53, 0.18), transparent 60%)",
              }}
            />

            {/* ALA IZQUIERDA: Superficie Limpia con el Logo Original de Jerovia en Alta Calidad */}
            <div className="relative z-20 lg:col-span-6 p-8 sm:p-12 flex flex-col items-center justify-center text-center bg-white dark:bg-[#111911] lg:bg-transparent lg:dark:bg-transparent lg:pr-16">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="mb-5 scale-125 drop-shadow-sm"
              >
                <Logo size="lg" />
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-[0.06em] uppercase text-[#365314] dark:text-[#a3e635] mt-2">
                JEROVIA DASHBOARD
              </h1>

              <p className="text-xs sm:text-sm font-medium text-subtext1 mt-1.5">
                Verificación Domiciliaria y Estudios Socioambientales
              </p>
            </div>

            {/* ALA DERECHA: Superficie Verde Oliva con Inputs Blancos */}
            <div className="relative z-20 lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-gradient-to-br from-[#3a5a1c] via-[#2e4716] to-[#1f310e] lg:bg-none text-white">
              <div className="w-full max-w-xs mx-auto space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="rounded-lg border border-red-300/40 bg-red-500/20 p-3 text-xs font-semibold text-white flex items-start gap-2"
                  >
                    <AlertCircle className="h-4 w-4 text-red-200 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="login-user"
                      className="block text-xs font-semibold text-lime-100 tracking-wide"
                    >
                      Usuario
                    </label>
                    <input
                      id="login-user"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ingrese su usuario"
                      className="w-full min-h-[42px] rounded-md bg-white text-[#111a10] placeholder:text-stone-400 px-3.5 py-2 text-sm font-semibold border border-transparent shadow-sm outline-none transition-all focus:ring-2 focus:ring-[#a3e635]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="login-pass"
                      className="block text-xs font-semibold text-lime-100 tracking-wide"
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
                        placeholder="Ingrese su contraseña"
                        className="w-full min-h-[42px] rounded-md bg-white text-[#111a10] placeholder:text-stone-400 px-3.5 py-2 pr-10 text-sm font-semibold border border-transparent shadow-sm outline-none transition-all focus:ring-2 focus:ring-[#a3e635]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded text-stone-400 hover:text-stone-800 flex items-center justify-center cursor-pointer"
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
                      <p className="text-[11px] font-mono font-bold text-lime-300 flex items-center gap-1.5 pt-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Bloq Mayús activado</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-lime-100 hover:text-white">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 rounded border-white/40 text-[#65a30d] focus:ring-white"
                      />
                      <span>Mantener sesión</span>
                    </label>

                    <Link
                      href="/entrevista/demo"
                      className="text-lime-200 hover:text-white underline-offset-4 hover:underline"
                    >
                      Explorar Demo
                    </Link>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full min-h-[42px] rounded-md bg-[#65a30d] hover:bg-[#84cc16] text-white font-bold text-xs uppercase tracking-[0.14em] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>INGRESANDO...</span>
                        </>
                      ) : (
                        <span>LOGIN</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-20 py-4 text-center text-[11px] font-mono text-subtext1">
        © 2026 Jerovia Consultora • Paraguay
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-base" />}>
      <DiagonalLoginContent />
    </Suspense>
  );
}
