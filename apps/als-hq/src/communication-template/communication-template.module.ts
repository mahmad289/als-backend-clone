import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { CommunicationTemplateController } from './communication-template.controller';

@Module({
  imports: [ManagerModule],
  controllers: [CommunicationTemplateController],
})
export class CommunicationTemplateModule {}
