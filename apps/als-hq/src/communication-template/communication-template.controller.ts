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
import { CommunicationTemplateCreator } from 'als/building-block/RequestableDto/CommunicationTemplate/CommunicationTemplateCreator';
import { CommunicationTemplateUpdate } from 'als/building-block/RequestableDto/CommunicationTemplate/CommunicationTemplateUpdate';
import { ParamIdDto } from 'als/building-block/RequestableDto/params.dto';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { ServiceError } from 'als/building-block/utils/apiError';
import { ICommunicationTemplateService } from 'als/manager/communication-template/communication-template.service';

@ApiBearerAuth()
@ApiTags('Communication Template')
@Controller('communication-template')
export class CommunicationTemplateController {
  constructor(
    private communicationTemplateService: ICommunicationTemplateService,
  ) {}

  @Get()
  async findAll(@Query() query: SearchableDto) {
    try {
      const serviceResponse = await this.communicationTemplateService.getAll(
        query,
      );

      return serviceResponse;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give communication template id',
  })
  @Get(':id')
  async findById(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      const serviceResponse = await this.communicationTemplateService.getById(
        param.id,
      );

      if (!serviceResponse) {
        throw new ServiceError(
          'Communication Template not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return serviceResponse;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give communication template id',
  })
  @Patch(':id')
  async update(
    @Param()
    param: ParamIdDto,
    @Body() communicationTemplatePayload: CommunicationTemplateUpdate,
  ) {
    try {
      const serviceResponse = await this.communicationTemplateService.update(
        param.id,
        communicationTemplatePayload,
      );

      if (!serviceResponse) {
        throw new ServiceError(
          'Failed To Update Communication Template',
          HttpStatus.NOT_FOUND,
        );
      }

      return serviceResponse;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give communication template id',
  })
  @Patch('delete/:id')
  async softDelete(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      const serviceResponse =
        await this.communicationTemplateService.softDelete(param.id);

      if (!serviceResponse) {
        throw new ServiceError(
          'Failed To Delete Communication Template',
          HttpStatus.NOT_FOUND,
        );
      }

      return serviceResponse;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create')
  async create(
    @Body() commuincationCreatePayload: CommunicationTemplateCreator,
  ) {
    try {
      return await this.communicationTemplateService.create(
        commuincationCreatePayload,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
