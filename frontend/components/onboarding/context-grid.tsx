"use client";

import { ContextCard } from "./context-card";
import type { OnboardingContext } from "@/lib/onboarding";

type ContextGridProps = {
  contexts: OnboardingContext[];
  selectedContextId: number | null;
  onSelect: (context: OnboardingContext) => void;
};

export function ContextGrid({
  contexts,
  selectedContextId,
  onSelect,
}: ContextGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {contexts.map((context) => (
        <ContextCard
          key={context.id}
          context={context}
          selected={selectedContextId === context.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
