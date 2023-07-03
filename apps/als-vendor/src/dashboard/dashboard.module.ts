import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { DashboardController } from './dashboard.controller';

@Module({
  imports: [ManagerModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
