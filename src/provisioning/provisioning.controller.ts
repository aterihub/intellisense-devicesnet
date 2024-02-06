import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices';
import { ProvisioningService } from './provisioning.service';

@Controller()
export class ProvisioningController {
  constructor(private provisioningService: ProvisioningService) {}

  @EventPattern('provisioning')
  provisioning(@Payload() data: string, @Ctx() context: MqttContext) {
    return this.provisioningService.provisioning(data, context.getTopic());
  }
}
