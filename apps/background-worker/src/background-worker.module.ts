import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import {
  AUTO_NOTIFICATION_QUEUE,
  COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE,
  COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE,
  ESCALATION_QUEUE,
  MAILER_QUEUE,
  NAME_UPDATE_QUEUE,
  PROJECT_ASSIGNEE_QUEUE,
  TEMPLATE_UPDATE_QUEUE,
  VENDOR_COMPLIANCE_QUEUE,
} from 'als/building-block/constants';
import { ManagerModule } from 'als/manager';
import { DatabaseModule } from 'als/manager/database.module';
import { EmailService } from 'libs/email-service/EmailService';

import { BackgroundWorkerController } from './background-worker.controller';
import { BackgroundWorkerService } from './background-worker.service';
import { ProjectAssigneeConsumer } from './consumers/assign-project-consumer';
import { AutoNotificationServiceConsumer } from './consumers/auto-notification-consumer';
import { EscalationServiceConsumer } from './consumers/escalation-consumer';
import { MailServiceConsumer } from './consumers/mail-service-consumer';
import { NameUpdateConsumer } from './consumers/name-update-queue';
import { RequirementRuleUpdateConsumer } from './consumers/requirement-rule-update-consumer';
import { RequirementTempUpdateConsumer } from './consumers/requirement-temp-update-consumer';
import { TemplateUpdateConsumer } from './consumers/template-update-consumer';
import { VendorComplianceConsumer } from './consumers/vendor-compliance-consumer';
import { EmailCronService } from './services/email-cron.service';

const DEFAULTJOBOPTIONS = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 100000,
  },
};

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ envFilePath: 'apps/background-worker/.env' }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    ManagerModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
        // Limit queue to max 1.000 jobs per 5 seconds.
        limiter: {
          max: 20, // Max number of jobs processed
          duration: 5000, // per duration in milliseconds
          bounceBack: false, // When jobs get rate limited, they stay in the waiting queue and are not moved to the delayed queue
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: VENDOR_COMPLIANCE_QUEUE, defaultJobOptions: DEFAULTJOBOPTIONS },
      { name: PROJECT_ASSIGNEE_QUEUE, defaultJobOptions: DEFAULTJOBOPTIONS },
      {
        name: MAILER_QUEUE,
        defaultJobOptions: DEFAULTJOBOPTIONS,
      },
      {
        name: ESCALATION_QUEUE,
        defaultJobOptions: DEFAULTJOBOPTIONS,
      },
      {
        name: COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE,
        defaultJobOptions: DEFAULTJOBOPTIONS,
      },
      {
        name: COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE,
        defaultJobOptions: DEFAULTJOBOPTIONS,
      },
      { name: TEMPLATE_UPDATE_QUEUE, defaultJobOptions: DEFAULTJOBOPTIONS },
      { name: AUTO_NOTIFICATION_QUEUE, defaultJobOptions: DEFAULTJOBOPTIONS },
      { name: NAME_UPDATE_QUEUE, defaultJobOptions: DEFAULTJOBOPTIONS },
    ),
  ],
  controllers: [BackgroundWorkerController],
  providers: [
    BackgroundWorkerService,
    VendorComplianceConsumer,
    ProjectAssigneeConsumer,
    MailServiceConsumer,
    RequirementRuleUpdateConsumer,
    RequirementTempUpdateConsumer,
    TemplateUpdateConsumer,
    ManagerModule,
    EmailService,
    EmailCronService,
    EscalationServiceConsumer,
    AutoNotificationServiceConsumer,
    NameUpdateConsumer,
  ],
})
export class BackgroundWorkerModule {}
