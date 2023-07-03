import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { TemplateController } from './template.controller';

@Module({
  imports: [ManagerModule],
  controllers: [TemplateController],
})
export class TemplateModule {}
