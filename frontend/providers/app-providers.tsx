"use client";

import type { ReactNode } from "react";
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider";
import { SessionProvider } from "@/providers/session-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <OnboardingProvider>{children}</OnboardingProvider>
    </SessionProvider>
  );
}
