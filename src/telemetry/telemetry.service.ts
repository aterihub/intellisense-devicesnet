import { InfluxDB, QueryApi } from '@influxdata/influxdb-client';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DevicesService } from 'src/devices/devices.service';
import { INFLUXDB_CLIENT } from 'src/influxdb/influxdb.constant';

Injectable();
export class TelemetryService {
  private queryApi: QueryApi;

  constructor(
    @Inject(INFLUXDB_CLIENT) private influx: InfluxDB,
    private configService: ConfigService,
    private devicesService: DevicesService,
  ) {
    const org = this.configService.get('INFLUXDB_ORG_ID');
    const queryApi = this.influx.getQueryApi(org);
    this.queryApi = queryApi;
  }
  async findLast(query: any, deviceNumber: string) {
    const device = await this.devicesService.findOneWithSerialNumber({
      serialNumber: deviceNumber,
    });

    const { serialNumber, tenant, type } = device;
    const { fields, ...tags }: { fields: string } = query;
    const filterFields = fields
      .split(',')
      .map((x) => `r["_field"] == "${x}"`)
      .join(' or ');

    const filterTags: Array<string> = [];
    for (const key in tags) {
      if (Object.prototype.hasOwnProperty.call(tags, key)) {
        filterTags.push(`r["${key}"] == "${tags[key]}"`);
      }
    }

    const filterTagsFlux =
      filterTags.length !== 0
        ? `|> filter(fn: (r) => ${filterTags.join(' or ')})`
        : '';

    const fluxQuery = `
    from(bucket: "${tenant?.name}")
    |> range(start: 0)
    |> filter(fn: (r) => r["_measurement"] == "${type}")
    ${filterTagsFlux}
    |> filter(fn: (r) => r["device"] == "${serialNumber}")
    |> filter(fn: (r) => ${filterFields})
    |> last()
    |> drop(columns: ["_start", "_stop"])`;

    const result = await this.queryApi.collectRows(fluxQuery);
    const refactoredData = result.reduce(
      (acc: any, { result: _x, table: _y, _measurement: _z, ...data }) => {
        acc[data._field] = data;
        return acc;
      },
      {},
    );
    return refactoredData;
  }

  async findHistory(query: any, deviceNumber: string) {
    const device = await this.devicesService.findOneWithSerialNumber({
      serialNumber: deviceNumber,
    });

    const { serialNumber, tenant, type } = device;
    const {
      fields,
      startTime,
      endTime,
      aggregate,
      ...tags
    }: {
      fields: string;
      startTime: string;
      endTime: string;
      aggregate: string;
    } = query;
    const filterFields = fields
      .split(',')
      .map((x) => `r["_field"] == "${x}"`)
      .join(' or ');

    const filterTags: Array<string> = [];
    for (const key in tags) {
      if (Object.prototype.hasOwnProperty.call(tags, key)) {
        filterTags.push(`r["${key}"] == "${tags[key]}"`);
      }
    }

    const filterTagsFlux =
      filterTags.length !== 0
        ? `|> filter(fn: (r) => ${filterTags.join(' or ')})`
        : '';

    const aggreateFlux =
      aggregate !== undefined
        ? `|> aggregateWindow(every: ${aggregate}, fn: median)`
        : '';

    const fluxQuery = `
    from(bucket: "${tenant?.name}")
    |> range(start: ${startTime}, stop: ${endTime})
    |> filter(fn: (r) => r["_measurement"] == "${type}")
    ${filterTagsFlux}
    |> filter(fn: (r) => r["device"] == "${serialNumber}")
    |> filter(fn: (r) => ${filterFields})
    ${aggreateFlux}
    |> drop(columns: ["_start", "_stop"])`;

    const result = await this.queryApi.collectRows(fluxQuery);
    const refactoredData = result.reduce(
      (acc: any, { result: _x, table: _y, _measurement: _z, ...data }) => {
        const key = data._field;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(data);
        return acc;
      },
      {},
    );
    return refactoredData;
  }

  async flowUsage(query: any, deviceNumber: string) {
    const device = await this.devicesService.findOneWithSerialNumber({
      serialNumber: deviceNumber,
    });

    const { serialNumber, tenant, type } = device;
    const {
      startTime,
      endTime,
    }: { fields: string; startTime: string; endTime: string } = query;

    const fluxQuery = `
    from(bucket: "${tenant?.name}")
    |> range(start: ${startTime}, stop: ${endTime})
    |> filter(fn: (r) => r["_measurement"] == "${type}")
    |> filter(fn: (r) => r["device"] == "${serialNumber}")
    |> filter(fn: (r) => r["_field"] == "flow")
    |> spread()
    |> drop(columns: ["_start", "_stop"])`;

    const result = await this.queryApi.collectRows(fluxQuery);
    const transform = result.map(
      ({ result: _x, table: _y, _measurement: _z, ...data }) => {
        data._value *= 0.01;
        return data;
      },
    );
    return transform[0] || {};
  }
}
