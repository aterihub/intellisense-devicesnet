-- DropForeignKey
ALTER TABLE "Devices" DROP CONSTRAINT "Devices_tenantId_fkey";

-- AlterTable
ALTER TABLE "Devices" ALTER COLUMN "tenantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Devices" ADD CONSTRAINT "Devices_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
