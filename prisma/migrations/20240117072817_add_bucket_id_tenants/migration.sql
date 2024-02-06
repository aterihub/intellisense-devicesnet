/*
  Warnings:

  - Added the required column `bucketId` to the `Tenants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tenants" ADD COLUMN     "bucketId" VARCHAR(16) NOT NULL;
