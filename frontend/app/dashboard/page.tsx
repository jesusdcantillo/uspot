"use client";

import { OnboardingProvider } from "@/components/onboarding/onboarding-provider";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardPage() {
  return (
    <OnboardingProvider>
      <DashboardShell />
    </OnboardingProvider>
  );
}
