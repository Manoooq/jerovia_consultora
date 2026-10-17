import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "auto" | "cover";
  className?: string;
}

export function Logo({ size = "md", variant = "auto", className }: LogoProps) {
  const sizes = {
    sm: { badge: "h-8 w-8 text-xs", title: "text-sm", sub: "text-[9px]" },
    md: { badge: "h-9 w-9 text-sm", title: "text-base", sub: "text-[10px]" },
    lg: { badge: "h-12 w-12 text-lg", title: "text-xl", sub: "text-xs" },
  };

  const s = sizes[size];
  const isCover = variant === "cover";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 select-none",
        isCover &&
          "rounded-2xl bg-[#f4f6f2]/95 dark:bg-[#1c2519]/95 border border-[#85987a]/50 px-3.5 py-1.5 shadow-lg backdrop-blur-md",
        className
      )}
    >
      {/* Monograma original de Jerovia en Verde Oliva (#536c45) con contraste garantizado */}
      <div
        className={cn(
          "rounded-xl bg-[#536c45] text-white font-black font-serif flex items-center justify-center shadow-sm border border-[#85987a]/60 shrink-0",
          s.badge
        )}
      >
        J
      </div>

      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-black tracking-[0.08em] uppercase",
            isCover
              ? "text-[#1a2216] dark:text-[#f4f6f2]"
              : "text-text",
            s.title
          )}
        >
          JEROVIA
        </span>
        <span
          className={cn(
            "font-mono font-bold uppercase tracking-[0.2em] mt-0.5",
            isCover
              ? "text-[#536c45] dark:text-[#9bb08f]"
              : "text-gold",
            s.sub
          )}
        >
          CONSULTORA
        </span>
      </div>
    </div>
  );
}
