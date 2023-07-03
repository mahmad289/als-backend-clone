import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { OtpController } from './otp.controller';

@Module({
  imports: [ManagerModule],
  controllers: [OtpController],
})
export class OtpModule {}
