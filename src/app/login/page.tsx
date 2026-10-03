"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormFields";
import { Lock, ArrowRight, Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

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
    <div className="rounded-3xl glass-panel p-8 sm:p-10 shadow-2xl">
      {/* Encabezado Institucional Sobrio */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-12 w-12 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center mb-4 text-gold shadow-sm">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-text tracking-tight mb-1.5">Portal de Evaluadores</h1>
        <p className="text-xs text-subtext0 max-w-xs">
          Acceso reservado para peritos acreditados y directivos de Jerovia Consultora.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-2xl bg-red/10 border border-red/30 p-4 text-xs font-semibold text-red"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Input
            id="username-input"
            label="Usuario o Correo Institucional"
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="usuario@jerovia.com.py"
          />
        </div>

        <div className="relative">
          <Input
            id="password-input"
            label="Contraseña Criptográfica"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-[38px] text-subtext0 hover:text-text transition-colors p-1"
            aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-subtext0">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-overlay0 bg-surface1 text-gold focus:ring-gold"
            />
            <span>Recordar sesión</span>
          </label>
        </div>

        <Button
          type="submit"
          loading={loading}
          size="lg"
          className="w-full mt-2 bg-gold text-black font-bold shadow-lg shadow-gold/20"
        >
          <span>Ingresar al Sistema</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Pie con garantías de seguridad */}
      <div className="mt-8 pt-6 border-t border-white/[0.08] text-center space-y-2">
        <p className="text-[11px] text-subtext0 flex items-center justify-center gap-1.5 font-mono">
          <Lock className="h-3 w-3 text-gold" />
          <span>Conexión protegida con TLS 1.3 & HSTS</span>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-base flex flex-col justify-between p-4 sm:p-6 text-text">
      {/* Navbar Superior */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between py-2">
        <Link href="/" aria-label="Volver a la portada de Jerovia">
          <Logo size="md" />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="text-xs font-semibold text-subtext0 hover:text-text px-3 py-1.5 rounded-xl border border-white/[0.08] transition-colors"
          >
            Volver a inicio
          </Link>
        </div>
      </header>

      {/* Contenedor Central */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        <Suspense fallback={<div className="h-96 rounded-3xl glass-panel animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </main>

      {/* Footer Mínimo */}
      <footer className="max-w-7xl mx-auto w-full text-center py-4 text-[11px] text-subtext0 border-t border-white/[0.08] font-mono">
        Jerovia Consultora · Evaluaciones Socioambientales y de Confiabilidad · Asunción, Paraguay
      </footer>
    </div>
  );
}
