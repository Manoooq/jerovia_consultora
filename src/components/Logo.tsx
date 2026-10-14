"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: "h-8 sm:h-9",
    md: "h-10 sm:h-11",
    lg: "h-14 sm:h-16",
  };

  return (
    <div className={cn("inline-flex items-center select-none", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-dark.png"
        alt="Jerovia Consultora"
        className={cn(
          "w-auto object-contain dark:hidden",
          sizes[size]
        )}
        loading="eager"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-white.png"
        alt="Jerovia Consultora"
        className={cn(
          "w-auto object-contain hidden dark:block",
          sizes[size]
        )}
        loading="eager"
      />
    </div>
  );
}
