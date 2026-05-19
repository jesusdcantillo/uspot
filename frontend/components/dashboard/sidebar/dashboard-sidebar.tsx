"use client";

import { BrandLogo } from "@/components/shared/brand-logo";

type DashboardSidebarProps = {
  onDiscover: () => void;
  onCreateSpot?: () => void;
};

export function DashboardSidebar({
  onDiscover,
  onCreateSpot,
}: DashboardSidebarProps) {
  return (
    <aside className="fixed left-4 top-4 z-20 hidden h-[calc(100vh-2rem)] w-64 flex-col rounded-xl border border-white/30 bg-white/80 px-4 pb-6 pt-6 shadow-[0_16px_40px_rgba(37,99,235,0.12)] backdrop-blur-xl lg:flex">
      <div className="mb-6 px-2">
        <BrandLogo />
      </div>

      <nav className="flex-1 space-y-2">
        <button
          type="button"
          onClick={onDiscover}
          className="w-full rounded-xl bg-[#eef2f9] px-4 py-3 text-left text-sm font-medium text-[#434655] transition hover:bg-[#2563eb] hover:text-white"
        >
          Descubre
        </button>
        <button
          type="button"
          className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-[#434655] transition hover:bg-[#2563eb] hover:text-white"
        >
          Favoritos
        </button>
        <button
          type="button"
          className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-[#434655] transition hover:bg-[#2563eb] hover:text-white"
        >
          Perfil
        </button>
      </nav>

      <div className="mt-4 px-2">
        <button
          type="button"
          onClick={onCreateSpot ?? onDiscover}
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#004ac6] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,74,198,0.18)] transition hover:bg-[#2563eb]"
        >
          Nuevo Spot
        </button>
      </div>
    </aside>
  );
}
