import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';
import { ReportManagerService, ReportsModule } from 'als/reports';

import { ReportController } from './report.controller';

@Module({
  imports: [ReportsModule, ManagerModule],
  controllers: [ReportController],
  providers: [ReportManagerService],
})
export class ReportModule {}
