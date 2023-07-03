import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { InboxController } from './inbox.controller';

@Module({
  imports: [ManagerModule],
  controllers: [InboxController],
})
export class InboxModule {}
