import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE } from 'als/building-block/constants';
import { CompliacneUpdateOnRequirementRuleChangeDto } from 'als/building-block/dtos/compliance-update-on-req-update.dto';
import { IComplianceService } from 'als/manager/compliance/services/compliance.service';
import { Job } from 'bullmq';

@Processor(COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE)
export class RequirementRuleUpdateConsumer extends WorkerHost {
  constructor(private readonly complianceService: IComplianceService) {
    super();
  }
  private readonly logger = new Logger(RequirementRuleUpdateConsumer.name);

  async process(
    job: Job<CompliacneUpdateOnRequirementRuleChangeDto>,
  ): Promise<any> {
    await this.complianceService.updateByRequirementGroup(
      job.data.requirement_group_id.toString(),
      job.data.master_requirement_id.toString(),
      job.data.action,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<CompliacneUpdateOnRequirementRuleChangeDto>) {
    this.logger.log(
      `Compliacnes Updated Due to change in Requirment Group:${job.data.requirement_group_id}`,
    );
    this.logger.log(
      `Master Requirement:${job.data.master_requirement_id} ${job.data.action} to/from Requirement Items`,
    );
  }
}
