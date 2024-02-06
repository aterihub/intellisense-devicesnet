-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenants" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Devices" (
    "id" TEXT NOT NULL,
    "serialNumber" VARCHAR(30) NOT NULL,
    "alias" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "type" VARCHAR(30) NOT NULL,
    "group" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gateways" (
    "id" TEXT NOT NULL,
    "serialNumber" VARCHAR(30) NOT NULL,
    "alias" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "type" VARCHAR(30) NOT NULL,
    "group" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Gateways_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Types" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "groups" TEXT[],
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLogs" (
    "id" TEXT NOT NULL,
    "entityType" VARCHAR(30) NOT NULL,
    "entityName" VARCHAR(30) NOT NULL,
    "user" VARCHAR(30) NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "actionData" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Devices_serialNumber_key" ON "Devices"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Devices_alias_key" ON "Devices"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "Gateways_serialNumber_key" ON "Gateways"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Gateways_alias_key" ON "Gateways"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "Types_name_key" ON "Types"("name");

-- AddForeignKey
ALTER TABLE "Devices" ADD CONSTRAINT "Devices_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gateways" ADD CONSTRAINT "Gateways_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
