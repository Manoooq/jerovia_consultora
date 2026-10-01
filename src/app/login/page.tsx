"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormFields";
import { Lock, ArrowRight, Eye, EyeOff, Shield } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  // Campos sin credenciales hardcodeadas por seguridad
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        throw new Error(data.error || "Credenciales de acceso inválidas.");
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
    <div className="rounded-3xl border border-overlay0/50 bg-surface0 p-8 sm:p-10 shadow-2xl">
      {/* Encabezado Institucional Sobrio */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-12 w-12 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center mb-4 text-gold">
          <Shield className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-text tracking-tight mb-1.5">Portal Corporativo</h1>
        <p className="text-xs text-subtext0 font-medium max-w-xs leading-relaxed">
          Jerovia Consultora · Evaluaciones Socioambientales y de Confiabilidad
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
          placeholder="Ej: michelle.romero o usuario@jerovia.com.py"
          autoComplete="username"
        />

        <div className="relative">
          <Input
            label="Contraseña"
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

        {/* Recordar sesión */}
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
            <span>Ingresar al Sistema</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </form>

      {/* Nota de confidencialidad y seguridad institucional */}
      <div className="mt-8 pt-6 border-t border-overlay0/30 text-center">
        <p className="text-[11px] text-subtext0 leading-relaxed">
          Acceso estrictamente restringido al personal autorizado de Jerovia Consultora y evaluadores homologados.
        </p>
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
        <p>© 2026 Jerovia Consultora · Seguridad Criptográfica y Confidencialidad Pericial</p>
      </footer>
    </div>
  );
}
