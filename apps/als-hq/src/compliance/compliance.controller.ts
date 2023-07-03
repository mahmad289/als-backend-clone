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
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ComplianceItemUpdateDto } from 'als/building-block/RequestableDto/Compliance/ComplianceItemUpdate';
import { GetComplianceDocumentListDto } from 'als/building-block/RequestableDto/Compliance/GetComplianceDocumentList';
import { UpdateDocumentDateDto } from 'als/building-block/RequestableDto/Compliance/UpdateDocumentDate';
import { ParamIdDto } from 'als/building-block/RequestableDto/params.dto';
import { ReportCreator } from 'als/building-block/RequestableDto/Report/ReportCreator';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { ServiceError } from 'als/building-block/utils/apiError';
import { IComplianceService } from 'als/manager/compliance/services/compliance.service';
import { ReportManagerService } from 'als/reports';
import { Response } from 'express';

@ApiBearerAuth()
@ApiTags('Compliance')
@Controller('compliance')
export class ComplianceController {
  constructor(
    private complianceService: IComplianceService,
    private reportService: ReportManagerService,
  ) {}

  @Get()
  async findAll(@Query() query: SearchableDto) {
    try {
      return await this.complianceService.getAll(query);
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
    description: 'Give compliance id',
  })
  @Get(':id')
  async findById(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      const compliance = await this.complianceService.getById(param.id);
      if (!compliance) {
        throw new ServiceError('Compliance not found', HttpStatus.NOT_FOUND);
      }

      return compliance;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':project_id/:vendor_id')
  async complianceByVendorAndProject(
    @Param() params: GetComplianceDocumentListDto,
  ) {
    try {
      return await this.complianceService.complianceByVendorAndProject(
        params.project_id,
        params.vendor_id,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':client_id/:project_id/:vendor_id')
  async getComplianceForReview(
    @Param('client_id') client_id: string,
    @Param('project_id') project_id: string,
    @Param('vendor_id') vendor_id: string,
  ) {
    try {
      return await this.complianceService.getComplianceForReview(
        client_id,
        project_id,
        vendor_id,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give compliance id',
  })
  @Patch(':id')
  async updateComplianceItem(
    @Param()
    param: ParamIdDto,
    @Body() complianceItemUpdateDto: ComplianceItemUpdateDto,
  ) {
    try {
      const compliance = await this.complianceService.updateComplianceItem(
        param.id,
        complianceItemUpdateDto,
      );

      if (!compliance) {
        throw new ServiceError(
          'Failed To Update Compliance',
          HttpStatus.NOT_FOUND,
        );
      }

      return compliance;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give compliance id',
  })
  @Patch('date/:id')
  async updateDocumentDate(
    @Param()
    param: ParamIdDto,
    @Body() updateDocumentDateDto: UpdateDocumentDateDto,
  ) {
    try {
      return await this.complianceService.updateDocumentDate(
        param.id,
        updateDocumentDateDto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('compliance-review')
  async complianceReview(@Body() body: ReportCreator, @Res() res: Response) {
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
