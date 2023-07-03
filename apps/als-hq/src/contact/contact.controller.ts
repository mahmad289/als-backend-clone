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
import { ContactCreator } from 'als/building-block/RequestableDto/Contact/ContactCreator';
import { ContactUpdate } from 'als/building-block/RequestableDto/Contact/ContactUpdate';
import { ParamIdDto } from 'als/building-block/RequestableDto/params.dto';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { ServiceError } from 'als/building-block/utils/apiError';
import { IContactService } from 'als/manager/contact/contact.service';

@ApiBearerAuth()
@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private contactService: IContactService) {}

  @Get()
  async findAll(@Query() query: SearchableDto) {
    try {
      return await this.contactService.getAll(query);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give contact id',
  })
  @Get(':id')
  async findById(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      const res = await this.contactService.getById(param.id);
      if (!res) {
        throw new ServiceError('Contact not found', HttpStatus.NOT_FOUND);
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
  async create(@Body() alsContactPayload: ContactCreator) {
    try {
      return await this.contactService.create(alsContactPayload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give contact id',
  })
  @Patch(':id')
  async update(
    @Param()
    param: ParamIdDto,
    @Body() alsContactPayload: ContactUpdate,
  ) {
    try {
      const res = await this.contactService.update(param.id, alsContactPayload);
      if (!res) {
        throw new ServiceError('Contact not found', HttpStatus.NOT_FOUND);
      }

      return res;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
