import { Devices, Prisma } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { TenantsEntity } from 'src/tenants/entity/tenants.entity';

export class DevicesEntity implements Devices {
  constructor({ tenant, ...data }: Partial<DevicesEntity>) {
    Object.assign(this, data);

    if (tenant) {
      this.tenant = new TenantsEntity(tenant);
    }
  }

  id: string;
  alias: string;
  description: string | null;
  group: Prisma.JsonValue;
  serialNumber: string;
  type: string;

  @Exclude()
  tenantId: string | null;

  tenant: Partial<TenantsEntity> | null;
  createdAt: Date;
  updatedAt: Date;
}
