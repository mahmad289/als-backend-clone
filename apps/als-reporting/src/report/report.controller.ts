import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { ClosingSummaryBriefReportCreator } from 'als/building-block/RequestableDto/Report/ClosingSummaryBriefReportCreator';
import { ClosingSummaryGridReportCreator } from 'als/building-block/RequestableDto/Report/ClosingSummaryGridReportCreator';
import { COIScheduleOfInsuranceReportCreator } from 'als/building-block/RequestableDto/Report/COIScheduleOfInsuranceCreator';
import { ComplianceReviewReportCreator } from 'als/building-block/RequestableDto/Report/ComplianceReviewReportCreator';
import { ComplianceStatusReportCreator } from 'als/building-block/RequestableDto/Report/ComplianceStatusReportCreator';
import { CoverageSummaryReportCreator } from 'als/building-block/RequestableDto/Report/CoverageSummaryReportCreator';
import { DealSummaryReportCreator } from 'als/building-block/RequestableDto/Report/DealSummaryReportCreator';
import { EscalationReportCreator } from 'als/building-block/RequestableDto/Report/EscalationReportCreator';
import { ExpirationReportCreator } from 'als/building-block/RequestableDto/Report/ExpirationReportCreator';
import { FullComplianceReportCreator } from 'als/building-block/RequestableDto/Report/FullComplianceReportCreator';
import { NonComplianceReportCreator } from 'als/building-block/RequestableDto/Report/NonComplianceReportCreator';
import { PostClosingSummaryReportCreator } from 'als/building-block/RequestableDto/Report/PostClosingSummaryReportCreator';
import { ReportCreator } from 'als/building-block/RequestableDto/Report/ReportCreator';
import { ReportManagerService } from 'als/reports';
import { Response } from 'express';

import { PdfService } from '../pdf/pdf.service';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(
    private reportService: ReportManagerService,
    private readonly pdfService: PdfService,
  ) {}

  // Just to test excel File download
  // @Get http://localhost:3002/api/v1/report/
  @Get()
  async getSampleExcel(@Body() body: ReportCreator, @Res() res: Response) {
    const result = await this.reportService.create({
      ...body,
      report: 'excel_test',
    });

    // Set the 'Content-Disposition' header to indicate the filename of the Excel file
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${body.report}_Report.xls"`, //body.report in undefined in our test case
    );

    return res
      .contentType(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' +
          ';charset=utf-8',
      )
      .status(HttpStatus.OK)
      .send(result.data);
  }

  @Post('create')
  async create(@Body() body: ReportCreator, @Res() res: Response) {
    try {
      const reportFile = await this.reportService.create(body);

      // Set the 'Content-Disposition' header to indicate the filename of the Excel file
      if (reportFile.type === 'excel') {
        res.contentType(
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' +
            ';charset=utf-8',
        );
        return res.send(reportFile.data);
      }

      res.contentType('application/pdf');
      return res.send(await this.pdfService.createPDF(reportFile.data));
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('create/full-compliance')
  async createFullComplianceReport(
    @Body() body: FullComplianceReportCreator,
    @Res() res: Response,
  ) {
    try {
      const reportFile = await this.reportService.createFullComplianceReport(
        body,
      );

      res.contentType('application/pdf');
      return res.send(await this.pdfService.createPDF(reportFile.data));
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('create/non-compliance')
  async createNonComplianceReport(
    @Body() body: NonComplianceReportCreator,
    @Res() res: Response,
  ) {
    try {
      const reportFile = await this.reportService.createNonComplianceReport(
        body,
      );

      res.contentType('application/pdf');
      return res.send(await this.pdfService.createPDF(reportFile.data));
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('create/closing-summary-brief')
  async createClosingSummaryBriefReport(
    @Body() body: ClosingSummaryBriefReportCreator,
    @Res() res: Response,
  ) {
    try {
      const reportFile =
        await this.reportService.createClosingSummaryBriefReport(body);

      res.contentType('application/pdf');
      return res.send(await this.pdfService.createPDF(reportFile.data));
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create/closing-summary-grid')
  async createClosingSummaryGridReport(
    @Body() body: ClosingSummaryGridReportCreator,
    @Res() res: Response,
  ) {
    try {
      const reportFile =
        await this.reportService.createClosingSummaryGridReport(body);

      res.contentType('application/pdf');
      return res.send(await this.pdfService.createPDF(reportFile.data));
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create/coi-schedule-of-insurance')
  async createCOIScheduleOfInsurance(
    @Body() body: COIScheduleOfInsuranceReportCreator,
    @Res() res: Response,
  ) {
    try {
      const reportFile = await this.reportService.coiScheduleOfInsuranceReport(
        body,
      );

      res.contentType('application/pdf');
      return res.send(await this.pdfService.createPDF(reportFile.data));
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create/deal-summary')
  async createDealSummary(
    @Body() body: DealSummaryReportCreator,
    @Res() res: Response,
  ) {
    try {
      const reportFile = await this.reportService.dealSummaryReportCreation(
        body,
      );

      res.contentType('application/pdf');
      return res.send(await this.pdfService.createPDF(reportFile.data));
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create/escalation')
  async createEscalationReport(
    @Body() body: EscalationReportCreator,
    @Res() res: Response,
  ) {
    try {
      const reportFile = await this.reportService.createEscalationReport(body);

      res.contentType('application/pdf');
      return res.send(await this.pdfService.createPDF(reportFile.data));
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // expiration
  @Post('create/expiration')
  async createExpirationReport(
    @Body() body: ExpirationReportCreator,
    @Res() res: Response,
  ) {
    try {
      const reportFile = await this.reportService.createExpirationReport(body);

      res.contentType(
        `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8`,
      );
      return res.send(reportFile.data);
    } catch (error) {
      //
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // post-closing
  @Post('create/post-closing-summary')
  async createPostClosingSummaryReport(
    @Body() body: PostClosingSummaryReportCreator,
    @Res() res: Response,
  ) {
    try {
      const reportFile =
        await this.reportService.createPostClosingSummaryReport(body);

      res.contentType(
        `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8`,
      );
      return res.send(reportFile.data);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // coverage-summary-report
  @Post('create/coverage-summary')
  async createCoverageSummaryReport(
    @Body() body: CoverageSummaryReportCreator,
    @Res() res: Response,
  ) {
    try {
      const reportFile = await this.reportService.createCoverageSummaryReport(
        body,
      );

      res.contentType(
        `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8`,
      );
      return res.send(reportFile.data);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // compliance-status-report
  @Post('create/compliance-status')
  async createComplianceStatusReport(
    @Body() body: ComplianceStatusReportCreator,
    @Res() res: Response,
  ) {
    try {
      const reportFile = await this.reportService.createComplianceStatusReport(
        body,
      );

      res.contentType(
        `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8`,
      );
      return res.send(reportFile.data);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // compliance-review-report
  @Post('create/compliance-review')
  async complianceReview(
    @Body() body: ComplianceReviewReportCreator,
    @Res() res: Response,
  ) {
    try {
      const reportHtml = await this.reportService.createComplianceReviewReport(
        body,
      );

      res.contentType('application/pdf');
      return res.send(await this.pdfService.createPDF(reportHtml.data));
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
