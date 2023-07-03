import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EscalationReportCreator } from 'als/building-block/RequestableDto/Report/EscalationReportCreator';
import { ServiceError } from 'als/building-block/utils/apiError';
import {
  COVERAGE_TYPE_UUID,
  DOCUMENT_TYPE_UUID,
} from 'als/building-block/utils/enum';
import {
  Escalation,
  EscalationArray,
} from 'als/building-block/utils/reportsInterface';
import {
  ClientModel as clientModel,
  ClientModelDocument,
} from 'als/manager/client/client.model';
import {
  CommunicationModel,
  CommunicationModel as communicationModel,
  CommunicationModelDocument,
} from 'als/manager/communication/communication.model';
import {
  ComplianceModel as complianceModel,
  ComplianceModelDocument,
} from 'als/manager/compliance/model/compliance.model';
import {
  ContactModel,
  ContactModelDocument,
} from 'als/manager/contact/contact.model';
import {
  EscalationModel as escalationModel,
  EscalationModelDocument,
} from 'als/manager/escalation/escalation.model';
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
export class EscalationReport implements IReportService {
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
    @InjectModel(communicationModel.name)
    readonly CommunicationModel: Model<CommunicationModelDocument>,
    @InjectModel(escalationModel.name)
    readonly EscalationModel: Model<EscalationModelDocument>,
    private reportHelper: ReportHelper,
    @InjectModel(ContactModel.name)
    private readonly contactModel: Model<ContactModelDocument>,
  ) {}

  async advanceFilter(
    body: EscalationReportCreator,
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

    if (body.insurance_co || body.broker || body.client_stage) {
      for (let i = projects.length - 1; i >= 0; i--) {
        if (
          body.client_stage &&
          projects[i]?.deal_summary?.client_stage !== body.client_stage
        ) {
          projects.splice(i, 1);
        }

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

  async create(body: EscalationReportCreator): Promise<any> {
    const compliance_items: Escalation[] = [];
    const template_items: Escalation[] = [];
    let escalationArray: EscalationArray[] = [];
    let { compliances, projects }: { compliances: any; projects: any } =
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

    if (projects.length !== 0) {
      for (const project of projects) {
        const contactDetails = await this.reportHelper.getContactDetails(
          project._id.toString(),
        );

        const escalationDetails = await this.EscalationModel.findOne({
          project_id: project._id,
        });

        let client: any = await this.ClientModel.findById(
          compliances[0].client_id,
        );

        if (client && client.contacts_id && client.contacts_id.length > 0) {
          let clientContacts = [];
          clientContacts = await this.contactModel.find({
            _id: { $in: client.contacts_id },
            type: { $in: ['Asset Manager'] },
          });

          client = {
            ...JSON.parse(JSON.stringify(client)),
            contacts_id: clientContacts,
          };
          client.contacts_id = clientContacts;
        }

        const client_contact_names = client.contacts_id.map(
          (contact: { first_name: any; last_name: any }) => {
            if (contact?.first_name && contact?.last_name) {
              return `${contact?.first_name} ${contact?.last_name},`;
            }
          },
        );

        const allKeys = Object.keys(contactDetails);
        const keysToRemove = ['Broker_CE', 'Broker_NAME'];
        const insuranceType = allKeys.filter(
          key => !keysToRemove.includes(key),
        );

        for (const comp of compliances) {
          const result: any = await this.CommunicationModel.aggregate([
            {
              $facet: {
                autoNotification: [
                  {
                    $match: {
                      compliance_id: comp._id,
                      communication_type: 'auto_notification',
                    },
                  },
                  {
                    $lookup: {
                      from: 'communicationtemplatemodels',
                      localField: 'template_id',
                      foreignField: '_id',
                      as: 'template_id',
                    },
                  },
                  {
                    $unwind: {
                      path: '$template_id',
                    },
                  },
                  {
                    $match: {
                      'template_id.template_type': 'AutoNotification Update',
                    },
                  },
                  {
                    $project: {
                      body: 0,
                      'template_id.template': 0,
                      'template_id.tags': 0,
                      'template_id.created_by': 0,
                      'template_id.subject': 0,
                      'template_id.system_generated': 0,
                      'template_id.__v': 0,
                    },
                  },
                  {
                    $sort: {
                      _id: 1,
                    },
                  },
                  {
                    $limit: 2,
                  },
                ],
                onBoarding: [
                  {
                    $match: {
                      compliance_id: comp._id,
                      communication_type: 'onboarding',
                    },
                  },
                  {
                    $sort: {
                      _id: 1,
                    },
                  },
                  {
                    $limit: 1,
                  },
                ],
                escalation: [
                  {
                    $match: {
                      compliance_id: comp._id,
                      communication_type: 'escalation',
                    },
                  },
                  {
                    $sort: {
                      _id: 1,
                    },
                  },
                  {
                    $limit: 1,
                  },
                ],
              },
            },
          ]);

          const notification_date1 =
            result[0]?.autoNotification[0]?.timestamp?.toLocaleDateString(
              'en-US',
              {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              },
            ) || '';

          const notification_date2 =
            result[0]?.autoNotification[1]?.timestamp?.toLocaleDateString(
              'en-US',
              {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              },
            ) || '';

          const onboarding =
            result[0]?.onBoarding[0]?.timestamp?.toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            }) || '';

          const escalation =
            result[0]?.escalation[0]?.timestamp?.toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            }) || '';

          if (project._id.equals(comp.project_id)) {
            for (const compliance of comp.compliance_items) {
              if (compliance.is_escalated === true) {
                const obj = {
                  client: project.client.name,
                  project_name: project.name,
                  vendor: comp.vendor_name,
                  asset_mgr: client_contact_names.join(', ') || '',
                  exp_date: '',
                  esc_description: escalationDetails?.comments,
                  type_of_ins: insuranceType,
                  coverage_type:
                    compliance.master_requirement.coverage_type_name,
                  insurance_co: '',
                  date1: onboarding,
                  date2: notification_date1,
                  date3: notification_date2,
                  date4: escalation,
                };

                compliance_items.push(obj);
              }
            }

            for (const template of comp.template_items) {
              if (template.document_type_uuid === DOCUMENT_TYPE_UUID.ACORD_28) {
                if (template.is_escalated === true) {
                  const obj = {
                    client: project.client.name,
                    project_name: project.name,
                    vendor: comp.vendor_name,
                    asset_mgr: client_contact_names.join(', ') || '',
                    exp_date:
                      comp?.acord_28_ocr_data?.extracted_data
                        ?.expiration_date || '',
                    policy_number:
                      comp?.acord_28_ocr_data?.extracted_data.policy_number ||
                      '',
                    named_insured:
                      comp.acord_28_ocr_data?.extracted_data.named_insured ||
                      '',
                    esc_description: escalationDetails?.comments,
                    type_of_ins: insuranceType,
                    coverage_type:
                      template.master_requirement.coverage_type_name,
                    insurance_co:
                      comp.acord_28_ocr_data?.extracted_data.company_name || '',
                    date1: onboarding,
                    date2: notification_date1,
                    date3: notification_date2,
                    date4: escalation,
                  };

                  template_items.push(obj);
                }
              } else {
                if (template.is_escalated === true) {
                  const obj = {
                    client: project.client.name,
                    project_name: project.name,
                    vendor: comp.vendor_name,
                    asset_mgr: client_contact_names.join(', ') || '',
                    exp_date: '',
                    esc_description: escalationDetails?.comments,
                    type_of_ins: insuranceType,
                    coverage_type:
                      template.master_requirement.coverage_type_name,
                    insurance_co: '',
                    date1: onboarding,
                    date2: notification_date1,
                    date3: notification_date2,
                    date4: escalation,
                    policy_number: '',
                    named_insured:
                      comp.acord_25_ocr_data?.extracted_data.insured || '',
                  };

                  if (
                    template?.master_requirement?.coverage_type_uuid ===
                    COVERAGE_TYPE_UUID.GL
                  ) {
                    obj.exp_date =
                      comp?.acord_25_ocr_data?.extracted_data?.cgl_policy_exp;
                    obj.policy_number =
                      comp?.acord_25_ocr_data?.extracted_data?.cgl_policy_number;
                  }

                  if (
                    template?.master_requirement?.coverage_type_uuid ===
                    COVERAGE_TYPE_UUID.AL
                  ) {
                    obj.exp_date =
                      comp?.acord_25_ocr_data?.extracted_data?.al_exp;
                    obj.policy_number =
                      comp?.acord_25_ocr_data?.extracted_data?.al_policy_number;
                  }

                  if (
                    template?.master_requirement?.coverage_type_uuid ===
                    COVERAGE_TYPE_UUID.UL
                  ) {
                    obj.exp_date =
                      comp?.acord_25_ocr_data?.extracted_data?.ul_exp;
                    obj.policy_number =
                      comp?.acord_25_ocr_data?.extracted_data?.ul_policy_number;
                  }

                  if (
                    template?.master_requirement?.coverage_type_uuid ===
                    COVERAGE_TYPE_UUID.WC
                  ) {
                    obj.exp_date =
                      comp?.acord_25_ocr_data?.extracted_data?.wc_exp;
                    obj.policy_number =
                      comp?.acord_25_ocr_data?.extracted_data?.wc_policy_number;
                  }

                  template_items.push(obj);
                }
              }
            }
          }
        }

        // merge the compliance and template items
        const mergedItemArray = compliance_items.concat(template_items);
        // remove duplicate items from mergedArray have same coverage_type and vendor_name
        const uniqueItemArray = mergedItemArray.filter(
          (thing, index, self) =>
            index ===
            self.findIndex(
              t =>
                t.coverage_type === thing.coverage_type &&
                t.vendor === thing.vendor,
            ),
        );

        //sort array by vendor name
        uniqueItemArray.sort((a, b) => (a.vendor > b.vendor ? 1 : -1));

        const escalationObject = {
          client: project.client.name,
          project_name: project.name,
          data: uniqueItemArray,
        };

        escalationArray.push(escalationObject);
      }
    }

    escalationArray = escalationArray.filter(el => el.data.length > 0);
    if (escalationArray.length < 1) {
      throw new ServiceError(
        'No Data found to generate report',
        HttpStatus.NOT_FOUND,
      );
    }

    return escalationArray;
  }
}
