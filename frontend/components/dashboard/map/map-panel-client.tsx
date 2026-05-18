"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CONTEXT_TYPE_DESCRIPTIONS,
  CONTEXT_TYPE_IMAGES,
  type ContextType,
  type OnboardingContext,
} from "@/lib/onboarding";
import type { Spot } from "@/lib/spots";
import { getSpots } from "@/lib/spots";
import { MapErrorState } from "../error/map-error-state";
import { MapLoadingState } from "../loading/map-loading-state";
import { MapErrorBoundary } from "./map-error-boundary";

type MapPanelClientProps = {
  contextId: number;
  contextName: string;
  contextType: ContextType;
  latitude: number;
  longitude: number;
  zoom: number;
  retryKey: number;
};

export function MapPanelClient({
  contextId,
  contextName,
  contextType,
  latitude,
  longitude,
  zoom,
  retryKey,
}: MapPanelClientProps) {
  const [spotsState, setSpotsState] = useState<{
    status: "loading" | "ready" | "error";
    spots: Spot[];
    error: unknown;
  }>({
    status: "loading",
    spots: [],
    error: null,
  });
  const [MapModule, setMapModule] = useState<
    typeof import("./dashboard-map") | null
  >(null);
  const [mapLoadError, setMapLoadError] = useState<unknown>(null);
  const [mapLoadNonce, setMapLoadNonce] = useState(0);
  const [spotsRetryNonce, setSpotsRetryNonce] = useState(0);

  const context = useMemo(
    () => ({
      id: contextId,
      name: contextName,
      type: contextType,
      description: CONTEXT_TYPE_DESCRIPTIONS[contextType],
      imageSrc: CONTEXT_TYPE_IMAGES[contextType],
      latitude,
      longitude,
      zoom,
    }),
    [contextId, contextName, contextType, latitude, longitude, zoom],
  );

  useEffect(() => {
    let active = true;
    const timeoutId = globalThis.setTimeout(() => {
      if (active) {
        setMapLoadError(new Error("El mapa no está disponible temporalmente."));
      }
    }, 5000);

    void import("./dashboard-map")
      .then((module) => {
        if (active) {
          setMapModule(module);
          globalThis.clearTimeout(timeoutId);
        }
      })
      .catch((error) => {
        if (active) {
          setMapLoadError(error);
          globalThis.clearTimeout(timeoutId);
        }
      });

    void getSpots(contextId)
      .then((items) => {
        if (active) {
          setSpotsState({ status: "ready", spots: items, error: null });
        }
      })
      .catch((error) => {
        if (active) {
          setSpotsState({ status: "error", spots: [], error });
        }
      });

    return () => {
      active = false;
      globalThis.clearTimeout(timeoutId);
    };
  }, [contextId, retryKey, spotsRetryNonce, mapLoadNonce]);

  const handleRetryMap = () => {
    setMapLoadError(null);
    setMapModule(null);
    setMapLoadNonce((current) => current + 1);
  };

  const handleRetrySpots = () => {
    setSpotsState({ status: "loading", spots: [], error: null });
    setSpotsRetryNonce((current) => current + 1);
  };

  if (spotsState.status === "error") {
    return (
      <MapErrorState error={spotsState.error} onRetry={handleRetrySpots} />
    );
  }

  if (mapLoadError) {
    return <MapErrorState error={mapLoadError} onRetry={handleRetryMap} />;
  }

  if (spotsState.status === "loading" || !MapModule) {
    return <MapLoadingState />;
  }

  return (
    <MapErrorBoundary resetKey={retryKey}>
      <MapModule.DashboardMap
        context={context as OnboardingContext}
        spots={spotsState.spots}
        loading={false}
      />
    </MapErrorBoundary>
  );
}
