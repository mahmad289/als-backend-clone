import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { MasterRequirementController } from './master-requirement.controller';

@Module({
  imports: [ManagerModule],
  controllers: [MasterRequirementController],
})
export class MasterRequirementModule {}
