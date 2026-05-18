"use client";

type DashboardMobileNavProps = {
  contextName: string;
  onDiscover: () => void;
};

export function DashboardMobileNav({
  contextName,
  onDiscover,
}: DashboardMobileNavProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/20 bg-white/90 px-4 py-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-4xl grid-cols-4 gap-2">
        <button className="rounded-lg px-2 py-2 text-xs font-semibold text-[#004ac6]">
          Descubre
        </button>
        <button className="rounded-lg px-2 py-2 text-xs font-medium text-[#6a7080]">
          Favoritos
        </button>
        <button
          type="button"
          onClick={onDiscover}
          className="rounded-lg bg-[#004ac6] px-2 py-2 text-xs font-semibold text-white"
        >
          Crear
        </button>
        <div className="truncate rounded-lg px-2 py-2 text-center text-xs font-medium text-[#6a7080]">
          {contextName}
        </div>
      </div>
    </div>
  );
}
