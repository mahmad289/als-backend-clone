import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthManagerModule } from 'als/auth-manager';
import { JwtAuthGuard } from 'als/auth-manager/jwt-auth.guard';
import { addIpMeta } from 'als/building-block/utils/winstonLogger';
import { ManagerModule } from 'als/manager';

import { AppController } from './app.controller';
import { AutoNotificationModule } from './auto-notification/auto-notification.module';
import { ClientModule } from './client/client.module';
import { CommunicationModule } from './communication/communication.module';
import { CommunicationTemplateModule } from './communication-template/communication-template.module';
import { ComplianceModule } from './compliance/compliance.module';
import { ContactModule } from './contact/contact.module';
import { CoverageTypeModule } from './coverage-type/coverage-type.module';
import { DocumentTypeModule } from './document-type/document-type.module';
import { EscalationModule } from './escalation/escalation.module';
import { FileManagerModule } from './file-manager/file-manager.module';
import { HealthModule } from './health-check/health-check.module';
import { InboxModule } from './inbox/inbox.module';
import { MasterRequirementModule } from './master-requirement/master-requirement.module';
import { OcrModule } from './ocr/ocr.module';
import { ProjectsModule } from './projects/projects.module';
import { RequirementsModule } from './requirements/requirements.module';
import { TagModule } from './tag/tag.module';
import { TemplateModule } from './template/template.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { VendorModule } from './vendor/vendor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/als-hq/.env',
    }),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: 'apps/als-hq/uploads',
      }),
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    HealthModule,
    ManagerModule,
    UserModule,
    ClientModule,
    ContactModule,
    VendorModule,
    AuthManagerModule,
    MasterRequirementModule,
    RequirementsModule,
    CommunicationTemplateModule,
    ProjectsModule,
    UploadModule,
    TemplateModule,
    ComplianceModule,
    InboxModule,
    OcrModule,
    FileManagerModule,
    DocumentTypeModule,
    AutoNotificationModule,
    TagModule,
    CoverageTypeModule,
    EscalationModule,
    CommunicationModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(addIpMeta).forRoutes('*');
  }
}
