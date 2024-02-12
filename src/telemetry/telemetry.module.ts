import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { InfluxdbClientModule } from 'src/influxdb/influxdb.module';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';
import { DevicesModule } from 'src/devices/devices.module';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';

@Module({
  imports: [AuthModule, InfluxdbClientModule, DevicesModule, ApiKeysModule],
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class TelemetryModule {}
