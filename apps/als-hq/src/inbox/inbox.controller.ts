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
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { DocumentUploadCreator } from 'als/building-block/RequestableDto/DocumentUpload/DocumentUploadCreator';
import { DocumentUploadUpdate } from 'als/building-block/RequestableDto/DocumentUpload/DocumentUploadUpdate';
import { ParamIdDto } from 'als/building-block/RequestableDto/params.dto';
import { InboxSearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { ServiceError } from 'als/building-block/utils/apiError';
import { IDocumentUploadService } from 'als/manager/document-upload/document-upload.service';

@ApiTags('Inbox')
@Controller('inbox')
export class InboxController {
  constructor(private inboxService: IDocumentUploadService) {}

  @Get()
  async findAll(@Query() query: InboxSearchableDto) {
    try {
      return await this.inboxService.getAll(query);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('unread-count')
  async unreadCount() {
    try {
      return await this.inboxService.unreadCount();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give document upload id',
  })
  @Get(':id')
  async findById(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      const res = await this.inboxService.getById(param.id);
      if (!res) {
        throw new ServiceError('Document not found', HttpStatus.NOT_FOUND);
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
  async create(@Body() documentUploadCreatePayload: DocumentUploadCreator) {
    try {
      return await this.inboxService.create(documentUploadCreatePayload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give document upload id',
  })
  @Patch(':id')
  async update(
    @Param()
    param: ParamIdDto,
    @Body() documentUploadUpdatePayload: DocumentUploadUpdate,
  ) {
    try {
      const res = await this.inboxService.update(
        param.id,
        documentUploadUpdatePayload,
      );

      if (!res) {
        throw new ServiceError(
          'Failed To Update Document',
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
}
