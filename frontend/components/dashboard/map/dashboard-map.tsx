"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Spot } from "@/lib/spots";
import type { OnboardingContext } from "@/lib/onboarding";
import { MapLoadingState } from "../loading/map-loading-state";

type DashboardMapProps = {
  context: OnboardingContext;
  spots: Spot[];
  loading: boolean;
};

function MapCenterSync({ context }: { context: OnboardingContext }) {
  const map = useMap();

  useEffect(() => {
    if (
      context.latitude === null ||
      context.longitude === null ||
      context.zoom === null ||
      context.latitude === undefined ||
      context.longitude === undefined ||
      context.zoom === undefined
    ) {
      return;
    }

    map.setView([context.latitude, context.longitude], context.zoom, {
      animate: true,
    });
  }, [context, map]);

  return null;
}

function createSpotIcon(index: number) {
  return L.divIcon({
    className: "",
    html: `
      <div style="transform: translate(-50%, -100%);">
        <div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:999px;background:linear-gradient(135deg,#004ac6,#7da0ff);border:3px solid rgba(255,255,255,0.95);box-shadow:0 14px 30px rgba(0,74,198,0.28);color:#fff;font-size:11px;font-weight:700;">
          ${index + 1}
        </div>
        <div style="margin:-3px auto 0;width:12px;height:12px;border-radius:999px;background:#004ac6;opacity:0.26;filter:blur(2px);"></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
}

export function DashboardMap({ context, spots, loading }: DashboardMapProps) {
  const center = useMemo(
    () =>
      [context.latitude as number, context.longitude as number] as [
        number,
        number,
      ],
    [context.latitude, context.longitude],
  );

  const zoom = context.zoom as number;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {loading ? (
        <div className="absolute inset-0 z-10">
          <MapLoadingState className="h-full min-h-full rounded-none border-0 bg-transparent p-0 shadow-none" />
        </div>
      ) : null}

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        zoomControl
        className="h-full w-full"
      >
        <MapSelectionListener />
        <MapCenterSync context={context} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {spots.map((spot, index) => (
          <Marker
            key={spot.id}
            position={[spot.latitude, spot.longitude]}
            icon={createSpotIcon(index)}
          >
            <Popup>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#191c1e]">
                  {spot.title}
                </p>
                <p className="text-xs text-[#435064]">{spot.category.name}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function MapSelectionListener() {
  const map = useMap();

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data as Record<string, unknown> | null;
      if (!data || data.type !== "uspot:map:enable-selection") return;

      // once: wait for next click and post back to parent
      const handler = (e: L.LeafletMouseEvent) => {
        try {
          const lat = e.latlng.lat as number;
          const lng = e.latlng.lng as number;
          window.parent.postMessage(
            { type: "uspot:map:selected", latitude: lat, longitude: lng },
            "*",
          );
        } finally {
          map.off("click", handler);
        }
      };

      map.once("click", handler);
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [map]);

  return null;
}
