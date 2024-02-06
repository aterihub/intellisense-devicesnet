/*
  Warnings:

  - The primary key for the `RequestLogs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RequestLogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "RequestLogs" DROP CONSTRAINT "RequestLogs_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RequestLogs_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "MqttAccount" (
    "id" SERIAL NOT NULL,
    "gatewaySerialNumber" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isSuperUser" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MqttAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MqttAccount_gatewaySerialNumber_key" ON "MqttAccount"("gatewaySerialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MqttAccount_username_key" ON "MqttAccount"("username");

-- AddForeignKey
ALTER TABLE "MqttAccount" ADD CONSTRAINT "MqttAccount_gatewaySerialNumber_fkey" FOREIGN KEY ("gatewaySerialNumber") REFERENCES "Gateways"("serialNumber") ON DELETE SET NULL ON UPDATE CASCADE;
