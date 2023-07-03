import { Module } from '@nestjs/common';
import { ReportManagerService, ReportsModule } from 'als/reports';

import { PdfModule } from '../pdf/pdf.module';
import { ReportController } from './report.controller';

@Module({
  imports: [ReportsModule, PdfModule],
  controllers: [ReportController],
  providers: [ReportManagerService],
})
export class ReportModule {}
