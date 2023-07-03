import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE } from 'als/building-block/constants';
import { CompliacneUpdateOnRequirementTempChangeDto } from 'als/building-block/dtos/compliance-update-on-req-update.dto';
import { IComplianceService } from 'als/manager/compliance/services/compliance.service';
import { Job } from 'bullmq';

@Processor(COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE)
export class RequirementTempUpdateConsumer extends WorkerHost {
  constructor(private complianceService: IComplianceService) {
    super();
  }
  private readonly logger = new Logger(RequirementTempUpdateConsumer.name);

  async process(
    job: Job<CompliacneUpdateOnRequirementTempChangeDto>,
  ): Promise<any> {
    await this.complianceService.updateByTemplate(
      job.data.requirement_group_id.toString(),
      job.data.old_template_id?.toString(),
      job.data.new_template_id.toString(),
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<CompliacneUpdateOnRequirementTempChangeDto>) {
    this.logger.log(
      `Compliacnes Updated Due to change in a Requirement's Tempalte. Job Id: ${job.id}`,
    );
  }
}
