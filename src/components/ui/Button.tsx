"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-gold text-black hover:bg-gold-light shadow-sm font-bold",
      secondary:
        "border border-overlay0/80 bg-surface1 text-text hover:bg-surface2 hover:border-overlay1",
      outline:
        "border border-gold/40 bg-transparent text-text hover:border-gold hover:bg-gold/10",
      danger:
        "bg-red text-white hover:opacity-90 shadow-sm font-bold",
      ghost:
        "bg-transparent text-subtext1 hover:bg-surface1 hover:text-text",
    };

    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "min-h-[38px] px-3.5 py-1.5 text-xs",
      md: "min-h-[44px] px-4 py-2.5 text-xs sm:text-sm",
      lg: "min-h-[48px] px-6 py-3 text-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
