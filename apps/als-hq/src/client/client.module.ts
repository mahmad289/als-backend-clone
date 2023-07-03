import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { ClientController } from './client.controller';

@Module({
  imports: [ManagerModule],
  controllers: [ClientController],
})
export class ClientModule {}
