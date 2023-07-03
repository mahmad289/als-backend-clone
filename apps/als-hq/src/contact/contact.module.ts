import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { ContactController } from './contact.controller';

@Module({
  imports: [ManagerModule],
  controllers: [ContactController],
})
export class ContactModule {}
