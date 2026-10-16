"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { AntigravityBackground } from "@/components/ui/AntigravityBackground";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  KeyRound,
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

function LoginForm() {
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
    <div className="relative min-h-screen bg-base text-text flex flex-col justify-between overflow-x-hidden">
      <AntigravityBackground />

      {/* Barra Superior */}
      <header className="relative z-20 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="min-h-[38px] px-3 rounded-xl border border-overlay1 bg-surface1 hover:border-gold text-xs font-bold text-text flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-gold" />
              <span>Inicio</span>
            </Link>
            <Logo size="sm" />
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Consola Central Táctil */}
      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 w-full max-w-md mx-auto px-4 py-10 my-auto outline-none"
      >
        <div className="recessed-well rounded-3xl p-3 sm:p-4">
          <SpotlightCard sinkIntensity={4.5} className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Cabecera sobria */}
              <div className="flex items-center justify-between pb-4 border-b border-overlay0/70">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
                    JEROVIA // ACCESO
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-text tracking-tight mt-0.5">
                    Portal de Evaluadores
                  </h1>
                </div>
                <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
                  <KeyRound className="h-5 w-5" />
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red/40 bg-red/10 p-3.5 text-xs font-semibold text-red flex items-start gap-2"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                  label="Usuario o Correo"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin / evaluador"
                />

                <div className="space-y-1.5">
                  <div className="relative">
                    <Input
                      label="Contraseña"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyUp={handleKeyEvent}
                      onKeyDown={handleKeyEvent}
                      placeholder="••••••••"
                      className="pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 bottom-2 min-h-[30px] min-w-[30px] rounded-lg text-subtext1 hover:text-gold flex items-center justify-center cursor-pointer"
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
                    <p className="text-[11px] font-mono font-bold text-yellow flex items-center gap-1.5 pt-0.5">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Bloq Mayús está activado</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none text-subtext1 hover:text-text">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="rounded border-overlay1 text-gold focus:ring-gold h-4 w-4"
                    />
                    <span className="font-semibold">Mantener sesión (30 días)</span>
                  </label>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    loading={loading}
                    className="w-full"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Ingresar al Sistema</span>
                  </Button>
                </div>
              </form>

              <div className="pt-4 border-t border-overlay0/60 flex items-center justify-between text-[11px] text-subtext1 font-mono">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                  Sesión HMAC-SHA256
                </span>
                <Link
                  href="/entrevista/demo"
                  className="text-gold hover:underline font-bold"
                >
                  Ver Cuestionario Demo →
                </Link>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </main>

      <footer className="relative z-10 border-t border-overlay0/40 py-4 bg-mantle/80 backdrop-blur-md text-center text-xs text-subtext1 font-mono">
        Jerovia Consultora • Paraguay
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-base" />}>
      <LoginForm />
    </Suspense>
  );
}
