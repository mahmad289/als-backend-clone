import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ComplianceReviewReportCreator } from 'als/building-block/RequestableDto/Report/ComplianceReviewReportCreator';
import {
  ComplianceItem,
  FullCompliance,
} from 'als/building-block/utils/reportsInterface';
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
  TemplateModel as templateModel,
  TemplateModelDocument,
} from 'als/manager/requirement-group/model/template.model';
import {
  VendorModel as vendorModel,
  VendorModelDocument,
} from 'als/manager/vendor/vendor.model';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { Model } from 'mongoose';
import * as path from 'path';

import { ReportHelper } from '../reportHelper';
import { IReportService } from '../reports.service';

Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

@Injectable()
export class ComplianceReviewReport implements IReportService {
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
    @InjectModel(templateModel.name)
    readonly TemplateModel: Model<TemplateModelDocument>,
    private reportHelper: ReportHelper,
  ) {}

  async create(body: ComplianceReviewReportCreator): Promise<any> {
    const compliance_items: ComplianceItem[] = [];
    const template_items: ComplianceItem[] = [];
    const fullComplianceResponse: FullCompliance[] = [];
    const { compliances, projects: projects } =
      await this.reportHelper.getCompliancesAndProjects({
        client_id: body.client_id,
        projectIdVendorIds: body.projectVendor,
      });

    const client = await this.ClientModel.findOne({
      _id: body.client_id,
    }).lean();

    const vendor = await this.VendorModel.findOne({
      _id: body.projectVendor[0].vendor_id,
    }).lean();

    //Iterate the response and change response to desired struture to be used
    for (const project of projects) {
      const contactDetails = await this.reportHelper.getContactDetails(
        project._id.toString(),
      );

      for (const comp of compliances) {
        if (project._id.equals(comp.project_id)) {
          for (const compliance of comp.compliance_items) {
            const obj = {
              coverage_type:
                compliance.master_requirement?.coverage_type_name || '',
              master_requirement_des:
                compliance.master_requirement?.requirement_description || '',
              required_limit: compliance?.required_limit,
              actual_limit: compliance?.actual_limit,
              status: compliance?.status,
              comment: compliance?.comment,
              named_insured: 'NA',
              expiry_date: compliance?.expiry_date || 'NA',
              show: compliance?.show,
              waiver: compliance?.waiver,
              post_closing: compliance?.post_closing,
              document_name: compliance?.document_name || '-',
            };

            compliance_items.push(obj);
          }

          for (const template of comp.template_items) {
            const temp = await this.TemplateModel.findOne({
              _id: template.template_id,
              'rules._id': template.template_rule_id,
            });

            const rule = temp?.rules.find(rule =>
              rule._id.equals(template.template_rule_id),
            );

            const obj = {
              coverage_type:
                template.master_requirement?.coverage_type_name || '',
              master_requirement_des:
                template.master_requirement?.requirement_description || '',
              required_limit: rule ? `${rule.condition} ${rule.value}` : 'NA',
              actual_limit: template?.actual_limit,
              status: template?.status,
              named_insured: template?.named_insured || 'NA',
              comment: rule?.message || 'NA',
              expiry_date: template?.expiry_date || 'NA',
              policy_number: template?.policy_number || 'NA',
              show: template?.show,
              waiver: template?.waiver,
              post_closing: template?.post_closing,
              document_name: template?.document_name || '-',
            };

            template_items.push(obj);
          }
        }
      }

      // get all certificate holders
      const certificate_holders_names =
        (project?.certificate_holders[0]?.first_name || '') +
        ' ' +
        (project?.certificate_holders[0]?.last_name || '');

      const complianceReview: FullCompliance = {
        summary: {
          hard_costs: project?.project_schedule?.hard_costs || '',
          soft_costs: project?.project_schedule?.soft_costs || '',
          loss_of_rents: project?.project_schedule?.loss_rents || '',
          rehab_new: project?.deal_summary?.rehab_or_new_const || '',
          flood_zone: project?.deal_summary?.flood_zone || '',
          eq_zone: project?.deal_summary?.eq_zone || '',
          wind_tier: project?.deal_summary?.wind_tier || '',
          replacement_cost: project?.project_schedule?.replacement_cost || '',
          closing_date: project?.project_schedule?.closing_date
            ? new Date(project.project_schedule.closing_date.toString())
                .toISOString()
                .slice(0, 10)
            : '',
          investor: project?.parties_to_the_transaction?.investor_bank || '',
          additional_insureds:
            project?.parties_to_the_transaction?.additional_insured || '',
          general_contractor: contactDetails['General Contractor'] || '',
          property_manager: contactDetails['Property Manager'] || '',
          partnership: contactDetails['Partnership'] || '',
        },
        project: project.name,
        cert_holder: certificate_holders_names,
        compliance_items: this.groupByCoverageType([
          ...compliance_items,
          ...template_items,
        ]),
        client: client,
        vendor: vendor,
      };

      fullComplianceResponse.push(complianceReview);
    }

    return fullComplianceResponse;
  }

  async generatPDF(data: any, templateName: string) {
    // Load the Handlebars template from a file in the templates directory
    const templatePath = path.join(__dirname, 'templates', templateName);
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);
    // Render the template with the dynamic data
    const renderedHtml = template(data);

    return renderedHtml;
  }

  groupByCoverageType = (
    complianceItems: ComplianceItem[],
  ): GroupedComplianceItems[] => {
    const groupedItems: {
      [key: string]: Omit<ComplianceItem, 'coverage_type'>[];
    } = {};

    complianceItems.forEach(item => {
      const { coverage_type, ...rest } = item;

      if (!groupedItems[coverage_type]) {
        groupedItems[coverage_type] = [];
      }

      groupedItems[coverage_type].push(rest);
    });
    return Object.entries(groupedItems).map(([coverage_type, items]) => ({
      coverage_type,
      items,
    }));
  };
}

interface GroupedComplianceItems {
  coverage_type: string;
  items: Omit<ComplianceItem, 'coverage_type'>[];
}
[];
