"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormFields";
import { Lock, ArrowRight, ShieldCheck, Eye, EyeOff, UserCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("jerovia2026");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, remember }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Credenciales de administrador inválidas");
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error de acceso";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-overlay0/60 bg-surface0 p-8 sm:p-10 shadow-xl">
      {/* Encabezado sin distracciones (Ley de Hick) */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-12 w-12 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-gold" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-text mb-1">Acceso Administrativo</h1>
        <p className="text-xs text-subtext0 font-medium">
          Jerovia Consultora · Panel de Control y Auditoría
        </p>
      </div>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-3.5 rounded-xl bg-red/10 border border-red/30 text-xs text-red font-semibold flex items-center gap-2"
        >
          <span aria-hidden="true">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4" aria-busy={loading}>
        <Input
          label="Usuario o Correo Institucional"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin o admin@jerovia.com.py"
          autoComplete="username"
        />

        <div className="relative">
          <Input
            label="Contraseña de Administrador"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-subtext0 hover:text-text p-1 transition-colors focus-visible:ring-2"
            aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>

        {/* Recordar sesión (Ley de Hick: opción simple) */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-subtext1 font-medium select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-overlay0 text-gold focus:ring-gold/30 accent-gold cursor-pointer"
            />
            <span>Mantener sesión iniciada</span>
          </label>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            loading={loading}
            className="w-full bg-gold hover:bg-gold-light text-black font-bold py-3.5 shadow-lg shadow-gold/20 text-sm"
          >
            <span>Iniciar Sesión como Administrador</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </form>

      {/* Credenciales oficiales preconfiguradas */}
      <div className="mt-8 p-3.5 rounded-2xl bg-surface1 border border-overlay0/40 text-[11px] text-subtext0 space-y-1">
        <p className="font-bold text-text flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
          Credenciales de Administrador:
        </p>
        <div className="flex justify-between font-mono pt-1 text-subtext1">
          <span>Usuario:</span>
          <strong className="text-text">admin</strong>
        </div>
        <div className="flex justify-between font-mono text-subtext1">
          <span>Contraseña:</span>
          <strong className="text-text">jerovia2026</strong>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-base flex flex-col justify-between p-4 sm:p-6">
      {/* Header bar */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full py-2">
        <Link href="/" className="hover:opacity-90 transition-opacity" aria-label="Ir a página de inicio">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="text-xs font-semibold text-subtext0 hover:text-text transition-colors"
          >
            ← Volver a inicio
          </Link>
        </div>
      </header>

      {/* Main Login Card con Suspense para Next.js App Router */}
      <main id="main-content" tabIndex={-1} className="max-w-md w-full mx-auto my-auto py-8 outline-none">
        <Suspense fallback={<div className="h-96 rounded-3xl bg-surface0 animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-subtext0 font-medium">
        <p>© 2026 Jerovia Consultora · Acceso Restringido a Personal Autorizado</p>
      </footer>
    </div>
  );
}
