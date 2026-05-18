"use client";

import type { Spot } from "@/lib/spots";

type DashboardSpotsBarProps = {
  spots: Spot[];
};

export function DashboardSpotsBar({ spots }: DashboardSpotsBarProps) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/70 p-3 shadow-[0_18px_40px_rgba(37,99,235,0.14)] backdrop-blur-xl">
      <div className="flex items-center justify-between px-2 pb-3">
        <div>
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-[#6a7080]">
            Spots destacados
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#191c1e]">
            Explora el contexto
          </h2>
        </div>

        <button className="text-sm font-semibold text-[#004ac6] transition hover:underline">
          Ver todos
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {spots.map((spot, index) => {
          const imageUrl = spot.images[0]?.url ?? null;

          return (
            <article
              key={spot.id}
              className="min-w-[18rem] max-w-[18rem] shrink-0 snap-start overflow-hidden rounded-xl border border-white/40 bg-white shadow-[0_16px_30px_rgba(37,99,235,0.1)]"
            >
              <div className="relative h-36 overflow-hidden bg-[linear-gradient(135deg,_#dbe1ff,_#eef3fb)]">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={spot.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(0,74,198,0.18),_transparent_62%)] text-sm font-semibold text-[#004ac6]">
                    Spot contextual
                  </div>
                )}

                <div className="absolute left-3 top-3 rounded-full bg-[#004ac6] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg">
                  {spot.category.name}
                </div>
              </div>

              <div className="p-3">
                <div className="min-w-0">
                  <p className="truncate text-[0.98rem] font-semibold text-[#191c1e]">
                    {spot.title}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-[#6a7080]">
                    {spot.address ??
                      spot.category.description ??
                      "Spot contextual"}
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[#6a7080]">
                  <span>
                    {index + 1} · {spot.category.name}
                  </span>
                  <span>0.{index + 4} km</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
