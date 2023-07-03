import {
  InjectQueue,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import {
  PROJECT_ASSIGNEE_QUEUE,
  VENDOR_COMPLIANCE_QUEUE,
} from 'als/building-block/constants';
import { ComplianceCreator } from 'als/building-block/RequestableDto/Compliance/ComplianceCreator';
import { IComplianceService } from 'als/manager/compliance/services/compliance.service';
import { Job, Queue } from 'bullmq';

@Processor(VENDOR_COMPLIANCE_QUEUE)
export class VendorComplianceConsumer extends WorkerHost {
  constructor(
    private complianceService: IComplianceService,
    @InjectQueue(PROJECT_ASSIGNEE_QUEUE)
    private readonly projectAssigneeQueue: Queue,
  ) {
    super();
  }

  private readonly logger = new Logger(VendorComplianceConsumer.name);

  async process(job: Job<ComplianceCreator>): Promise<any> {
    try {
      this.logger.log(
        `Creating compliance for vendor:${job.data.vendor_id} on project: ${job.data.project_id}`,
      );

      const compliance = {
        user_id: job.data.user_id,
        vendor_id: job.data.vendor_id,
        vendor_name: job.data.vendor_name,
        project_id: job.data.project_id,
        project_name: job.data.project_name,
        client_id: job.data.client_id,
        client_name: job.data.client_name,
        requirement_group_id: job.data.requirement_group_id,
      };

      const res = await this.complianceService.create(compliance);
      this.projectAssigneeQueue.add(PROJECT_ASSIGNEE_QUEUE, res);
    } catch (err) {
      this.logger.log('Error creating compliance');
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<ComplianceCreator>) {
    this.logger.log(
      `Compliance created for vendor:${job.data.vendor_id} on project:x ${job.data.project_id}`,
    );
  }
}
