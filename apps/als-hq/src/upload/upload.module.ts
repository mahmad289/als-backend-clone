import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { UploadController } from './upload.controller';

@Module({
  imports: [ManagerModule],
  controllers: [UploadController],
})
export class UploadModule {}
