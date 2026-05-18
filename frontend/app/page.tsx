import { Suspense } from "react";
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

function OnboardingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(0,74,198,0.08),_transparent_36%),linear-gradient(180deg,_#f7f9fb_0%,_#eef3fb_100%)] px-4 py-8 text-[#191c1e]">
      <div className="w-full max-w-3xl rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_24px_70px_rgba(37,99,235,0.12)] backdrop-blur-xl">
        <div className="h-3 w-28 rounded-full uspot-skeleton" />
        <div className="mt-5 h-10 w-3/4 rounded-full uspot-skeleton" />
        <div className="mt-3 h-4 w-full rounded-full uspot-skeleton" />
        <div className="mt-3 h-4 w-5/6 rounded-full uspot-skeleton" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="h-40 rounded-[1.5rem] uspot-skeleton" />
          <div className="h-40 rounded-[1.5rem] uspot-skeleton" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <OnboardingProvider>
      <Suspense fallback={<OnboardingFallback />}>
        <OnboardingFlow />
      </Suspense>
    </OnboardingProvider>
  );
}
