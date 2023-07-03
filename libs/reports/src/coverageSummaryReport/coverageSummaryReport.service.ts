import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CoverageSummaryReportCreator } from 'als/building-block/RequestableDto/Report/CoverageSummaryReportCreator';
import { ServiceError } from 'als/building-block/utils/apiError';
import { DOCUMENT_TYPE_UUID } from 'als/building-block/utils/enum';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import { CoverageSummary } from 'als/building-block/utils/reportsInterface';
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
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as xlsx from 'xlsx-js-style';

import { ReportHelper } from '../reportHelper';

@Injectable()
export class CoverageSummaryReport {
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
    body: CoverageSummaryReportCreator,
    projects: projectModel[],
  ) {
    if (body.client_stage) {
      for (let i = projects.length - 1; i >= 0; i--) {
        if (
          body.client_stage &&
          projects[i] &&
          projects[i]?.deal_summary?.client_stage !== body?.client_stage
        ) {
          projects.splice(i, 1);
        }
      }
    }

    return projects;
  }

  async create(body: CoverageSummaryReportCreator): Promise<any> {
    try {
      const coverageSummaryResponse: CoverageSummary[] = [];
      const { compliances, projects: projects } =
        await this.reportHelper.getCompliancesAndProjects({
          client_id: body.client_id,
          projectIdVendorIds: body.projectVendor,
        });

      const updatedprojects = await this.advanceFilter(body, projects);
      if (updatedprojects && updatedprojects.length > 0) {
        for (const project of updatedprojects) {
          for (const compliance of compliances) {
            if (project._id.equals(compliance.project_id)) {
              const coverage_data: CoverageSummary = {
                partnership:
                  project?.parties_to_the_transaction
                    ?.named_insured_partnership,
                property_name: project?.name,
                property_address: project?.address_1,
                property_city: project?.city,
                property_state: project?.state,
                investor: project?.parties_to_the_transaction?.investor_bank,
                project_id: '',
                vendor_name: compliance?.vendor_name,
                commercial_property_policy: '',
                commercial_property_limits: '',
                commercial_property_deductible: '',
                property_expiration_date: '',
                property_insurer: '',
                property_am_best_rating: '',
                loss_of_income: '',
                earthquake_limit: '',
                earthquake_deductible: '',
                flood_limit: '',
                flood_deductible: '',
                wind_and_hail_limit: '', // master requirement does not exist
                wind_and_hail_deductible: '',
                commercial_general_liability: '',
                commercial_general_liability_occurrence: '',
                commercial_general_liability_aggregate: '',
                commercial_general_liability_aggregate_deductible: '',
                general_liability_expiration_date: '',
                general_liability_insurer: '', //how to map
                general_liability_am_best_rating: '',
                excess_commercial_general_liability: '',
                excess_commercial_general_liability_occurrence: '',
                excess_commercial_general_liability_aggregate: '',
                excess_commercial_general_liability_aggregate_deductible: '',
                excess_umbrella_expiration_date: '',
                umbrella_insurer: '', //how to map
                umbrella_am_best_rating: '',
                partnership_auto_liability: '',
                partnership_auto_liability_limit: '',
                partnership_auto_liability_deductible: '', //master requirement does not exist
                partnership_auto_expiration_date: '',
                automobile_insurer: '', //how to map
                automobile_am_best_rating: '',
                property_management_general_liability: '',
                property_management_general_liability_occurrence: '',
                property_management_general_liability_aggregate: '',
                property_management_general_liability_aggregate_deductible: '',
                mgmt_general_liability_expiration_date: '',
                manager_general_liability_insurer: '', //how to map
                manager_general_liability_am_best_rating: '',
                property_management_umbrella: '',
                property_management_umbrella_occurrence: '',
                property_management_umbrella_aggregate: '',
                property_management_umbrella_aggregate_deductible: '',
                mgmt_excess_umbrella_expiration_date: '',
                manager_umbrella_insurer: '', //how to map
                manager_umbrella_am_best_rating: '',
                management_auto_liability_acord25: '',
                management_auto_liability: '',
                management_auto_liability_deductible: '',
                mgmt_auto_expiration_date: '',
                manager_automobile_insurer: '',
                manager_automobile_am_best_rating: '',
                management_workers_comp_acord25: '',
                management_workers_comp: '',
                mgmt_workers_comp_expiration_date: '',
                workers_insurer: '', //how to mp
                workers_am_best_rating: '',
                management_fidelity_bond_acord25: '',
                management_fidelity_bond: '',
                management_fidelity_bond_deductible: '',
                mgmt_fidelity_crime_expiration_date: '',
                crime_insurer: '',
                crime_am_best_rating: '',
              };

              for (const item of compliance?.template_items) {
                if (item.document_type_uuid === DOCUMENT_TYPE_UUID.ACORD_28) {
                  coverage_data.commercial_property_policy =
                    compliance?.acord_28_ocr_data?.extracted_data
                      .policy_number || '';
                  coverage_data.property_expiration_date =
                    compliance?.acord_28_ocr_data?.extracted_data
                      .expiration_date || '';
                  coverage_data.property_insurer =
                    compliance?.acord_28_ocr_data?.extracted_data
                      .company_name || '';
                }

                if (item.document_type_uuid === DOCUMENT_TYPE_UUID.ACORD_25) {
                  coverage_data.commercial_general_liability =
                    compliance?.acord_25_ocr_data?.extracted_data
                      .cgl_policy_number || '';
                  coverage_data.general_liability_expiration_date =
                    compliance?.acord_25_ocr_data?.extracted_data
                      .cgl_policy_exp || '';
                  coverage_data.excess_commercial_general_liability =
                    compliance?.acord_25_ocr_data?.extracted_data
                      .ul_policy_number || '';
                  coverage_data.excess_umbrella_expiration_date =
                    compliance?.acord_25_ocr_data?.extracted_data.ul_exp || '';
                  coverage_data.partnership_auto_liability =
                    compliance?.acord_25_ocr_data?.extracted_data
                      .al_policy_number || '';
                  coverage_data.partnership_auto_expiration_date =
                    compliance?.acord_25_ocr_data?.extracted_data.al_exp || '';
                  coverage_data.property_management_general_liability =
                    compliance?.acord_25_ocr_data?.extracted_data
                      .cgl_policy_number || '';
                  coverage_data.mgmt_general_liability_expiration_date =
                    compliance?.acord_25_ocr_data?.extracted_data
                      .cgl_policy_exp || '';
                  coverage_data.property_management_umbrella =
                    compliance?.acord_25_ocr_data?.extracted_data
                      .ul_policy_number || '';
                  coverage_data.mgmt_excess_umbrella_expiration_date =
                    compliance?.acord_25_ocr_data?.extracted_data.ul_exp || '';
                  coverage_data.management_auto_liability_acord25 =
                    compliance?.acord_25_ocr_data?.extracted_data
                      .al_policy_number || '';
                  coverage_data.mgmt_auto_expiration_date =
                    compliance?.acord_25_ocr_data?.extracted_data.al_exp || '';
                  coverage_data.management_workers_comp_acord25 =
                    compliance?.acord_25_ocr_data?.extracted_data
                      .wc_policy_number || '';
                  coverage_data.mgmt_workers_comp_expiration_date =
                    compliance?.acord_25_ocr_data?.extracted_data.wc_exp || '';
                  coverage_data.management_fidelity_bond_acord25 =
                    compliance?.acord_25_ocr_data?.extracted_data
                      .blank_policy_number || '';
                  coverage_data.mgmt_fidelity_crime_expiration_date =
                    compliance?.acord_25_ocr_data?.extracted_data.blank_exp ||
                    '';
                }

                switch (item.master_requirement?.uuid) {
                  case '4b386e74-80df-452d-a242-b864b5f08493':
                    coverage_data.commercial_property_limits =
                      item.actual_limit;
                    break;
                  case '1e2cfcb3-57f4-42a9-b913-629db04febf9':
                  case 'c3546309-ec47-4a56-ad0a-39d65efc190b':
                    coverage_data.commercial_property_deductible =
                      item.actual_limit;
                    break;
                  case 'f3b59946-d00a-4ba5-8a2c-6b3e54212164':
                    coverage_data.property_am_best_rating = item.actual_limit;
                    break;
                  case 'f78b8afc-f7d2-4f89-9473-90b360eecd79':
                  case '14213260-0a0f-485b-ac35-ab459d363cf5':
                    coverage_data.earthquake_limit = item.actual_limit;
                    break;
                  case 'fee54999-2308-4ea1-a6ca-52cf679b516a':
                    coverage_data.earthquake_deductible = item.actual_limit;
                    break;
                  case 'a09c5e60-84bd-4e9f-9ad1-c4f9cd4d465c':
                  case 'f1a6282c-c85d-4052-bb5f-3c64c1af2452':
                    coverage_data.flood_limit = item.actual_limit;
                    break;
                  case 'd3a64fce-2d0b-4fe6-91db-86b928e90443':
                    coverage_data.loss_of_income = item.actual_limit;
                    break;
                  case '5fcf90a6-e048-4aed-bc44-c4291bc492f5':
                    coverage_data.flood_deductible = item.actual_limit;
                    break;
                  case 'Wind/Hail':
                    // TODO: This master requirement does not exist in system, need to add it
                    break;
                  case '126fefe2-d160-42d5-8067-889235ef2810':
                    coverage_data.wind_and_hail_deductible = item.actual_limit;
                    break;
                  case 'e803f536-da94-44cd-a897-b59f94d619fe':
                    coverage_data.commercial_general_liability_occurrence =
                      item.actual_limit;
                    coverage_data.property_management_general_liability_occurrence =
                      item.actual_limit;
                    break;
                  case '94cdf13c-6f2c-4a59-84f4-580d62cf6ec8':
                    coverage_data.commercial_general_liability_aggregate =
                      item.actual_limit;
                    coverage_data.property_management_general_liability_aggregate =
                      item.actual_limit;
                    break;
                  case '81480230-3727-487a-b471-dab4c6b0d6d8':
                    coverage_data.commercial_general_liability_aggregate_deductible =
                      item.actual_limit;
                    coverage_data.property_management_general_liability_aggregate_deductible =
                      item.actual_limit;
                    break;
                  case '91bf2276-7bf1-4179-a379-a2de9b95d35a':
                    coverage_data.general_liability_am_best_rating =
                      item.actual_limit;
                    coverage_data.manager_general_liability_am_best_rating =
                      item.actual_limit;
                    break;
                  case '75cde2b8-d2dd-44c7-b6f7-96c0e4742cf9':
                    coverage_data.excess_commercial_general_liability_occurrence =
                      item.actual_limit;
                    coverage_data.property_management_umbrella_occurrence =
                      item.actual_limit;
                    break;
                  case '522566a4-3e84-41be-85aa-a291df3660ca':
                    coverage_data.excess_commercial_general_liability_aggregate =
                      item.actual_limit;
                    coverage_data.property_management_umbrella_aggregate =
                      item.actual_limit;
                    break;
                  case '111c2d2b-0289-4f6e-b5a0-849478f5c11e':
                    coverage_data.excess_commercial_general_liability_aggregate_deductible =
                      item.actual_limit;
                    coverage_data.property_management_umbrella_aggregate_deductible =
                      item.actual_limit;
                    break;
                  case 'e304bdd7-3324-4251-a19b-d323e25dcf38':
                    coverage_data.umbrella_am_best_rating = item.actual_limit;
                    coverage_data.manager_umbrella_am_best_rating =
                      item.actual_limit;
                    break;
                  case 'cd391bcc-3122-4529-b062-a0d578235503':
                    coverage_data.partnership_auto_liability_limit =
                      item.actual_limit;
                    coverage_data.management_auto_liability = item.actual_limit;
                    break;
                  case 'partnership_auto_liability_limit':
                    // TODO: Need to add Auto: Deductible master requirement to cater this issue
                    break;
                  case 'b1786bdd-bf47-473f-bb2e-bdab852d068e':
                    coverage_data.automobile_am_best_rating = item.actual_limit;
                    coverage_data.manager_automobile_am_best_rating =
                      item.actual_limit;
                    break;
                  case 'e7bb353a-0785-4025-ab71-4fc7a8fbbf1d':
                    coverage_data.management_workers_comp = item.actual_limit;
                    break;
                  case 'fdab20ac-7f02-4dd1-8914-2a3fcbe78932':
                    coverage_data.workers_am_best_rating = item.actual_limit;
                    break;
                  case '1596ab2d-78a8-4026-beb4-2cbb408214cc':
                    coverage_data.management_fidelity_bond = item.actual_limit;
                    break;
                  case '6de43f6d-c182-4874-be3f-38c66ec0cb4a':
                    coverage_data.crime_am_best_rating = item.actual_limit;
                    break;
                  default:
                    break;
                }
              }

              coverageSummaryResponse.push(coverage_data);
            }
          }
        }
      }

      return coverageSummaryResponse;
    } catch (e) {
      throw errorHandler(e);
    }
  }

  async generateExcel(body: any) {
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
      'Partnership',
      'Property Name',
      'Property Address',
      'Property City',
      'Property State',
      'Investor',
      'Project ID',
      'Vendor Name',
      'Comercial Property Policy #',
      'Comercial Property Limits',
      'Comercial Property Deductible',
      'Property Expiration Date',
      'Insurer',
      'AM Best Rating',
      'Loss of Income',
      'Earthquake Limit',
      'Earthquake Deductible',
      'Flood Limit',
      'Flood Deductible',
      'Wind & Hail Limit',
      'Wind & Hail Deductible',
      'Commercial General Liability',
      'Commercial General Liability (occurrence)',
      'Commercial General Liability (aggregate)',
      'Commercial General Liability (aggregate) Deductible',
      'General Liability Expiration Date',
      'Insurer',
      'AM Best Rating',
      'Excess Commercial General Liability',
      'Excess Commercial General Liability (occurrence)',
      'Excess Commercial General Liability (aggregate)',
      'Excess Commercial General Liability (aggregate) Deductible',
      'Excess/Umbrella Expiration Date',
      'Insurer',
      'AM Best Rating',
      'Partnership Auto Liability',
      'Partnership Auto Liability Limit',
      'Partnership Auto Liability Deductible',
      'Partnership Auto Expiration Date',
      'Insurer',
      'AM Best Rating',
      'Property Management General Liability',
      'Property Management General Liability (occurrence)',
      'Property Management General Liability (aggregate)',
      'Property Management General Liability (aggregate) Deductible',
      'Mgmt General Liability Expiration Date',
      'Insurer',
      'AM Best Rating',
      'Property Management Umbrella',
      'Property Management Umbrella (occurrence)',
      'Property Management Umbrella (aggregate)',
      'Property Management Umbrella (aggregate) Deductible',
      'Mgmt Excess/Umbrella Expiration Date',
      'Insurer',
      'AM Best Rating',
      'Management Auto Liability',
      'Management Auto Liability',
      'Management Auto Liability Deductible',
      'Mgmt Auto Expiration Date',
      'Insurer',
      'AM Best Rating',
      'Management Workers Comp',
      'Management Workers Comp',
      'Mgmt Workers Comp Expiration Date',
      'Insurer',
      'AM Best Rating',
      'Management Fidelity Bond',
      'Management Fidelity Bond',
      'Management Fidelity Bond Deductible',
      'Mgmt Fidelity/Crime Expiration Date',
      'Insurer',
      'AM Best Rating',
    ];

    const data = reportData.map((obj: any) => {
      return headers.map(key => {
        return obj[key];
      });
    });

    const wsData = [[], [], headers_1, ...data];

    wsData[0][0] = {
      v: 'Insurance Coverage Template',
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
        borders: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      },
    };

    wsData[0][8] = {
      v: 'Partnership - Property (Permanent)',
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
          fgColor: { rgb: 'FFE599' },
        },
        borders: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      },
    };

    wsData[0][21] = {
      v: 'Partnership - General Liability (Permanent)',
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
        borders: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      },
    };

    wsData[0][28] = {
      v: 'Partnership - Umbrella (Permanent)',
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
          fgColor: { rgb: 'FFFF00' },
        },
        borders: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      },
    };

    wsData[0][35] = {
      v: 'Partnership - Automobile (Permanent)',
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
          fgColor: { rgb: 'D3D3D3' },
        },
        borders: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      },
    };
    wsData[0][41] = {
      v: 'Property Manager General Liability',
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
          fgColor: { rgb: 'FFE599' },
        },
        borders: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      },
    };
    wsData[0][48] = {
      v: 'Property Manager - Umbrella',
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
          fgColor: { rgb: 'FFC6EFCE' },
        },
        borders: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      },
    };
    wsData[0][55] = {
      v: 'Property Manager - Automobile',
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
          fgColor: { rgb: 'D3D3D3' },
        },
        borders: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      },
    };
    wsData[0][61] = {
      v: 'Property Manager - Workers Compensation',
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
          fgColor: { rgb: 'FFFF00' },
        },
        borders: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      },
    };
    wsData[0][66] = {
      v: 'Property Manager - Crime & Fidelity',
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
          fgColor: { rgb: 'FFE599' },
        },
        borders: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
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
            fgColor: { rgb: 'FFFFFF' },
          },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
        },
      };
    });

    // loop through the data and add the style
    for (let i = 3; i < wsData.length; i++) {
      wsData[i] = wsData[i].map((item: any) => {
        return {
          v: item,
          s: {
            font: {
              sz: 10,
            },
            alignment: {
              horizontal: 'left',
              vertical: 'center',
              wrapText: true,
            },
          },
        };
      });
    }

    // Create the worksheet
    const ws = xlsx.utils.aoa_to_sheet(wsData);

    ws['!merges'] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 7 },
      },
      {
        s: { r: 0, c: 8 },
        e: { r: 0, c: 20 },
      },
      {
        s: { r: 0, c: 21 },
        e: { r: 0, c: 27 },
      },
      {
        s: { r: 0, c: 28 },
        e: { r: 0, c: 34 },
      },
      {
        s: { r: 0, c: 35 },
        e: { r: 0, c: 40 },
      },
      {
        s: { r: 0, c: 41 },
        e: { r: 0, c: 47 },
      },
      {
        s: { r: 0, c: 48 },
        e: { r: 0, c: 54 },
      },
      {
        s: { r: 0, c: 55 },
        e: { r: 0, c: 60 },
      },
      {
        s: { r: 0, c: 61 },
        e: { r: 0, c: 65 },
      },
      {
        s: { r: 0, c: 66 },
        e: { r: 0, c: 71 },
      },
    ];

    ws['!rows'] = [{ hpt: 30 }];
    ws['!rows'][2] = { hpt: 20 };

    ws['!cols'] = [];
    for (let i = 0; i < 72; i++) {
      ws['!cols'][i] = { wch: 30 };
    }

    //

    // Append the worksheet to the workbook
    xlsx.utils.book_append_sheet(wb, ws, 'Coverage Summary Report');

    // Write the workbook to an Excel file
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    // fs.writeFileSync('libs/reports/sample.xlsx', buffer);

    return buffer;
  }
}
