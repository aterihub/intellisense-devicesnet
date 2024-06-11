import { Module } from '@nestjs/common';
import { ProvisioningController } from './provisioning.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProvisioningService } from './provisioning.service';

@Module({
  controllers: [ProvisioningController],
  providers: [ProvisioningService],
  imports: [
    ClientsModule.register([
      {
        name: 'MQTT_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_HOST,
        },
      },
    ]),
  ],
})
export class ProvisioningModule {}
