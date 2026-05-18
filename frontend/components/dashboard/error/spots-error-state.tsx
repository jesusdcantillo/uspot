"use client";

import { getFetchErrorCopy } from "@/lib/fetch-with-timeout";
import { DashboardErrorState } from "./dashboard-error-state";

type SpotsErrorStateProps = {
  error?: unknown;
  onRetry: () => void;
};

export function SpotsErrorState({ error, onRetry }: SpotsErrorStateProps) {
  return (
    <DashboardErrorState
      title="No pudimos cargar los spots"
      description={getFetchErrorCopy(
        error,
        "Revisa tu conexión e inténtalo nuevamente.",
      )}
      detail="El mapa sigue disponible y puedes cambiar de espacio sin recargar la página."
      actionLabel="Reintentar spots"
      onAction={onRetry}
      className="w-full max-w-5xl rounded-2xl border border-[#f0d5d5] bg-white/92 px-5 py-5 shadow-[0_18px_40px_rgba(37,99,235,0.14)] backdrop-blur-xl"
    />
  );
}
