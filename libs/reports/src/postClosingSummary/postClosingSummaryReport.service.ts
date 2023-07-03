import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostClosingSummaryReportCreator } from 'als/building-block/RequestableDto/Report/PostClosingSummaryReportCreator';
import { ServiceError } from 'als/building-block/utils/apiError';
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
import { Model } from 'mongoose';
import * as XLSX from 'xlsx-js-style';

import { ReportHelper } from '../reportHelper';
import { IReportService } from '../reports.service';

const borderStyle = 'thin';
const borderColor = { rgb: ' CFCFCF' };
const border = {
  top: { style: borderStyle, color: borderColor },
  bottom: { style: borderStyle, color: borderColor },
  left: { style: borderStyle, color: borderColor },
  right: { style: borderStyle, color: borderColor },
};

@Injectable()
export class PostClosingSummaryReport implements IReportService {
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
    body: PostClosingSummaryReportCreator,
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
              compliance?.compliance_items?.splice(i, 1);
            }
          }
        }

        for (let i = compliance.template_items.length - 1; i >= 0; i--) {
          const object = compliance?.template_items[i];
          if (object.master_requirement) {
            if (
              body?.coverage_type?.length > 0 &&
              !body.coverage_type.includes(
                object?.master_requirement.coverage_type_name,
              )
            ) {
              compliance?.template_items.splice(i, 1);
            }
          }
        }
      }
    }

    if (body.insurance_co || body.broker || body.client_stage) {
      for (let i = projects.length - 1; i >= 0; i--) {
        if (
          body.client_stage &&
          projects[i]?.deal_summary?.client_stage !== body.client_stage &&
          projects[i]
        ) {
          projects.splice(i, 1);
        }

        if (body.broker || body.insurance_co) {
          const contactDetails = await this.reportHelper.getContactDetails(
            projects[i]?._id.toString(),
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

  async create(body: PostClosingSummaryReportCreator): Promise<Project[]> {
    const postClosingSummarys = [];
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

    //Iterate the response and change response to desired struture to be used
    if (projects.length !== 0) {
      for (const project of projects) {
        for (const comp of compliances) {
          const compliance_items: Item[] = [];
          const template_items: Item[] = [];
          if (project._id.equals(comp.project_id)) {
            for (const compliance of comp.compliance_items) {
              const obj = {
                coverage_type:
                  compliance?.master_requirement?.coverage_type_name || '',
                master_requirement_des:
                  compliance.master_requirement?.requirement_description || '',
                required_limit: compliance?.required_limit,
                actual_limit: compliance?.actual_limit,
                comment: compliance?.comment,
                status: compliance?.status,
                waiver: compliance?.waiver,
                post_closing: compliance?.post_closing,
              };

              compliance_items.push(obj);
            }

            for (const template of comp.template_items) {
              const temp = await this.TemplateModel.findOne({
                _id: template?.template_id,
                'rules._id': template?.template_rule_id,
              });

              const rule = temp?.rules.find(rule =>
                rule._id.equals(template?.template_rule_id),
              );

              const obj = {
                coverage_type:
                  template?.master_requirement?.coverage_type_name || '',
                master_requirement_des:
                  template?.master_requirement?.requirement_description || '',
                required_limit: rule
                  ? `${rule?.condition} ${rule?.value}`
                  : 'NA',
                actual_limit: template?.actual_limit,
                comment: rule?.message || '',
                status: template?.status,
                waiver: template?.waiver,
                post_closing: template?.post_closing,
              };

              template_items.push(obj);
            }
          } // if  condition ends

          const post_closing_summary = {
            project: project?.name,
            address: project?.address_1
              ? project.address_1
              : '' + ' ' + project?.address_2
              ? project.address_2
              : '',
            items: this.groupByCoverageType([
              ...compliance_items,
              ...template_items,
            ]),
          };

          if (post_closing_summary?.items?.length > 0) {
            postClosingSummarys.push(post_closing_summary);
          }
        } // compliance loop
      } // project loop end
    }

    if (postClosingSummarys.length < 1) {
      throw new ServiceError(
        'No Data found to generate report',
        HttpStatus.NOT_FOUND,
      );
    }

    return postClosingSummarys;
  }

  async generateExcelFile(PCSJson: Project[]) {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    for (let i = 0; i < PCSJson.length; i++) {
      // Define the sheet name
      const sheetName = PCSJson[i]?.project.substring(0, 30);
      // Create a new worksheet
      const ws = XLSX.utils.json_to_sheet([], { header: [] });
      // Set column width
      ws['!cols'] = [{ wch: 35 }, { wch: 35 }, { wch: 35 }, { wch: 35 }];
      // Set row height for header and address
      ws['!rows'] = [{ hpx: 30 }, { hpx: 30 }];

      ws['!merges'] = [];
      ws['!rows'] = [];

      this.addProjectAndAddressHeader(
        ws,
        PCSJson[i]?.project,
        PCSJson[i]?.address,
      );

      let currentRow = 3;

      PCSJson[i]?.items.forEach(item => {
        // Add The COVERAGE_TYPE Header
        if (!ws['!rows']) {
          ws['!rows'] = [];
        }

        ws['!rows'][currentRow - 1] = { hpx: 30 };
        XLSX.utils.sheet_add_aoa(
          ws,
          [
            [
              {
                v: item?.coverage_type,
                t: 's',
                s: {
                  alignment: {
                    wrapText: true,
                    vertical: 'center',
                    horizontal: 'center',
                  },
                  border: border,
                  h: 25,
                  color: { rgb: '000000' },
                  font: { sz: 12 },
                  fill: { fgColor: { rgb: 'FFFF00' } },
                },
              },
            ],
          ],
          {
            origin: `A${currentRow}`,
          },
        );

        if (!ws['!merges']) {
          ws['!merges'] = [];
        }

        ws['!merges'].push({
          s: { r: currentRow - 1, c: 0 },
          e: { r: currentRow - 1, c: 3 },
        });
        currentRow += 1;

        if (!ws['!rows']) {
          ws['!rows'] = [];
        }

        ws['!rows'][currentRow - 1] = { hpx: 30 };
        // Add the POST CLOSING Title
        XLSX.utils.sheet_add_aoa(
          ws,
          [
            [
              {
                v: 'POST CLOSING',
                t: 's',
                s: {
                  bold: true,
                  color: { rgb: '000000' },
                  font: { sz: 14 },
                  fill: { fgColor: { rgb: 'FFFFFF' } },
                },
              },
            ],
          ],
          {
            origin: `A${currentRow}`,
          },
        );
        currentRow += 1;

        // Add the headers for the post-closing items

        const styledHeaders = [
          'Requirements',
          'Required Limits',
          'Actual Limits',
          'Comment',
        ].map(item => ({
          v: item,
          t: 's',
          s: {
            alignment: {
              wrapText: true,
            },
            border: border,
            color: { rgb: '000000' },
            font: { sz: 12 },
            fill: { fgColor: { rgb: 'D3D3D3' } },
          },
        }));

        XLSX.utils.sheet_add_aoa(ws, [styledHeaders], {
          origin: `A${currentRow}`,
        });
        currentRow += 1;

        item?.post_closing_items.forEach(postClosingItem => {
          const styledRow = [
            postClosingItem?.master_requirement_des,
            postClosingItem?.required_limit,
            postClosingItem?.actual_limit,
            postClosingItem?.comment,
          ].map(item => ({
            v: item,
            t: 's',
            s: {
              alignment: {
                wrapText: true,
                horizontal: 'left',
                vertical: 'top',
              },
              border: border,
              color: { rgb: '000000' },
              font: { sz: 12 },
              fill: { fgColor: { rgb: 'FFFFFF' } },
            },
          }));

          XLSX.utils.sheet_add_aoa(ws, [styledRow], {
            origin: `A${currentRow}`,
          });
          if (!ws['!rows']) {
            ws['!rows'] = [];
          }

          ws['!rows'][currentRow - 1] = { hpx: 50 };
          currentRow += 1;
        });

        if (!ws['!rows']) {
          ws['!rows'] = [];
        }

        ws['!rows'][currentRow - 1] = { hpx: 30 };
        // WAIVER ITEMS TITLE
        XLSX.utils.sheet_add_aoa(
          ws,
          [
            [
              {
                v: 'WAIVER Items',
                t: 's',
                s: {
                  bold: true,
                  color: { rgb: '000000' },
                  font: { sz: 14 },
                  fill: { fgColor: { rgb: 'FFFFFF' } },
                },
              },
            ],
          ],
          {
            origin: `A${currentRow}`,
          },
        );
        currentRow += 1;

        // WAIVER ITEMS HEADERS
        XLSX.utils.sheet_add_aoa(ws, [styledHeaders], {
          origin: `A${currentRow}`,
        });
        currentRow += 1;

        // Loop over each waiver item and add it to the sheet
        item?.waiver_items.forEach(waiverItem => {
          const styledRow = [
            waiverItem?.master_requirement_des,
            waiverItem?.required_limit,
            waiverItem?.actual_limit,
            waiverItem?.comment,
          ].map(item => ({
            v: item,
            t: 's',
            s: {
              alignment: {
                wrapText: true,
                horizontal: 'left',
                vertical: 'top',
              },
              border: border,
              color: { rgb: '000000' },
              font: { sz: 12 },
              fill: { fgColor: { rgb: 'FFFFFF' } },
            },
          }));

          XLSX.utils.sheet_add_aoa(ws, [styledRow], {
            origin: `A${currentRow}`,
          });

          // Set row height for each row
          if (!ws['!rows']) {
            ws['!rows'] = [];
          }

          ws['!rows'][currentRow - 1] = { hpx: 50 };
          currentRow += 1;
        });
        // To Insert a blank after every Coverage Type
        currentRow += 1;
      });

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }

    // Write the workbook to an Excel file
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Write the workbook to a file, Only For Testing
    // XLSX.writeFile(wb, 'libs/reports/sample.xlsx');

    // Return the buffer to send the Excel file from a REST endpoint
    return buffer;
  }

  addProjectAndAddressHeader(
    ws: XLSX.WorkSheet,
    project: string,
    address: string,
    rowHeight = 60,
  ): void {
    const borderStyle = 'thin';
    const borderColor = { rgb: 'CFCFCF' };
    const border = {
      top: { style: borderStyle, color: borderColor },
      bottom: { style: borderStyle, color: borderColor },
      left: { style: borderStyle, color: borderColor },
      right: { style: borderStyle, color: borderColor },
    };

    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          {
            v: project,
            t: 's',
            s: {
              alignment: {
                horizontal: 'center',
                vertical: 'center',
                wrapText: true,
                border: border,
              },
              h: rowHeight,
              color: { rgb: '000000' },
              font: { sz: 16, bold: true },
              fill: { fgColor: { rgb: 'FFFFFF' } },
            },
          },
        ],
      ],
      { origin: 'A1' },
    );
    if (!ws['!merges']) {
      ws['!merges'] = [];
    }

    ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } });
    if (!ws['!rows']) {
      ws['!rows'] = [];
    }

    ws['!rows'][0] = { hpx: 30 };
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          {
            v: address ? address : '',
            t: 's',
            s: {
              alignment: {
                horizontal: 'center',
                vertical: 'center',
                wrapText: true,
                border,
              },
              color: { rgb: '000000' },
              font: { sz: 12 },
              fill: { fgColor: { rgb: 'FFFFFF' } },
            },
          },
        ],
      ],
      { origin: 'A2' },
    );
    ws['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 3 } });
    if (!ws['!rows']) {
      ws['!rows'] = [];
    }

    ws['!rows'][1] = { hpx: 20 };
  }

  groupByCoverageType = (
    complianceItems: Item[],
  ): GroupedItemsByCoverageType[] => {
    const groupedItems: {
      [key: string]: {
        waiver_items: WaiverItem[];
        post_closing_items: PostClosingItem[];
      };
    } = {};

    complianceItems.forEach(item => {
      const { coverage_type, waiver, post_closing, ...rest } = item;

      if (!groupedItems[coverage_type]) {
        groupedItems[coverage_type] = {
          waiver_items: [],
          post_closing_items: [],
        };
      }

      // FIXME: What if an item belongs to Both?
      if (waiver === true) {
        groupedItems[coverage_type].waiver_items.push(rest);
      }

      if (post_closing === true) {
        groupedItems[coverage_type].post_closing_items.push(rest);
      }
    });

    return Object.entries(groupedItems)
      .map(([coverage_type, { waiver_items, post_closing_items }]) => ({
        coverage_type,
        post_closing_items,
        waiver_items,
      }))
      .filter(({ post_closing_items, waiver_items }) => {
        return post_closing_items.length > 0 || waiver_items.length > 0;
      });
  };
}

interface Project {
  project: string;
  address: string;
  items: GroupedItemsByCoverageType[];
}

// A subset of Compliance/Template Items
export interface Item {
  coverage_type: string;
  master_requirement_des: string;
  required_limit: string;
  actual_limit: string;
  comment: string;
  status: string;
  waiver: boolean;
  post_closing: boolean;
}

type WaiverItem = Omit<Item, 'coverage_type' | 'waiver' | 'post_closing'>;
type PostClosingItem = Omit<Item, 'coverage_type' | 'waiver' | 'post_closing'>;

interface GroupedItemsByCoverageType {
  coverage_type: string;
  post_closing_items: WaiverItem[];
  waiver_items: PostClosingItem[];
}
[];
