"use client";

import { useState } from "react";
import { MapPin, CheckCircle2, AlertCircle, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormFields";

interface GeoCapturePayload {
  coordenadas: string;
  plusCode: string;
  ciudad?: string;
  barrio?: string;
}

interface GeoCaptureProps {
  onCapturado?: (data: GeoCapturePayload) => void;
  onCaptured?: (data: GeoCapturePayload) => void;
  ciudad?: string;
  coordenadas?: string;
  plusCode?: string;
}

function latLngToPlusCode(lat: number, lng: number): string {
  const latCode = Math.abs(lat).toFixed(4).replace(".", "").slice(0, 4).toUpperCase();
  const lngCode = Math.abs(lng).toFixed(4).replace(".", "").slice(0, 4).toUpperCase();
  return `${latCode}+${lngCode} PY`;
}

export function GeoCapture({ onCapturado, onCaptured, ciudad = "", coordenadas = "" }: GeoCaptureProps) {
  const emitCapture = (payload: GeoCapturePayload) => {
    onCapturado?.(payload);
    onCaptured?.(payload);
  };
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    coordenadas ? "done" : "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [coords, setCoords] = useState(coordenadas);
  const [precision, setPrecision] = useState<number | null>(null);

  async function capturar() {
    if (!navigator.geolocation) {
      setState("error");
      setErrorMsg("Este navegador o dispositivo no soporta geolocalización satelital.");
      return;
    }
    setState("loading");
    setErrorMsg("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const coordStr = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        const plusCode = latLngToPlusCode(latitude, longitude);
        setCoords(coordStr);
        setPrecision(Math.round(accuracy));

        let city = ciudad;
        let suburb = "";
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "es" } }
          );
          if (res.ok) {
            const geo = await res.json();
            city =
              geo.address?.city ||
              geo.address?.town ||
              geo.address?.municipality ||
              geo.address?.village ||
              ciudad;
            suburb =
              geo.address?.suburb ||
              geo.address?.neighbourhood ||
              geo.address?.quarter ||
              "";
          }
        } catch {
          // Conserva ciudad manual si no hay respuesta de red
        }

        emitCapture({ coordenadas: coordStr, plusCode, ciudad: city, barrio: suburb || undefined });
        setState("done");
      },
      (err) => {
        setState("error");
        setErrorMsg(
          err.code === err.PERMISSION_DENIED
            ? "Permiso de ubicación denegado. Habilite el GPS del navegador o ingrese la coordenada manualmente."
            : "No se logró fijar señal satelital. Intente al aire libre o cargue las coordenadas manualmente."
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }

  return (
    <div className="rounded-2xl border border-overlay0/70 bg-surface1/50 p-4 sm:p-5 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shrink-0">
            <Navigation className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-text">
              Georreferenciación In Situ del Inmueble
            </p>
            <p className="text-[11px] text-subtext0">
              Registro satelital auditable para el legajo crediticio
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant={state === "done" ? "secondary" : "primary"}
          onClick={capturar}
          loading={state === "loading"}
          className="w-full sm:w-auto"
        >
          {state === "done" ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green" />
              <span>Actualizar Coordenada GPS</span>
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              <span>Obtener Coordenada GPS Actual</span>
            </>
          )}
        </Button>
      </div>

      {coords && (
        <div className="rounded-xl bg-surface0 border border-overlay0/60 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-subtext0 font-medium">Coordenada fijada:</span>
            <span className="font-mono font-bold text-text tabular-nums">{coords}</span>
            {precision !== null && (
              <span className="text-[11px] font-mono text-green bg-green/10 border border-green/30 px-2 py-0.5 rounded tabular-nums">
                ±{precision}m
              </span>
            )}
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-gold hover:underline font-semibold"
          >
            <span>Verificar en Mapa</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {state === "error" && (
        <div
          role="alert"
          className="rounded-xl bg-red/10 border border-red/30 p-3.5 space-y-2.5"
        >
          <div className="flex items-start gap-2 text-xs text-red font-semibold">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
          <Input
            label="Carga manual de coordenadas (Latitud, Longitud)"
            placeholder="Ej: -25.2867, -57.6470"
            value={coords}
            onChange={(e) => {
              setCoords(e.target.value);
              if (e.target.value.trim()) {
                emitCapture({
                  coordenadas: e.target.value.trim(),
                  plusCode: "",
                  ciudad,
                });
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
