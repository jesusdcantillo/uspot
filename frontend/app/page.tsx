import { getSpots } from "@/lib/spots";

export default async function Home() {
  const spots = await getSpots();

  return (
    <main className="p-6">
      <h1>USpot - Spots</h1>

      {spots.length === 0 ? (
        <p>No hay spots registrados.</p>
      ) : (
        <ul>
          {spots.map((spot) => (
            <li key={spot.id}>
              <h2>{spot.title}</h2>
              <p>{spot.description}</p>
              <p>Categoria: {spot.category.name}</p>
              <p>Usuario: {spot.userId}</p>
              <p>
                Coordenadas: {spot.latitude}, {spot.longitude}
              </p>
              <p>Imagenes: {spot.images.length}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
