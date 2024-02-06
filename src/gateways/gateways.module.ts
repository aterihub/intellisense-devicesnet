import { Module } from '@nestjs/common';
import { GatewaysController } from './gateways.controller';
import { GatewaysService } from './gateways.service';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { NatsModule } from 'src/nats/nats.module';
import { InfluxdbClientModule } from 'src/influxdb/influxdb.module';
import { GatewayNatsConsumer } from './nats/gateway.nats.consumer';

@Module({
  imports: [
    AuthModule,
    CacheModule.register(),
    NatsModule,
    InfluxdbClientModule,
  ],
  controllers: [GatewaysController],
  providers: [GatewaysService, GatewayNatsConsumer],
})
export class GatewaysModule {}
