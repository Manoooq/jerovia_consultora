"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  alpha: number;
  isGold: boolean;
}

/**
 * Fondo interactivo de partículas y filamentos (estética Antigravity)
 * optimizado a 60 FPS: usa distancias al cuadrado (sin Math.sqrt en bucles internos),
 * recorte de área en el gradiente del cursor y pausa automática en pestañas inactivas.
 */
export function AntigravityBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 175,
      radiusSq: 175 * 175,
      active: false,
    };

    const isMobile = width < 768;
    const count = prefersReducedMotion ? 18 : isMobile ? 26 : 56;

    const particles: Particle[] = Array.from({ length: count }, () => {
      const baseVx = (Math.random() - 0.5) * 0.28;
      const baseVy = -Math.random() * 0.35 - 0.1;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: baseVx,
        vy: baseVy,
        baseVx,
        baseVy,
        size: Math.random() * 1.8 + 1,
        alpha: Math.random() * 0.45 + 0.2,
        isGold: Math.random() > 0.35,
      };
    });

    function handleResize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function handleMouseMove(e: MouseEvent) {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    }

    function handleMouseLeave() {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    }

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    const maxLinkDist = 118;
    const maxLinkDistSq = maxLinkDist * maxLinkDist;

    function animate() {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      const goldRgb = isDark ? "229, 192, 123" : "146, 108, 21";
      const slateRgb = isDark ? "148, 163, 184" : "71, 85, 105";

      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      // Halo optimizado: solo pinta el cuadro de 480x480 alrededor del cursor, no toda la pantalla
      if (mouse.active && mouse.x > -200) {
        const r = 240;
        const grad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          4,
          mouse.x,
          mouse.y,
          r
        );
        grad.addColorStop(0, `rgba(${goldRgb}, ${isDark ? 0.1 : 0.06})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(mouse.x - r, mouse.y - r, r * 2, r * 2);
      }

      for (let i = 0; i < count; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouse.radiusSq && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (mouse.radius - dist) / mouse.radius;
            const nx = dx / dist;
            const ny = dy / dist;
            p.vx += nx * force * 0.45 - ny * force * 0.12;
            p.vy += ny * force * 0.45 + nx * force * 0.12;
          }

          p.vx += (p.baseVx - p.vx) * 0.04;
          p.vy += (p.baseVy - p.vy) * 0.04;
          p.x += p.vx;
          p.y += p.vy;

          if (p.y < -10) p.y = height + 10;
          else if (p.y > height + 10) p.y = -10;
          if (p.x < -10) p.x = width + 10;
          else if (p.x > width + 10) p.x = -10;

          // Filamento magnético al cursor
          if (distSq < mouse.radiusSq) {
            const cAlpha = (1 - distSq / mouse.radiusSq) * 0.32;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${goldRgb}, ${cAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.isGold ? goldRgb : slateRgb}, ${p.alpha})`;
        ctx.fill();

        // Conexiones entre nodos cercanos usando distancia al cuadrado (sin Math.sqrt)
        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const ldx = p.x - p2.x;
          const ldy = p.y - p2.y;
          const ldistSq = ldx * ldx + ldy * ldy;

          if (ldistSq < maxLinkDistSq) {
            const lineAlpha =
              (1 - ldistSq / maxLinkDistSq) * (isDark ? 0.15 : 0.1);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${
              p.isGold ? goldRgb : slateRgb
            }, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
