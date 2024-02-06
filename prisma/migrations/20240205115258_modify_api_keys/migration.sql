/*
  Warnings:

  - You are about to drop the column `note` on the `ApiKeys` table. All the data in the column will be lost.
  - You are about to alter the column `username` on the `ApiKeys` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `expiresIn` on the `ApiKeys` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - Added the required column `apiKey` to the `ApiKeys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKeys" DROP COLUMN "note",
ADD COLUMN     "apiKey" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ALTER COLUMN "username" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "expiresIn" SET DATA TYPE VARCHAR(30);
