"use client";

import type { Spot } from "@/lib/spots";
import type { OnboardingContext } from "@/lib/onboarding";

type DashboardMapLoaderProps = {
  context: OnboardingContext;
  spots: Spot[];
  loading: boolean;
  retryKey: number;
  onRetry: () => void;
};

function buildMapPanelUrl(
  context: OnboardingContext,
  retryKey: number,
  spotCount: number,
) {
  const params = new URLSearchParams();

  params.set("contextId", String(context.id));
  params.set("contextName", context.name);
  params.set("contextType", context.type);
  params.set("latitude", String(context.latitude ?? ""));
  params.set("longitude", String(context.longitude ?? ""));
  params.set("zoom", String(context.zoom ?? ""));
  params.set("retryKey", String(retryKey));
  params.set("spotCount", String(spotCount));

  return `/dashboard/map-panel?${params.toString()}`;
}

export function DashboardMapLoader({
  context,
  spots,
  loading,
  retryKey,
}: DashboardMapLoaderProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-[0_16px_40px_rgba(37,99,235,0.12)]">
      <iframe
        key={`${retryKey}-${context.id}`}
        title={`Mapa de ${context.name}`}
        src={buildMapPanelUrl(context, retryKey, spots.length)}
        className="h-full w-full border-0"
        loading="eager"
        aria-busy={loading}
      />
    </div>
  );
}
