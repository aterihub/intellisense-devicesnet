-- CreateTable
CREATE TABLE "ApiKeys" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "expiresIn" TEXT NOT NULL,
    "isEnable" BOOLEAN NOT NULL,
    "secretKey" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKeys_pkey" PRIMARY KEY ("id")
);
