import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';
import { ReportsModule } from 'als/reports';

import { ComplianceController } from './compliance.controller';

@Module({
  imports: [ManagerModule, ReportsModule],
  controllers: [ComplianceController],
})
export class ComplianceModule {}
