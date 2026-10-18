"use client";

import React, { createContext, useContext } from "react";

interface InterviewModeContextValue {
  /** true si quien abre el link tiene sesión activa de admin o evaluador */
  isEvaluator: boolean;
  /** Lista de claves que ya fueron pre-llenadas por el evaluador al crear la ficha */
  prefilledKeys: Set<string>;
  /** Devuelve true si el campo debe ocultarse al postulante porque ya fue pre-llenado */
  shouldHideField: (fieldName: string) => boolean;
}

const InterviewModeContext = createContext<InterviewModeContextValue>({
  isEvaluator: false,
  prefilledKeys: new Set(),
  shouldHideField: () => false,
});

export function InterviewModeProvider({
  isEvaluator,
  prefilledList,
  children,
}: {
  isEvaluator: boolean;
  prefilledList: string[];
  children: React.ReactNode;
}) {
  const prefilledKeys = new Set(prefilledList);

  function shouldHideField(fieldName: string): boolean {
    if (isEvaluator) return false;
    return prefilledKeys.has(fieldName);
  }

  return (
    <InterviewModeContext.Provider
      value={{ isEvaluator, prefilledKeys, shouldHideField }}
    >
      {children}
    </InterviewModeContext.Provider>
  );
}

export function useInterviewMode() {
  return useContext(InterviewModeContext);
}
