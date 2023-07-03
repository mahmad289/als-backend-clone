import { Module } from '@nestjs/common';
import { AuthManagerModule } from 'als/auth-manager';
import { ManagerModule } from 'als/manager/manager.module';

import { UserController } from './user.controller';

@Module({
  imports: [ManagerModule, AuthManagerModule],
  controllers: [UserController],
})
export class UserModule {}
