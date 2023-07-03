import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { CommunicationController } from './communication.controller';

@Module({
  imports: [ManagerModule],
  controllers: [CommunicationController],
})
export class CommunicationModule {}
