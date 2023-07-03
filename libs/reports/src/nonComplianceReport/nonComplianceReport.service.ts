import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NonComplianceReportCreator } from 'als/building-block/RequestableDto/Report/NonComplianceReportCreator';
import { ServiceError } from 'als/building-block/utils/apiError';
import {
  COVERAGE_TYPE_UUID,
  DOCUMENT_TYPE_UUID,
} from 'als/building-block/utils/enum';
import { errorHandler } from 'als/building-block/utils/errorHandler';
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

@Injectable()
export class NonComplianceReport implements IReportService {
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

  async advanceFilter(
    body: NonComplianceReportCreator,
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

  async create(body: NonComplianceReportCreator): Promise<any> {
    try {
      const nonComplianceResponse: FullCompliance[] = [];
      let { compliances, projects: projects } =
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

      const client = await this.ClientModel.findOne({
        _id: body.client_id,
      }).lean();

      if (projects.length !== 0) {
        //Iterate the response and change response to desired struture to be used
        for (const project of projects) {
          const contactDetails = await this.reportHelper.getContactDetails(
            project._id.toString(),
          );

          if (contactDetails.hasOwnProperty('Broker') && body.broker) {
            contactDetails['Broker'] = contactDetails['Broker'].filter(
              (broker: string) => broker === body.broker,
            );
          }

          for (const comp of compliances) {
            const compliance_items: ComplianceItem[] = [];
            const template_items: ComplianceItem[] = [];
            const vendor = await this.VendorModel.findOne({
              _id: comp.vendor_id,
            }).lean();

            if (project._id.equals(comp.project_id)) {
              for (const compliance of comp.compliance_items) {
                if (compliance.status !== 'G') {
                  const obj = {
                    coverage_type:
                      compliance.master_requirement?.coverage_type_name || '',
                    master_requirement_des:
                      compliance.master_requirement?.requirement_description ||
                      '',
                    required_limit: compliance.required_limit,
                    actual_limit: compliance.actual_limit,
                    status: compliance.status,
                    comment: compliance.comment,
                    expiry_date: compliance.expiry_date || '',
                    brokers: contactDetails['Broker'],
                  };

                  compliance_items.push(obj);
                }
              }

              for (const template of comp.template_items) {
                if (template.status !== 'G') {
                  const temp = await this.TemplateModel.findOne({
                    _id: template.template_id,
                    'rules._id': template.template_rule_id,
                  });

                  const rule = temp?.rules.find(rule =>
                    rule._id.equals(template.template_rule_id),
                  );

                  if (
                    template.document_type_uuid === DOCUMENT_TYPE_UUID.ACORD_25
                  ) {
                    const insurers = [];
                    if (comp.acord_25_ocr_data?.extracted_data.insurer_A) {
                      insurers.push(
                        comp.acord_25_ocr_data?.extracted_data.insurer_A,
                      );
                    }

                    if (comp.acord_25_ocr_data?.extracted_data.insurer_B) {
                      insurers.push(
                        comp.acord_25_ocr_data?.extracted_data.insurer_B,
                      );
                    }

                    if (comp.acord_25_ocr_data?.extracted_data.insurer_C) {
                      insurers.push(
                        comp.acord_25_ocr_data?.extracted_data.insurer_C,
                      );
                    }

                    if (comp.acord_25_ocr_data?.extracted_data.insurer_D) {
                      insurers.push(
                        comp.acord_25_ocr_data?.extracted_data.insurer_D,
                      );
                    }

                    if (comp.acord_25_ocr_data?.extracted_data.insurer_E) {
                      insurers.push(
                        comp.acord_25_ocr_data?.extracted_data.insurer_E,
                      );
                    }

                    if (comp.acord_25_ocr_data?.extracted_data.insurer_F) {
                      insurers.push(
                        comp.acord_25_ocr_data?.extracted_data.insurer_F,
                      );
                    }

                    const obj = {
                      carrier:
                        insurers.length < 1
                          ? insurers[0]
                            ? insurers[0]
                            : ''
                          : `Various (${insurers.join(', ')})`,
                      coverage_type:
                        template.master_requirement?.coverage_type_name || '',
                      master_requirement_des:
                        template.master_requirement?.requirement_description ||
                        '',
                      required_limit: rule
                        ? `${rule.condition} ${rule.value}`
                        : '',
                      actual_limit: template.actual_limit,
                      status: template.status,
                      comment: rule?.message || '',
                      expiry_date: '',
                      brokers:
                        comp.acord_25_ocr_data?.extracted_data?.producer || '',
                      named_insured:
                        comp.acord_25_ocr_data?.extracted_data?.insured || '',
                      policy_number: '',
                    };

                    if (
                      template?.master_requirement?.coverage_type_uuid ===
                      COVERAGE_TYPE_UUID.GL
                    ) {
                      obj.expiry_date =
                        comp.acord_25_ocr_data?.extracted_data
                          ?.cgl_policy_exp || '';
                      obj.policy_number =
                        comp.acord_25_ocr_data?.extracted_data
                          ?.cgl_policy_number || '';
                    }

                    if (
                      template?.master_requirement?.coverage_type_uuid ===
                      COVERAGE_TYPE_UUID.AL
                    ) {
                      obj.expiry_date =
                        comp?.acord_25_ocr_data?.extracted_data?.al_exp || '';
                      obj.policy_number =
                        comp?.acord_25_ocr_data?.extracted_data
                          ?.al_policy_number || '';
                    }

                    if (
                      template?.master_requirement?.coverage_type_uuid ===
                      COVERAGE_TYPE_UUID.UL
                    ) {
                      obj.expiry_date =
                        comp?.acord_25_ocr_data?.extracted_data?.ul_exp || '';
                      obj.policy_number =
                        comp?.acord_25_ocr_data?.extracted_data
                          ?.ul_policy_number || '';
                    }

                    if (
                      template?.master_requirement?.coverage_type_uuid ===
                      COVERAGE_TYPE_UUID.WC
                    ) {
                      obj.expiry_date =
                        comp?.acord_25_ocr_data?.extracted_data?.wc_exp || '';
                      obj.policy_number =
                        comp?.acord_25_ocr_data?.extracted_data
                          ?.wc_policy_number || '';
                    }

                    template_items.push(obj);
                  } else {
                    const obj = {
                      policy_number:
                        comp.acord_28_ocr_data?.extracted_data.policy_number ||
                        '',
                      carrier:
                        comp.acord_28_ocr_data?.extracted_data.company_name ||
                        '',
                      named_insured:
                        comp.acord_28_ocr_data?.extracted_data.named_insured ||
                        '',
                      coverage_type:
                        template.master_requirement?.coverage_type_name || '',
                      master_requirement_des:
                        template.master_requirement?.requirement_description ||
                        '',
                      required_limit: rule
                        ? `${rule.condition} ${rule.value}`
                        : '',
                      actual_limit: template.actual_limit || '',
                      status: template.status || '',
                      comment: rule?.message || '',
                      expiry_date:
                        comp.acord_28_ocr_data?.extracted_data
                          ?.expiration_date || '',
                      brokers:
                        comp.acord_28_ocr_data?.extracted_data?.producer_name ||
                        '',
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

              const fullCompliance: FullCompliance = {
                summary: {
                  hard_costs: project.project_schedule?.hard_costs,
                  soft_costs: project.project_schedule?.soft_costs,
                  loss_of_rents: project.project_schedule?.loss_rents,
                  rehab_new: project.deal_summary?.rehab_or_new_const,
                  flood_zone: project.deal_summary?.flood_zone,
                  eq_zone: project.deal_summary?.eq_zone,
                  wind_tier: project.deal_summary?.wind_tier,
                  replacement_cost: project.project_schedule?.replacement_cost,
                  closing_date: project?.project_schedule?.closing_date
                    ? new Date(project.project_schedule.closing_date.toString())
                        .toISOString()
                        .slice(0, 10)
                    : '',
                  investor: project.parties_to_the_transaction?.investor_bank,
                  additional_insureds:
                    project.parties_to_the_transaction?.additional_insured,
                  general_contractor: contactDetails['General Contractor'],
                  property_manager: contactDetails['Property Manager'],
                  partnership: contactDetails['Partnership'],
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

              if (compliance_items.length > 0 || template_items.length > 0) {
                nonComplianceResponse.push(fullCompliance);
              }
            }
          }
        }
      } else {
        throw new ServiceError('No Project Exist', HttpStatus.NOT_FOUND);
      }

      return nonComplianceResponse;
    } catch (e) {
      throw errorHandler(e);
    }
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
      [key: string]: {
        items: Omit<ComplianceItem, 'coverage_type'>[];
        brokers: string;
        policy_number?: string;
        carrier?: string;
        named_insured?: string;
        expiry_date?: string;
      };
    } = {};

    complianceItems.forEach(item => {
      const { coverage_type, ...rest } = item;

      if (!groupedItems[coverage_type]) {
        groupedItems[coverage_type] = {
          items: [],
          brokers: '',
          policy_number: '',
          carrier: '',
          expiry_date: '',
          named_insured: '',
        };
      }

      groupedItems[coverage_type].items.push(rest);
      groupedItems[coverage_type].brokers = item.brokers ? item.brokers : '';
      groupedItems[coverage_type].policy_number = item.policy_number;
      groupedItems[coverage_type].carrier = item.carrier;
      groupedItems[coverage_type].named_insured = item.named_insured;
      groupedItems[coverage_type].expiry_date = item.expiry_date
        ? item.expiry_date
        : '';
    });

    return Object.entries(groupedItems).map(
      ([
        coverage_type,
        { items, brokers, policy_number, carrier, named_insured, expiry_date },
      ]) => ({
        coverage_type,
        items,
        brokers,
        policy_number,
        carrier,
        named_insured,
        expiry_date,
      }),
    );
  };
}

interface GroupedComplianceItems {
  coverage_type: string;
  items: Omit<ComplianceItem, 'coverage_type'>[];
  brokers: string;
}
[];
