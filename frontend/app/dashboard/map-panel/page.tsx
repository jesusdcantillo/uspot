import { MapPanelClient } from "@/components/dashboard/map/map-panel-client";
import type { ContextType } from "@/lib/onboarding";

type MapPanelSearchParams = {
  contextId?: string;
  contextName?: string;
  contextType?: ContextType;
  latitude?: string;
  longitude?: string;
  zoom?: string;
  retryKey?: string;
  spotCount?: string;
};

function toNumber(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

export default async function MapPanelPage({
  searchParams,
}: {
  searchParams?: Promise<MapPanelSearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const contextId = toNumber(resolvedSearchParams.contextId) ?? 0;
  const latitude = toNumber(resolvedSearchParams.latitude) ?? 0;
  const longitude = toNumber(resolvedSearchParams.longitude) ?? 0;
  const zoom = toNumber(resolvedSearchParams.zoom) ?? 13;
  const retryKey = toNumber(resolvedSearchParams.retryKey) ?? 0;
  const contextName = resolvedSearchParams.contextName ?? "Espacio";
  const contextType = resolvedSearchParams.contextType ?? "CITY";

  return (
    <div className="h-screen w-screen bg-[#f7f9fb] p-3">
      <MapPanelClient
        contextId={contextId}
        contextName={contextName}
        contextType={contextType}
        latitude={latitude}
        longitude={longitude}
        zoom={zoom}
        retryKey={retryKey}
      />
    </div>
  );
}
