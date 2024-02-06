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
          host: process.env.MQTT_HOST,
          port: parseInt(process.env.MQTT_PORT as string),
        },
      },
    ]),
  ],
})
export class ProvisioningModule {}
