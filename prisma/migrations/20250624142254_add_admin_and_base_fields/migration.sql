-- CreateEnum
CREATE TYPE "EWLBases" AS ENUM ('PMI', 'ARN', 'PRG', 'SZG', 'VIE', 'WP_PMI', 'WP_BCN', 'WP_PRG');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "base" "EWLBases" NOT NULL DEFAULT 'PMI',
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
