import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { NatsModule } from './nats/nats.module';
import { DevicesModule } from './devices/devices.module';
import { TenantsModule } from './tenants/tenants.module';
import { GatewaysModule } from './gateways/gateways.module';
import { TypesModule } from './types/types.module';
import { RequestLogsModule } from './request-logs/request-logs.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLogsInterceptor } from './request-logs/request-logs.interceptor';
import { ProvisioningModule } from './provisioning/provisioning.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { TelemetryModule } from './telemetry/telemetry.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    NatsModule,
    DevicesModule,
    TenantsModule,
    GatewaysModule,
    TypesModule,
    RequestLogsModule,
    ProvisioningModule,
    ApiKeysModule,
    TelemetryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLogsInterceptor,
    },
  ],
})
export class AppModule {}
