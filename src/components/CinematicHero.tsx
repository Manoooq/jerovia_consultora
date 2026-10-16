"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";

interface HeroScene {
  id: string;
  title: string;
  subtitleLink: string;
  targetHref: string;
  locationTag: string;
  coords: string;
  statusText: string;
  imageUrl: string;
}

const SCENES: HeroScene[] = [
  {
    id: "residencial",
    title: "Verificación Domiciliaria",
    subtitleLink: "Explorar consola pericial y protocolo de 9 módulos",
    targetHref: "#showcase",
    locationTag: "Asunción & Gran Asunción",
    coords: "-25.2867° S, -57.6470° O",
    statusText: "Constatación presencial georreferenciada",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: "socioambiental",
    title: "Estudios Socioambientales",
    subtitleLink: "Ver estructura del informe ejecutivo en 5 láminas (.PPTX y PDF)",
    targetHref: "#capacidades",
    locationTag: "Cobertura Nacional • Paraguay",
    coords: "Plus Code + Registro Fotográfico",
    statusText: "Entregables listos para comité en < 24 hs",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: "corporativo",
    title: "Aranceles y Cobertura",
    subtitleLink: "Calcular presupuesto instantáneo por zona y urgencia",
    targetHref: "#simulador",
    locationTag: "Central • Alto Paraná • Itapúa",
    coords: "100% Trazabilidad en Campo",
    statusText: "Plataforma optimizada para celulares y escritorio",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85",
  },
];

export function CinematicHero() {
  const [activeScene, setActiveScene] = useState(0);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Rotación serena entre las 3 escenas cada 8 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % SCENES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Efecto de paralaje suave con el cursor (60 FPS sin re-renderizar React)
  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const el = bgRef.current;
    if (!el || window.innerWidth < 1024) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const nx = (clientX / window.innerWidth - 0.5) * -18;
      const ny = (clientY / window.innerHeight - 0.5) * -12;
      el.style.transform = `scale(1.05) translate3d(${nx.toFixed(1)}px, ${ny.toFixed(1)}px, 0)`;
    });
  }

  function handleMouseLeave() {
    const el = bgRef.current;
    if (!el) return;
    el.style.transform = "scale(1.03) translate3d(0px, 0px, 0)";
  }

  const scene = SCENES[activeScene];

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Presentación principal Jerovia Consultora"
      className="relative h-[100dvh] min-h-[620px] w-full overflow-hidden flex flex-col justify-between select-none bg-[#070b14] text-white"
    >
      {/* 1. Escena de Fondo Cinematográfica con Fallback Arquitectónico Integrado */}
      <div
        ref={bgRef}
        style={{ transform: "scale(1.03) translate3d(0px, 0px, 0)" }}
        className="pointer-events-none absolute inset-0 z-0 transition-transform duration-500 ease-out will-change-transform"
      >
        {/* Ilustración arquitectónica/geoespacial base en caso de modo sin internet */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0b1528] via-[#0f1e36] to-[#060911]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 65%, rgba(245, 196, 81, 0.18), transparent 55%), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "100% 100%, 48px 48px, 48px 48px",
          }}
        />

        {/* Fotografía Arquitectónica Residencial con transición suave */}
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.imageUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${scene.imageUrl}')`,
            }}
          />
        </AnimatePresence>

        {/* Gradientes cinematográficos para legibilidad perfecta arriba y abajo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(4,6,11,0.65)_100%)]" />
      </div>

      {/* 2. Bloque Superior Central (Título prominente + Subtítulo subrayado estilo Tesla) */}
      <div className="relative z-20 pt-24 sm:pt-28 md:pt-32 px-4 text-center flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-2.5 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-6xl md:text-[64px] font-bold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)] leading-[1.05]">
              {scene.title}
            </h1>

            <div>
              <a
                href={scene.targetHref}
                className="inline-block text-xs sm:text-base font-medium text-white/95 underline underline-offset-[6px] decoration-white/80 hover:decoration-[#f5c451] hover:text-[#f5c451] transition-colors drop-shadow"
              >
                {scene.subtitleLink}
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. HUD de Telemetría Discreto en el Centro-Inferior (Identidad Jerovia) */}
      <div className="relative z-20 my-auto pointer-events-none flex justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="hidden sm:inline-flex items-center gap-4 rounded-full bg-black/45 backdrop-blur-md border border-white/15 px-5 py-2 text-xs text-white/90 shadow-2xl"
        >
          <span className="flex items-center gap-1.5 font-semibold text-[#f5c451]">
            <MapPin className="h-3.5 w-3.5" />
            {scene.locationTag}
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span className="font-mono text-[11px] text-white/85 tabular-nums">
            {scene.coords}
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {scene.statusText}
          </span>
        </motion.div>
      </div>

      {/* 4. Bloque Inferior Central (Dos botones gemelos + Selector de escena + Flecha Scroll) */}
      <div className="relative z-20 pb-7 sm:pb-10 px-4 sm:px-6 flex flex-col items-center gap-5">
        {/* Botones gemelos estilo Tesla adaptados a móvil y PC */}
        <div className="w-full max-w-xl flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/entrevista/demo"
            className="w-full sm:w-64 min-h-[44px] rounded-md bg-white/95 hover:bg-white text-[#090d16] font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-all active:scale-[0.98]"
          >
            Probar Cuestionario Demo
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-64 min-h-[44px] rounded-md bg-[#171a20]/85 hover:bg-[#171a20] text-white font-bold text-xs sm:text-sm tracking-wide border border-white/20 backdrop-blur-md flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-all active:scale-[0.98]"
          >
            Portal de Evaluadores
          </Link>
        </div>

        {/* Indicadores de escena + Botón para bajar a los paneles interactivos */}
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-2" role="tablist" aria-label="Cambiar escena">
            {SCENES.map((s, idx) => {
              const active = idx === activeScene;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={s.title}
                  onClick={() => setActiveScene(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    active
                      ? "w-7 bg-[#f5c451]"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              );
            })}
          </div>

          <a
            href="#showcase"
            aria-label="Deslizar hacia abajo para ver la plataforma interactiva"
            className="group flex flex-col items-center gap-0.5 text-[11px] font-mono uppercase tracking-widest text-white/75 hover:text-[#f5c451] transition-colors pt-1"
          >
            <span>Deslizar al Sistema</span>
            <ChevronDown className="h-4 w-4 animate-bounce text-[#f5c451]" />
          </a>
        </div>
      </div>
    </section>
  );
}
