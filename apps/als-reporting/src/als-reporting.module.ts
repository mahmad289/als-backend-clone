import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthManagerModule } from 'als/auth-manager';
import { JwtAuthGuard } from 'als/auth-manager/jwt-auth.guard';
import { ManagerModule } from 'als/manager';

import { AlsReportingController } from './als-reporting.controller';
import { AlsReportingService } from './als-reporting.service';
import { PdfModule } from './pdf/pdf.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'apps/als-reporting/.env' }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    ReportModule,
    ManagerModule,
    AuthManagerModule,
    PdfModule,
  ],
  controllers: [AlsReportingController],
  providers: [
    AlsReportingService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AlsReportingModule {}
