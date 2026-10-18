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
  Smartphone,
  ExternalLink,
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
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [previewPath, setPreviewPath] = useState<"/" | "/entrevista/demo" | "/login">("/");

  const bgRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const mouseOffset = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    let rafId: number;
    let smoothScrollY = window.scrollY;

    function renderLoop() {
      const targetScrollY = window.scrollY;
      smoothScrollY += (targetScrollY - smoothScrollY) * 0.14;

      mouseOffset.current.x +=
        (mouseOffset.current.targetX - mouseOffset.current.x) * 0.08;
      mouseOffset.current.y +=
        (mouseOffset.current.targetY - mouseOffset.current.y) * 0.08;

      const vh = window.innerHeight || 800;
      const progress = Math.min(Math.max(smoothScrollY / (vh * 0.88), 0), 1);
      const eased = progress * progress * (3 - 2 * progress);

      if (bgRef.current) {
        const tx = mouseOffset.current.x.toFixed(1);
        const ty = (mouseOffset.current.y + smoothScrollY * 0.16).toFixed(1);
        const opacity = Math.max(0.08, 1 - eased * 0.88).toFixed(3);
        bgRef.current.style.opacity = opacity;
        bgRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.03)`;
      }

      if (contentRef.current && window.innerWidth >= 768) {
        const cOpacity = Math.max(0, 1 - eased * 1.15).toFixed(3);
        const cTy = (smoothScrollY * 0.1).toFixed(1);
        contentRef.current.style.opacity = cOpacity;
        contentRef.current.style.transform = `translate3d(0px, -${cTy}px, 0)`;
      }

      rafId = requestAnimationFrame(renderLoop);
    }

    rafId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (window.innerWidth < 1024) return;
    mouseOffset.current.targetX = (e.clientX / window.innerWidth - 0.5) * -12;
    mouseOffset.current.targetY = (e.clientY / window.innerHeight - 0.5) * -8;
  }

  function handleMouseLeave() {
    mouseOffset.current.targetX = 0;
    mouseOffset.current.targetY = 0;
  }

  const navLinks = [
    { href: "#showcase", label: "Dossier" },
    { href: "#capacidades", label: "Método" },
    { href: "#simulador", label: "Aranceles" },
    { href: "#cobertura", label: "Cobertura" },
  ];

  return (
    <>
      <section
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label="Portada corporativa Jerovia Consultora"
        className="relative z-10 w-full min-h-[100dvh] h-auto pb-20 sm:pb-24 overflow-hidden flex flex-col justify-between gap-6 select-none bg-[#232f1e] text-white"
      >
        {/* 1. Imagen Corporativa Arquitectónica */}
        <div
          ref={bgRef}
          style={{
            transform: "translate3d(0px, 0px, 0) scale(1.03)",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=85')",
            backgroundPosition: "center center",
          }}
          className="pointer-events-none absolute inset-0 z-0 bg-cover bg-no-repeat will-change-[transform,opacity]"
        />

        {/* Capas atmosféricas en Verde Oliva (#536c45 y #485536) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#1d2719]/92 via-[#38492f]/75 to-[#253120]/85"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#161e13]/70 via-transparent to-transparent"
        />

        {/* Degradado Inferior Suave Restaurado */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-44 z-20"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, color-mix(in srgb, var(--bg-base) 45%, transparent) 55%, var(--bg-base) 100%)",
          }}
        />

        {/* 2. Barra Superior Responsiva (Sin apretarse en celulares) */}
        <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-10 pt-4 sm:pt-7 flex items-center justify-between gap-2">
          <a href="#" aria-label="Jerovia Consultora Inicio" className="shrink-0">
            <Logo size="sm" variant="cover" className="sm:hidden" />
            <Logo size="md" variant="cover" className="hidden sm:inline-flex" />
          </a>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-[#f4f6f2]">
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

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Botón Simulador "Vista Celular" para previsualizar el móvil desde la PC */}
            <button
              type="button"
              onClick={() => setMobilePreviewOpen(true)}
              className="hidden md:inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white transition-all cursor-pointer"
              title="Previsualizar cómo se ve en un teléfono celular"
            >
              <Smartphone className="h-3.5 w-3.5 text-[#d5ddd1]" />
              <span>Vista Celular</span>
            </button>

            <CommandPalette variant="hero-icon" />
            <ThemeToggle />

            <Link
              href="/login"
              className="hidden sm:inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#536c45] hover:bg-[#485536] border border-[#85987a]/60 px-4 py-1.5 text-xs font-bold text-white shadow-md transition-all"
            >
              <Lock className="h-3.5 w-3.5 text-[#d5ddd1]" />
              <span>Portal Evaluadores</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#536c45]/90 border border-[#85987a]/50 flex items-center justify-center text-white cursor-pointer"
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Menú móvil desplegable */}
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

        {/* 3. Cuerpo Central Adaptado para Móvil y Escritorio (Sin encimarse) */}
        <div
          ref={contentRef}
          className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-10 py-4 sm:py-8 my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-3.5 sm:space-y-5"
          >
            <p className="font-serif italic text-sm sm:text-xl text-[#d5ddd1] tracking-wide">
              Dirección General · Lic. Michelle Romero
            </p>

            <h1 className="text-4xl sm:text-7xl lg:text-[84px] font-black tracking-tight leading-[0.96] text-white drop-shadow-md">
              Jerovia
              <br />
              Consultora
            </h1>

            <p className="text-xs sm:text-base font-medium text-[#e2e8de] max-w-md pt-0.5 leading-relaxed">
              Verificación domiciliaria presencial e informes socioambientales ejecutivos en Paraguay.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 pt-2">
              <Link
                href="/login"
                className="min-h-[46px] px-7 rounded-full bg-[#f4f6f2] hover:bg-white text-[#1a2216] font-extrabold text-xs sm:text-sm flex items-center justify-center shadow-xl transition-transform active:scale-95"
              >
                Portal Evaluadores
              </Link>

              <a
                href="#showcase"
                className="min-h-[44px] group inline-flex items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm font-bold text-white hover:text-[#d5ddd1] transition-colors"
              >
                <span className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-[#85987a] bg-[#536c45]/50 group-hover:bg-[#536c45] flex items-center justify-center transition-all shrink-0">
                  <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current ml-0.5" />
                </span>
                <span>Explorar Dossier</span>
              </a>
            </div>

            {/* Sellos compactos en fila para pantallas de celular */}
            <div className="grid grid-cols-3 gap-2 pt-2 sm:hidden">
              <div className="rounded-xl bg-[#1c2519]/80 border border-[#85987a]/40 p-2 text-center">
                <p className="text-[10px] font-black text-white">GPS IN SITU</p>
                <p className="text-[9px] text-[#d5ddd1]">Verificado</p>
              </div>
              <div className="rounded-xl bg-[#1c2519]/80 border border-[#85987a]/40 p-2 text-center">
                <p className="text-[10px] font-black text-white">5 PÁGINAS</p>
                <p className="text-[9px] text-[#d5ddd1]">PDF & PPTX</p>
              </div>
              <div className="rounded-xl bg-[#1c2519]/80 border border-[#85987a]/40 p-2 text-center">
                <p className="text-[10px] font-black text-white">PARAGUAY</p>
                <p className="text-[9px] text-[#d5ddd1]">Cobertura</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 hidden sm:flex flex-col items-start lg:items-end justify-center gap-4"
          >
            {LAUREL_BADGES.map((b) => (
              <div
                key={b.main}
                className="w-64 rounded-2xl bg-[#1c2519]/80 hover:bg-[#243021]/90 backdrop-blur-md border border-[#85987a]/45 px-5 py-3 text-center transition-all shadow-lg"
              >
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#b4c6aa]">
                  <Award className="h-3.5 w-3.5 text-[#85987a]" />
                  <span>{b.top}</span>
                </div>
                <p className="text-xs sm:text-sm font-black tracking-wider text-white mt-0.5">
                  {b.main}
                </p>
                <p className="text-[11px] font-medium text-[#d5ddd1] mt-0.5">
                  {b.sub}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 4. Barra Inferior de Enlaces Rápidos */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-10 pt-1 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-4 drop-shadow">
            <Link
              href="/entrevista/demo"
              className="font-bold text-white hover:text-[#d5ddd1] underline underline-offset-4"
            >
              Ver Ficha Demo (Stefanie Lovera)
            </Link>
            <span className="hidden sm:inline text-white/50">|</span>
            <span className="hidden sm:inline font-medium text-[#e2e8de]">
              Asunción, Paraguay
            </span>
          </div>

          <a
            href="#showcase"
            aria-label="Deslizar hacia abajo"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-white hover:text-[#d5ddd1] transition-colors drop-shadow"
          >
            <span>Deslizar</span>
            <ChevronDown className="h-4 w-4 animate-bounce text-[#b4c6aa]" />
          </a>
        </div>
      </section>

      {/* MODAL SIMULADOR DE VISTA CELULAR EN VIVO (390 x 844 px) */}
      {mobilePreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setMobilePreviewOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-3 max-h-[96vh]"
          >
            {/* Controles del Simulador Móvil */}
            <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-[410px] px-4 py-2.5 rounded-2xl bg-[#1c2519] border border-[#85987a]/50 text-white text-xs">
              <div className="flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-[#85987a]" />
                <span className="font-bold">Vista Celular (390×844)</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewPath("/")}
                  className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                    previewPath === "/" ? "bg-[#536c45] text-white" : "text-[#d5ddd1] hover:bg-white/10"
                  }`}
                >
                  Portada
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPath("/entrevista/demo")}
                  className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                    previewPath === "/entrevista/demo"
                      ? "bg-[#536c45] text-white"
                      : "text-[#d5ddd1] hover:bg-white/10"
                  }`}
                >
                  Link Postulante
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPath("/login")}
                  className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                    previewPath === "/login" ? "bg-[#536c45] text-white" : "text-[#d5ddd1] hover:bg-white/10"
                  }`}
                >
                  Login
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMobilePreviewOpen(false)}
                className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
                aria-label="Cerrar simulador móvil"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Marco Físico de Teléfono Celular */}
            <div className="relative w-[390px] h-[780px] max-h-[82vh] rounded-[44px] border-[10px] border-[#1a2216] bg-base shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden ring-2 ring-[#85987a]/50">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-28 h-5 rounded-full bg-black/90 pointer-events-none" />
              <iframe
                src={previewPath}
                title="Simulador de Vista Móvil Jerovia"
                className="w-full h-full border-0 bg-base"
              />
            </div>

            <a
              href={previewPath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#d5ddd1] hover:text-white inline-flex items-center gap-1.5"
            >
              <span>Abrir esta vista en pestaña completa</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
