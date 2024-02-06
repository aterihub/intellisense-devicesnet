/*
  Warnings:

  - You are about to drop the `AuditLogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AuditLogs";

-- CreateTable
CREATE TABLE "RequestLogs" (
    "id" TEXT NOT NULL,
    "user" VARCHAR(30) NOT NULL,
    "auditLog" VARCHAR(30) NOT NULL,
    "ipAddress" VARCHAR(30) NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "body" TEXT NOT NULL,
    "params" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestLogs_pkey" PRIMARY KEY ("id")
);
