import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiKeysGuard } from 'src/api-keys/guards/api-keys.guard';
import { RequestLogs } from 'src/request-logs/request-logs.decorator';
import { TelemetryService } from './telemetry.service';

@Controller('telemetry')
@UsePipes(ZodValidationPipe)
@UseInterceptors(ClassSerializerInterceptor)
export class TelemetryController {
  constructor(private telemetryService: TelemetryService) {}

  @Get('/last/:device')
  @RequestLogs('getLastTelemetry')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeysGuard)
  async findLast(@Query() query: any, @Param('device') device: string) {
    const telemetry = await this.telemetryService.findLast(query, device);
    return {
      status: 'success',
      data: { telemetry },
    };
  }

  @Get('/history/:device')
  @RequestLogs('getHistoryTelemetry')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeysGuard)
  async findHistory(@Query() query: any, @Param('device') device: string) {
    const telemetries = await this.telemetryService.findHistory(query, device);
    return {
      status: 'success',
      data: { telemetries },
    };
  }
}
