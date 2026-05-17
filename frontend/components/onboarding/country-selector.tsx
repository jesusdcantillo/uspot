"use client";

import { COUNTRIES } from "@/lib/onboarding";

type CountrySelectorProps = {
  value: string | null;
  onChange: (country: string) => void;
};

export function CountrySelector({ value, onChange }: CountrySelectorProps) {
  const country = COUNTRIES[0];
  const selected = value === country.name;

  return (
    <section className="rounded-[1.75rem] border border-white/60 bg-white/80 p-5 shadow-[0_12px_40px_rgba(37,99,235,0.08)] backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#434655]">
            País
          </p>
          <h2 className="mt-1 text-xl font-bold text-[#191c1e]">
            Selecciona tu ubicación
          </h2>
        </div>
        <div className="rounded-full bg-[#dbe1ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#004ac6]">
          Fijo temporalmente
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(country.name)}
        className={`flex w-full items-center gap-4 rounded-[1.5rem] border px-4 py-4 text-left transition ${
          selected
            ? "border-[#004ac6] bg-[#eef3ff] shadow-[0_10px_30px_rgba(0,74,198,0.12)]"
            : "border-[#c3c6d7] bg-white hover:border-[#004ac6]/50 hover:bg-[#f6f8ff]"
        }`}
      >
        <div className="flex h-14 w-14 flex-col overflow-hidden rounded-full border border-white shadow-sm">
          <span className="h-1/2 bg-[#fcd116]" />
          <span className="h-1/4 bg-[#003893]" />
          <span className="h-1/4 bg-[#ce1126]" />
        </div>

        <div className="flex-1">
          <p className="text-lg font-semibold text-[#191c1e]">{country.name}</p>
          <p className="mt-1 text-sm text-[#434655]">
            Exploración contextual en Colombia.
          </p>
        </div>

        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
            selected ? "bg-[#004ac6] text-white" : "bg-[#eceef0] text-[#434655]"
          }`}
        >
          {selected ? "Seleccionado" : "Elegir"}
        </div>
      </button>
    </section>
  );
}
