"use client";

import { CONTEXT_TYPE_LABELS, type ContextType } from "@/lib/onboarding";

type DashboardHeaderProps = {
  cityName: string;
  contextName: string;
  contextType: ContextType;
  statusLabel: string;
  onResetFlow: () => void;
};

export function DashboardHeader({
  cityName,
  contextName,
  contextType,
  statusLabel,
  onResetFlow,
}: DashboardHeaderProps) {
  return (
    <header className="fixed left-4 right-4 top-4 z-20 lg:left-[19.5rem]">
      <div className="flex items-center justify-between rounded-full border border-white/30 bg-white/80 px-5 py-3 shadow-[0_10px_30px_rgba(37,99,235,0.1)] backdrop-blur-xl">
        <div className="min-w-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#6a7080]">
            Dashboard
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="truncate text-sm text-[#434655] sm:text-base">
              {cityName} <span className="px-2">/</span>
              <span className="font-semibold text-[#004ac6]">
                {contextName}
              </span>
            </p>
            <span className="rounded-full bg-[#dbe1ff] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#004ac6]">
              {CONTEXT_TYPE_LABELS[contextType]}
            </span>
            <span className="rounded-full border border-[#d7deea] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6a7080]">
              {statusLabel}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetFlow}
          className="rounded-full border border-[#d7deea] bg-white px-3 py-2 text-xs font-semibold text-[#434655] transition hover:border-[#004ac6]/40 hover:text-[#004ac6]"
        >
          Reiniciar flujo
        </button>
      </div>
    </header>
  );
}
