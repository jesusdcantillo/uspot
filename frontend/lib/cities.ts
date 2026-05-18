const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

let citiesRequest: Promise<CityRecord[]> | null = null;
const IN_FLIGHT_CACHE_TTL_MS = 350;

export type CityRecord = {
  id: number;
  name: string;
  country: string;
};

export async function getCities(): Promise<CityRecord[]> {
  if (citiesRequest) {
    return citiesRequest;
  }

  // Instrumentation: log when a new cities request starts
  try {
    // eslint-disable-next-line no-console
    console.debug("getCities:start", { time: Date.now() });
  } catch (e) {
    // ignore
  }

  citiesRequest = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cities`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("No se pudieron cargar las ciudades");
      }

      return (await response.json()) as CityRecord[];
    } catch {
      return [];
    } finally {
      setTimeout(() => {
        citiesRequest = null;
      }, IN_FLIGHT_CACHE_TTL_MS);
    }
  })();

  try {
    return await citiesRequest;
  } catch {
    return [];
  }
}
