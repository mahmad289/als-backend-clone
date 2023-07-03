import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
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
import { ServiceError } from 'als/building-block/utils/apiError';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import * as fs from 'fs';

import { ClosingSummaryGridReport } from './closingSummaryGridReport/closingSummaryGridReport.service';
import { ClosingSummaryReport } from './closingSummaryReport/closingSummaryReport.service';
import { CoiScheduleInsuranceReport } from './coiScheduleInsuranceReport/coiScheduleInsuranceReport.service';
import { ComplianceReviewReport } from './complianceReviewReport/complianceReviewReport.service';
import { ComplianceStatusReport } from './complianceStatusReport/complianceStatusReport.service';
import { CoverageSummaryReport } from './coverageSummaryReport/coverageSummaryReport.service';
import { DealSummaryReport } from './dealSummaryReport/dealSummaryReport.service';
import { EscalationReport } from './EscalationReport/escalation_report';
import { FullComplianceReport } from './fullComplianceReport/fullComplianceReport.service';
import { NonComplianceReport } from './nonComplianceReport/nonComplianceReport.service';
import { PolicyExpirationReport } from './policyExpirationReport/policyExpirationReport.service';
import { PostClosingSummaryReport } from './postClosingSummary/postClosingSummaryReport.service';
import { IReportService } from './reports.service';

@Injectable()
export class ReportManagerService implements IReportService {
  constructor(
    private fullComplianceReport: FullComplianceReport,
    private nonComplianceReport: NonComplianceReport,
    private dealSummaryReport: DealSummaryReport,
    private closingSummaryReport: ClosingSummaryReport,
    private closingSummaryGridReport: ClosingSummaryGridReport,
    private policyExpirationReport: PolicyExpirationReport,
    private complianceReviewReport: ComplianceReviewReport,
    private coiScheduleInsuranceReport: CoiScheduleInsuranceReport,
    private escalationReport: EscalationReport,
    private postClosingSummary: PostClosingSummaryReport,
    private coverageSummaryReport: CoverageSummaryReport,
    private complianceStatusReport: ComplianceStatusReport,
  ) {}

  async create(body: ReportCreator) {
    try {
      switch (body.report) {
        case 'compliance_review_report':
          const CRReport = await this.complianceReviewReport.create(body);
          const pdf = await this.fullComplianceReport.generatPDF(
            JSON.parse(JSON.stringify(CRReport[0])),
            'compliance_review_report.hbs',
          );

          return { data: pdf, type: 'html' };
        case 'full_compliance_report':
          const FCR = await this.fullComplianceReport.create(body);
          const fullComplianceReportHTML =
            await this.fullComplianceReport.generatPDF(
              JSON.parse(JSON.stringify(FCR)),
              'full_compliance_report.hbs',
            );

          return { data: fullComplianceReportHTML, type: 'html' };
        case 'escalation_report':
          const EscReport = await this.escalationReport.create(body);
          const escalationReportHTML =
            await this.fullComplianceReport.generatPDF(
              JSON.parse(JSON.stringify(EscReport)),
              'escalation_report.hbs',
            );

          return { data: escalationReportHTML, type: 'html' };
        case 'non_compliance_report':
          const NCR = await this.nonComplianceReport.create(body);
          const nonComplianceReportHTML =
            await this.fullComplianceReport.generatPDF(
              JSON.parse(JSON.stringify(NCR)),
              'non_compliance_report.hbs',
            );

          return { data: nonComplianceReportHTML, type: 'html' };
        // case 'closing_summary_brief':
        //   const CSReport = await this.closingSummaryReport.create(body);
        //   const CSReportHTML = await this.fullComplianceReport.generatPDF(
        //     JSON.parse(JSON.stringify(CSReport)),
        //     'closing_summary_brief_report.hbs',
        //   );

        //   return { data: CSReportHTML, type: 'html' };

        // eslint-disable-next-line padding-line-between-statements
        // case 'closing_summary_grid':
        //   const CSGReport = await this.closingSummaryGridReport.create(body);
        //   const CSGReportHTML = await this.fullComplianceReport.generatPDF(
        //     JSON.parse(JSON.stringify(CSGReport)),
        //     'closing_summary_grid_report.hbs',
        //   );

        //   return { data: CSGReportHTML, type: 'html' };

        // eslint-disable-next-line padding-line-between-statements
        case 'coi_schedule_of_insurance':
          const SOIReport = await this.coiScheduleInsuranceReport.create(body);
          const scheduleOfInsuranceReportHtml =
            await this.fullComplianceReport.generatPDF(
              JSON.parse(JSON.stringify(SOIReport)),
              'schedule_of_insurance_report.hbs',
            );

          return { data: scheduleOfInsuranceReportHtml, type: 'html' };
        // case 'deal_summary_report':
        //   const dealSummaryReportHtml = await this.dealSummaryReport.create(
        //     body,
        //   );
        //   return { data: dealSummaryReportHtml, type: 'html' };
        case 'expiration_report':
          const policyExpirationExcel =
            await this.policyExpirationReport.generateExcel(body);

          return { data: policyExpirationExcel, type: 'excel' };
        case 'excel_test':
          // read the contents of the Excel file
          const filePath = 'libs/reports/sample.xls';
          const excelContent = fs.readFileSync(filePath);

          return { data: excelContent, type: 'excel' };
        case 'post_closing_summary':
          const PCSJson = await this.postClosingSummary.create(body);
          Logger.log(JSON.stringify(PCSJson, null, 2));

          if (Array.isArray(PCSJson) && PCSJson.length < 1) {
            throw new HttpException(
              'No Data found to generate report',
              HttpStatus.BAD_REQUEST,
            );
          }

          const PCSExcel = await this.postClosingSummary.generateExcelFile(
            PCSJson,
          );

          return { data: PCSExcel, type: 'excel' };
        default:
          throw new HttpException(
            'Something Went Wrong',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async createFullComplianceReport(body: FullComplianceReportCreator) {
    try {
      const FCR = await this.fullComplianceReport.create(body);

      if (FCR && FCR.length <= 0) {
        throw new ServiceError(
          'No Data found to generate report',
          HttpStatus.BAD_REQUEST,
        );
      }

      const fullComplianceReportHTML =
        await this.fullComplianceReport.generatPDF(
          JSON.parse(JSON.stringify(FCR)),
          'full_compliance_report.hbs',
        );

      return { data: fullComplianceReportHTML, type: 'html' };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async createNonComplianceReport(body: NonComplianceReportCreator) {
    try {
      const NCR = await this.nonComplianceReport.create(body);
      if (NCR && NCR.length <= 0) {
        throw new ServiceError(
          'No Data found to generate report',
          HttpStatus.BAD_REQUEST,
        );
      }

      const nonComplianceReportHTML =
        await this.fullComplianceReport.generatPDF(
          JSON.parse(JSON.stringify(NCR)),
          'non_compliance_report.hbs',
        );

      return { data: nonComplianceReportHTML, type: 'html' };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async createClosingSummaryBriefReport(
    body: ClosingSummaryBriefReportCreator,
  ) {
    try {
      const CSReport = await this.closingSummaryReport.create(body);
      if (CSReport && CSReport.length <= 0) {
        throw new ServiceError(
          'No Data found to generate report',
          HttpStatus.BAD_REQUEST,
        );
      }

      const CSReportHTML = await this.fullComplianceReport.generatPDF(
        JSON.parse(JSON.stringify(CSReport)),
        'closing_summary_brief_report.hbs',
      );

      return { data: CSReportHTML, type: 'html' };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async createClosingSummaryGridReport(body: ClosingSummaryGridReportCreator) {
    try {
      const CSGReport = await this.closingSummaryGridReport.create(body);
      if (CSGReport && CSGReport.projects.length <= 0) {
        throw new ServiceError(
          'No Data found to generate report',
          HttpStatus.BAD_REQUEST,
        );
      }

      const CSGReportHTML = await this.fullComplianceReport.generatPDF(
        JSON.parse(JSON.stringify(CSGReport)),
        'closing_summary_grid_report.hbs',
      );

      return { data: CSGReportHTML, type: 'html' };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async coiScheduleOfInsuranceReport(
    body: COIScheduleOfInsuranceReportCreator,
  ) {
    try {
      const SOIReport = await this.coiScheduleInsuranceReport.create(body);
      if (SOIReport && SOIReport.length <= 0) {
        throw new ServiceError(
          'No Data found to generate report',
          HttpStatus.BAD_REQUEST,
        );
      }

      const scheduleOfInsuranceReportHtml =
        await this.fullComplianceReport.generatPDF(
          JSON.parse(JSON.stringify(SOIReport)),
          'schedule_of_insurance_report.hbs',
        );

      return { data: scheduleOfInsuranceReportHtml, type: 'html' };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async dealSummaryReportCreation(body: DealSummaryReportCreator) {
    try {
      const DSReport = await this.dealSummaryReport.create(body);
      const dealSummaryReportHtml = await this.fullComplianceReport.generatPDF(
        JSON.parse(JSON.stringify(DSReport)),
        'deal_summary_report.hbs',
      );

      return { data: dealSummaryReportHtml, type: 'html' };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async createEscalationReport(body: EscalationReportCreator) {
    try {
      const EscReport = await this.escalationReport.create(body);
      const escalationReportHTML = await this.fullComplianceReport.generatPDF(
        JSON.parse(JSON.stringify(EscReport)),
        'escalation_report.hbs',
      );

      return { data: escalationReportHTML, type: 'html' };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  // Expiration report
  async createExpirationReport(body: ExpirationReportCreator) {
    try {
      const policyExpirationExcel =
        await this.policyExpirationReport.generateExcel(body);

      return { data: policyExpirationExcel, type: 'excel' };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  // Post Closing Summary report
  async createPostClosingSummaryReport(body: PostClosingSummaryReportCreator) {
    try {
      const PCSJson = await this.postClosingSummary.create(body);
      if (Array.isArray(PCSJson) && PCSJson.length < 1) {
        throw new HttpException(
          'No Data found to generate report',
          HttpStatus.BAD_REQUEST,
        );
      }

      const PCSExcel = await this.postClosingSummary.generateExcelFile(PCSJson);

      return { data: PCSExcel, type: 'excel' };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  // coverage summary report
  async createCoverageSummaryReport(body: CoverageSummaryReportCreator) {
    try {
      const CSJson = await this.coverageSummaryReport.generateExcel(body);
      return { data: CSJson, type: 'excel' };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  // compliance status report
  async createComplianceStatusReport(body: ComplianceStatusReportCreator) {
    try {
      const complianceStatusReportExcel =
        await this.complianceStatusReport.generateExcel(body);

      return { data: complianceStatusReportExcel, type: 'excel' };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  // compliance status report
  async createComplianceReviewReport(body: ComplianceReviewReportCreator) {
    try {
      const CRReport = await this.complianceReviewReport.create(body);
      const pdf = await this.fullComplianceReport.generatPDF(
        JSON.parse(JSON.stringify(CRReport[0])),
        'compliance_review_report.hbs',
      );

      return { data: pdf, type: 'html' };
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
