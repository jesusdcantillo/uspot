import {
  CONTEXT_DISPLAY_ORDER,
  CONTEXT_TYPE_DESCRIPTIONS,
  CONTEXT_TYPE_IMAGES,
  type ContextType,
  type OnboardingContext,
} from "./onboarding";
import { fetchWithTimeout, UspotFetchError } from "./fetch-with-timeout";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const contextsRequestCache = new Map<
  number | null,
  Promise<OnboardingContext[]>
>();
// Keep in-flight promises available briefly to survive quick unmounts/transitions
const IN_FLIGHT_CACHE_TTL_MS = 350;

function mapContexts(
  items: Array<{
    id: number;
    name: string;
    type: ContextType;
    latitude: number | null;
    longitude: number | null;
    zoom: number | null;
  }>,
): OnboardingContext[] {
  return items
    .map((context) => ({
      id: context.id,
      name: context.name,
      type: context.type,
      description: CONTEXT_TYPE_DESCRIPTIONS[context.type],
      imageSrc: CONTEXT_TYPE_IMAGES[context.type],
      latitude: context.latitude,
      longitude: context.longitude,
      zoom: context.zoom,
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

export async function getContexts(
  cityId?: number,
): Promise<OnboardingContext[]> {
  const query = cityId ? `?cityId=${cityId}` : "";
  const cacheKey = cityId ?? null;

  const existingRequest = contextsRequestCache.get(cacheKey);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    // Instrumentation: log when a new contexts request starts
    try {
      // eslint-disable-next-line no-console
      console.debug("getContexts:start", { cityId, time: Date.now() });
    } catch (e) {
      // ignore
    }
    let response: Response;

    try {
      response = await fetchWithTimeout(`${API_BASE_URL}/contexts${query}`, {
        method: "GET",
        cache: "no-store",
      });
    } catch (error) {
      if (error instanceof UspotFetchError) {
        throw error;
      }

      throw new UspotFetchError(
        "No se pudieron cargar los contextos",
        "network",
        {
          cause: error,
        },
      );
    }

    if (!response.ok) {
      throw new UspotFetchError(
        "No se pudieron cargar los contextos",
        "server",
        {
          status: response.status,
        },
      );
    }

    const items = (await response.json()) as Array<{
      id: number;
      name: string;
      type: ContextType;
      latitude: number | null;
      longitude: number | null;
      zoom: number | null;
    }>;

    return mapContexts(items);
  })().finally(() => {
    // Delay deletion so quick transitions or StrictMode unmounts can reuse the promise
    setTimeout(() => {
      contextsRequestCache.delete(cacheKey);
    }, IN_FLIGHT_CACHE_TTL_MS);
  });

  contextsRequestCache.set(cacheKey, request);

  return request;
}
