import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { TEMPLATE_UPDATE_QUEUE } from 'als/building-block/constants';
import { TemplateUpdateQueueDto } from 'als/building-block/dtos/update-by-template.queue.dto';
import { IComplianceService } from 'als/manager/compliance/services/compliance.service';
import { Job } from 'bullmq';

@Processor(TEMPLATE_UPDATE_QUEUE)
export class TemplateUpdateConsumer extends WorkerHost {
  constructor(private readonly complianceService: IComplianceService) {
    super();
  }
  private readonly logger = new Logger(TemplateUpdateConsumer.name);

  async process(job: Job<TemplateUpdateQueueDto>): Promise<any> {
    await this.complianceService.updateByTemplateEdit(
      job.data.template_id,
      job.data.rules_id,
      job.data.action,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<TemplateUpdateQueueDto>) {
    this.logger.log(
      `Compliacnes Updated Due to change in Template:${job.data.template_id}`,
    );
  }
}
