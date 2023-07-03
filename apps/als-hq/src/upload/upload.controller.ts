import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsePipes } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileValidationPipe } from 'als/building-block/pipes/file-validation.pipe';
import { storage } from 'als/building-block/utils/uploadHelpers';
import { IUploadService } from 'als/manager/upload/upload-service';
import { Response } from 'express';

@ApiBearerAuth()
@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: IUploadService) {}

  @Post('file-upload')
  @UsePipes(new FileValidationPipe(new ConfigService()))
  @ApiBody({
    required: true,
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { storage }))
  @ApiConsumes('multipart/form-data')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      return await this.uploadService.savedFilePath(file);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'filename',
    description: 'Give File name',
  })
  @Get(':filename')
  @ApiResponse({ type: Buffer })
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      return await this.uploadService.getFile(filename, res);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
