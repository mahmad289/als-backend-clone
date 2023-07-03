import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { DocumentTypeController } from './document-type.controller';

@Module({
  imports: [ManagerModule],
  controllers: [DocumentTypeController],
})
export class DocumentTypeModule {}
