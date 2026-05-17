import {
  CONTEXT_DISPLAY_ORDER,
  CONTEXT_TYPE_DESCRIPTIONS,
  CONTEXT_TYPE_IMAGES,
  FALLBACK_CONTEXTS,
  type ContextType,
  type OnboardingContext,
} from "./onboarding";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function mapContexts(
  items: Array<{ id: number; name: string; type: ContextType }>,
): OnboardingContext[] {
  return items
    .map((context) => ({
      id: context.id,
      name: context.name,
      type: context.type,
      description: CONTEXT_TYPE_DESCRIPTIONS[context.type],
      imageSrc: CONTEXT_TYPE_IMAGES[context.type],
    }))
    .sort((left, right) => {
      const leftIndex = CONTEXT_DISPLAY_ORDER.indexOf(left.type);
      const rightIndex = CONTEXT_DISPLAY_ORDER.indexOf(right.type);

      if (leftIndex !== rightIndex) {
        return leftIndex - rightIndex;
      }

      return left.name.localeCompare(right.name);
    });
}

export async function getContexts(): Promise<OnboardingContext[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/contexts`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("No se pudieron cargar los contextos");
    }

    const items = (await response.json()) as Array<{
      id: number;
      name: string;
      type: ContextType;
    }>;

    if (items.length === 0) {
      return FALLBACK_CONTEXTS;
    }

    return mapContexts(items);
  } catch {
    return FALLBACK_CONTEXTS;
  }
}
