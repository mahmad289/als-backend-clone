import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

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
import { ReportManagerService } from './report-manager.service';
import { ReportHelper } from './reportHelper';

const reportProviders = [
  FullComplianceReport,
  NonComplianceReport,
  DealSummaryReport,
  ClosingSummaryReport,
  PolicyExpirationReport,
  ComplianceReviewReport,
  CoiScheduleInsuranceReport,
  ClosingSummaryGridReport,
  EscalationReport,
  PostClosingSummaryReport,
  CoverageSummaryReport,
  ComplianceStatusReport,
];

@Module({
  imports: [ManagerModule],
  providers: [ReportManagerService, ReportHelper, ...reportProviders],

  exports: [ReportManagerService, ...reportProviders],
})
export class ReportsModule {}
