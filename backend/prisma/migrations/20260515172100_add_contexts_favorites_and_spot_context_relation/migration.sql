/*
  Warnings:

  - Added the required column `contextId` to the `spots` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContextType" AS ENUM ('CITY', 'UNIVERSITY', 'MALL');

-- AlterTable
ALTER TABLE "spots" ADD COLUMN     "contextId" INTEGER;

-- CreateTable
CREATE TABLE "contexts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ContextType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contexts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "spotId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favorites_userId_idx" ON "favorites"("userId");

-- CreateIndex
CREATE INDEX "favorites_spotId_idx" ON "favorites"("spotId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_spotId_key" ON "favorites"("userId", "spotId");

-- Seed initial contexts for the existing spots data.
INSERT INTO "contexts" ("name", "type", "createdAt", "updatedAt") VALUES
  ('Barranquilla', 'CITY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Universidad de la Costa', 'UNIVERSITY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Portal del Prado', 'MALL', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

UPDATE "spots"
SET "contextId" = (
  SELECT "id"
  FROM "contexts"
  WHERE "name" = 'Barranquilla' AND "type" = 'CITY'
  ORDER BY "id"
  LIMIT 1
)
WHERE "contextId" IS NULL;

ALTER TABLE "spots" ALTER COLUMN "contextId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "spots_contextId_idx" ON "spots"("contextId");

-- AddForeignKey
ALTER TABLE "spots" ADD CONSTRAINT "spots_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "contexts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "spots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
