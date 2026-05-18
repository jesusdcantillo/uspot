"use client";

import {
  DashboardHeaderSkeleton,
  DashboardSidebarSkeleton,
} from "./dashboard-skeletons";
import { MapLoadingState } from "./map-loading-state";
import { SpotsLoadingState } from "./spots-loading-state";

export function DashboardLoadingState() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f9fb] text-[#191c1e]">
      <DashboardSidebarSkeleton />

      <div className="flex min-h-screen flex-col lg:pl-[18.5rem]">
        <DashboardHeaderSkeleton />

        <main className="relative h-screen w-full pt-28 lg:pt-32">
          <div className="absolute inset-0 px-4 pb-4">
            <MapLoadingState className="h-full min-h-full rounded-[2rem] border border-white/70 bg-white/70 p-3 shadow-[0_16px_40px_rgba(37,99,235,0.12)]" />
          </div>

          <section className="fixed bottom-24 left-3 right-3 z-[1200] pointer-events-auto lg:bottom-3 lg:left-[19.5rem] lg:right-6">
            <SpotsLoadingState />
          </section>
        </main>
      </div>
    </div>
  );
}
