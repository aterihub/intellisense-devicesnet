import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { NatsModule } from 'src/nats/nats.module';
import { DeviceNatsConsumer } from './nats/device.nats-consumer';
import { InfluxdbClientModule } from 'src/influxdb/influxdb.module';

@Module({
  imports: [
    AuthModule,
    CacheModule.register(),
    NatsModule,
    InfluxdbClientModule,
  ],
  controllers: [DevicesController],
  providers: [DevicesService, DeviceNatsConsumer],
  exports: [DevicesService],
})
export class DevicesModule {}
