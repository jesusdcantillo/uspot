import { OnboardingProvider } from "@/components/onboarding/onboarding-provider";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export default function Home() {
  return (
    <OnboardingProvider>
      <OnboardingFlow />
    </OnboardingProvider>
  );
}
