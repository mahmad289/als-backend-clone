import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { COIScheduleOfInsuranceReportCreator } from 'als/building-block/RequestableDto/Report/COIScheduleOfInsuranceCreator';
import { coiScheduleOfInsuranceHelper } from 'als/building-block/utils/reportHelper';
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
import { IReportService } from '../reports.service';

@Injectable()
export class CoiScheduleInsuranceReport implements IReportService {
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
    body: COIScheduleOfInsuranceReportCreator,
    compliances: complianceModel[],
    projects: projectModel[],
  ): Promise<[compliances: complianceModel[], projects: projectModel[]]> {
    if (body.coverage_type) {
      for (const compliance of compliances) {
        for (let i = compliance.compliance_items.length - 1; i >= 0; i--) {
          const object = compliance.compliance_items[i];
          if (object.master_requirement) {
            if (
              body?.coverage_type?.length > 0 &&
              !body.coverage_type.includes(
                object?.master_requirement.coverage_type_name,
              )
            ) {
              compliance.compliance_items.splice(i, 1);
            }
          }
        }

        for (let i = compliance.template_items.length - 1; i >= 0; i--) {
          const object = compliance.template_items[i];
          if (object.master_requirement) {
            if (
              body?.coverage_type?.length > 0 &&
              !body.coverage_type.includes(
                object?.master_requirement.coverage_type_name,
              )
            ) {
              compliance.template_items.splice(i, 1);
            }
          }
        }
      }
    }

    if (body.insurance_co || body.broker) {
      for (let i = projects.length - 1; i >= 0; i--) {
        if (body.broker || body.insurance_co) {
          const contactDetails = await this.reportHelper.getContactDetails(
            projects[i]._id.toString(),
          );

          if (
            body.broker &&
            contactDetails.hasOwnProperty('Broker') &&
            !contactDetails.Broker.includes(body.broker)
          ) {
            projects.splice(i, 1);
          }

          if (
            body.insurance_co &&
            contactDetails.hasOwnProperty('Insurance Company') &&
            !contactDetails['Insurance Company'].includes(body.insurance_co)
          ) {
            projects.splice(i, 1);
          }
        }
      }
    }

    return [compliances, projects];
  }

  async create(body: COIScheduleOfInsuranceReportCreator): Promise<any> {
    let { compliances, projects } =
      await this.reportHelper.getCompliancesAndProjects({
        client_id: body.client_id,
        projectIdVendorIds: body.projectVendor,
      });

    //update the compliance and project response depending upon the advanced filter
    [compliances, projects] = await this.advanceFilter(
      body,
      compliances,
      projects,
    );

    const result = coiScheduleOfInsuranceHelper(compliances);
    const now = new Date();
    const month = ('0' + (now.getMonth() + 1)).slice(-2); // e.g. 05
    const day = ('0' + now.getDate()).slice(-2); // e.g. 03
    const year = now.getFullYear(); // e.g. 2023
    const formattedDate = `${month}/${day}/${year}`;

    result.forEach((item: any) => {
      item['date'] = formattedDate;
    });

    return result;
  }
}
