"use client";

import { useEffect, useRef } from "react";

interface GridPoint {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/**
 * Matriz arquitectónica interactiva: una grilla de precisión que reacciona
 * con física elástica suave al paso del cursor sin ruido visual.
 */
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

    const spacing = width < 768 ? 44 : 36;
    let points: GridPoint[] = [];

    function initGrid() {
      points = [];
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = c * spacing;
          const oy = r * spacing;
          points.push({
            originX: ox,
            originY: oy,
            x: ox,
            y: oy,
            vx: 0,
            vy: 0,
          });
        }
      }
    }

    initGrid();

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 170,
      active: false,
    };

    function handleResize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initGrid();
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

    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      const goldRgb = isDark ? "212, 175, 55" : "138, 100, 18";
      const baseRgb = isDark ? "148, 163, 184" : "100, 116, 139";

      mouse.x += (mouse.targetX - mouse.x) * 0.14;
      mouse.y += (mouse.targetY - mouse.y) * 0.14;

      if (mouse.active && mouse.x > 0) {
        const halo = ctx.createRadialGradient(mouse.x, mouse.y, 8, mouse.x, mouse.y, 320);
        halo.addColorStop(0, `rgba(${goldRgb}, ${isDark ? 0.08 : 0.05})`);
        halo.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, width, height);
      }

      const maxDist = mouse.radius;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;

        let proximity = 0;

        if (!prefersReducedMotion && distSq < maxDistSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          proximity = 1 - dist / maxDist;
          const push = proximity * proximity * 14;
          const targetX = p.originX + (dx / dist) * push;
          const targetY = p.originY + (dy / dist) * push;
          p.vx += (targetX - p.x) * 0.18;
          p.vy += (targetY - p.y) * 0.18;
        } else {
          p.vx += (p.originX - p.x) * 0.12;
          p.vy += (p.originY - p.y) * 0.12;
        }

        p.vx *= 0.78;
        p.vy *= 0.78;
        p.x += p.vx;
        p.y += p.vy;

        const radius = proximity > 0.05 ? 1.1 + proximity * 1.4 : 1.05;
        const alpha =
          proximity > 0.05
            ? (isDark ? 0.25 : 0.2) + proximity * 0.55
            : isDark
            ? 0.12
            : 0.14;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle =
          proximity > 0.12
            ? `rgba(${goldRgb}, ${alpha})`
            : `rgba(${baseRgb}, ${alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

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
