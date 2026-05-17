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

export async function getSpots(contextId?: number): Promise<Spot[]> {
  const queryString =
    typeof contextId === "number" ? `?contextId=${contextId}` : "";

  const response = await fetch(`${API_BASE_URL}/spots${queryString}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar los spots");
  }

  return (await response.json()) as Spot[];
}
