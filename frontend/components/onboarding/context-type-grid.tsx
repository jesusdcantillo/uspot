"use client";

import { ContextCard } from "./context-card";
import {
  CONTEXT_DISPLAY_ORDER,
  CONTEXT_TYPE_DESCRIPTIONS,
  CONTEXT_TYPE_LABELS,
  type ContextType,
  type OnboardingContext,
} from "@/lib/onboarding";

type ContextTypeGridProps = {
  contexts: OnboardingContext[];
  selectedContextId: number | null;
  onSelect: (context: OnboardingContext) => void;
};

export function ContextTypeGrid({
  contexts,
  selectedContextId,
  onSelect,
}: ContextTypeGridProps) {
  const types: ContextType[] = CONTEXT_DISPLAY_ORDER;

  return (
    <div className="space-y-8">
      {types.map((type) => {
        const contextsByType = contexts.filter(
          (context) => context.type === type,
        );

        if (contextsByType.length === 0) {
          return null;
        }

        return (
          <section key={type} className="space-y-4">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#434655]">
                {CONTEXT_TYPE_LABELS[type]}
              </p>
              <p className="text-sm leading-6 text-[#434655]">
                {CONTEXT_TYPE_DESCRIPTIONS[type]}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {contextsByType.map((context) => (
                <ContextCard
                  key={context.id}
                  context={context}
                  selected={selectedContextId === context.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
