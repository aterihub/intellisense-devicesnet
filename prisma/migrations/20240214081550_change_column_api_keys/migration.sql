/*
  Warnings:

  - You are about to drop the column `expiresIn` on the `ApiKeys` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `ApiKeys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKeys" DROP COLUMN "expiresIn",
ADD COLUMN     "expiresAt" VARCHAR(30) NOT NULL;
