"use client";

import { useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso7Schema, type Paso7Data } from "@/lib/validations";
import { Input, Textarea, Toggle } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import {
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface PasoProps {
  defaultValues?: Partial<Paso7Data>;
  onNext: (data: Paso7Data) => void;
  onPrev: () => void;
}

function parseGuaranies(raw: unknown): number {
  if (typeof raw === "number") return isNaN(raw) ? 0 : raw;
  if (typeof raw !== "string") return 0;
  const digits = raw.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function Paso7_Economico({ defaultValues, onNext, onPrev }: PasoProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Paso7Data>({
    resolver: zodResolver(paso7Schema),
    defaultValues: { ...defaultValues },
  });

  const productosEntidad = Boolean(watch("productosEntidad"));
  const familiaresProductosEntidad = Boolean(watch("familiaresProductosEntidad"));
  const prestamos = Boolean(watch("prestamos"));

  const ingFamRaw = watch("ingresosFamiliares");
  const otrosIngRaw = watch("otrosIngresos");
  const egresosRaw = watch("egresosMensuales");

  const balance = useMemo(() => {
    const ingTotal = parseGuaranies(ingFamRaw) + parseGuaranies(otrosIngRaw);
    const egrTotal = parseGuaranies(egresosRaw);
    const disponible = ingTotal - egrTotal;
    const ratioEgreso = ingTotal > 0 ? Math.round((egrTotal / ingTotal) * 100) : 0;
    return { ingTotal, egrTotal, disponible, ratioEgreso };
  }, [ingFamRaw, otrosIngRaw, egresosRaw]);

  const onSubmit: SubmitHandler<Paso7Data> = (data) => onNext(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit as SubmitHandler<Record<string, unknown>>)}
      className="flex flex-col gap-6"
      noValidate
    >
      <div className="flex items-center gap-3 pb-4 border-b border-overlay0/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 shrink-0">
          <Wallet className="h-5 w-5 text-gold" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text">
            7. Flujo Financiero y Situación Patrimonial
          </h2>
          <p className="text-xs text-subtext0">
            Ingresos verificables, gastos operativos del hogar y nivel de endeudamiento
          </p>
        </div>
      </div>

      {/* Flujo Mensual */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Ingresos Familiares Mensuales (Gs.)"
          inputMode="numeric"
          placeholder="Ej: 8.500.000"
          {...register("ingresosFamiliares")}
          error={errors.ingresosFamiliares?.message}
        />

        <Input
          label="Ingresos Adicionales / Renta (Gs.)"
          inputMode="numeric"
          placeholder="Ej: 1.500.000"
          {...register("otrosIngresos")}
          error={errors.otrosIngresos?.message}
        />

        <Input
          label="Egresos Totales Mensuales (Gs.)"
          inputMode="numeric"
          placeholder="Ej: 5.200.000"
          {...register("egresosMensuales")}
          error={errors.egresosMensuales?.message}
        />
      </div>

      {/* Panel de Liquidez Calculada en Tiempo Real */}
      {balance.ingTotal > 0 && (
        <div
          className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            balance.disponible >= 0
              ? "border-green/30 bg-green/5"
              : "border-red/40 bg-red/10"
          }`}
        >
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase font-bold text-subtext0 flex items-center gap-1.5">
              {balance.disponible >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-green" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 text-red" />
              )}
              Capacidad Neta Mensual Calculada
            </span>
            <p
              className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${
                balance.disponible >= 0 ? "text-green" : "text-red"
              }`}
            >
              Gs. {balance.disponible.toLocaleString("es-PY")}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs tabular-nums">
            <div>
              <span className="text-subtext0 block">Total Ingresos</span>
              <span className="font-bold text-text font-mono">
                Gs. {balance.ingTotal.toLocaleString("es-PY")}
              </span>
            </div>
            <div className="h-8 w-px bg-overlay0/50" />
            <div>
              <span className="text-subtext0 block">Compromiso de Gasto</span>
              <span className="font-bold text-text font-mono">{balance.ratioEgreso}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Relación Bancaria y Pasivos */}
      <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-4 sm:p-5 space-y-3.5">
        <Toggle
          label="¿Es cliente activo o posee productos en la entidad solicitante?"
          checked={productosEntidad}
          onChange={(val) => setValue("productosEntidad", val, { shouldDirty: true })}
        />
        {productosEntidad && (
          <Input
            label="Detalle de productos activos (Caja de ahorro, tarjetas, créditos)"
            placeholder="Ej: Caja de ahorro Gs. y Tarjeta de Crédito Clásica"
            {...register("tiposProductosEntidad")}
            error={errors.tiposProductosEntidad?.message}
          />
        )}

        <div className="border-t border-overlay0/40 pt-2">
          <Toggle
            label="¿Posee familiares directos que operen con la entidad solicitante?"
            checked={familiaresProductosEntidad}
            onChange={(val) =>
              setValue("familiaresProductosEntidad", val, { shouldDirty: true })
            }
          />
        </div>

        <div className="border-t border-overlay0/40 pt-2">
          <Toggle
            label="¿Registra préstamos, tarjetas o compromisos financieros vigentes en plaza?"
            checked={prestamos}
            onChange={(val) => setValue("prestamos", val, { shouldDirty: true })}
          />
          {prestamos && (
            <div className="pt-2">
              <Textarea
                label="Detalle de acreedores, cuotas mensuales y saldo pendiente"
                placeholder="Ej: Cooperativa Universitaria - Cuota Gs. 850.000 (faltan 10 cuotas)"
                rows={3}
                {...register("prestamosDetalle")}
                error={errors.prestamosDetalle?.message}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-overlay0/40">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onPrev}
          className="w-full sm:w-auto"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto min-w-[180px]"
        >
          <span>Guardar y Continuar</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
