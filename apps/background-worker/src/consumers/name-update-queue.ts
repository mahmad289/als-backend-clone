import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NAME_UPDATE_QUEUE } from 'als/building-block/constants';
import { ComplianceModel } from 'als/manager/compliance/model/compliance.model';
import { ProjectModel } from 'als/manager/project/project.model';
import { Job } from 'bullmq';
import { Model } from 'mongoose';

@Processor(NAME_UPDATE_QUEUE)
export class NameUpdateConsumer extends WorkerHost {
  constructor(
    @InjectModel(ComplianceModel.name)
    readonly ComplianceModel: Model<ComplianceModel>,
    @InjectModel(ProjectModel.name)
    readonly ProjectModel: Model<ComplianceModel>,
  ) {
    super();
  }
  private readonly logger = new Logger(NameUpdateConsumer.name);

  async process(job: Job<any>): Promise<any> {
    if (job.data.type === 'project') {
      await this.ComplianceModel.updateMany(
        {
          project_id: job.data.project_id,
        },
        {
          $set: {
            project_name: job.data.project_name,
          },
        },
        {
          multi: true,
        },
      );
    }

    if (job.data.type === 'client') {
      await this.ComplianceModel.updateMany(
        {
          client_id: job.data.client_id,
        },
        {
          $set: {
            client_name: job.data.client_name,
          },
        },
        {
          multi: true,
        },
      );

      await this.ProjectModel.updateMany(
        {
          'client.client_id': job.data.client_id,
        },
        {
          $set: {
            'client.name': job.data.client_name,
          },
        },
        {
          multi: true,
        },
      );
    }

    if (job.data.type === 'vendor') {
      await this.ComplianceModel.updateMany(
        {
          vendor_id: job.data.vendor_id,
        },
        {
          $set: {
            vendor_name: job.data.vendor_name,
          },
        },
        {
          multi: true,
        },
      );

      await this.ProjectModel.updateMany(
        {
          'assigned_vendor.vendor_id': job.data.vendor_id,
        },
        {
          $set: {
            'assigned_vendor.$[elem].vendor_name': job.data.vendor_name,
          },
        },
        {
          arrayFilters: [
            {
              'elem.vendor_id': job.data.vendor_id,
            },
          ],
        },
      );
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<any>) {
    this.logger.log(
      `Name Update Job for entity type ${job.data.type} completed`,
    );
  }
}
