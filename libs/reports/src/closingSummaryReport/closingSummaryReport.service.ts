import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClosingSummaryBriefReportCreator } from 'als/building-block/RequestableDto/Report/ClosingSummaryBriefReportCreator';
import { ServiceError } from 'als/building-block/utils/apiError';
import { ClosingSummary } from 'als/building-block/utils/reportsInterface';
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
export class ClosingSummaryReport {
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

  async advanceFilter(
    body: ClosingSummaryBriefReportCreator,
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
              dbDate.getTime() < reqStartDate.getTime() ||
              dbDate.getTime() > reqCloseDate.getTime()
            ) {
              projects.splice(i, 1);
            }
          }
        }
      }
    }

    return projects;
  }

  async create(body: ClosingSummaryBriefReportCreator): Promise<any> {
    const closingSummaryResponse: ClosingSummary[] = [];
    let projects = await this.reportHelper.getProjects({
      client_id: body.client_id,
      project_ids: body.project_id,
    });

    //update the compliance and project response depending upon the advanced filter
    projects = await this.advanceFilter(body, projects);

    if (projects.length !== 0) {
      for (const project of projects) {
        const contactDetails = await this.reportHelper.getContactDetails(
          project._id.toString(),
        );

        const closing_summary: ClosingSummary = {
          client_name: project.client.name,
          status_as_of: new Date().toISOString().slice(0, 10),
          project_details: {
            name: project.name,
            investor: project?.parties_to_the_transaction?.investor_bank,
            hhc_engineer: project?.deal_summary?.engineer,
            als_analyst: project?.deal_summary?.analyst,
            general_partner: contactDetails['General Partner'],
            general_contractor: contactDetails['General Contractor'],
            rehab_or_new_const: project?.deal_summary?.rehab_or_new_const,
            bldg_rcv: project?.project_schedule?.bldg_rcv,
            hard_cost: project?.project_schedule?.hard_costs,
            soft_cost: project?.project_schedule?.soft_costs,
            loss_rents_12mo: project?.project_schedule?.loss_rents,
            closing_date: project?.project_schedule?.closing_date
              ? new Date(project.project_schedule.closing_date.toString())
                  .toISOString()
                  .slice(0, 10)
              : '',
          },
          comments: [
            ...project.material_documents
              .map(
                item =>
                  (item.vers_date
                    ? new Date(item.vers_date.toString())
                        .toISOString()
                        .slice(0, 10)
                    : '') +
                  ' ' +
                  item.comments,
              )
              .filter(item => item.length > 1),
            ...project.certificates
              .map(
                item =>
                  (item.vers_date
                    ? new Date(item.vers_date.toString())
                        .toISOString()
                        .slice(0, 10)
                    : '') +
                  ' ' +
                  item.comments,
              )
              .filter(item => item.length > 1),
          ],
          material_documents: project.material_documents,
          certificates_and_supporting: project.certificates,
        };

        closingSummaryResponse.push(closing_summary);
      }
    }

    return closingSummaryResponse;
  }
}
