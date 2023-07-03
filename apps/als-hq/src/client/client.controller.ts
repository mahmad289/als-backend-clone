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
import { ClientCreator } from 'als/building-block/RequestableDto/Client/ClientCreator';
import {
  ClientContactUpdate,
  ClientUpdate,
} from 'als/building-block/RequestableDto/Client/ClientUpdate';
import { ParamIdDto } from 'als/building-block/RequestableDto/params.dto';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { ServiceError } from 'als/building-block/utils/apiError';
import { IClientService } from 'als/manager/client/client.service';

@ApiBearerAuth()
@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private clientService: IClientService) {}

  @Get()
  async findAll(@Query() query: SearchableDto) {
    try {
      return await this.clientService.getAll(query);
    } catch (error) {
      //null coalescing
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @ApiParam({
    name: 'id',
    description: 'Give client id',
  })
  @Get(':id')
  async findById(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      const res = await this.clientService.getById(param.id);
      if (!res) {
        throw new ServiceError('Client not found', HttpStatus.NOT_FOUND);
      }

      return res;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create')
  async create(@Body() clientCreatePayload: ClientCreator) {
    try {
      return await this.clientService.create(clientCreatePayload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give client id',
  })
  @Patch(':id')
  async update(
    @Param()
    param: ParamIdDto,
    @Body() clientUpdatePayload: ClientUpdate,
  ) {
    try {
      const res = await this.clientService.update(
        param.id,
        clientUpdatePayload,
      );

      if (!res) {
        throw new ServiceError(
          ' Failed To Update Client',
          HttpStatus.NOT_FOUND,
        );
      }

      return res;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give client id',
  })
  @Patch(':id/assign-contact')
  async assignContact(
    @Param()
    param: ParamIdDto,
    @Body() clientContactUpdatePayload: ClientContactUpdate,
  ) {
    try {
      return await this.clientService.assignContacts(
        param.id,
        clientContactUpdatePayload,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
