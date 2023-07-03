import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { AutoNotificationController } from './auto-notification.controller';

@Module({
  imports: [ManagerModule],
  controllers: [AutoNotificationController],
})
export class AutoNotificationModule {}
