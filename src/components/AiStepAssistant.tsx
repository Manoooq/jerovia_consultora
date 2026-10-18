"use client";

import { SpellCheck } from "lucide-react";

interface AiStepAssistantProps {
  stepNumber?: number;
  stepTitle: string;
  placeholder?: string;
  onApplyFields?: (extracted: Record<string, unknown>) => void;
}

export function AiStepAssistant({ stepTitle }: AiStepAssistantProps) {
  return (
    <div className="rounded-xl border border-[#85987a]/45 bg-[#536c45]/8 px-3.5 py-2.5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-[#536c45] text-white flex items-center justify-center shrink-0">
          <SpellCheck className="h-4 w-4" />
        </div>
        <div className="text-xs sm:text-sm text-text">
          <span className="font-bold">Corrector Ortográfico Activo</span>
          <span className="text-subtext1 hidden sm:inline">
            {" "}
            — Se corrigen automáticamente tildes y ortografía en {stepTitle.toLowerCase()} respetando sus palabras.
          </span>
        </div>
      </div>
    </div>
  );
}
