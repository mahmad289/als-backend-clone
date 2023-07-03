import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClosingSummaryGridReportCreator } from 'als/building-block/RequestableDto/Report/ClosingSummaryGridReportCreator';
import { ServiceError } from 'als/building-block/utils/apiError';
import { ClosingSummaryGrid } from 'als/building-block/utils/reportsInterface';
import {
  ClientModel as clientModel,
  ClientModelDocument,
} from 'als/manager/client/client.model';
import {
  ComplianceModel as complianceModel,
  ComplianceModelDocument,
} from 'als/manager/compliance/model/compliance.model';
import {
  ProjectModel as projectModel,
  ProjectModelDocument,
} from 'als/manager/project/project.model';
import {
  MasterRequirementModel as masterRequirementModel,
  MasterRequirementModelDocument,
} from 'als/manager/requirement-group/model/master-requirement.model';
import {
  VendorModel as vendorModel,
  VendorModelDocument,
} from 'als/manager/vendor/vendor.model';
import { Model } from 'mongoose';

import { ReportHelper } from '../reportHelper';

@Injectable()
export class ClosingSummaryGridReport {
  constructor(
    @InjectModel(projectModel.name)
    readonly ProjectModel: Model<ProjectModelDocument>,
    @InjectModel(clientModel.name)
    readonly ClientModel: Model<ClientModelDocument>,
    @InjectModel(vendorModel.name)
    readonly VendorModel: Model<VendorModelDocument>,
    @InjectModel(complianceModel.name)
    readonly ComplianceModel: Model<ComplianceModelDocument>,
    @InjectModel(masterRequirementModel.name)
    readonly MasterRequirementModel: Model<MasterRequirementModelDocument>,
    private reportHelper: ReportHelper,
  ) {}

  convertToCamelCase(str: string): string {
    const words = str.toLowerCase().split(' ');
    const firstWord = words.shift();
    const rest = words.map(
      word => word.charAt(0).toUpperCase() + word.slice(1),
    );

    return firstWord + rest.join('');
  }

  async advanceFilter(
    body: ClosingSummaryGridReportCreator,
    projects: projectModel[],
  ) {
    if (body.client_stage || (body.start_date && body.closing_date)) {
      for (let i = projects.length - 1; i >= 0; i--) {
        if (
          body.client_stage &&
          projects[i]?.deal_summary?.client_stage !== body.client_stage &&
          projects[i]
        ) {
          projects.splice(i, 1);
        }

        if (body.start_date && body.closing_date && projects[i]) {
          if (body.closing_date < body.start_date) {
            throw new ServiceError('Closing date must be greater!');
          }

          const dbClosingDate = projects[i]?.project_schedule
            ?.closing_date as unknown as Date;

          if (dbClosingDate) {
            const reqClosingDate = new Date(body.closing_date);
            const reqStartingDate = new Date(body.start_date);
            // Compare date components only
            const dbDate = new Date(
              (<Date>dbClosingDate).getFullYear(),
              (<Date>dbClosingDate).getMonth(),
              (<Date>dbClosingDate).getDate(),
            );

            const reqCloseDate = new Date(
              reqClosingDate.getFullYear(),
              reqClosingDate.getMonth(),
              reqClosingDate.getDate(),
            );

            const reqStartDate = new Date(
              reqStartingDate.getFullYear(),
              reqStartingDate.getMonth(),
              reqStartingDate.getDate(),
            );

            if (
              dbDate.getTime() <= reqStartDate.getTime() ||
              dbDate.getTime() >= reqCloseDate.getTime()
            ) {
              projects.splice(i, 1);
            }
          }
        }
      }
    }

    return projects;
  }

  async create(body: ClosingSummaryGridReportCreator): Promise<{
    projects: ClosingSummaryGrid[];
    count: number;
    date: string;
    client?: string;
  }> {
    const closingSummaryResponse: ClosingSummaryGrid[] = [];
    let projects = await this.reportHelper.getProjects({
      client_id: body.client_id,
      project_ids: body.project_id,
    });

    const client = await this.ClientModel.findOne({
      _id: body.client_id,
    }).lean();

    projects = await this.advanceFilter(body, projects);

    const projectCount = projects.length;
    const formattedDate = new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });

    for (const project of projects) {
      const closing_summary_grid = {
        name: project.name,
        closing_date: project?.project_schedule?.closing_date
          ? (
              project?.project_schedule?.closing_date as unknown as Date
            ).toLocaleDateString()
          : '',

        material_documents: project.material_documents.map(el => {
          return {
            name: this.convertToCamelCase(el.name),
            status: el.status,
          };
        }),
      };

      closingSummaryResponse.push(closing_summary_grid);
    }

    return {
      projects: closingSummaryResponse,
      count: projectCount,
      date: formattedDate,
      client: client?.name,
    };
  }
}
