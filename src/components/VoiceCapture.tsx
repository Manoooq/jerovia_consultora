"use client";

import { useState, useRef } from "react";
import { Mic, Square, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface VoiceCaptureProps {
  onExtracted: (data: Record<string, unknown>) => void;
}

export function VoiceCapture({ onExtracted }: VoiceCaptureProps) {
  const [state, setState] = useState<"idle" | "recording" | "processing" | "done" | "error">("idle");
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      setState("recording");
      setSeconds(0);

      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        stream.getTracks().forEach((t) => t.stop());
        setState("processing");
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
            if (!res.ok) throw new Error("Error al procesar");
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
    mediaRecorderRef.current?.stop();
  }

  const labels = {
    idle: "Hablar para completar con IA",
    recording: `Grabando... ${seconds}s`,
    processing: "Procesando con IA...",
    done: "✓ Campos completados automáticamente",
    error: "Error. Intenta nuevamente",
  };

  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border border-gold/30 bg-gold/5">
      <div className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300",
        state === "recording" ? "bg-red" : "bg-gold/20"
      )}>
        {state === "recording" && (
          <span className="absolute inset-0 animate-ping rounded-full bg-red opacity-30" />
        )}
        {state === "processing" ? (
          <Loader2 className="h-5 w-5 text-gold animate-spin" />
        ) : state === "done" ? (
          <Sparkles className="h-5 w-5 text-green" />
        ) : (
          <Mic className={cn("h-5 w-5", state === "recording" ? "text-white" : "text-gold")} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate">{labels[state]}</p>
        <p className="text-xs text-subtext0">IA rellena los campos automáticamente</p>
      </div>

      {state === "idle" && (
        <Button size="sm" onClick={startRecording} variant="secondary">
          <Mic className="h-4 w-4" />
          Iniciar
        </Button>
      )}
      {state === "recording" && (
        <Button size="sm" onClick={stopRecording} variant="danger">
          <Square className="h-4 w-4" />
          Detener
        </Button>
      )}
    </div>
  );
}
