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
    <section className="mx-auto flex w-full max-w-2xl items-center justify-center rounded-[2rem] border border-dashed border-[#d6deec] bg-white/70 px-6 py-12 text-center shadow-[0_12px_40px_rgba(37,99,235,0.06)] backdrop-blur-xl">
      <div className="max-w-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dbe1ff] text-lg font-semibold text-[#004ac6] shadow-[0_10px_24px_rgba(0,74,198,0.12)]">
          US
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#191c1e]">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#556070]">{description}</p>

        <button
          type="button"
          onClick={onAction}
          disabled={disabled}
          className={`mt-6 inline-flex items-center justify-center rounded-full bg-[#004ac6] px-5 py-3 text-sm font-semibold text-white ${
            disabled ? "cursor-not-allowed opacity-70" : "hover:brightness-95"
          }`}
        >
          {actionLabel}
        </button>
      </div>
    </section>
  );
}
