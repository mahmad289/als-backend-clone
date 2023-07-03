import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager/manager.module';

import { CoverageTypeController } from './coverage-type.controller';

@Module({
  imports: [ManagerModule],
  controllers: [CoverageTypeController],
})
export class CoverageTypeModule {}
