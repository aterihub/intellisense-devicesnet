-- DropForeignKey
ALTER TABLE "Gateways" DROP CONSTRAINT "Gateways_tenantId_fkey";

-- AlterTable
ALTER TABLE "Gateways" ALTER COLUMN "tenantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Gateways" ADD CONSTRAINT "Gateways_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
