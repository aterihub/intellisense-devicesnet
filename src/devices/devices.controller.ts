import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { DevicesEntity } from './entity/devices.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Prisma } from '@prisma/client';
import { RequestLogs } from 'src/request-logs/request-logs.decorator';

@Controller('devices')
@UsePipes(ZodValidationPipe)
@UseInterceptors(ClassSerializerInterceptor)
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Get('/')
  @RequestLogs('getAllDevices')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async findAll(@Query() params: any) {
    const devices = await this.devicesService.findAll({ where: params });
    const devicesEntity = devices.map(
      ({ createdAt: _x, updatedAt: _y, ...device }) =>
        new DevicesEntity(device),
    );
    return {
      status: 'success',
      data: { devices: devicesEntity },
    };
  }

  @Get('/:id')
  @RequestLogs('getDevice')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async findOne(@Param('id') id: string) {
    const device = await this.devicesService.findOne({ id });
    const deviceEntity = new DevicesEntity(device);
    return {
      status: 'success',
      data: { device: deviceEntity },
    };
  }

  @Post('/')
  @RequestLogs('postDevice')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async create(@Body() data: CreateDeviceDto) {
    const device = await this.devicesService.create(
      data as Prisma.DevicesCreateInput,
    );
    const deviceEntity = new DevicesEntity(device);
    return {
      status: 'success',
      data: { device: deviceEntity },
    };
  }

  @Patch('/:id')
  @RequestLogs('patchDevice')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async update(@Param('id') id: string, @Body() data: UpdateDeviceDto) {
    const device = await this.devicesService.update({
      where: { id },
      data: data as Prisma.DevicesUpdateInput,
    });
    const deviceEntity = new DevicesEntity(device);
    return {
      status: 'success',
      data: { device: deviceEntity },
    };
  }

  @Delete('/:id')
  @RequestLogs('deleteDevice')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async delete(@Param('id') id: string) {
    await this.devicesService.delete({ id });
    return {
      status: 'success',
      data: null,
    };
  }
}
