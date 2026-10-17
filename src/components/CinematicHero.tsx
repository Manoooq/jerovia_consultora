"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandPalette } from "@/components/CommandPalette";
import {
  Play,
  Sparkles,
  Award,
  Loader2,
  Menu,
  X,
  Lock,
} from "lucide-react";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=2000&q=85";

const LAUREL_BADGES = [
  {
    top: "Verificación Presencial",
    main: "GEORREFERENCIACIÓN GPS",
    sub: "Constatación In Situ",
  },
  {
    top: "Entregable Comité",
    main: "DOSSIER EN 5 LÁMINAS",
    sub: "Formato .PPTX & PDF A4",
  },
  {
    top: "Alcance Operativo",
    main: "COBERTURA NACIONAL",
    sub: "Asunción · Central · Interior",
  },
];

export function CinematicHero() {
  const [heroImage, setHeroImage] = useState<string>(DEFAULT_HERO_IMAGE);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("jerovia-michelle-hero");
    if (saved) setHeroImage(saved);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const el = bgRef.current;
    if (!el || window.innerWidth < 1024) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const nx = (clientX / window.innerWidth - 0.5) * -14;
      const ny = (clientY / window.innerHeight - 0.5) * -10;
      el.style.transform = `scale(1.04) translate3d(${nx.toFixed(1)}px, ${ny.toFixed(1)}px, 0)`;
    });
  }

  function handleMouseLeave() {
    const el = bgRef.current;
    if (!el) return;
    el.style.transform = "scale(1.02) translate3d(0px, 0px, 0)";
  }

  async function handleNanoBananaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setGeneratingAi(true);
    setAiNotice(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch("/api/ai/nano-banana", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || "image/jpeg",
          }),
        });
        const data = await res.json();
        if (data.imageUrl) {
          setHeroImage(data.imageUrl);
          try {
            localStorage.setItem("jerovia-michelle-hero", data.imageUrl);
          } catch {}
          setAiNotice(
            data.generated
              ? "Retrato corporativo generado con Nano Banana."
              : data.notice || "Imagen de portada actualizada."
          );
          setTimeout(() => setAiNotice(null), 4000);
        }
      } catch {
        setHeroImage(base64);
      } finally {
        setGeneratingAi(false);
      }
    };
    reader.readAsDataURL(file);
  }

  const navLinks = [
    { href: "#showcase", label: "Dossier" },
    { href: "#capacidades", label: "Método" },
    { href: "#simulador", label: "Aranceles" },
    { href: "#cobertura", label: "Cobertura" },
  ];

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Portada oficial Jerovia Consultora"
      className="relative w-full min-h-[100dvh] p-0 sm:p-4 lg:p-6 flex items-center justify-center select-none"
    >
      {/* Marco Editorial Principal (Inspirado en tu referencia 'El paseo') */}
      <div className="relative w-full max-w-[1400px] min-h-[100dvh] sm:min-h-[88dvh] sm:rounded-3xl overflow-hidden shadow-[0_30px_90px_-15px_rgba(6,15,38,0.5)] border border-white/15 flex flex-col justify-between bg-[#0b1528] text-white">
        {/* 1. Única Imagen Principal Empresarial con Paralaje Suave */}
        <div
          ref={bgRef}
          style={{
            transform: "scale(1.02) translate3d(0px, 0px, 0)",
            backgroundImage: `url('${heroImage}')`,
          }}
          className="pointer-events-none absolute inset-0 z-0 bg-cover bg-[center_top] bg-no-repeat transition-transform duration-500 ease-out will-change-transform"
        />

        {/* Gradiente Editorial Azul Cobalto / Pizarra para máxima legibilidad */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#071124]/90 via-[#0b1d3a]/55 to-[#071124]/75"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#050b18]/90 via-transparent to-[#050b18]/60"
        />

        {/* 2. Barra Superior Interna del Marco Editorial */}
        <header className="relative z-30 px-6 sm:px-12 pt-6 sm:pt-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="hidden sm:inline-block text-xs font-semibold tracking-wider text-white/80 border-l border-white/25 pl-3">
              Sitio oficial
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-white/90">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hover:text-[#60a5fa] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Input oculto para transformar foto de Michelle con Nano Banana */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleNanoBananaUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={generatingAi}
              className="hidden sm:inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-bold text-white transition-all cursor-pointer"
              title="Subir foto de Michelle para generar retrato corporativo con Nano Banana IA"
            >
              {generatingAi ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#60a5fa]" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-[#60a5fa]" />
              )}
              <span>{generatingAi ? "Generando IA..." : "Retrato IA"}</span>
            </button>

            <CommandPalette variant="hero-icon" />
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-9 w-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white cursor-pointer"
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* Menú desplegable en celular */}
        {mobileMenuOpen && (
          <div className="relative z-30 md:hidden mx-6 mt-3 rounded-2xl bg-[#091326]/95 border border-white/20 p-4 space-y-3 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl bg-white/10 text-xs font-bold text-white"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t border-white/15">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  fileInputRef.current?.click();
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/15 text-xs font-bold text-white flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#60a5fa]" />
                <span>Retrato IA</span>
              </button>
              <Link
                href="/login"
                className="flex-1 py-2.5 rounded-xl bg-[#2563eb] text-xs font-bold text-white flex items-center justify-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Login</span>
              </Link>
            </div>
          </div>
        )}

        {/* 3. Cuerpo Central Asimétrico (Igual a la composición de 'El paseo') */}
        <div className="relative z-20 px-6 sm:px-12 my-auto py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Izquierda: Firma cursiva + Gran Título + 2 Botones limpios */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 space-y-5"
          >
            <p className="font-serif italic text-base sm:text-lg text-blue-200 tracking-wide">
              Dirección General · Lic. Michelle Romero
            </p>

            <h1 className="text-5xl sm:text-7xl lg:text-[82px] font-black tracking-tight leading-[0.96] text-white drop-shadow-sm">
              Jerovia
              <br />
              Consultora
            </h1>

            <p className="text-sm sm:text-base font-medium text-blue-100/90 max-w-md pt-1">
              Verificación domiciliaria y estudios socioambientales en Paraguay
            </p>

            {aiNotice && (
              <p className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-400/30 px-3 py-1.5 rounded-lg inline-block">
                ✓ {aiNotice}
              </p>
            )}

            {/* Dos botones estilo 'El paseo': Botón circular + Botón píldora blanco */}
            <div className="flex flex-wrap items-center gap-5 pt-3">
              <a
                href="#showcase"
                className="group inline-flex items-center gap-3 text-sm font-bold text-white hover:text-[#60a5fa] transition-colors"
              >
                <span className="h-12 w-12 rounded-full border border-white/60 group-hover:border-[#60a5fa] group-hover:bg-white/10 flex items-center justify-center transition-all">
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                </span>
                <span>Explorar Dossier</span>
              </a>

              <Link
                href="/login"
                className="min-h-[48px] px-8 rounded-full bg-white hover:bg-blue-50 text-[#0a1428] font-extrabold text-sm flex items-center justify-center shadow-xl transition-transform active:scale-95"
              >
                Portal Evaluadores
              </Link>
            </div>
          </motion.div>

          {/* Derecha: 3 Sellos Institucionales Limpios (Como los laureles de la derecha en 'El paseo') */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center gap-6"
          >
            {LAUREL_BADGES.map((b) => (
              <div
                key={b.main}
                className="w-full sm:w-64 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 px-5 py-3.5 text-center transition-all"
              >
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-blue-200">
                  <Award className="h-3.5 w-3.5 text-[#60a5fa]" />
                  <span>{b.top}</span>
                </div>
                <p className="text-xs sm:text-sm font-black tracking-wider text-white mt-0.5">
                  {b.main}
                </p>
                <p className="text-[11px] font-medium text-blue-100/80 mt-0.5">
                  {b.sub}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 4. Barra Inferior Minimalista del Marco Editorial */}
        <div className="relative z-20 px-6 sm:px-12 pb-6 sm:pb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/75">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/entrevista/demo" className="hover:text-white underline underline-offset-4">
              Probar Cuestionario Demo
            </Link>
            <span>•</span>
            <a href="#simulador" className="hover:text-white">
              Simulador de Aranceles
            </a>
            <span>•</span>
            <span className="text-white/60">© 2026 Jerovia Consultora</span>
          </div>

          <div className="font-mono text-[11px] text-blue-200 uppercase tracking-widest">
            Asunción · República del Paraguay
          </div>
        </div>
      </div>
    </section>
  );
}
