import { fetchWithTimeout, UspotFetchError } from "./fetch-with-timeout";

export type Category = {
  id: number;
  name: string;
  description?: string;
};

export type SpotImage = {
  id: number;
  url: string;
  order?: number;
};

export type Spot = {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  userId: number;
  contextId: number;
  category: Category;
  images: SpotImage[];
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const spotsRequestCache = new Map<number | null, Promise<Spot[]>>();
const IN_FLIGHT_CACHE_TTL_MS = 350;

export async function getSpots(contextId?: number): Promise<Spot[]> {
  const queryString =
    typeof contextId === "number" ? `?contextId=${contextId}` : "";
  const cacheKey = contextId ?? null;

  const existingRequest = spotsRequestCache.get(cacheKey);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    // Instrumentation: log when a new spots request starts
    try {
      // eslint-disable-next-line no-console
      console.debug("getSpots:start", { contextId, time: Date.now() });
    } catch (e) {
      // ignore
    }
    let response: Response;

    try {
      response = await fetchWithTimeout(`${API_BASE_URL}/spots${queryString}`, {
        method: "GET",
        cache: "no-store",
      });
    } catch (error) {
      if (error instanceof UspotFetchError) {
        throw error;
      }

      throw new UspotFetchError("No se pudieron cargar los spots", "network", {
        cause: error,
      });
    }

    if (!response.ok) {
      throw new UspotFetchError("No se pudieron cargar los spots", "server", {
        status: response.status,
      });
    }

    return (await response.json()) as Spot[];
  })().finally(() => {
    setTimeout(() => {
      spotsRequestCache.delete(cacheKey);
    }, IN_FLIGHT_CACHE_TTL_MS);
  });

  spotsRequestCache.set(cacheKey, request);

  return request;
}
