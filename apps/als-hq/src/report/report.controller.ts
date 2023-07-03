import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportCreator } from 'als/building-block/RequestableDto/Report/ReportCreator';
import { ReportManagerService } from 'als/reports';
import { Response } from 'express';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private reportService: ReportManagerService) {}

  @Post('create')
  async create(@Body() body: ReportCreator, @Res() res: Response) {
    try {
      const reportHtml = await this.reportService.create(body);
      return res
        .contentType('text/html')
        .status(HttpStatus.OK)
        .send(reportHtml);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
