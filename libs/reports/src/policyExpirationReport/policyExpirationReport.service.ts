import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ExpirationReportCreator } from 'als/building-block/RequestableDto/Report/ExpirationReportCreator';
import { ServiceError } from 'als/building-block/utils/apiError';
import {
  COVERAGE_TYPE_UUID,
  DOCUMENT_TYPE_UUID,
} from 'als/building-block/utils/enum';
import { PolicyExpiration } from 'als/building-block/utils/reportsInterface';
import {
  ClientModel as clientModel,
  ClientModelDocument,
} from 'als/manager/client/client.model';
import {
  CommunicationModel,
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
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as xlsx from 'xlsx-js-style';

import { ReportHelper } from '../reportHelper';
import { IReportService } from '../reports.service';

@Injectable()
export class PolicyExpirationReport implements IReportService {
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
    @InjectModel(CommunicationModel.name)
    readonly CommunicationModel: Model<CommunicationModelDocument>,
    @InjectModel(ContactModel.name)
    private readonly contactModel: Model<ContactModelDocument>,
    private reportHelper: ReportHelper,
  ) {}

  async advanceFilter(
    body: ExpirationReportCreator,
    compliances: complianceModel[],
    projects: projectModel[],
  ): Promise<[compliances: complianceModel[], projects: projectModel[]]> {
    if (body.coverage_type || body.expiration_date) {
      for (const compliance of compliances) {
        for (let i = compliance.compliance_items.length - 1; i >= 0; i--) {
          const object = compliance.compliance_items[i];
          if (object.master_requirement) {
            if (
              body?.coverage_type?.length > 0 &&
              !body.coverage_type?.includes(
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
              !body.coverage_type?.includes(
                object?.master_requirement.coverage_type_name,
              )
            ) {
              compliance.template_items.splice(i, 1);
            }
          }

          if (body.expiration_date) {
            if (compliance?.acord_25_ocr_data) {
              let reqexpiryDate = new Date(body.expiration_date);
              // Compare date components only
              reqexpiryDate = new Date(
                (<Date>reqexpiryDate).getFullYear(),
                (<Date>reqexpiryDate).getMonth(),
                (<Date>reqexpiryDate).getDate(),
              );

              if (
                object?.master_requirement?.coverage_type_uuid ===
                  COVERAGE_TYPE_UUID.GL &&
                compliance.acord_25_ocr_data.extracted_data?.cgl_policy_exp
              ) {
                let expiryDateGl = new Date(
                  compliance.acord_25_ocr_data.extracted_data.cgl_policy_exp,
                );

                expiryDateGl = new Date(
                  (<Date>expiryDateGl).getFullYear(),
                  (<Date>expiryDateGl).getMonth(),
                  (<Date>expiryDateGl).getDate(),
                );
                if (
                  expiryDateGl.getTime() > reqexpiryDate.getTime() &&
                  compliance.template_items[i]
                ) {
                  compliance.template_items.splice(i, 1);
                }
              }

              if (
                object?.master_requirement?.coverage_type_uuid ===
                  COVERAGE_TYPE_UUID.AL &&
                compliance.acord_25_ocr_data.extracted_data?.al_exp
              ) {
                let expiryDateAl = new Date(
                  compliance.acord_25_ocr_data.extracted_data.al_exp,
                );

                expiryDateAl = new Date(
                  (<Date>expiryDateAl).getFullYear(),
                  (<Date>expiryDateAl).getMonth(),
                  (<Date>expiryDateAl).getDate(),
                );

                if (
                  expiryDateAl.getTime() > reqexpiryDate.getTime() &&
                  compliance.template_items[i]
                ) {
                  compliance.template_items.splice(i, 1);
                }
              }

              if (
                object?.master_requirement?.coverage_type_uuid ===
                  COVERAGE_TYPE_UUID.UL &&
                compliance.acord_25_ocr_data.extracted_data.ul_exp
              ) {
                let expiryDateUl = new Date(
                  compliance.acord_25_ocr_data.extracted_data.ul_exp,
                );

                expiryDateUl = new Date(
                  (<Date>expiryDateUl).getFullYear(),
                  (<Date>expiryDateUl).getMonth(),
                  (<Date>expiryDateUl).getDate(),
                );

                if (
                  expiryDateUl.getTime() > reqexpiryDate.getTime() &&
                  compliance.template_items[i]
                ) {
                  compliance.template_items.splice(i, 1);
                }
              }

              if (
                object?.master_requirement?.coverage_type_uuid ===
                  COVERAGE_TYPE_UUID.WC &&
                compliance.acord_25_ocr_data.extracted_data.wc_exp
              ) {
                let expiryDateWc = new Date(
                  compliance.acord_25_ocr_data.extracted_data.wc_exp,
                );

                expiryDateWc = new Date(
                  (<Date>expiryDateWc).getFullYear(),
                  (<Date>expiryDateWc).getMonth(),
                  (<Date>expiryDateWc).getDate(),
                );

                if (
                  expiryDateWc.getTime() > reqexpiryDate.getTime() &&
                  compliance.template_items[i]
                ) {
                  compliance.template_items.splice(i, 1);
                }
              }
            }

            if (compliance?.acord_28_ocr_data) {
              let reqexpiryDate = new Date(body.expiration_date);
              reqexpiryDate = new Date(
                (<Date>reqexpiryDate).getFullYear(),
                (<Date>reqexpiryDate).getMonth(),
                (<Date>reqexpiryDate).getDate(),
              );

              let dbexpiryDate = new Date(
                compliance.acord_28_ocr_data?.extracted_data?.expiration_date,
              );

              dbexpiryDate = new Date(
                (<Date>dbexpiryDate).getFullYear(),
                (<Date>dbexpiryDate).getMonth(),
                (<Date>dbexpiryDate).getDate(),
              );
              if (
                dbexpiryDate.getTime() > reqexpiryDate.getTime() &&
                compliance.template_items[i]
              ) {
                compliance.template_items.splice(i, 1);
              }
            }
          }
        }
      }
    }

    if (body.insurance_co || body.broker || body.client_stage) {
      for (let i = projects.length - 1; i >= 0; i--) {
        if (
          body.client_stage &&
          projects[i] &&
          projects[i]?.deal_summary?.client_stage !== body.client_stage
        ) {
          projects.splice(i, 1);
        }

        if ((body.broker || body.insurance_co) && projects[i]) {
          const contactDetails = await this.reportHelper.getContactDetails(
            projects[i]._id.toString(),
          );

          if (
            body.broker &&
            contactDetails.hasOwnProperty('Broker') &&
            !contactDetails.Broker.includes(body.broker) &&
            projects[i]
          ) {
            projects.splice(i, 1);
          }

          if (
            body.insurance_co &&
            contactDetails.hasOwnProperty('Insurance Company') &&
            !contactDetails['Insurance Company'].includes(body.insurance_co) &&
            projects[i]
          ) {
            projects.splice(i, 1);
          }
        }
      }
    }

    return [compliances, projects];
  }

  async create(body: ExpirationReportCreator): Promise<any> {
    const compliance_items: PolicyExpiration[] = [];
    const template_items: PolicyExpiration[] = [];
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
    let uniqueItemArray: any = [];
    if (projects.length !== 0) {
      for (const project of projects) {
        const contactDetails: any = await this.reportHelper.getContactDetails(
          project._id.toString(),
        );

        let mergedArray: any = [];
        let brokerName: any = [];
        let broker_Address: any = [];
        if (contactDetails.hasOwnProperty('Broker_CE')) {
          broker_Address = contactDetails['Broker_CE'];
        }

        if (contactDetails.hasOwnProperty('Broker_NAME')) {
          brokerName = contactDetails['Broker_NAME'];
        }

        if (
          contactDetails.hasOwnProperty('Broker') &&
          contactDetails.hasOwnProperty('Insurance Company')
        ) {
          mergedArray = contactDetails['Broker']?.concat(
            contactDetails['Insurance Company'],
          );
        }

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
              const obj = {
                client: project?.client?.name,
                exp_date: compliance?.expiry_date || '',
                type_of_ins: insuranceType,
                coverage_type:
                  compliance?.master_requirement?.coverage_type_name,
                policy_number: '',
                insurance_co: '',
                analyst: project?.deal_summary?.analyst || '',
                asset_mgr: client_contact_names.join(', ') || '',
                project_name: project?.name,
                vendor: comp?.vendor_name,
                client_stage: project?.deal_summary?.client_stage || '',
                named_insured: '',
                broker_name: brokerName || '',
                broker_add_email: broker_Address || '',
                date1: onboarding,
                date2: notification_date1,
                date3: notification_date2,
                date4: escalation,
              };

              compliance_items.push(obj);
            }

            for (const template of comp.template_items) {
              if (
                template?.document_type_uuid === DOCUMENT_TYPE_UUID.ACORD_28
              ) {
                const obj = {
                  client: project?.client?.name,
                  exp_date:
                    comp.acord_28_ocr_data?.extracted_data?.expiration_date ||
                    '',
                  type_of_ins: insuranceType,
                  coverage_type:
                    template?.master_requirement?.coverage_type_name || '',
                  policy_number:
                    comp?.acord_28_ocr_data?.extracted_data.policy_number || '',
                  insurance_co:
                    comp.acord_28_ocr_data?.extracted_data.company_name || '',
                  analyst: project?.deal_summary?.analyst || '',
                  asset_mgr: client_contact_names.join(', ') || '',
                  project_name: project?.name || '',
                  vendor: comp?.vendor_name,
                  client_stage: project?.deal_summary?.client_stage || '',
                  named_insured:
                    comp.acord_28_ocr_data?.extracted_data.named_insured || '',
                  broker_name:
                    comp.acord_28_ocr_data?.extracted_data.producer_name || '',
                  broker_add_email:
                    comp.acord_28_ocr_data?.extracted_data.email || '',
                  date1: onboarding,
                  date2: notification_date1,
                  date3: notification_date2,
                  date4: escalation,
                };

                template_items.push(obj);
              } else {
                const obj = {
                  client: project?.client.name,
                  exp_date: '',
                  type_of_ins: insuranceType,
                  coverage_type:
                    template?.master_requirement?.coverage_type_name || '',
                  policy_number: '',
                  insurance_co: '',
                  analyst: project?.deal_summary?.analyst || '',

                  asset_mgr: client_contact_names.join(', ') || '',

                  project_name: project?.name,
                  vendor: comp?.vendor_name,
                  client_stage: project?.deal_summary?.client_stage || '',
                  named_insured:
                    comp.acord_25_ocr_data?.extracted_data.insured || '',
                  broker_name:
                    comp.acord_25_ocr_data?.extracted_data.producer || '',
                  broker_add_email:
                    comp?.acord_25_ocr_data?.extracted_data?.email_address ||
                    '',
                  date1: onboarding,
                  date2: notification_date1,
                  date3: notification_date2,
                  date4: escalation,
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

        // merge the compliance and template items
        const mergedItemArray = compliance_items?.concat(template_items);
        // remove duplicate items from mergedArray have same coverage_type and vendor_name
        uniqueItemArray = mergedItemArray.filter(
          (thing, index, self) =>
            index ===
            self.findIndex(
              t =>
                t?.coverage_type === thing?.coverage_type &&
                t?.vendor === thing?.vendor,
            ),
        );

        //sort array by vendor name
        uniqueItemArray.sort((a: any, b: any) =>
          a?.vendor > b?.vendor ? 1 : -1,
        );
      }
    }

    return uniqueItemArray;
  }

  async generateExcel(body: ExpirationReportCreator) {
    // Create a workbook and add the worksheet to it
    const wb = xlsx.utils.book_new();
    const reportData: any = await this.create(body);
    // if we have no data to generate Excel!
    if (reportData && reportData.length <= 0) {
      throw new ServiceError(
        'No Data found to generate report',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Convert data to array of arrays
    const headers = Object.keys(reportData[0]);
    const headers_1 = [
      'Client',
      'Exp Date',
      'Type of Ins.',
      'Coverage Type',
      'Policy No.',
      'Insurance Co',
      'Analyst',
      'Asst Mgr',
      'Project Name',
      'Vendor',
      'Client Stage',
      'Named Insured',
      'Broker',
      'Broker Info',
      'Intial Req',
      '2nd Req. Inc. GP',
      'Esc to HHC Asset',
      'Date 1st Esc to HHC',
    ];

    const data = reportData.map((obj: any) => {
      return headers.map(key => {
        if (key === 'type_of_ins' && obj[key]) {
          return obj[key]?.join(', '); // Convert array to string
        }

        return obj[key];
      });
    });

    const wsData = [
      ['Policy Expiration Report (Chronological) – w/ f/u dates'],
      [
        `Policies that expire on or before ${
          body.expiration_date ? body.expiration_date : ''
        }`,
      ],
      headers_1,
      ...data,
    ];

    // stylize and colorize wsData
    wsData[0][0] = {
      v: wsData[0][0],
      s: {
        font: {
          sz: 18,
          bold: true,
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true,
        },
        fill: {
          fgColor: { rgb: 'FFFF00' },
        },
      },
    };
    wsData[1][0] = {
      v: wsData[1][0],
      s: {
        font: {
          sz: 14,
          bold: true,
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true,
        },
        fill: {
          fgColor: { rgb: 'FFFF00' },
        },
      },
    };

    wsData[2] = wsData[2].map((header: any) => {
      return {
        v: header,
        s: {
          font: {
            sz: 12,
            bold: true,
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: true,
          },
          fill: {
            fgColor: { rgb: 'D3D3D3' },
          },
        },
      };
    });

    // Create the worksheet
    const ws = xlsx.utils.aoa_to_sheet(wsData);

    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
    ];

    // Set row height
    ws['!rows'] = [{ hpx: 20 }, { hpx: 20 }, { hpx: 20 }];

    // Set row height from third row by looping through data
    ws['!rows'] = ws['!rows'].concat(
      data.map((row: any) => {
        return { hpx: 30 };
      }),
    );

    // Set column width from third column by looping through header
    ws['!cols'] = headers.map((header: any) => {
      return { wch: header.length + 5 };
    });

    wsData[2] = headers.map((header: any) => {
      return {
        v: header,
        s: {
          font: {
            sz: 12,
            bold: true,
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: true,
          },
          fill: {
            fgColor: { rgb: '808080' },
          },
        },
      };
    });

    ws['!cols'][2] = { wch: 50 };
    ws['!cols'][3] = { wch: 30 };
    ws['!cols'][5] = { wch: 75 };
    ws['!cols'][6] = { wch: 20 };
    ws['!cols'][7] = { wch: 40 };
    ws['!cols'][11] = { wch: 60 };
    ws['!cols'][12] = { wch: 70 };
    for (let i = 13; i < 18; i++) {
      ws['!cols'][i] = { wch: 20 };
    }

    // Append the worksheet to the workbook
    xlsx.utils.book_append_sheet(wb, ws, 'Expiration Report');

    // Write the workbook to an Excel file
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    // fs.writeFileSync('libs/reports/sample.xlsx', buffer);

    return buffer;
  }
}
