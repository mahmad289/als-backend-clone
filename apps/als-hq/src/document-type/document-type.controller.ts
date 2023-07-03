import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { IDocumentTypeService } from 'als/manager/requirement-group/interfaces/document-type.service';

@ApiTags('Document Type')
@Controller('document-type')
export class DocumentTypeController {
  constructor(private documentTypeService: IDocumentTypeService) {}

  @Get()
  async getAll(@Query() query: SearchableDto) {
    try {
      return await this.documentTypeService.getAll(query);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
