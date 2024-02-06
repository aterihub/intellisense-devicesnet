import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProvisioningService {
  constructor(
    @Inject('MQTT_SERVICE') private client: ClientProxy,
    private prisma: PrismaService,
  ) {}

  async provisioning(data: any, _topic: string) {
    const { gatewaySerial } = data;
    const gateway = await this.prisma.gateways.findFirst({
      where: {
        serialNumber: gatewaySerial,
      },
    });
    if (gateway === null) return;

    let mqttUser: any;
    mqttUser = await this.prisma.mqttAccount.findFirst({
      where: {
        gatewaySerialNumber: gatewaySerial,
      },
    });

    if (mqttUser === null) {
      mqttUser = await this.prisma.mqttAccount.create({
        data: {
          isSuperUser: false,
          username: gatewaySerial,
          password: this.uniqueStringSecure(),
          gatewaySerialNumber: gatewaySerial,
        },
      });
    }

    const { username, password } = mqttUser;
    return this.client.emit(`${_topic}/${gatewaySerial}/response`, {
      username,
      password,
      status: 'success',
    });
  }

  private uniqueStringSecure() {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0].toString(36);
  }
}
