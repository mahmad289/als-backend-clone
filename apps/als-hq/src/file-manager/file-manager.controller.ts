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
import { GetComplianceDocumentListDto } from 'als/building-block/RequestableDto/Compliance/GetComplianceDocumentList';
import { DocumentNameUpdate } from 'als/building-block/RequestableDto/FileManager/DocumentNameUpdate';
import { GetDocuments } from 'als/building-block/RequestableDto/FileManager/GetDocuments';
import {
  FileSearchableDto,
  GetDocumentsSearchableDto,
} from 'als/building-block/RequestableDto/searchable.dto';
import { IFileManagerService } from 'als/manager/file-manager/file-manager-interface';

@ApiTags('File-Manager')
@Controller('file-manager')
export class FileManagerController {
  constructor(private fileManagerService: IFileManagerService) {}

  @Get()
  async getAll(@Query() query: FileSearchableDto) {
    try {
      return await this.fileManagerService.getAll(query);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'uuid',
    description: 'Give Document Type UUID',
  })
  @Get('/:uuid')
  async getDocuments(
    @Query() query: GetDocumentsSearchableDto,
    @Param() getDocumentsDto: GetDocuments,
  ) {
    try {
      return await this.fileManagerService.getDocuments(
        getDocumentsDto.uuid,
        query,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch()
  async editName(@Body() documentNameUpdate: DocumentNameUpdate) {
    try {
      return await this.fileManagerService.editName(documentNameUpdate);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('document-detail/:project_id/:vendor_id')
  async complianceDocumentDetail(
    @Param() complianceDocumentListDto: GetComplianceDocumentListDto,
  ) {
    try {
      return await this.fileManagerService.complianceDocumentDetail(
        complianceDocumentListDto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
