"use client";

import { DashboardMapSkeleton } from "./dashboard-skeletons";

type MapLoadingStateProps = {
  className?: string;
};

export function MapLoadingState({ className }: MapLoadingStateProps) {
  return (
    <div
      className={
        className ??
        "flex h-full min-h-[34rem] items-stretch rounded-[2rem] border border-white/70 bg-white/70 p-3 shadow-[0_16px_40px_rgba(37,99,235,0.12)]"
      }
      aria-busy="true"
      aria-live="polite"
    >
      <DashboardMapSkeleton />
    </div>
  );
}
