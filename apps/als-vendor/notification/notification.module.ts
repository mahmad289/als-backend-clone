import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [ManagerModule],
  providers: [NotificationGateway],
  exports: [NotificationGateway],
})
export class NotificationModule {}
