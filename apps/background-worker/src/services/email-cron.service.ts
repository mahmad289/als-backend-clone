import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { config } from 'als/building-block/constants';
import { IAutoNotificationService } from 'als/manager/auto-notification/auto-notification.service';
import { IEscalationService } from 'als/manager/escalation/escalation.service';

@Injectable()
export class EmailCronService {
  constructor(
    private autoNotificationService: IAutoNotificationService,
    private escalationService: IEscalationService,
  ) {}

  private readonly logger = new Logger(EmailCronService.name);

  @Cron(config[process.env.CRON_TIME as keyof typeof config] || config.midnight)
  async runEveryMidnight() {
    this.logger.debug(
      `cron job started`,
      config[process.env.CRON_TIME as keyof typeof config] || config.midnight,
    );
    await this.autoNotificationService.startNotificationJob();
    await this.escalationService.sendEscalationEmail();
  }
}
