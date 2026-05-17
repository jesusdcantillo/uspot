import { ContextType, Country, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cities = [
  { name: 'Barranquilla', country: Country.COLOMBIA },
  { name: 'Bogotá', country: Country.COLOMBIA },
] as const;

const contextsByCity: Record<
  (typeof cities)[number]['name'],
  Array<{ name: string; type: ContextType }>
> = {
  Barranquilla: [
    { name: 'Barranquilla', type: ContextType.CITY },
    { name: 'Universidad de la Costa', type: ContextType.UNIVERSITY },
    { name: 'Buenavista', type: ContextType.MALL },
  ],
  Bogotá: [
    { name: 'Bogotá', type: ContextType.CITY },
    { name: 'Universidad Nacional', type: ContextType.UNIVERSITY },
    { name: 'Unicentro', type: ContextType.MALL },
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
          },
        });
      }
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
