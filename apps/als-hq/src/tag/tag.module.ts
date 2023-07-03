import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { TagController } from './tag.controller';

@Module({
  imports: [ManagerModule],
  controllers: [TagController],
})
export class TagModule {}
