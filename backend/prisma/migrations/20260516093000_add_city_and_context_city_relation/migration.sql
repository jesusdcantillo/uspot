-- CreateEnum
CREATE TYPE "Country" AS ENUM ('COLOMBIA');

-- CreateTable
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" "Country" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_country_key" ON "cities"("name", "country");

-- Seed base cities for existing and future context relations.
INSERT INTO "cities" ("name", "country", "createdAt", "updatedAt") VALUES
  ('Barranquilla', 'COLOMBIA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Bogotá', 'COLOMBIA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("name", "country") DO NOTHING;

-- AlterTable
ALTER TABLE "contexts" ADD COLUMN "cityId" INTEGER;

-- Backfill existing contexts to Barranquilla to avoid orphan data.
UPDATE "contexts"
SET "cityId" = (
  SELECT "id"
  FROM "cities"
  WHERE "name" = 'Barranquilla' AND "country" = 'COLOMBIA'::"Country"
  ORDER BY "id"
  LIMIT 1
)
WHERE "cityId" IS NULL;

-- AlterTable
ALTER TABLE "contexts" ALTER COLUMN "cityId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "contexts_cityId_idx" ON "contexts"("cityId");

-- AddForeignKey
ALTER TABLE "contexts" ADD CONSTRAINT "contexts_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
