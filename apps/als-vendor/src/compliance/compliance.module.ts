import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';
import { NotificationGateway } from 'apps/als-vendor/notification/notification.gateway';

import { ComplianceController } from './compliance.controller';

@Module({
  imports: [ManagerModule],
  controllers: [ComplianceController],
  providers: [NotificationGateway],
})
export class ComplianceModule {}
