"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandPalette } from "@/components/CommandPalette";
import {
  Play,
  Award,
  Menu,
  X,
  Lock,
  ChevronDown,
} from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Desvanecimiento progresivo de la portada al desplazar hacia abajo (cero corte brusco)
  useEffect(() => {
    let scrollRaf: number | null = null;

    function handleScroll() {
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight || 800;
        const progress = Math.min(Math.max(y / (vh * 0.82), 0), 1);

        if (bgRef.current) {
          const opacity = (1 - progress * 0.92).toFixed(3);
          const translateY = (y * 0.28).toFixed(1);
          const blur = (progress * 8).toFixed(1);
          bgRef.current.style.opacity = opacity;
          bgRef.current.style.filter = `blur(${blur}px)`;
          bgRef.current.style.transform = `scale(${(1.02 + progress * 0.05).toFixed(3)}) translate3d(0px, ${translateY}px, 0)`;
        }

        if (contentRef.current) {
          const cOpacity = Math.max(0, 1 - progress * 1.35).toFixed(3);
          const cTranslateY = (y * 0.18).toFixed(1);
          contentRef.current.style.opacity = cOpacity;
          contentRef.current.style.transform = `translate3d(0px, -${cTranslateY}px, 0)`;
        }
      });
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
    };
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const el = bgRef.current;
    if (!el || window.innerWidth < 1024 || window.scrollY > 120) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const nx = (clientX / window.innerWidth - 0.5) * -14;
      const ny = (clientY / window.innerHeight - 0.5) * -10;
      el.style.transform = `scale(1.03) translate3d(${nx.toFixed(1)}px, ${ny.toFixed(1)}px, 0)`;
    });
  }

  function handleMouseLeave() {
    const el = bgRef.current;
    if (!el || window.scrollY > 120) return;
    el.style.transform = "scale(1.02) translate3d(0px, 0px, 0)";
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
      className="relative w-full h-[100dvh] min-h-[640px] overflow-hidden flex flex-col justify-between select-none bg-[#141e15] text-white"
    >
      {/* 1. Retrato Editorial Real de Michelle en Estudio Verde Oliva */}
      <div
        ref={bgRef}
        style={{
          transform: "scale(1.02) translate3d(0px, 0px, 0)",
          backgroundImage: "url('/michelle-hero.webp')",
          backgroundPosition: "center center",
        }}
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-no-repeat transition-transform duration-300 ease-out will-change-[transform,opacity,filter]"
      />

      {/* Capas atmosféricas en Verde Oliva Profundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#0a120b]/90 via-[#152316]/45 to-[#0a120b]/78"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#070c07]/70 via-transparent to-transparent"
      />

      {/* Máscara de Desvanecimiento Inferior Continua hacia el fondo de la página (--bg-base) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 sm:h-56 z-20"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, var(--bg-base) 100%)",
        }}
      />

      {/* 2. Barra Superior con el Logo Original de Jerovia */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-6 sm:pt-7 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 brightness-110 contrast-125 drop-shadow-md">
          <Logo size="md" />
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-white/90">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-[#a3e635] transition-colors py-1"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <CommandPalette variant="hero-icon" />
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden sm:inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#4d7c0f]/90 hover:bg-[#65a30d] border border-[#a3e635]/40 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-white shadow-md transition-all"
          >
            <Lock className="h-3.5 w-3.5 text-[#d9f99d]" />
            <span>Acceso</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-10 w-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white cursor-pointer"
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="relative z-30 md:hidden mx-6 mt-2 rounded-2xl bg-[#0d160e]/95 border border-white/20 p-4 space-y-3 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 text-xs font-bold text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-2.5 rounded-xl bg-[#4d7c0f] text-xs font-bold text-white flex items-center justify-center gap-1.5"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Portal Evaluadores</span>
          </Link>
        </div>
      )}

      {/* 3. Cuerpo Central Editorial con Desvanecimiento Sincronizado al Scroll */}
      <div
        ref={contentRef}
        className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center will-change-[transform,opacity]"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:col-span-7 space-y-5"
        >
          <p className="font-serif italic text-base sm:text-xl text-[#d9f99d] tracking-wide">
            Dirección General · Lic. Michelle Romero
          </p>

          <h1 className="text-5xl sm:text-7xl lg:text-[84px] font-black tracking-tight leading-[0.94] text-white drop-shadow-md">
            Jerovia
            <br />
            Consultora
          </h1>

          <p className="text-sm sm:text-base font-medium text-stone-100/90 max-w-md pt-1">
            Verificación domiciliaria presencial e informes socioambientales ejecutivos.
          </p>

          <div className="flex flex-wrap items-center gap-5 pt-3">
            <a
              href="#showcase"
              className="group inline-flex items-center gap-3 text-sm font-bold text-white hover:text-[#a3e635] transition-colors"
            >
              <span className="h-12 w-12 rounded-full border border-white/60 group-hover:border-[#a3e635] group-hover:bg-white/10 flex items-center justify-center transition-all">
                <Play className="h-4 w-4 fill-current ml-0.5" />
              </span>
              <span>Ver Dossier</span>
            </a>

            <Link
              href="/login"
              className="min-h-[48px] px-8 rounded-full bg-white hover:bg-[#ecfccb] text-[#111a10] font-extrabold text-sm flex items-center justify-center shadow-xl transition-transform active:scale-95"
            >
              Portal Evaluadores
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
          className="lg:col-span-5 hidden sm:flex flex-col items-start lg:items-end justify-center gap-5"
        >
          {LAUREL_BADGES.map((b) => (
            <div
              key={b.main}
              className="w-64 rounded-2xl bg-black/30 hover:bg-black/40 backdrop-blur-md border border-white/20 px-5 py-3.5 text-center transition-all"
            >
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#bef264]">
                <Award className="h-3.5 w-3.5" />
                <span>{b.top}</span>
              </div>
              <p className="text-xs sm:text-sm font-black tracking-wider text-white mt-0.5">
                {b.main}
              </p>
              <p className="text-[11px] font-medium text-stone-200/85 mt-0.5">
                {b.sub}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 4. Pie de Portada sobre el Gradiente de Fusión */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-6 sm:pb-8 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <Link
            href="/entrevista/demo"
            className="font-bold text-text hover:text-gold underline underline-offset-4"
          >
            Probar Cuestionario Demo
          </Link>
          <span className="hidden sm:inline text-subtext0">|</span>
          <span className="hidden sm:inline font-medium text-subtext1">
            Asunción, Paraguay
          </span>
        </div>

        <a
          href="#showcase"
          aria-label="Deslizar hacia abajo"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-gold hover:opacity-80 transition-opacity"
        >
          <span>Deslizar</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
