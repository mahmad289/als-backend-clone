import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { EscalationController } from './escalation.controller';

@Module({
  imports: [ManagerModule],
  controllers: [EscalationController],
})
export class EscalationModule {}
