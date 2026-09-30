"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormFields";
import { Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@jerovia.com.py");
  const [password, setPassword] = useState("jerovia2026");
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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al autenticar");
      }

      // Redirigir al panel de administración
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error de credenciales";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-base flex flex-col justify-between p-4 sm:p-6">
      {/* Header bar */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full py-2">
        <Link href="/" className="hover:opacity-90 transition-opacity">
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

      {/* Main Login Card */}
      <main id="main-content" tabIndex={-1} className="max-w-md w-full mx-auto my-auto py-8">
        <div className="rounded-3xl border border-overlay0/60 bg-surface0 p-8 sm:p-10 shadow-xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-12 w-12 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-gold" />
            </div>
            <h1 className="text-2xl font-black text-text mb-1">Acceso Administrativo</h1>
            <p className="text-xs text-subtext0">
              Portal exclusivo para peritos y evaluadores de Jerovia Consultora
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-xl bg-red/10 border border-red/30 text-xs text-red font-semibold flex items-center gap-2"
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                label="Usuario o Correo Institucional"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jerovia.com.py"
                autoComplete="username"
              />
            </div>

            <div className="relative">
              <Input
                label="Contraseña de Seguridad"
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
                className="absolute right-3 top-8 text-subtext0 hover:text-text p-1 transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                loading={loading}
                className="w-full bg-gold hover:bg-gold-light text-black font-bold py-3.5 shadow-lg shadow-gold/20 text-sm"
              >
                <span>Ingresar al Sistema</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Credenciales de demostración */}
          <div className="mt-8 p-3.5 rounded-2xl bg-surface1 border border-overlay0/40 text-[11px] text-subtext0 space-y-1">
            <p className="font-bold text-text flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" />
              Credenciales de Administrador:
            </p>
            <div className="flex justify-between font-mono pt-1 text-subtext1">
              <span>Usuario:</span>
              <strong className="text-text">admin@jerovia.com.py</strong>
            </div>
            <div className="flex justify-between font-mono text-subtext1">
              <span>Contraseña:</span>
              <strong className="text-text">jerovia2026</strong>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-subtext0">
        <p>Jerovia Consultora · Sistema de Gestión de Visitas Socioambientales Confidenciales</p>
      </footer>
    </div>
  );
}
