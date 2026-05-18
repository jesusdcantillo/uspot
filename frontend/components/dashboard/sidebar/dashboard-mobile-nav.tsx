"use client";

type DashboardMobileNavProps = {
  onDiscover: () => void;
};

export function DashboardMobileNav({ onDiscover }: DashboardMobileNavProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[1300] border-t border-white/30 bg-white/92 px-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-10px_30px_rgba(37,99,235,0.08)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-4xl grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onDiscover}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-[#eef2f9] px-2 py-2.5 text-[0.7rem] font-semibold text-[#004ac6] transition hover:bg-[#e2e8f7]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-base shadow-[0_8px_18px_rgba(0,74,198,0.12)]">
            +
          </span>
          Descubre
        </button>
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 text-[0.7rem] font-medium text-[#6a7080] transition hover:bg-[#f4f6fa] hover:text-[#191c1e]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2f9] text-sm">
            ♥
          </span>
          Favoritos
        </button>
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 text-[0.7rem] font-medium text-[#6a7080] transition hover:bg-[#f4f6fa] hover:text-[#191c1e]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2f9] text-sm">
            ●
          </span>
          Perfil
        </button>
      </div>
    </div>
  );
}
