const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type CityRecord = {
  id: number;
  name: string;
  country: string;
};

export async function getCities(): Promise<CityRecord[]> {
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
  }
}
