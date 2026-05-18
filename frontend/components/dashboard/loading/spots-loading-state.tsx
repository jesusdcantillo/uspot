"use client";

import { DashboardSpotCardSkeleton } from "./dashboard-skeletons";

type SpotsLoadingStateProps = {
  className?: string;
};

export function SpotsLoadingState({ className }: SpotsLoadingStateProps) {
  return (
    <div
      className={
        className ??
        "rounded-2xl border border-white/30 bg-white/70 p-3 shadow-[0_18px_40px_rgba(37,99,235,0.14)] backdrop-blur-xl"
      }
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-center justify-between px-2 pb-3">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded-full uspot-skeleton" />
          <div className="h-5 w-40 rounded-full uspot-skeleton" />
        </div>

        <div className="h-4 w-20 rounded-full uspot-skeleton" />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <DashboardSpotCardSkeleton />
        <DashboardSpotCardSkeleton />
        <DashboardSpotCardSkeleton />
      </div>
    </div>
  );
}
