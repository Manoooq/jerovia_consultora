import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Componente base de Skeleton con animación shimmer respetuosa de accesibilidad
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-xl bg-surface2/60 dark:bg-surface2/40",
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton para las tarjetas de estadísticas métricas del dashboard
 */
export function MetricCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="rounded-2xl border border-overlay0/40 bg-surface0 p-5 shadow-sm space-y-3"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24 rounded-md" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-8 w-16 rounded-lg" />
    </div>
  );
}

/**
 * Skeleton para las filas de entrevistas en la lista del dashboard
 */
export function InterviewRowSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-4 px-6 py-4 border-b border-overlay0/20"
    >
      <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-44 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-64 rounded-md" />
      </div>
      <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
        <Skeleton className="h-3 w-10 rounded-md" />
        <Skeleton className="h-1.5 w-20 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton para el formulario del wizard entre pasos
 */
export function WizardStepSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-6 animate-pulse">
      {/* Header del paso */}
      <div className="flex items-center gap-3 pb-4 border-b border-overlay0/40">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-3.5 w-64 rounded-md" />
        </div>
      </div>

      {/* Inputs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-28 rounded-md" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-32 rounded-md" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Skeleton className="h-3.5 w-36 rounded-md" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between pt-4 border-t border-overlay0/40">
        <Skeleton className="h-11 w-28 rounded-xl" />
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>
    </div>
  );
}
