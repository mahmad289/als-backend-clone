import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { FileManagerController } from './file-manager.controller';

@Module({
  imports: [ManagerModule],
  controllers: [FileManagerController],
})
export class FileManagerModule {}
