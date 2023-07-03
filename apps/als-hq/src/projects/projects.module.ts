import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { ProjectsController } from './projects.controller';

@Module({
  imports: [ManagerModule],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
