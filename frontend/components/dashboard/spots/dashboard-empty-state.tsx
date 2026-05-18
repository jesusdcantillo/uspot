"use client";

type DashboardEmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
  disabled?: boolean;
};

export function DashboardEmptyState({
  title,
  description,
  actionLabel,
  onAction,
  disabled = true,
}: DashboardEmptyStateProps) {
  return (
    <section className="mx-auto flex w-full max-w-2xl items-center justify-center rounded-[2.5rem] border border-white/60 bg-white/85 px-6 py-12 text-center shadow-[0_24px_70px_rgba(37,99,235,0.12)] backdrop-blur-xl sm:px-10">
      <div className="max-w-xl">
        <p className="mt-5 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#6a7080]">
          Espacio sin spots
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#191c1e] sm:text-3xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#556070]">
          {description}
        </p>

        <button
          type="button"
          onClick={onAction}
          disabled={disabled}
          className={`mt-7 inline-flex items-center justify-center rounded-full bg-[#004ac6] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(0,74,198,0.18)] transition ${
            disabled
              ? "cursor-not-allowed opacity-70"
              : "hover:-translate-y-0.5 hover:bg-[#2563eb] hover:shadow-[0_18px_34px_rgba(0,74,198,0.22)]"
          }`}
        >
          <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/35 bg-white/15 text-[0.95rem] leading-none text-white">
            +
          </span>
          {actionLabel}
        </button>
      </div>
    </section>
  );
}
