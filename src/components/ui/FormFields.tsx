import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef, useId } from "react";
import { AlertCircle } from "lucide-react";
import { corregirOrtografiaTexto } from "@/lib/textProcessor";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, onBlur, onChange, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      const type = props.type || "text";
      if (type === "text" && e.target.value && e.target.value.trim().length > 1) {
        const fixed = corregirOrtografiaTexto(e.target.value);
        if (fixed !== e.target.value) {
          e.target.value = fixed;
          onChange?.(e as unknown as React.ChangeEvent<HTMLInputElement>);
        }
      }
      onBlur?.(e);
    }

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-subtext1"
          >
            {label}
            {props.required && (
              <span className="text-gold ml-1" aria-hidden="true">
                *
              </span>
            )}
            {props.required && <span className="sr-only">(obligatorio)</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          lang="es"
          spellCheck={props.type === "email" || props.type === "password" ? false : true}
          autoCorrect="on"
          aria-required={props.required ? "true" : undefined}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          onChange={onChange}
          onBlur={handleBlur}
          className={cn(
            "w-full rounded-xl border border-overlay1/80 bg-crust/80 px-4 py-3 text-base text-text placeholder:text-subtext0/60 font-medium min-h-[48px]",
            "shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)] transition-all duration-150 outline-none",
            "hover:border-gold/40 focus-visible:border-gold focus-visible:bg-surface0 focus-visible:shadow-[inset_0_1px_3px_rgba(0,0,0,0.2),0_0_0_3px_rgba(212,175,55,0.15)]",
            error &&
              "border-red focus-visible:border-red focus-visible:ring-red/25",
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs sm:text-sm font-semibold text-red flex items-center gap-1.5 mt-0.5"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs sm:text-sm text-subtext0">
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
          <label
            htmlFor={selectId}
            className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-subtext1"
          >
            {label}
            {props.required && (
              <span className="text-gold ml-1" aria-hidden="true">
                *
              </span>
            )}
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
            "w-full rounded-xl border border-overlay1/80 bg-crust/80 px-4 py-3 text-base text-text font-medium min-h-[48px]",
            "shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)] transition-all duration-150 outline-none cursor-pointer",
            "hover:border-gold/40 focus-visible:border-gold focus-visible:bg-surface0 focus-visible:shadow-[inset_0_1px_3px_rgba(0,0,0,0.2),0_0_0_3px_rgba(212,175,55,0.15)]",
            error &&
              "border-red focus-visible:border-red focus-visible:ring-red/25",
            className
          )}
          {...props}
        >
          <option value="" className="bg-mantle text-text">
            Seleccionar...
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-mantle text-text"
            >
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs sm:text-sm font-semibold text-red flex items-center gap-1.5 mt-0.5"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, onBlur, onChange, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    function handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
      if (e.target.value && e.target.value.trim().length > 1) {
        const fixed = corregirOrtografiaTexto(e.target.value);
        if (fixed !== e.target.value) {
          e.target.value = fixed;
          onChange?.(e as unknown as React.ChangeEvent<HTMLTextAreaElement>);
        }
      }
      onBlur?.(e);
    }

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-subtext1"
          >
            {label}
            {props.required && (
              <span className="text-gold ml-1" aria-hidden="true">
                *
              </span>
            )}
            {props.required && <span className="sr-only">(obligatorio)</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          lang="es"
          spellCheck={true}
          autoCorrect="on"
          aria-required={props.required ? "true" : undefined}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          onChange={onChange}
          onBlur={handleBlur}
          className={cn(
            "w-full rounded-xl border border-overlay1/80 bg-crust/80 px-4 py-3 text-base text-text placeholder:text-subtext0/60 font-medium",
            "shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)] transition-all duration-150 outline-none resize-y min-h-[96px]",
            "hover:border-gold/40 focus-visible:border-gold focus-visible:bg-surface0 focus-visible:shadow-[inset_0_1px_3px_rgba(0,0,0,0.2),0_0_0_3px_rgba(212,175,55,0.15)]",
            error &&
              "border-red focus-visible:border-red focus-visible:ring-red/25",
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs sm:text-sm font-semibold text-red flex items-center gap-1.5 mt-0.5"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs sm:text-sm text-subtext0">
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
    <div
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center justify-between gap-4 py-3 px-4 rounded-xl border transition-all cursor-pointer select-none min-h-[50px]",
        checked
          ? "border-gold/50 bg-gold/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)]"
          : "border-overlay0/60 bg-crust/50 hover:border-overlay1"
      )}
    >
      <div className="flex flex-col">
        <label
          htmlFor={id}
          onClick={(e) => e.stopPropagation()}
          className="text-sm sm:text-base font-semibold text-text cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <span className="text-xs sm:text-sm text-subtext1 mt-0.5">{description}</span>
        )}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={(e) => {
          e.stopPropagation();
          onChange(!checked);
        }}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-gold",
          checked ? "bg-gold border-gold" : "bg-surface2 border-overlay1"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-overlay0/80 bg-surface0 p-5 sm:p-7 shadow-xs",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const variants = {
    default: "bg-surface2 text-subtext1 border-overlay0/60",
    success: "bg-green/15 text-green border-green/30 font-bold",
    warning: "bg-yellow/15 text-yellow border-yellow/30 font-bold",
    danger: "bg-red/15 text-red border-red/30 font-bold",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
