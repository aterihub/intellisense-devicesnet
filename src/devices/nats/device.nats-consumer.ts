import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { INFLUXDB_CLIENT } from 'src/influxdb/influxdb.constant';
import { Consume, Message, Subject } from 'src/nats/nats.decorator';
import { DevicesService } from '../devices.service';
import { JsMsg } from 'nats';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeviceNatsConsumer {
  private logger = new Logger(DeviceNatsConsumer.name);

  constructor(
    @Inject(INFLUXDB_CLIENT) private influx: InfluxDB,
    private devicesService: DevicesService,
    private configService: ConfigService,
  ) {}

  @Consume('A1.v1.*.*.heart')
  async heart(@Subject() subject: string, @Message() message: JsMsg) {
    const { gateway, device } = this.parseSubject(subject);
    try {
      const metaDevice = await this.devicesService.findOneWithSerialNumber({
        serialNumber: device,
      });

      const { temperature, humidity, messageId, rss, ts } = message.json() as {
        temperature: number;
        humidity: number;
        messageId: number;
        rss: number;
        ts: number;
      };

      if (metaDevice.tenant) {
        const writeApi = this.influx.getWriteApi(
          this.configService.getOrThrow('INFLUXDB_ORG_ID'),
          metaDevice.tenant.name!,
        );

        const point = new Point('devices-heart-beat');
        point.tag('gateway', gateway);
        point.tag('device', device);
        point.floatField('temperature', temperature);
        point.floatField('humidity', humidity);
        point.intField('rss', rss);
        point.intField('messageId', messageId);

        if (ts) {
          point.timestamp(new Date(ts));
        }

        if (metaDevice.group) {
          for (const key in metaDevice.group as any) {
            if (Object.prototype.hasOwnProperty.call(metaDevice.group, key)) {
              point.tag(key, metaDevice.group[key]);
            }
          }
        }

        writeApi.writePoint(point);
        await writeApi.close();
      }

      message.ack();
    } catch (error) {
      this.logger.error(`ERROR HEART ${error.message}`);
      const errors = ['No Devices found', ' Bad JSON'];
      if (errors.includes(error.message)) message.ack();
    }
  }

  @Consume('device.v1.*.*.data')
  async telemetry(@Subject() subject: string, @Message() message: JsMsg) {
    const { gateway, device } = this.parseSubject(subject);
    try {
      const metaDevice = await this.devicesService.findOneWithSerialNumber({
        serialNumber: device,
      });

      const { ts, ...data } = message.json() as {
        ts: number;
      };

      if (metaDevice.tenant && metaDevice.type && data) {
        const writeApi = this.influx.getWriteApi(
          this.configService.getOrThrow('INFLUXDB_ORG_ID'),
          metaDevice.tenant.name!,
        );

        const point = new Point(metaDevice.type);
        point.tag('gateway', gateway);
        point.tag('device', device);

        if (ts) {
          point.timestamp(new Date(ts));
        }

        if (metaDevice.group) {
          for (const key in metaDevice.group as any) {
            if (Object.prototype.hasOwnProperty.call(metaDevice.group, key)) {
              point.tag(key, metaDevice.group[key]);
            }
          }
        }

        for (const key in data as any) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            switch (typeof value) {
              case 'string':
                point.stringField(key, value);
                break;
              case 'number':
                Number.isInteger(value)
                  ? point.intField(key, value)
                  : point.floatField(key, value);
                break;
            }
          }
        }

        writeApi.writePoint(point);
        await writeApi.close();
      }

      message.ack();
    } catch (error) {
      this.logger.error(`ERROR HEART ${error.message}`);
      const errors = ['No Devices found', ' Bad JSON'];
      if (errors.includes(error.message)) message.ack();
    }
  }

  parseSubject(subject: string): { gateway: string; device: string } {
    const gateway = subject.split('.')[2];
    const device = subject.split('.')[3];
    return {
      gateway,
      device,
    };
  }
}
