import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { EscalationCreator } from 'als/building-block/RequestableDto/Escalation/EscalationCreator';
import { EscalationUpdate } from 'als/building-block/RequestableDto/Escalation/EscalationUpdate';
import { ParamIdDto } from 'als/building-block/RequestableDto/params.dto';
import { IEscalationService } from 'als/manager/escalation/escalation.service';

@ApiBearerAuth()
@ApiTags('Escalation')
@Controller('escalation')
export class EscalationController {
  constructor(private readonly escalationService: IEscalationService) {}

  @ApiParam({
    name: 'id',
    description: 'Give Compliance id',
  })
  @Get('compliance/:id')
  async findByComplianceId(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      return await this.escalationService.getByComplianceId(param.id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give escalation id',
  })
  @Get(':id')
  async findById(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      return await this.escalationService.getById(param.id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create')
  async create(@Body() payload: EscalationCreator) {
    try {
      return await this.escalationService.create(payload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give Escalation id',
  })
  @Patch(':id')
  async update(
    @Param()
    param: ParamIdDto,
    @Body() payload: EscalationUpdate,
  ) {
    try {
      return await this.escalationService.update(param.id, payload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give escalation id',
  })
  @Patch('toggle-escalation/:id')
  async toggleNotification(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      return await this.escalationService.updateEscalationStatus(param.id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
