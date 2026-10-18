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
      className="relative z-10 w-full min-h-[86vh] overflow-hidden flex flex-col justify-between gap-10 py-6 sm:py-10 select-none bg-[#232f1e] text-white border-b border-[#85987a]/35 shadow-xl"
    >
      <div
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=85')",
          backgroundPosition: "center center",
        }}
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-no-repeat opacity-40"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#192215]/95 via-[#2c3b25]/88 to-[#1f2a1b]/92"
      />

      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 flex items-center justify-between gap-4">
        <a href="#" aria-label="Jerovia Consultora Inicio" className="shrink-0">
          <Logo size="sm" variant="cover" className="sm:hidden" />
          <Logo size="md" variant="cover" className="hidden sm:inline-flex" />
        </a>

        <nav className="hidden lg:flex items-center gap-9 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f4f6f2]">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-[#b4c6aa] transition-colors py-1"
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
            className="hidden sm:inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#536c45] hover:bg-[#485536] border border-[#85987a]/70 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-md transition-all"
          >
            <Lock className="h-4 w-4 text-[#d5ddd1]" />
            <span>Portal Evaluadores</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-10 w-10 rounded-xl bg-[#536c45]/90 border border-[#85987a]/50 flex items-center justify-center text-white cursor-pointer"
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="relative z-30 lg:hidden mx-4 rounded-2xl bg-[#1c2519]/95 border border-[#85987a]/40 p-4 space-y-3 backdrop-blur-xl">
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
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/15">
            <Link
              href="/entrevista/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 rounded-xl bg-white/15 text-xs font-bold text-white flex items-center justify-center"
            >
              Cuestionario Demo
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 rounded-xl bg-[#536c45] text-xs font-bold text-white flex items-center justify-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Evaluadores</span>
            </Link>
          </div>
        </div>
      )}

      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 my-auto py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 space-y-5 sm:space-y-6"
        >
          <p className="font-serif italic text-base sm:text-xl text-[#d5ddd1] tracking-wide">
            Dirección General · Lic. Michelle Romero
          </p>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] text-white drop-shadow-md">
            Jerovia Consultora
          </h1>

          <p className="text-sm sm:text-lg font-medium text-[#e2e8de] max-w-xl leading-relaxed">
            Verificación domiciliaria presencial e informes socioambientales ejecutivos en Paraguay.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Link
              href="/login"
              className="min-h-[48px] px-7 rounded-xl bg-[#f4f6f2] hover:bg-white text-[#1a2216] font-extrabold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-xl transition-transform active:scale-95"
            >
              <Lock className="h-4 w-4 text-[#536c45]" />
              <span>Portal Evaluadores</span>
            </Link>

            <Link
              href="/entrevista/demo"
              className="min-h-[48px] px-6 rounded-xl bg-[#536c45] hover:bg-[#485536] border border-[#85987a] text-white font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <FileSpreadsheet className="h-4 w-4 text-[#d5ddd1]" />
              <span>Probar Cuestionario Demo</span>
            </Link>

            <a
              href="#showcase"
              className="min-h-[48px] px-5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 transition-all"
            >
              <Play className="h-4 w-4 fill-current text-[#b4c6aa]" />
              <span>Explorar Dossier</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 hidden sm:flex flex-col items-start lg:items-end justify-center gap-4"
        >
          {LAUREL_BADGES.map((b) => (
            <div
              key={b.main}
              className="w-72 rounded-2xl bg-[#1c2519]/90 hover:bg-[#243021] backdrop-blur-md border border-[#85987a]/55 px-5 py-3.5 text-center transition-all shadow-lg"
            >
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#b4c6aa]">
                <Award className="h-4 w-4 text-[#85987a]" />
                <span>{b.top}</span>
              </div>
              <p className="text-sm sm:text-base font-black tracking-wider text-white mt-1">
                {b.main}
              </p>
              <p className="text-xs font-medium text-[#d5ddd1] mt-0.5">
                {b.sub}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
