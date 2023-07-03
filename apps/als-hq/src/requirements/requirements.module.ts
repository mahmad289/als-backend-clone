import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { RequirementsController } from './requirements.controller';

@Module({
  imports: [ManagerModule],
  controllers: [RequirementsController],
})
export class RequirementsModule {}
