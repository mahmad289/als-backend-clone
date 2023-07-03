import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ComplianceStatusReportCreator } from 'als/building-block/RequestableDto/Report/ComplianceStatusReportCreator';
import { ServiceError } from 'als/building-block/utils/apiError';
import { DOCUMENT_TYPE_UUID } from 'als/building-block/utils/enum';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  ComplianceStatus,
  ComplianceStatusFinal,
} from 'als/building-block/utils/reportsInterface';
import {
  CommunicationModel,
  CommunicationModel as communicationModel,
  CommunicationModelDocument,
} from 'als/manager/communication/communication.model';
import {
  VendorModel as vendorModel,
  VendorModelDocument,
} from 'als/manager/vendor/vendor.model';
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as xlsx from 'xlsx-js-style';

import { ReportHelper } from '../reportHelper';

@Injectable()
export class ComplianceStatusReport {
  constructor(
    @InjectModel(vendorModel.name)
    readonly VendorModel: Model<VendorModelDocument>,
    @InjectModel(communicationModel.name)
    readonly CommunicationModel: Model<CommunicationModelDocument>,
    private reportHelper: ReportHelper,
  ) {}

  async create(body: ComplianceStatusReportCreator): Promise<any> {
    try {
      let complianceStatusResponse: ComplianceStatus[] = [];
      let complianceStatusFinal: ComplianceStatusFinal = {
        project_name: '',
        data: [],
      };

      let complianceStatusFinalArray: any[] = [];
      let initialDate;
      let firstFollowDate;
      let secondFollowDate;
      const { compliances, projects: projects } =
        await this.reportHelper.getCompliancesAndProjects({
          client_id: body.client_id,
          projectIdVendorIds: body.projectVendor,
        });

      if (projects && projects.length > 0) {
        for (const project of projects) {
          const communicationData: CommunicationModel[] =
            await this.CommunicationModel.find({
              project_id: project._id,
            });

          if (!communicationData) {
            throw new ServiceError(
              'Communication Data Not Found',
              HttpStatus.NOT_FOUND,
            );
          }

          for (const communication of communicationData) {
            if (communication?.communication_type === 'onboarding') {
              initialDate = communication?.timestamp.toLocaleDateString(
                'en-US',
                {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                },
              );
            } else if (
              communication?.communication_type === 'auto_notification'
            ) {
              firstFollowDate = communication?.timestamp.toLocaleDateString(
                'en-US',
                {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                },
              );
            } else {
              secondFollowDate = communication?.timestamp.toLocaleDateString(
                'en-US',
                {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                },
              );
            }
          }

          for (const compliance of compliances) {
            complianceStatusResponse = [];
            if (compliance.project_id.toString() === project._id.toString()) {
              const professionalLiability: string[] = [];
              const vendor = await this.VendorModel.findOne({
                _id: compliance.vendor_id,
              }).lean();

              for (const template_item of compliance.template_items) {
                if (
                  template_item?.document_type_uuid ===
                  DOCUMENT_TYPE_UUID.ACORD_25
                ) {
                  if (
                    template_item?.master_requirement
                      ?.requirement_description === 'E&O: In Aggregate'
                  ) {
                    professionalLiability.push(template_item.actual_limit);
                  }

                  if (
                    template_item?.master_requirement
                      ?.requirement_description === 'E&O: Per Claim'
                  ) {
                    professionalLiability.push(template_item.actual_limit);
                  }
                }
              }

              if (!vendor) {
                throw new ServiceError(
                  'Vendor Data Not Found',
                  HttpStatus.NOT_FOUND,
                );
              }

              const complianceStatus: ComplianceStatus = {
                vendor_and_others: compliance?.vendor_name,
                sow_overview: vendor?.scope_of_work,
                initial_request: initialDate || '',
                follow_up_1st: firstFollowDate || '',
                follow_up_2nd: secondFollowDate || '',
                escalation_status: compliance?.in_escalation ? 'Y' : 'N',
                notes: project?.notes,
                professional_liability_coverage_limit:
                  professionalLiability.join('/') || '',
              };

              complianceStatusResponse.push(complianceStatus);
            }

            complianceStatusFinal = {
              project_name: project.name,
              data: complianceStatusResponse,
            };

            if (complianceStatusFinal.data.length > 0) {
              complianceStatusFinalArray.push(complianceStatusFinal);
            }
          }
        }
      } else {
        throw new ServiceError('Project Data Not Found', HttpStatus.NOT_FOUND);
      }

      complianceStatusFinalArray = complianceStatusFinalArray.reduce(
        (acc, { project_name, data }) => {
          const existingData = acc.find(
            (item: any) => item.project_name === project_name,
          );

          if (existingData) {
            existingData.data.push(...data);
          } else {
            acc.push({ project_name, data });
          }

          return acc;
        },
        [],
      );

      return complianceStatusFinalArray;
    } catch (e) {
      throw errorHandler(e);
    }
  }

  async generateExcel(body: any) {
    try {
      // Create a workbook and add the worksheet to it
      const wb = xlsx.utils.book_new();
      const reportData: any = await this.create(body);

      if (reportData.length <= 0) {
        throw new ServiceError(
          'No Data Found for the given criteria',
          HttpStatus.NOT_FOUND,
        );
      }

      for (let i = 0; i < reportData.length; i++) {
        const sheetName = reportData[i].project_name.substring(0, 30);
        // Create the data array
        const wsData = [
          [
            {
              v: reportData[i].project_name + ' - Compliance Summary',
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
                  patternType: 'solid',
                  fgColor: { rgb: 'FFC6EFCE' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
          ],
          // add Comments in 8th column of second row
          [],
          [
            {
              v: 'Vendors and Others',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                  color: { rgb: 'FFFFFF' },
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: '87CEEB' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'SOW Overview/Brief',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                  color: { rgb: 'FFFFFF' },
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: '87CEEB' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Compliance Status',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'B4C6E7' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Initial Request',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFE599' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: '1st Follow Up',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFE599' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: '2nd Follow Up or Last Request',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFE599' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Escalation Y/N',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFE599' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Agreement and Insurance Requirements',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                  color: { rgb: 'FFFFFF' },
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'B4C6E7' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Certificates',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                  color: { rgb: 'FFFFFF' },
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'B4C6E7' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Supporting Documents',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                  color: { rgb: 'FFFFFF' },
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'B4C6E7' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Fortis Action',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                  color: { rgb: 'FFFFFF' },
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'B4C6E7' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Notes',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                  color: { rgb: 'FFFFFF' },
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: '87CEEB' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Executive Agreement with Insurance Requirements on file',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                  color: { rgb: 'FFFFFF' },
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: '87CEEB' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Agreement Type',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                  color: { rgb: 'FFFFFF' },
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: '87CEEB' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Indemnification',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                  color: { rgb: 'FFFFFF' },
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: '87CEEB' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Limitation of Liability',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                  color: { rgb: 'FFFFFF' },
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: '87CEEB' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Professional Liability Coverage Limit',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                  color: { rgb: 'FFFFFF' },
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: '87CEEB' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'GL',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFC6EFCE' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Auto',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFC6EFCE' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Umb',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFC6EFCE' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'WC',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFC6EFCE' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Prof',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFC6EFCE' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'GL',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFC6EFCE' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Auto',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFC6EFCE' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Umb',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFC6EFCE' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'WC',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFC6EFCE' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Pro Liab',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFC6EFCE' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Dec',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFE599' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Forms List',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFE599' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'AI Ongoing',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFE599' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'AI completed',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFE599' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'PNC',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFE599' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'WOS',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFE599' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'NOC',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFE599' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Dec',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFFFCC' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Forms List',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFFFCC' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Dec',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'D3D3D3' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Forms List',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'D3D3D3' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Sch of Underlying',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'D3D3D3' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'PNC',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'D3D3D3' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'WOS',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'FFFFCC' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Dec',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'B4C6E7' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Forms List',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'B4C6E7' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'Retro Date',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'B4C6E7' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
            {
              v: 'NOC',
              s: {
                font: {
                  sz: 10,
                  bold: true,
                },
                alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  textRotation: 90,
                },
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: 'B4C6E7' },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  bottom: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  left: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                  right: {
                    style: 'thin',
                    color: { rgb: '000000' },
                  },
                },
              },
            },
          ],
        ];

        wsData[1][7] = {
          v: 'Comments',
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
              patternType: 'solid',
              fgColor: { rgb: 'B4C6E7' },
            },
            border: {
              top: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              bottom: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              left: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              right: {
                style: 'thin',
                color: { rgb: '000000' },
              },
            },
          },
        };
        wsData[0][22] = {
          v: 'SUPPORTING POLICY DOCUMENTS',
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
              patternType: 'solid',
              fgColor: { rgb: 'FFFFFF' },
            },
            border: {
              top: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              bottom: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              left: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              right: {
                style: 'thin',
                color: { rgb: '000000' },
              },
            },
          },
        };
        wsData[1][22] = {
          v: 'Certificates',
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
              patternType: 'solid',
              fgColor: { rgb: 'FFFF00' },
            },
            border: {
              top: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              bottom: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              left: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              right: {
                style: 'thin',
                color: { rgb: '000000' },
              },
            },
          },
        };
        wsData[1][27] = {
          v: 'GL',
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
              patternType: 'solid',
              fgColor: { rgb: 'FFFF00' },
            },
            border: {
              top: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              bottom: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              left: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              right: {
                style: 'thin',
                color: { rgb: '000000' },
              },
            },
          },
        };
        wsData[1][34] = {
          v: 'Auto',
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
              patternType: 'solid',
              fgColor: { rgb: 'FFE599' },
            },
            border: {
              top: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              bottom: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              left: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              right: {
                style: 'thin',
                color: { rgb: '000000' },
              },
            },
          },
        };
        wsData[1][36] = {
          v: 'UMB',
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
              patternType: 'solid',
              fgColor: { rgb: 'D3D3D3' },
            },
            border: {
              top: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              bottom: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              left: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              right: {
                style: 'thin',
                color: { rgb: '000000' },
              },
            },
          },
        };
        wsData[1][40] = {
          v: 'WC',
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
              patternType: 'solid',
              fgColor: { rgb: 'FFFFCC' },
            },
            border: {
              top: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              bottom: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              left: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              right: {
                style: 'thin',
                color: { rgb: '000000' },
              },
            },
          },
        };
        wsData[1][41] = {
          v: 'Pro Liab',
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
              patternType: 'solid',
              fgColor: { rgb: 'FFFF00' },
            },
            border: {
              top: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              bottom: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              left: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              right: {
                style: 'thin',
                color: { rgb: '000000' },
              },
            },
          },
        };
        wsData[1][44] = {
          v: 'PL',
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
              patternType: 'solid',
              fgColor: { rgb: 'B4C6E7' },
            },
            border: {
              top: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              bottom: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              left: {
                style: 'thin',
                color: { rgb: '000000' },
              },
              right: {
                style: 'thin',
                color: { rgb: '000000' },
              },
            },
          },
        };

        for (const data of reportData[i].data) {
          const styledData = [
            data.vendor_and_others,
            data.sow_overview,
            data.compliance_status,
            data.initial_request,
            data.follow_up_1st,
            data.follow_up_2nd,
            data.escalation_status,
            data.exec_agreement_insurance_req,
            data.agreement_type,
            data.indemnification,
            data.limitation_of_liability,
            data.notes,
            data.gl,
            data.auto,
            data.umb,
            data.wc,
            data.professional_liability_coverage_limit,
            data.prof,
            data.suppoting_document,
          ];

          // Apply styling to each cell in styledData
          for (let i = 0; i < styledData.length; i++) {
            styledData[i] = {
              v: styledData[i],
              s: {
                font: { sz: 10 },
                alignment: {
                  horizontal: 'left',
                  vertical: 'center',
                  wrapText: true,
                },
              },
            };
          }

          wsData.push(styledData);
        }

        // Create the worksheet
        const ws = xlsx.utils.aoa_to_sheet(wsData);

        // merge column
        ws['!merges'] = [
          {
            s: { r: 0, c: 0 },
            e: { r: 0, c: 12 },
          },
          {
            s: { r: 0, c: 22 },
            e: { r: 0, c: 43 },
          },
          {
            s: { r: 1, c: 0 },
            e: { r: 1, c: 6 },
          },
          {
            s: { r: 1, c: 7 },
            e: { r: 1, c: 10 },
          },
          {
            s: { r: 1, c: 22 },
            e: { r: 1, c: 26 },
          },
          {
            s: { r: 1, c: 27 },
            e: { r: 1, c: 33 },
          },
          {
            s: { r: 1, c: 34 },
            e: { r: 1, c: 35 },
          },
          {
            s: { r: 1, c: 36 },
            e: { r: 1, c: 39 },
          },
          {
            s: { r: 1, c: 41 },
            e: { r: 1, c: 43 },
          },
        ];

        // set row height for first row
        ws['!rows'] = [{ hpt: 30 }];

        // set row height for second row
        ws['!rows'][1] = { hpt: 20 };

        // set row height and width for third row
        ws['!rows'][2] = { hpt: 100 };

        ws['!cols'] = [];
        for (let i = 0; i < 2; i++) {
          ws['!cols'][i] = { wch: 20 };
        }

        for (let i = 7; i < 17; i++) {
          ws['!cols'][i] = { wch: 20 };
        }

        // Append the worksheet to the workbook
        xlsx.utils.book_append_sheet(wb, ws, sheetName);
      }

      // Write the workbook to an Excel file
      const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
      // fs.writeFileSync('libs/reports/sample.xlsx', buffer);

      return buffer;
    } catch (e) {
      throw errorHandler(e);
    }
  }
}
