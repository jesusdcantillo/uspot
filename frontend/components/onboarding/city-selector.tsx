"use client";

import type { CityRecord } from "@/lib/cities";

type CitySelectorProps = {
  selectedCountry: string | null;
  selectedCityId: number | null;
  cities: CityRecord[];
  onChange: (city: CityRecord) => void;
};

export function CitySelector({
  selectedCountry,
  selectedCityId,
  cities,
  onChange,
}: CitySelectorProps) {
  const availableCities =
    selectedCountry === "Colombia"
      ? cities.filter((city) => city.country === "COLOMBIA")
      : [];

  return (
    <section className="rounded-[1.75rem] border border-white/60 bg-white/80 p-5 shadow-[0_12px_40px_rgba(37,99,235,0.08)] backdrop-blur-xl">
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#434655]">
          Ciudad
        </p>
        <h2 className="mt-1 text-xl font-bold text-[#191c1e]">
          Elige una ciudad
        </h2>
      </div>

      <div className="space-y-3">
        {availableCities.map((city) => {
          const active = selectedCityId === city.id;

          return (
            <button
              key={city.id}
              type="button"
              onClick={() => onChange(city)}
              className={`flex w-full items-center justify-between rounded-[1.25rem] border px-4 py-4 text-left transition ${
                active
                  ? "border-[#004ac6] bg-[#004ac6] text-white shadow-[0_12px_30px_rgba(0,74,198,0.18)]"
                  : "border-[#c3c6d7] bg-white text-[#191c1e] hover:border-[#004ac6]/50 hover:bg-[#f6f8ff]"
              }`}
            >
              <div>
                <p className="text-base font-semibold">{city.name}</p>
                <p
                  className={`mt-1 text-sm ${active ? "text-white/80" : "text-[#434655]"}`}
                >
                  Selección temporal para el MVP.
                </p>
              </div>
              <div
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                  active
                    ? "border-white/30 bg-white/15 text-white"
                    : "border-[#c3c6d7] bg-[#eceef0] text-[#434655]"
                }`}
              >
                {active ? "Seleccionada" : "Seleccionar"}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
