"use client";

import { ContextCard } from "./context-card";
import {
  CONTEXT_DISPLAY_ORDER,
  CONTEXT_TYPE_DESCRIPTIONS,
  CONTEXT_TYPE_IMAGES,
  CONTEXT_TYPE_LABELS,
  type ContextType,
  type OnboardingContext,
} from "@/lib/onboarding";

type ContextTypeGridProps = {
  selectedContextId: number | null;
  onSelect: (context: OnboardingContext) => void;
};

export function ContextTypeGrid({
  selectedContextId,
  onSelect,
}: ContextTypeGridProps) {
  const types: ContextType[] = CONTEXT_DISPLAY_ORDER;

  const syntheticContexts: OnboardingContext[] = types.map((type, idx) => ({
    id: -(idx + 1),
    name: CONTEXT_TYPE_LABELS[type],
    type,
    description: CONTEXT_TYPE_DESCRIPTIONS[type],
    imageSrc: CONTEXT_TYPE_IMAGES[type],
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {syntheticContexts.map((context) => (
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
