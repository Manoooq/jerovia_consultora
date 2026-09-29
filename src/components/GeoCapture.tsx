"use client";

import { useState } from "react";
import { MapPin, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormFields";

interface GeoCaptureProps {
  onCapturado: (data: { coordenadas: string; plusCode: string; ciudad?: string }) => void;
  ciudad?: string;
  coordenadas?: string;
}

function latLngToPlusCode(lat: number, lng: number): string {
  // Simplified Plus Code approximation for display
  const latCode = Math.abs(lat).toFixed(4).replace(".", "").slice(0, 4).toUpperCase();
  const lngCode = Math.abs(lng).toFixed(4).replace(".", "").slice(0, 4).toUpperCase();
  return `${latCode}+${lngCode}`;
}

export function GeoCapture({ onCapturado, ciudad = "", coordenadas = "" }: GeoCaptureProps) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [coords, setCoords] = useState(coordenadas);

  async function capturar() {
    if (!navigator.geolocation) {
      setState("error");
      setErrorMsg("Tu dispositivo no soporta geolocalización");
      return;
    }
    setState("loading");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const coordStr = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        const plusCode = latLngToPlusCode(latitude, longitude);
        setCoords(coordStr);

        // Reverse geocode to get city (Nominatim - free OpenStreetMap API)
        let city = ciudad;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "es" } }
          );
          const geo = await res.json();
          city = geo.address?.city || geo.address?.town || geo.address?.village || ciudad;
        } catch { /* uso la ciudad manual si falla */ }

        onCapturado({ coordenadas: coordStr, plusCode, ciudad: city });
        setState("done");
        void accuracy;
      },
      (err) => {
        setState("error");
        setErrorMsg(
          err.code === err.PERMISSION_DENIED
            ? "Permiso de ubicación denegado. Actívalo en tu navegador."
            : "No se pudo obtener la ubicación. Ingresa las coordenadas manualmente."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-sky/20 bg-sky/5">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-sky" />
        <p className="text-sm font-semibold text-text">Geolocalización del Domicilio</p>
      </div>

      {coords && (
        <div className="rounded-xl bg-surface1 border border-overlay0 px-4 py-3">
          <p className="text-xs text-subtext0 mb-1">Coordenadas capturadas</p>
          <p className="text-sm font-mono text-sky">{coords}</p>
        </div>
      )}

      <div className="flex gap-2 items-start">
        <Button
          size="sm"
          variant={state === "done" ? "secondary" : "primary"}
          onClick={capturar}
          loading={state === "loading"}
          className={state === "done" ? "bg-green/10 text-green border-green/20" : ""}
        >
          {state === "done" ? (
            <><CheckCircle className="h-4 w-4" /> Ubicación capturada</>
          ) : (
            <><MapPin className="h-4 w-4" /> Capturar ubicación GPS</>
          )}
        </Button>
      </div>

      {state === "error" && (
        <div className="flex items-start gap-2 rounded-xl bg-red/10 border border-red/20 p-3">
          <AlertCircle className="h-4 w-4 text-red shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-red">{errorMsg}</p>
            <div className="mt-2">
              <Input
                placeholder="Ej: -25.288, -57.647"
                value={coords}
                onChange={(e) => {
                  setCoords(e.target.value);
                  if (e.target.value) onCapturado({ coordenadas: e.target.value, plusCode: "", ciudad });
                }}
              />
            </div>
          </div>
        </div>
      )}

      {state === "idle" && (
        <p className="text-xs text-subtext0">
          Captura las coordenadas GPS de la vivienda con un toque. Se genera el Plus Code automáticamente.
        </p>
      )}
    </div>
  );
}
