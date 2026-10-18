"use client";

import { useState } from "react";
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
  FileSpreadsheet,
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
    main: "DOSSIER EN 5 PÁGINAS",
    sub: "Formato PDF A4 & .PPTX",
  },
  {
    top: "Alcance Operativo",
    main: "COBERTURA NACIONAL",
    sub: "Asunción · Central · Interior",
  },
];

export function CinematicHero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#showcase", label: "Dossier" },
    { href: "#capacidades", label: "Método" },
    { href: "#simulador", label: "Aranceles" },
    { href: "#cobertura", label: "Cobertura" },
  ];

  return (
    <section
      aria-label="Portada corporativa Jerovia Consultora"
      className="relative z-10 w-full min-h-[88vh] overflow-hidden flex flex-col justify-between gap-8 py-6 sm:py-9 select-none bg-gradient-to-b from-[#edf3eb] via-[#f4f7f2] to-[var(--bg-base)] dark:from-[#0d120c] dark:via-[#141b12] dark:to-[var(--bg-base)] text-text transition-colors duration-300"
    >
      {/* 1. Imagen de fondo con desvanecimiento gradual en máscara para eliminar cualquier línea de corte */}
      <div
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=85')",
          backgroundPosition: "center center",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 95%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 95%)",
        }}
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-no-repeat opacity-25 dark:opacity-35 transition-opacity"
      />

      {/* 2. Capa ambiental adaptativa para modo claro y modo oscuro */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-white/90 via-white/75 to-[#edf3eb]/80 dark:from-[#0d120c]/95 dark:via-[#141b12]/90 dark:to-[#0d120c]/92 transition-colors duration-300"
      />

      {/* 3. Barra de Navegación Superior */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 flex items-center justify-between gap-4">
        <a href="#" aria-label="Jerovia Consultora Inicio" className="shrink-0">
          <Logo size="sm" variant="cover" className="sm:hidden" />
          <Logo size="md" variant="cover" className="hidden sm:inline-flex" />
        </a>

        <nav className="hidden lg:flex items-center gap-9 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#242e21] dark:text-[#f4f6f2]">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-[#3c5030] dark:hover:text-[#a3c293] transition-colors py-1"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <CommandPalette variant="hero-icon" />
          <ThemeToggle />

          <Link
            href="/login"
            className="hidden sm:inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#3c5030] hover:bg-[#2b3a23] dark:bg-[#425736] dark:hover:bg-[#536c45] border border-[#3c5030]/40 dark:border-[#a3c293]/60 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-md transition-all cursor-pointer"
          >
            <Lock className="h-4 w-4 text-white/90" />
            <span>Portal Evaluadores</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-10 w-10 rounded-xl bg-surface0 dark:bg-[#3c5030]/90 border border-overlay1 flex items-center justify-center text-text dark:text-white cursor-pointer"
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="relative z-30 lg:hidden mx-4 rounded-2xl bg-surface0 dark:bg-[#161d14]/95 border border-overlay1 p-4 space-y-3 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl bg-surface1 text-xs font-bold text-text hover:text-gold"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-overlay0">
            <Link
              href="/entrevista/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 rounded-xl bg-surface1 text-xs font-bold text-text flex items-center justify-center"
            >
              Cuestionario Demo
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 rounded-xl bg-[#3c5030] text-xs font-bold text-white flex items-center justify-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Evaluadores</span>
            </Link>
          </div>
        </div>
      )}

      {/* 4. Cuerpo de la Portada Principal */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 my-auto py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 space-y-5 sm:space-y-6"
        >
          <p className="font-serif italic text-base sm:text-xl text-[#3c5030] dark:text-[#a3c293] tracking-wide font-medium">
            Dirección General · Lic. Michelle Romero
          </p>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] text-[#141a12] dark:text-white drop-shadow-xs">
            Jerovia Consultora
          </h1>

          <p className="text-sm sm:text-lg font-medium text-[#2c3727] dark:text-[#dbe0d8] max-w-xl leading-relaxed">
            Verificación domiciliaria presencial e informes socioambientales ejecutivos en Paraguay.
          </p>

          {/* Botones de Acción Adaptables con Alto Contraste en Claro y Oscuro */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-3">
            <Link
              href="/login"
              className="min-h-[48px] px-7 rounded-xl bg-[#3c5030] hover:bg-[#2c3b24] text-white dark:bg-[#f4f6f2] dark:hover:bg-white dark:text-[#141a12] font-black text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 cursor-pointer border border-[#3c5030]/60 dark:border-white"
            >
              <Lock className="h-4 w-4 text-white dark:text-[#3c5030]" />
              <span>Portal Evaluadores</span>
            </Link>

            <Link
              href="/entrevista/demo"
              className="min-h-[48px] px-6 rounded-xl bg-surface0 hover:bg-surface1 text-text border border-overlay1 hover:border-gold font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-gold" />
              <span>Probar Cuestionario Demo</span>
            </Link>

            <a
              href="#showcase"
              className="min-h-[48px] px-5 rounded-xl bg-surface1/80 hover:bg-surface2 text-text border border-overlay0 hover:border-gold font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current text-gold" />
              <span>Explorar Dossier</span>
            </a>
          </div>
        </motion.div>

        {/* Laurel Badges Adaptables */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 hidden sm:flex flex-col items-start lg:items-end justify-center gap-4"
        >
          {LAUREL_BADGES.map((b) => (
            <div
              key={b.main}
              className="w-72 rounded-2xl bg-surface0/90 dark:bg-[#161d14]/90 hover:bg-surface0 dark:hover:bg-[#1e271b] backdrop-blur-md border border-overlay1 dark:border-[#a3c293]/35 px-5 py-3.5 text-center transition-all shadow-md"
            >
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#3c5030] dark:text-[#a3c293]">
                <Award className="h-4 w-4 text-gold" />
                <span>{b.top}</span>
              </div>
              <p className="text-sm sm:text-base font-black tracking-wider text-text dark:text-white mt-1">
                {b.main}
              </p>
              <p className="text-xs font-medium text-subtext0 dark:text-[#a7b3a4] mt-0.5">
                {b.sub}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 5. Degradado arquitectónico inferior 100% transparente que funde suavemente la portada con var(--bg-base) sin ninguna línea de corte */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 sm:h-64 z-20"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, var(--bg-base) 100%)",
        }}
      />

      {/* 6. Barra Inferior de Navegación con Z-Index Superior */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 pb-3 pt-1 flex items-center justify-between text-xs sm:text-sm text-text font-medium">
        <div className="flex items-center gap-4">
          <Link
            href="/entrevista/demo"
            className="font-bold text-gold hover:underline underline-offset-4"
          >
            Probar Cuestionario Demo
          </Link>
          <span className="hidden sm:inline text-subtext0/40">|</span>
          <span className="hidden sm:inline text-subtext1">
            Asunción, Paraguay
          </span>
        </div>

        <a
          href="#showcase"
          aria-label="Deslizar hacia el dossier"
          className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-text hover:text-gold transition-colors cursor-pointer"
        >
          <span>Explorar</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-gold" />
        </a>
      </div>
    </section>
  );
}
