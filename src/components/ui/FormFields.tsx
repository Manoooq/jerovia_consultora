import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold text-subtext1 tracking-wide uppercase">
            {label}
            {props.required && <span className="text-red ml-1" aria-hidden="true">*</span>}
            {props.required && <span className="sr-only">(obligatorio)</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-required={props.required ? "true" : undefined}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "w-full rounded-xl border border-overlay0 bg-surface1 px-4 py-2.5 text-sm text-text placeholder:text-overlay2 font-medium min-h-[44px]",
            "transition-colors outline-none",
            "focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/30",
            error && "border-red focus-visible:border-red focus-visible:ring-red/30",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-xs font-semibold text-red flex items-center gap-1 mt-0.5">
            <span aria-hidden="true">⚠️</span> {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs text-subtext0">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-bold text-subtext1 tracking-wide uppercase">
            {label}
            {props.required && <span className="text-red ml-1" aria-hidden="true">*</span>}
            {props.required && <span className="sr-only">(obligatorio)</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-required={props.required ? "true" : undefined}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full rounded-xl border border-overlay0 bg-surface1 px-4 py-2.5 text-sm text-text font-medium min-h-[44px]",
            "transition-colors outline-none cursor-pointer",
            "focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/30",
            error && "border-red focus-visible:border-red focus-visible:ring-red/30",
            className
          )}
          {...props}
        >
          <option value="" className="bg-mantle text-text">Selecciona una opción</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-mantle text-text">
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} role="alert" className="text-xs font-semibold text-red flex items-center gap-1 mt-0.5">
            <span aria-hidden="true">⚠️</span> {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-bold text-subtext1 tracking-wide uppercase">
            {label}
            {props.required && <span className="text-red ml-1" aria-hidden="true">*</span>}
            {props.required && <span className="sr-only">(obligatorio)</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-required={props.required ? "true" : undefined}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "w-full rounded-xl border border-overlay0 bg-surface1 px-4 py-2.5 text-sm text-text placeholder:text-overlay2 font-medium",
            "transition-colors outline-none resize-none",
            "focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/30",
            error && "border-red focus-visible:border-red focus-visible:ring-red/30",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-xs font-semibold text-red flex items-center gap-1 mt-0.5">
            <span aria-hidden="true">⚠️</span> {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs text-subtext0">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  description?: string;
}

export function Toggle({ label, checked, onChange, description }: ToggleProps) {
  const id = useId();

  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <div className="flex flex-col">
        <label htmlFor={id} className="text-sm font-semibold text-text cursor-pointer select-none">
          {label}
        </label>
        {description && (
          <span className="text-xs text-subtext0">{description}</span>
        )}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-gold",
          checked ? "bg-gold border-gold" : "bg-surface2 border-overlay0"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-overlay0/60 bg-surface0 p-6 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "danger" }) {
  const variants = {
    default: "bg-surface2 text-subtext1 border-overlay0/60",
    success: "bg-green/15 text-green border-green/30 font-bold",
    warning: "bg-yellow/15 text-yellow border-yellow/30 font-bold",
    danger: "bg-red/15 text-red border-red/30 font-bold",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border", variants[variant])}>
      {children}
    </span>
  );
}
