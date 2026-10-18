"use client";

import { Check } from "lucide-react";

const ALL_STEPS = [
  { num: 1, label: "Personal" },
  { num: 2, label: "Académico" },
  { num: 3, label: "Laboral" },
  { num: 4, label: "Cualidades" },
  { num: 5, label: "Familiar" },
  { num: 6, label: "Salud" },
  { num: 7, label: "Económico" },
  { num: 8, label: "Vivienda" },
  { num: 9, label: "Evaluador" },
];

interface ProgressBarProps {
  currentStep: number;
  maxReachedStep?: number;
  totalSteps?: 8 | 9;
  onStepSelect?: (step: number) => void;
}

export function ProgressBar({
  currentStep,
  maxReachedStep = currentStep,
  totalSteps = 9,
  onStepSelect,
}: ProgressBarProps) {
  const steps = ALL_STEPS.slice(0, totalSteps);
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="space-y-2.5">
      <div className="h-2 w-full rounded-full bg-surface2 overflow-hidden">
        <div
          className="h-full bg-gold transition-all duration-300 rounded-full"
          style={{ width: `${Math.max(6, progressPercent)}%` }}
        />
      </div>

      <div
        className={`grid gap-1.5 ${
          totalSteps === 8 ? "grid-cols-4 sm:grid-cols-8" : "grid-cols-3 sm:grid-cols-9"
        }`}
      >
        {steps.map((s) => {
          const isCurrent = s.num === currentStep;
          const isCompleted = s.num < currentStep;
          const isClickable = s.num <= Math.max(currentStep, maxReachedStep);

          return (
            <button
              key={s.num}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepSelect?.(s.num)}
              className={`min-h-[34px] px-2 py-1 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                isCurrent
                  ? "bg-gold text-white border-gold shadow-xs"
                  : isCompleted
                  ? "bg-[#536c45]/15 text-gold border-[#536c45]/40 cursor-pointer"
                  : isClickable
                  ? "bg-surface0 text-text border-overlay1 cursor-pointer"
                  : "bg-surface1/50 text-subtext0 border-overlay0 opacity-60 cursor-not-allowed"
              }`}
            >
              {isCompleted ? (
                <Check className="h-3 w-3 shrink-0" />
              ) : (
                <span className="font-mono">{s.num}.</span>
              )}
              <span className="truncate">{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
