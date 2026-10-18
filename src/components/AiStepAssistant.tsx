"use client";

import { useState, useRef } from "react";
import {
  Sparkles,
  Mic,
  Square,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface AiStepAssistantProps {
  stepTitle: string;
  placeholder?: string;
  onApplyFields: (extracted: Record<string, unknown>) => void;
}

/**
 * Extractor inteligente local + IA que convierte frases dictadas o escritas
 * en campos del formulario al instante, funcionando incluso en iPhone y con señal baja.
 */
function parseSmartTextLocally(text: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const clean = text.trim();
  if (!clean) return out;

  // Cédula
  const ciMatch = clean.match(/(?:ci|c[eé]dula|documento)[:\s]*([0-9.]{5,12})/i);
  if (ciMatch) out.cedula = ciMatch[1];

  // Teléfono
  const telMatch = clean.match(/(09[6789][0-9\s.-]{6,10})/);
  if (telMatch) out.telefono = telMatch[1].trim();

  // Idiomas
  const langs: string[] = [];
  if (/castellano|espa[ñn]ol/i.test(clean)) langs.push("Castellano");
  if (/guaran[ií]/i.test(clean)) langs.push("Guaraní");
  if (/ingl[eé]s/i.test(clean)) langs.push("Inglés");
  if (/portugu[eé]s/i.test(clean)) langs.push("Portugués");
  if (langs.length > 0) out.idiomasTexto = langs.join(", ");

  // Condición ocupacional
  if (/no estoy trabajando|desemplead/i.test(clean)) {
    out.situacionActual = "desempleado";
  } else if (/pasant[ií]a|pasante/i.test(clean)) {
    out.situacionActual = "pasantia";
  } else if (/estoy trabajando|trabajo en|emplead/i.test(clean)) {
    out.situacionActual = "empleado";
  }

  // Empresa / Lugar de trabajo
  const empMatch = clean.match(/(?:trabajo en|empresa|en)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ0-9\s]{2,30}?)(?:,|\.|hace|como|ganando|$)/i);
  if (empMatch && empMatch[1]) {
    out.empresaAnterior = empMatch[1].trim();
  }

  // Cargo
  const cargoMatch = clean.match(/(?:como|cargo de|puesto de|en el [aá]rea de)\s+([A-Za-záéíóúñ\s]{3,28}?)(?:,|\.|hace|ganando|$)/i);
  if (cargoMatch && cargoMatch[1]) {
    out.cargoAnterior = cargoMatch[1].trim();
  }

  // Antigüedad
  const antMatch = clean.match(/(?:hace|antig[üu]edad de)\s+([0-9]+\s*(?:meses|mes|a[ñn]os|a[ñn]o))/i);
  if (antMatch) out.antiguedad = antMatch[1].trim();

  // Salario
  const salMatch = clean.match(/(?:gano|salario de|sueldo de|cobro)\s*(?:gs\.?)?\s*([0-9.]{5,12})/i);
  if (salMatch) out.salarioBruto = salMatch[1].trim();

  // Carrera / Universidad
  const carrMatch = clean.match(/(?:estudio|carrera de)\s+([A-Za-záéíóúñ\s]{3,35}?)(?:\s+en\s+|,|\.|$)/i);
  if (carrMatch) out.carrera = carrMatch[1].trim();
  const uniMatch = clean.match(/universidad\s+([A-Za-záéíóúñ\s]{2,30}?)(?:,|\.|$)/i);
  if (uniMatch) out.universidad = "Universidad " + uniMatch[1].trim();

  return out;
}

export function AiStepAssistant({
  stepTitle,
  placeholder = "Dicte por voz o escriba aquí con sus palabras y la IA completará las casillas automáticamente...",
  onApplyFields,
}: AiStepAssistantProps) {
  const [quickText, setQuickText] = useState("");
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [doneMsg, setDoneMsg] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function handleProcessText(inputText?: string) {
    const textToUse = (inputText ?? quickText).trim();
    if (!textToUse) return;

    setProcessing(true);
    setDoneMsg(null);

    // 1. Aplicar extracción inteligente instantánea
    const localExtracted = parseSmartTextLocally(textToUse);
    if (Object.keys(localExtracted).length > 0) {
      onApplyFields(localExtracted);
    } else {
      // Si el usuario escribió una frase general, enviarla también como texto útil
      onApplyFields({ _rawAiText: textToUse });
    }

    setProcessing(false);
    setQuickText("");
    setDoneMsg("¡Datos completados por la IA!");
    setTimeout(() => setDoneMsg(null), 3500);
  }

  async function toggleMic() {
    if (recording) {
      mediaRecorderRef.current?.stop();
      setRecording(false);
      return;
    }

    // Intentar primero Web Speech API nativa (instantánea en iPhone Safari y Chrome)
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = "es-PY";
        recognition.continuous = false;
        recognition.interimResults = false;
        setRecording(true);

        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript || "";
          setRecording(false);
          if (transcript) {
            setQuickText(transcript);
            handleProcessText(transcript);
          }
        };
        recognition.onerror = () => setRecording(false);
        recognition.onend = () => setRecording(false);
        recognition.start();
        return;
      } catch {}
    }

    // Fallback a MediaRecorder + /api/ai/transcribir
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setProcessing(true);

        try {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64 = (reader.result as string).split(",")[1];
            const res = await fetch("/api/ai/transcribir", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ audio: base64, mimeType }),
            });
            if (res.ok) {
              const data = await res.json();
              onApplyFields(data);
              setDoneMsg("¡Dictado aplicado a las casillas!");
              setTimeout(() => setDoneMsg(null), 3500);
            }
            setProcessing(false);
          };
          reader.readAsDataURL(blob);
        } catch {
          setProcessing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setRecording(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#85987a]/60 bg-gradient-to-r from-[#536c45]/10 via-[#85987a]/10 to-transparent p-3 sm:p-4 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#536c45] text-white flex items-center justify-center shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-extrabold text-text">
            Asistente IA Rápido — {stepTitle}
          </span>
        </div>
        {doneMsg && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {doneMsg}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={quickText}
          onChange={(e) => setQuickText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleProcessText();
            }
          }}
          placeholder={placeholder}
          className="flex-1 min-h-[40px] rounded-xl tactile-input px-3 py-2 text-xs sm:text-sm font-medium outline-none"
        />

        <button
          type="button"
          onClick={toggleMic}
          className={`min-h-[40px] px-3 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
            recording
              ? "bg-red text-white border-red animate-pulse"
              : "bg-surface0 border-overlay1 text-text hover:border-gold"
          }`}
          title="Dictar por voz"
        >
          {recording ? (
            <>
              <Square className="h-3.5 w-3.5" />
              <span>Parar</span>
            </>
          ) : (
            <>
              <Mic className="h-3.5 w-3.5 text-gold" />
              <span className="hidden sm:inline">Dictar</span>
            </>
          )}
        </button>

        <button
          type="button"
          disabled={!quickText.trim() || processing}
          onClick={() => handleProcessText()}
          className="min-h-[40px] px-3.5 rounded-xl bg-gold text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {processing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">Autocompletar</span>
        </button>
      </div>
    </div>
  );
}
