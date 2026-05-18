import { ContextType, Country, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cities = [
  { name: 'Barranquilla', country: Country.COLOMBIA },
  { name: 'Bogotá', country: Country.COLOMBIA },
] as const;

const contextsByCity: Record<
  (typeof cities)[number]['name'],
  Array<{
    name: string;
    type: ContextType;
    latitude: number;
    longitude: number;
    zoom: number;
  }>
> = {
  Barranquilla: [
    {
      name: 'Barranquilla',
      type: ContextType.CITY,
      latitude: 10.96854,
      longitude: -74.78132,
      zoom: 13,
    },
    {
      name: 'Universidad de la Costa',
      type: ContextType.UNIVERSITY,
      latitude: 10.99969,
      longitude: -74.80583,
      zoom: 16,
    },
    {
      name: 'Portal del Prado',
      type: ContextType.MALL,
      latitude: 10.9721,
      longitude: -74.8035,
      zoom: 17,
    },
    {
      name: 'Buenavista',
      type: ContextType.MALL,
      latitude: 11.00698,
      longitude: -74.81582,
      zoom: 17,
    },
  ],
  Bogotá: [
    {
      name: 'Bogotá',
      type: ContextType.CITY,
      latitude: 4.711,
      longitude: -74.0721,
      zoom: 12,
    },
    {
      name: 'Universidad Nacional',
      type: ContextType.UNIVERSITY,
      latitude: 4.6375,
      longitude: -74.0828,
      zoom: 16,
    },
    {
      name: 'Unicentro',
      type: ContextType.MALL,
      latitude: 4.69938,
      longitude: -74.04099,
      zoom: 17,
    },
  ],
};

async function main() {
  for (const city of cities) {
    await prisma.city.upsert({
      where: {
        name_country: {
          name: city.name,
          country: city.country,
        },
      },
      update: {},
      create: city,
    });
  }

  for (const city of cities) {
    const existingCity = await prisma.city.findUnique({
      where: {
        name_country: {
          name: city.name,
          country: city.country,
        },
      },
    });

    if (!existingCity) {
      continue;
    }

    const cityContexts = contextsByCity[city.name];

    for (const context of cityContexts) {
      const existingContext = await prisma.context.findFirst({
        where: {
          name: context.name,
          type: context.type,
          cityId: existingCity.id,
        },
      });

      if (!existingContext) {
        await prisma.context.create({
          data: {
            name: context.name,
            type: context.type,
            cityId: existingCity.id,
            latitude: context.latitude,
            longitude: context.longitude,
            zoom: context.zoom,
          },
        });
        continue;
      }

      await prisma.context.update({
        where: {
          id: existingContext.id,
        },
        data: {
          latitude: context.latitude,
          longitude: context.longitude,
          zoom: context.zoom,
        },
      });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
