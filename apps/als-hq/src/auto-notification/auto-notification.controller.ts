import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AutoNotificationCreator } from 'als/building-block/RequestableDto/AutoNotification/AutoNotificationCreator';
import { AutoNotificationUpdate } from 'als/building-block/RequestableDto/AutoNotification/AutoNotificationUpdate';
import { ParamIdDto } from 'als/building-block/RequestableDto/params.dto';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { IAutoNotificationService } from 'als/manager/auto-notification/auto-notification.service';

@ApiBearerAuth()
@ApiTags('Auto Notifications')
@Controller('auto-notification')
export class AutoNotificationController {
  constructor(
    private readonly autoNotificationService: IAutoNotificationService,
  ) {}

  @Get()
  async findAll(@Query() query: SearchableDto) {
    try {
      return await this.autoNotificationService.getAll(query);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give auto-notification id',
  })
  @Get(':id')
  async findById(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      return await this.autoNotificationService.getById(param.id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create')
  async create(@Body() payload: AutoNotificationCreator) {
    try {
      return await this.autoNotificationService.create(payload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give auto notification id',
  })
  @Patch(':id')
  async update(
    @Param()
    param: ParamIdDto,
    @Body() payload: AutoNotificationUpdate,
  ) {
    try {
      return await this.autoNotificationService.update(param.id, payload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give auto notification id',
  })
  @Patch('toggle-notification/:id')
  async toggleNotification(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      return await this.autoNotificationService.toggleNotification(param.id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give auto-notification id',
  })
  @Get('recipients/:id')
  async getRecipientsById(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      return await this.autoNotificationService.getRecipientsCount(param.id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give auto notification id',
  })
  @Patch('delete-notification/:id')
  async softDelete(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      return await this.autoNotificationService.softDelete(param.id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
