"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Spot } from "@/lib/spots";
import type { OnboardingContext } from "@/lib/onboarding";

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
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        zoomControl
        className="h-full w-full"
      >
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

        <div className="pointer-events-none absolute left-4 top-4 z-[500] rounded-full border border-white/70 bg-white/80 px-4 py-3 shadow-[0_14px_36px_rgba(37,99,235,0.1)] backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#191c1e]">
            <span className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-[#6a7080]">
              Contexto centrado
            </span>
            <span className="text-[#004ac6]">{context.name}</span>
            <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-xs font-semibold text-[#004ac6]">
              {spots.length} spots visibles
            </span>
            {loading ? (
              <span className="rounded-full border border-[#d7deea] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6a7080]">
                Ajustando
              </span>
            ) : null}
          </div>
        </div>
      </MapContainer>
    </div>
  );
}
