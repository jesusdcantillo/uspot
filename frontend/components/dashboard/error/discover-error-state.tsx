"use client";

import { getFetchErrorCopy } from "@/lib/fetch-with-timeout";
import { DashboardErrorState } from "./dashboard-error-state";

type DiscoverErrorStateProps = {
  error?: unknown;
  onRetry: () => void;
};

export function DiscoverErrorState({
  error,
  onRetry,
}: DiscoverErrorStateProps) {
  return (
    <DashboardErrorState
      title="No pudimos cargar los espacios disponibles"
      description={getFetchErrorCopy(
        error,
        "Revisa tu conexión e inténtalo nuevamente.",
      )}
      detail="La selección persistida no se pierde. Solo necesitas reintentar la carga de ciudades y espacios."
      actionLabel="Reintentar discover"
      onAction={onRetry}
      className="w-full rounded-3xl border border-[#f0d5d5] bg-white/92 px-5 py-5 shadow-[0_24px_80px_rgba(15,23,42,0.26)] backdrop-blur-xl md:px-8"
    />
  );
}
