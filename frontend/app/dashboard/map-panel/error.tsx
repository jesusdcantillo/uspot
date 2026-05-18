"use client";

import { useEffect } from "react";
import { MapErrorState } from "@/components/dashboard/error/map-error-state";

type MapPanelRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function MapPanelRouteError({
  error,
  reset,
}: MapPanelRouteErrorProps) {
  useEffect(() => {
    console.error("Map panel route error", error);
  }, [error]);

  return (
    <div className="h-screen w-screen bg-[#f7f9fb] p-3">
      <MapErrorState error={error} onRetry={reset} />
    </div>
  );
}
