import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DevicesEntity } from './entity/devices.entity';

@Injectable()
export class DevicesService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.DevicesWhereUniqueInput;
    where?: Prisma.DevicesWhereInput;
    orderBy?: Prisma.DevicesOrderByWithRelationInput;
  }) {
    return this.prisma.devices.findMany({
      ...params,
      include: { tenant: { select: { id: true, name: true } } },
    });
  }

  findOne(where: Prisma.DevicesWhereUniqueInput) {
    return this.prisma.devices.findFirstOrThrow({
      where,
      include: {
        tenant: { select: { id: true, name: true } },
      },
    });
  }

  async create(data: Prisma.DevicesCreateInput) {
    const device = await this.prisma.devices.create({ data });
    await this.cacheManager.del(device.id);
    return device;
  }

  async update(params: {
    where: Prisma.DevicesWhereUniqueInput;
    data: Prisma.DevicesUpdateInput;
  }) {
    const device = await this.prisma.devices.update(params);
    await this.cacheManager.del(device.id);
    return device;
  }

  delete(where: Prisma.DevicesWhereUniqueInput) {
    return this.prisma.devices.delete({ where });
  }

  // Add cache to increase data retrieval performance
  async findOneWithSerialNumber(where: Prisma.DevicesWhereUniqueInput) {
    const cache = (await this.cacheManager.get(where.serialNumber!)) as string;
    if (cache) {
      const device = JSON.parse(cache);
      return new DevicesEntity(device);
    } else {
      const device = await this.prisma.devices.findFirstOrThrow({
        where,
        include: {
          tenant: { select: { id: true, name: true } },
        },
      });
      await this.cacheManager.set(
        device.serialNumber,
        JSON.stringify(device),
        0,
      );
      return new DevicesEntity(device);
    }
  }
}
