"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Compass, Radio, ShieldCheck, MapPin } from "lucide-react";

interface Node3D {
  name: string;
  dept: string;
  lat: number;
  lng: number;
  status: "active" | "standby";
  delay: string;
}

const PARAGUAY_NODES: Node3D[] = [
  { name: "Asunción (Capital)", dept: "Distrito Capital", lat: -25.2637, lng: -57.5759, status: "active", delay: "< 12hs" },
  { name: "Luque / Aeropuerto", dept: "Central", lat: -25.2699, lng: -57.4890, status: "active", delay: "< 18hs" },
  { name: "San Lorenzo", dept: "Central", lat: -25.3397, lng: -57.5088, status: "active", delay: "< 18hs" },
  { name: "Ciudad del Este", dept: "Alto Paraná", lat: -25.5097, lng: -54.6111, status: "active", delay: "< 24hs" },
  { name: "Encarnación", dept: "Itapúa", lat: -27.3306, lng: -55.8667, status: "active", delay: "< 36hs" },
  { name: "Coronel Oviedo", dept: "Caaguazú", lat: -25.4444, lng: -56.4403, status: "active", delay: "< 24hs" },
];

export function Radar3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node3D>(PARAGUAY_NODES[0]);
  const [isDragging, setIsDragging] = useState(false);
  const rotationRef = useRef({ rotX: 0.25, rotY: -0.4 });
  const mouseRef = useRef({ lastX: 0, lastY: 0 });
  const pulseRef = useRef(0);

  // Convert lat/lng to 3D sphere coordinates (x, y, z)
  const toCartesian = useCallback((lat: number, lng: number, radius: number) => {
    // Normalizar coordenadas para centrar Paraguay
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return { x, y, z };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.36;

      ctx.clearRect(0, 0, width, height);

      // Auto rotación lenta si no se está arrastrando
      if (!isDragging) {
        rotationRef.current.rotY += 0.0035;
      }
      pulseRef.current += 0.03;

      const { rotX, rotY } = rotationRef.current;

      // Matriz de rotación simple
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const project = (x: number, y: number, z: number) => {
        // Rotación Y
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Rotación X
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Proyección de perspectiva suave
        const fov = 420;
        const scale = fov / (fov + z2);
        return {
          px: centerX + x1 * scale,
          py: centerY + y2 * scale,
          depth: z2,
          scale,
        };
      };

      // 1. Dibujar anillos de latitud (wireframe 3D del radar)
      ctx.lineWidth = 1;
      const ringLatitudes = [-60, -30, 0, 30, 60];
      for (const lat of ringLatitudes) {
        const ringRad = radius * Math.cos((lat * Math.PI) / 180);
        const ringY = radius * Math.sin((lat * Math.PI) / 180);
        ctx.beginPath();
        let first = true;
        for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += 0.15) {
          const rx = ringRad * Math.cos(angle);
          const rz = ringRad * Math.sin(angle);
          const { px, py, depth } = project(rx, ringY, rz);
          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.strokeStyle = "rgba(180, 190, 254, 0.07)";
        ctx.stroke();
      }

      // 2. Dibujar meridianos longitudinales
      for (let lon = 0; lon < 360; lon += 45) {
        const radLon = (lon * Math.PI) / 180;
        ctx.beginPath();
        let first = true;
        for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += 0.15) {
          const rx = radius * Math.sin(angle) * Math.cos(radLon);
          const ry = radius * Math.cos(angle);
          const rz = radius * Math.sin(angle) * Math.sin(radLon);
          const { px, py } = project(rx, ry, rz);
          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.strokeStyle = "rgba(180, 190, 254, 0.07)";
        ctx.stroke();
      }

      // 3. Haz de radar giratorio (scanning sweep line)
      const sweepAngle = pulseRef.current * 1.5;
      const sweepX = radius * Math.cos(sweepAngle);
      const sweepZ = radius * Math.sin(sweepAngle);
      const sweepProj = project(sweepX, 0, sweepZ);
      const centerProj = project(0, 0, 0);

      const grad = ctx.createLinearGradient(centerProj.px, centerProj.py, sweepProj.px, sweepProj.py);
      grad.addColorStop(0, "rgba(249, 226, 175, 0)");
      grad.addColorStop(1, "rgba(249, 226, 175, 0.35)");
      ctx.beginPath();
      ctx.moveTo(centerProj.px, centerProj.py);
      ctx.lineTo(sweepProj.px, sweepProj.py);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 4. Renderizar nodos georreferenciados de Paraguay
      for (const node of PARAGUAY_NODES) {
        const { x, y, z } = toCartesian(node.lat, node.lng, radius);
        const { px, py, depth, scale } = project(x, y, z);

        // Si el nodo está en la cara visible (depth > -50)
        const isVisible = depth > -radius * 0.4;
        const alpha = isVisible ? Math.max(0.2, (depth + radius) / (radius * 1.8)) : 0.1;

        // Pulso animado
        const pulse = (Math.sin(pulseRef.current * 2 + x) + 1) / 2;
        const ringSize = (6 + pulse * 10) * scale;

        // Halo exterior
        ctx.beginPath();
        ctx.arc(px, py, ringSize, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(249, 226, 175, ${alpha * 0.5 * (1 - pulse)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Punto central
        ctx.beginPath();
        ctx.arc(px, py, 3.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = node.status === "active" ? `rgba(166, 227, 161, ${alpha})` : `rgba(249, 226, 175, ${alpha})`;
        ctx.fill();

        // Etiqueta de la ciudad (solo para la cara frontal)
        if (depth > 0) {
          ctx.font = "9px monospace";
          ctx.fillStyle = `rgba(205, 214, 244, ${Math.min(1, alpha + 0.3)})`;
          ctx.fillText(node.name, px + 8, py + 3);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isDragging, toCartesian]);

  // Manejo de interacción de arrastre para rotar en 3D
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    mouseRef.current = { lastX: e.clientX, lastY: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - mouseRef.current.lastX;
    const deltaY = e.clientY - mouseRef.current.lastY;

    rotationRef.current.rotY += deltaX * 0.008;
    rotationRef.current.rotX = Math.max(-1.2, Math.min(1.2, rotationRef.current.rotX + deltaY * 0.008));

    mouseRef.current = { lastX: e.clientX, lastY: e.clientY };
  };

  const onMouseUp = () => setIsDragging(false);

  return (
    <div className="relative rounded-3xl border border-overlay0/40 bg-surface0 overflow-hidden shadow-2xl p-6 flex flex-col justify-between">
      {/* HUD Cabecera */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-overlay0/30">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-gold animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest font-black text-gold">
            GEO-RADAR PERICIAL 3D · RED NACIONAL
          </span>
        </div>
        <span className="text-[10px] font-mono text-green bg-green/10 border border-green/30 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-green animate-ping" />
          6 NODOS ACTIVOS
        </span>
      </div>

      {/* Canvas 3D Interactivo */}
      <div
        className="relative h-72 sm:h-80 w-full cursor-grab active:cursor-grabbing my-2 select-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Retícula de mira telescópica central */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
          <div className="w-32 h-32 rounded-full border border-gold/40 border-dashed animate-[spin_60s_linear_infinite]" />
          <div className="absolute w-48 h-48 rounded-full border border-blue/20" />
        </div>

        <div className="absolute bottom-2 left-2 pointer-events-none text-[9px] font-mono text-subtext0 bg-mantle/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-overlay0/30">
          🖱️ Arrastrar para rotar visualización en 3D
        </div>
      </div>

      {/* Selector de Nodos y Datos del Peritaje */}
      <div className="relative z-10 pt-3 border-t border-overlay0/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text">Despliegue Territorial</span>
          <span className="text-[11px] text-gold font-mono font-medium">GPS Certificado</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PARAGUAY_NODES.map((node) => {
            const isSelected = selectedNode.name === node.name;
            return (
              <button
                key={node.name}
                type="button"
                onClick={() => setSelectedNode(node)}
                className={`p-2 rounded-xl text-left border transition-all text-xs ${
                  isSelected
                    ? "border-gold bg-gold/10 text-text font-bold shadow-sm"
                    : "border-overlay0/30 bg-surface1/60 hover:bg-surface1 text-subtext0 hover:text-text"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="truncate font-semibold text-[11px]">{node.name.split(" ")[0]}</span>
                  <span className="text-[9px] font-mono text-green">{node.delay}</span>
                </div>
                <div className="text-[10px] text-subtext0 flex items-center gap-1 truncate">
                  <MapPin className="h-2.5 w-2.5 text-gold shrink-0" />
                  <span>{node.dept}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
