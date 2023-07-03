import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthGuard } from 'als/building-block/guards/vendor-auth.guard';
import { ManagerModule } from 'als/manager';

import { AlsVendorController } from './als-vendor.controller';
import { AlsVendorService } from './als-vendor.service';
import { ComplianceModule } from './compliance/compliance.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OtpModule } from './otp/otp.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/als-vendor/.env',
      isGlobal: true,
    }),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: 'apps/als-vendor/uploads',
      }),
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    ManagerModule,
    OtpModule,
    DashboardModule,
    ComplianceModule,
    UploadModule,
  ],
  controllers: [AlsVendorController],
  providers: [
    AlsVendorService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AlsVendorModule {}
