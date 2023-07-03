import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

@Module({
  imports: [
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
      { name: VENDOR_COMPLIANCE_QUEUE },
      { name: PROJECT_ASSIGNEE_QUEUE },
      { name: MAILER_QUEUE },
      { name: COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE },
      { name: COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE },
      { name: TEMPLATE_UPDATE_QUEUE },
      { name: ESCALATION_QUEUE },
      { name: AUTO_NOTIFICATION_QUEUE },
      { name: NAME_UPDATE_QUEUE },
    ),
  ],

  exports: [BullModule],
})
export class BullMQModule {}
