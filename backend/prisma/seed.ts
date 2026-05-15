import { ContextType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const contexts = [
  {
    name: 'Barranquilla',
    type: ContextType.CITY,
  },
  {
    name: 'Universidad de la Costa',
    type: ContextType.UNIVERSITY,
  },
  {
    name: 'Portal del Prado',
    type: ContextType.MALL,
  },
];

async function main() {
  for (const context of contexts) {
    const existingContext = await prisma.context.findFirst({
      where: {
        name: context.name,
        type: context.type,
      },
    });

    if (!existingContext) {
      await prisma.context.create({
        data: context,
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
