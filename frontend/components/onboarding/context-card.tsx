"use client";

import Image from "next/image";
import { CONTEXT_TYPE_LABELS, type OnboardingContext } from "@/lib/onboarding";

type ContextCardProps = {
  context: OnboardingContext;
  selected: boolean;
  onSelect: (context: OnboardingContext) => void;
};

export function ContextCard({ context, selected, onSelect }: ContextCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(context)}
      className={`group overflow-hidden rounded-[1.5rem] border text-left transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(37,99,235,0.14)] ${
        selected
          ? "border-[#004ac6] bg-white shadow-[0_18px_50px_rgba(0,74,198,0.16)] ring-1 ring-[#004ac6]/20"
          : "border-white/70 bg-white/80 shadow-[0_12px_32px_rgba(37,99,235,0.08)]"
      }`}
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={context.imageSrc}
          alt={context.name}
          fill
          sizes="(max-width: 1024px) 100vw, 360px"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-black/5 to-transparent" />

        <div className="absolute left-3 top-3 rounded-full bg-[#004ac6] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg">
          {CONTEXT_TYPE_LABELS[context.type]}
        </div>

        {selected ? (
          <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#004ac6] shadow-lg">
            Seleccionado
          </div>
        ) : null}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="text-lg font-semibold text-[#191c1e]">{context.name}</h3>
        <p className="text-sm leading-6 text-[#434655]">
          {context.description}
        </p>
      </div>
    </button>
  );
}
