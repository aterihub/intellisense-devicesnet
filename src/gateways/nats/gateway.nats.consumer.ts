import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { INFLUXDB_CLIENT } from 'src/influxdb/influxdb.constant';
import { Consume, Message, Subject } from 'src/nats/nats.decorator';
import { JsMsg } from 'nats';
import { ConfigService } from '@nestjs/config';
import { GatewaysService } from '../gateways.service';

@Injectable()
export class GatewayNatsConsumer {
  private logger = new Logger(GatewayNatsConsumer.name);

  constructor(
    @Inject(INFLUXDB_CLIENT) private influx: InfluxDB,
    private gatewayService: GatewaysService,
    private configService: ConfigService,
  ) {}

  @Consume('AI.v1.*.heartbeat')
  async heart(@Subject() subject: string, @Message() message: JsMsg) {
    const { gateway } = this.parseSubject(subject);
    try {
      const metaGateway = await this.gatewayService.findOneWithSerialNumber({
        serialNumber: gateway,
      });

      const {
        messageId,
        ts,
        uptime,
        temperature,
        humidity,
        hwVersion,
        fwVersion,
      } = message.json() as {
        uptime: number;
        hwVersion: number;
        fwVersion: number;
        temperature: number;
        humidity: number;
        messageId: number;
        rss: number;
        ts: number;
      };

      if (metaGateway.tenant) {
        const writeApi = this.influx.getWriteApi(
          this.configService.getOrThrow('INFLUXDB_ORG_ID'),
          metaGateway.tenant.name!,
        );

        const point = new Point('gateways-heart-beat');
        point.tag('gateway', gateway);
        point.floatField('temperature', temperature);
        point.floatField('humidity', humidity);
        point.intField('messageId', messageId);
        point.intField('uptime', uptime);
        point.intField('hwVersion', hwVersion);
        point.intField('fwVersion', fwVersion);

        if (ts) {
          point.timestamp(new Date(ts * 1000));
        }

        if (metaGateway.group) {
          for (const key in metaGateway.group as any) {
            if (Object.prototype.hasOwnProperty.call(metaGateway.group, key)) {
              point.tag(key, metaGateway.group[key]);
            }
          }
        }

        writeApi.writePoint(point);
        await writeApi.close();
      }

      message.ack();
    } catch (error) {
      this.logger.error(`ERROR HEART ${error.message}`);
      const errors = ['No Gateways found', 'Bad JSON'];
      if (errors.includes(error.message)) message.ack();
    }
  }

  parseSubject(subject: string): { gateway: string } {
    const gateway = subject.split('.')[2];
    return {
      gateway,
    };
  }
}
