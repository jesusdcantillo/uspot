import { fetchWithTimeout, UspotFetchError } from "./fetch-with-timeout";

export type Category = {
  id: number;
  name: string;
  description?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const categoriesRequestCache = {
  promise: null as Promise<Category[]> | null,
  ttl: 200,
};

export async function getCategories(): Promise<Category[]> {
  if (categoriesRequestCache.promise) {
    return categoriesRequestCache.promise;
  }

  const request = (async () => {
    let response: Response;

    try {
      response = await fetchWithTimeout(`${API_BASE_URL}/categories`, {
        method: "GET",
        cache: "no-store",
      });
    } catch (error) {
      if (error instanceof UspotFetchError) {
        throw error;
      }

      throw new UspotFetchError(
        "No se pudieron cargar las categorías",
        "network",
        {
          cause: error,
        },
      );
    }

    if (!response.ok) {
      throw new UspotFetchError(
        "No se pudieron cargar las categorías",
        "server",
        {
          status: response.status,
        },
      );
    }

    return (await response.json()) as Category[];
  })().finally(() => {
    setTimeout(() => {
      categoriesRequestCache.promise = null;
    }, categoriesRequestCache.ttl);
  });

  categoriesRequestCache.promise = request;

  return request;
}
