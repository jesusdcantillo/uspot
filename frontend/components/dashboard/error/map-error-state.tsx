"use client";

import { getFetchErrorCopy } from "@/lib/fetch-with-timeout";
import { DashboardErrorState } from "./dashboard-error-state";

type MapErrorStateProps = {
  error?: unknown;
  onRetry: () => void;
};

export function MapErrorState({ error, onRetry }: MapErrorStateProps) {
  return (
    <div className="flex h-full min-h-[34rem] items-center justify-center rounded-[2rem] border border-white/70 bg-white/70 px-4 shadow-[0_16px_40px_rgba(37,99,235,0.12)]">
      <DashboardErrorState
        title="El mapa no está disponible temporalmente"
        description={getFetchErrorCopy(
          error,
          "No pudimos cargar el mapa en este momento.",
        )}
        detail="Puedes reintentar sin perder la selección actual del espacio."
        actionLabel="Reintentar mapa"
        onAction={onRetry}
        className="w-full max-w-xl"
      />
    </div>
  );
}
