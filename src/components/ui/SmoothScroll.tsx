"use client";

import { useEffect } from "react";

/**
 * Motor de desplazamiento suave (Inertial Lerp + Eased Anchor Scroll)
 * Elimina los saltos bruscos de la rueda del ratón y suaviza los enlaces internos (#).
 */
export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let isAnimating = false;
    let rafId: number | null = null;

    function clampTarget(y: number) {
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      return Math.min(Math.max(0, y), maxScroll);
    }

    function step() {
      const diff = targetY - currentY;
      if (Math.abs(diff) < 0.45) {
        currentY = targetY;
        window.scrollTo(0, Math.round(currentY));
        isAnimating = false;
        rafId = null;
        return;
      }

      // Factor de amortiguación suave (0.095 = deslizamiento sedoso sin latencia)
      currentY += diff * 0.095;
      window.scrollTo(0, currentY);
      rafId = requestAnimationFrame(step);
    }

    function startLoop() {
      if (!isAnimating) {
        isAnimating = true;
        rafId = requestAnimationFrame(step);
      }
    }

    function handleWheel(e: WheelEvent) {
      // No interceptar zoom con Ctrl o contenedores internos con scroll propio
      if (e.ctrlKey || e.metaKey) return;

      const target = e.target as HTMLElement | null;
      if (target) {
        const scrollableParent = target.closest(
          "[data-scrollable='true'], .overflow-y-auto, textarea, select"
        );
        if (scrollableParent) return;
      }

      // Solo suavizar ruedas de ratón discretas o desplazamientos verticales
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      e.preventDefault();
      if (!isAnimating) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }

      const delta =
        e.deltaMode === 1
          ? e.deltaY * 36
          : e.deltaMode === 2
          ? e.deltaY * window.innerHeight
          : e.deltaY;

      targetY = clampTarget(targetY + delta * 0.92);
      startLoop();
    }

    function handleAnchorClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest("a[href^='#']");
      if (!el) return;
      const href = el.getAttribute("href");
      if (!href) return;

      if (href === "#") {
        e.preventDefault();
        currentY = window.scrollY;
        targetY = 0;
        startLoop();
        return;
      }

      const dest = document.querySelector(href);
      if (dest) {
        e.preventDefault();
        currentY = window.scrollY;
        const rect = dest.getBoundingClientRect();
        targetY = clampTarget(window.scrollY + rect.top - 32);
        startLoop();
      }
    }

    function handleNativeScroll() {
      if (!isAnimating) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("click", handleAnchorClick);
    window.addEventListener("scroll", handleNativeScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("scroll", handleNativeScroll);
    };
  }, []);

  return null;
}
