/*
  Warnings:

  - You are about to drop the column `arrivalLocation` on the `duties` table. All the data in the column will be lost.
  - You are about to drop the column `arrivalTime` on the `duties` table. All the data in the column will be lost.
  - You are about to drop the column `departureLocation` on the `duties` table. All the data in the column will be lost.
  - You are about to drop the column `departureTime` on the `duties` table. All the data in the column will be lost.
  - You are about to drop the column `flightNumber` on the `duties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "duties" DROP COLUMN "arrivalLocation",
DROP COLUMN "arrivalTime",
DROP COLUMN "departureLocation",
DROP COLUMN "departureTime",
DROP COLUMN "flightNumber",
ADD COLUMN     "pairing" TEXT;

-- CreateTable
CREATE TABLE "flight_legs" (
    "id" TEXT NOT NULL,
    "dutyId" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,
    "departureLocation" TEXT NOT NULL,
    "arrivalLocation" TEXT NOT NULL,
    "isDeadhead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flight_legs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "flight_legs" ADD CONSTRAINT "flight_legs_dutyId_fkey" FOREIGN KEY ("dutyId") REFERENCES "duties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
