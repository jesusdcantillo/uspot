"use client";

import type { ReactNode } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";

type OnboardingLayoutProps = {
  children: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
};

export function OnboardingLayout({
  children,
  action,
  footer,
}: OnboardingLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f7f9fb] text-[#191c1e]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#2563eb]/5 blur-3xl" />
        <div className="absolute right-0 top-16 h-96 w-96 rounded-full bg-[#b90538]/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#004ac6]/5 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <BrandLogo />
          {action ? (
            <div className="flex items-center gap-3">{action}</div>
          ) : null}
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center justify-center overflow-hidden px-5 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {footer ? (
        <footer className="relative z-10 border-t border-[#e0e3e5]/80 bg-white/45 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-5 py-4 text-xs text-[#434655] sm:flex-row sm:px-6 lg:px-8">
            {footer}
          </div>
        </footer>
      ) : null}
    </div>
  );
}
