"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, Sparkles, Volume2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface VoiceCaptureProps {
  onExtracted: (data: Record<string, unknown>) => void;
}

// Extractor local instantáneo en 0ms mediante expresiones regulares
function extraerCamposLocales(texto: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const t = texto.toLowerCase();

  // Nombre
  const matchNombre = texto.match(/(?:me llamo|mi nombre es|postulante es|candidato)\s+([a-záéíóúñA-ZÁÉÍÓÚÑ]+(?:\s+[a-záéíóúñA-ZÁÉÍÓÚÑ]+)*)/i);
  if (matchNombre && matchNombre[1]) {
    const parts = matchNombre[1].trim().split(" ");
    result.nombre = parts[0];
    if (parts.length > 1) result.apellido = parts.slice(1).join(" ");
  }

  // Cédula
  const matchCi = texto.match(/(?:c[eé]dula|ci|documento)\s*(?:es|n[uú]mero)?\s*([0-9\.\-]{6,10})/i) ||
                  texto.match(/\b([1-8]\.?\d{3}\.?\d{3})\b/);
  if (matchCi) {
    result.cedula = matchCi[1].replace(/\./g, "").trim();
  }

  // Ciudad
  const ciudades = ["asunción", "asuncion", "luque", "san lorenzo", "lambaré", "lambare", "fernando de la mora", "cde", "ciudad del este", "encarnación", "encarnacion", "capiatá", "capiata", "mariano roque alonso", "villa elisa", "ñemby", "nemby"];
  for (const c of ciudades) {
    if (t.includes(c)) {
      result.ciudad = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  // Ingresos
  const matchIngreso = texto.match(/(?:gano|ingreso|salario|sueldo|percibo)\s*(?:de)?\s*([\d\.\,]+)/i);
  if (matchIngreso) {
    result.ingresosFamiliares = matchIngreso[1].trim() + " Gs.";
  }

  // Vivienda
  if (t.includes("propia") || t.includes("casa propia")) result.tenenciaVivienda = "propia";
  else if (t.includes("alquilo") || t.includes("alquilada")) result.tenenciaVivienda = "alquilada";
  else if (t.includes("prestada")) result.tenenciaVivienda = "prestada";
  else if (t.includes("familiar") || t.includes("con mis padres")) result.tenenciaVivienda = "familiar";

  // Observaciones generales acumuladas
  result.observacionesEntrevista = texto.trim();

  return result;
}

export function VoiceCapture({ onExtracted }: VoiceCaptureProps) {
  const [state, setState] = useState<"idle" | "recording" | "processing" | "done" | "error">("idle");
  const [seconds, setSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRecognizerRef = useRef<any>(null);

  // Inicializar Web Speech Recognition si está disponible para respuesta 0ms
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "es-PY";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setLiveTranscript(transcript);
      };

      speechRecognizerRef.current = recognition;
    }
  }, []);

  async function startRecording() {
    try {
      setLiveTranscript("");
      setSeconds(0);
      setState("recording");

      // Iniciar reconocimiento por voz nativo inmediato
      if (speechRecognizerRef.current) {
        try {
          speechRecognizerRef.current.start();
        } catch {
          // Ya iniciado o ignorar
        }
      }

      // Audio recorder de respaldo
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        stream.getTracks().forEach((t) => t.stop());

        setState("processing");

        // Si tenemos transcripción en vivo por Web Speech API, autocompletar en 0ms
        if (liveTranscript.trim().length > 10) {
          const extracted = extraerCamposLocales(liveTranscript);
          onExtracted(extracted);
          setState("done");
          setTimeout(() => setState("idle"), 3000);
          return;
        }

        // Fallback: enviar audio a la API de backend
        try {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            const base64 = (reader.result as string).split(",")[1];
            const res = await fetch("/api/ai/transcribir", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ audio: base64 }),
            });
            if (!res.ok) throw new Error("Error en servidor");
            const data = await res.json();
            onExtracted(data);
            setState("done");
            setTimeout(() => setState("idle"), 3000);
          };
        } catch {
          setState("error");
          setTimeout(() => setState("idle"), 3000);
        }
      };

      recorder.start();
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  function stopRecording() {
    if (speechRecognizerRef.current) {
      try {
        speechRecognizerRef.current.stop();
      } catch {
        // Ignorar
      }
    }
    mediaRecorderRef.current?.stop();
  }

  return (
    <div className="flex flex-col gap-2 p-4 rounded-3xl border border-gold/40 bg-gold/5 transition-all">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-300",
            state === "recording" ? "bg-red text-white" : "bg-gold/20 text-gold"
          )}
        >
          {state === "recording" && (
            <span className="absolute inset-0 animate-ping rounded-2xl bg-red opacity-30" />
          )}
          {state === "processing" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : state === "done" ? (
            <CheckCircle2 className="h-5 w-5 text-green" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-text truncate">
              {state === "idle" && "Dictado por Voz Inteligente (0ms Latencia)"}
              {state === "recording" && `Escuchando en vivo... ${seconds}s`}
              {state === "processing" && "Sintetizando datos en tiempo real..."}
              {state === "done" && "✓ Campos extraídos y completados"}
              {state === "error" && "No se detectó audio. Reintentar"}
            </p>
            <span className="text-[10px] font-mono text-gold bg-gold/15 px-2 py-0.5 rounded-full border border-gold/30">
              Web Speech + IA
            </span>
          </div>
          <p className="text-xs text-subtext0">
            {state === "recording"
              ? "Habla con naturalidad (nombre, ciudad, ingresos, vivienda)..."
              : "Autocompleta los campos del formulario sin necesidad de tipear."}
          </p>
        </div>

        <div>
          {state === "idle" && (
            <Button size="sm" onClick={startRecording} variant="primary" className="bg-gold text-black font-bold">
              <Mic className="h-4 w-4 mr-1" />
              Dictar
            </Button>
          )}
          {state === "recording" && (
            <Button size="sm" onClick={stopRecording} variant="danger" className="animate-pulse">
              <Square className="h-4 w-4 mr-1" />
              Terminar
            </Button>
          )}
        </div>
      </div>

      {/* Transcripción en vivo al hablar */}
      {state === "recording" && liveTranscript && (
        <div className="mt-2 p-3 rounded-2xl bg-surface0/90 border border-gold/30 text-xs text-text flex items-start gap-2 shadow-inner">
          <Volume2 className="h-4 w-4 text-gold shrink-0 mt-0.5 animate-pulse" />
          <p className="italic font-sans">&quot;{liveTranscript}&quot;</p>
        </div>
      )}
    </div>
  );
}
