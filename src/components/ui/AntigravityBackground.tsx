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

export function AntigravityBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 190,
      active: false,
    };

    const particleCount = prefersReducedMotion ? 25 : Math.min(85, Math.floor((width * height) / 16000));
    const particles: Particle[] = Array.from({ length: particleCount }, () => {
      const baseVx = (Math.random() - 0.5) * 0.35;
      const baseVy = -Math.random() * 0.45 - 0.15; // Flotación antigravedad hacia arriba
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: baseVx,
        vy: baseVy,
        baseVx,
        baseVy,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.55 + 0.2,
        isGold: Math.random() > 0.32,
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

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      const goldRgb = isDark ? "229, 192, 123" : "146, 108, 21";
      const slateRgb = isDark ? "148, 163, 184" : "71, 85, 105";

      // Interpolación suave del cursor
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      // Halo ambiental reactivo al cursor
      if (mouse.active && mouse.x > 0) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 360);
        grad.addColorStop(0, `rgba(${goldRgb}, ${isDark ? 0.11 : 0.07})`);
        grad.addColorStop(0.5, `rgba(${goldRgb}, ${isDark ? 0.03 : 0.02})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // Física de repulsión / órbita antigravedad frente al cursor
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            // Empuje radial + leve rotación tangencial
            p.vx += Math.cos(angle) * force * 0.55 + Math.cos(angle + Math.PI / 2) * force * 0.15;
            p.vy += Math.sin(angle) * force * 0.55 + Math.sin(angle + Math.PI / 2) * force * 0.15;
          }

          // Retorno elástico a su velocidad base antigravedad
          p.vx += (p.baseVx - p.vx) * 0.04;
          p.vy += (p.baseVy - p.vy) * 0.04;

          p.x += p.vx;
          p.y += p.vy;

          // Envolvimiento de bordes
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }

        // Dibujar nodo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.isGold ? goldRgb : slateRgb}, ${p.alpha})`;
        ctx.fill();

        // Filamentos entre nodos cercanos
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ldx = p.x - p2.x;
          const ldy = p.y - p2.y;
          const ldist = Math.sqrt(ldx * ldx + ldy * ldy);

          if (ldist < 125) {
            const lineAlpha = (1 - ldist / 125) * (isDark ? 0.16 : 0.11);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${p.isGold ? goldRgb : slateRgb}, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        // Filamento magnético directo al cursor
        const cdx = p.x - mouse.x;
        const cdy = p.y - mouse.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cdist < mouse.radius) {
          const cursorLineAlpha = (1 - cdist / mouse.radius) * 0.35;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${goldRgb}, ${cursorLineAlpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
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
