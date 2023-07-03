import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { MAILER_QUEUE } from 'als/building-block/constants';
import { Job } from 'bullmq';
import { EmailService } from 'libs/email-service/EmailService';
import { MailCreator } from 'libs/email-service/MailCreator';

@Processor(MAILER_QUEUE)
export class MailServiceConsumer extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }
  private readonly logger = new Logger(MailServiceConsumer.name);

  async process(job: Job<MailCreator>): Promise<any> {
    this.logger.log(`Sending mail to: ${job.data.to}`);
    await this.emailService.sendEmail(job.data);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<unknown>) {
    this.logger.log(`The Email Job was completed: ${job.id}`);
  }
}
