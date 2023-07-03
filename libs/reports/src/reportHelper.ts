import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProjectVendor,
  ReportCreator,
} from 'als/building-block/RequestableDto/Report/ReportCreator';
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
  VendorModel as vendorModel,
  VendorModelDocument,
} from 'als/manager/vendor/vendor.model';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

@Injectable()
export class ReportHelper {
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
  ) {}
  /**
   * Retrieves compliance and project data for a given client and project/vendor information.
   *
   * @async
   * @function getCompliancesAndProjects
   * @param {string} client_id - The ID of the client to retrieve data for.
   * @param {ProjectVendor[]} projectVendor - An array of project/vendor objects, each containing a project ID and an array of vendor IDs.
   * @returns {Promise<{
   *   compliances: complianceModel[];
   *   projects: projectModel[];
   * }>} A Promise that resolves to an object containing two arrays:
   *   - `complianceResponse`: An array of complianceModel objects that match the specified client and project/vendor information.
   *   - `projectResponse`: An array of projectModel objects that match the specified client and project/vendor information.
   */
  async getCompliancesAndProjects({
    client_id,
    projectIdVendorIds,
  }: {
    client_id: string;
    projectIdVendorIds: ProjectVendor[];
  }): Promise<{
    compliances: complianceModel[];
    projects: projectModel[];
  }> {
    const complianceCondition: Record<string, unknown> = {};
    const projectCondition: Record<string, unknown> = {};
    const complianceResponse: complianceModel[] = [];
    const projectResponse: projectModel[] = [];
    if (client_id) {
      complianceCondition['client_id'] = new ObjectId(client_id);
      projectCondition['client.client_id'] = new ObjectId(client_id);
    }

    if (projectIdVendorIds && projectIdVendorIds.length > 0) {
      for (const projectVendor of projectIdVendorIds) {
        complianceCondition['project_id'] = new ObjectId(
          projectVendor.project_id,
        );
        projectCondition['_id'] = new ObjectId(projectVendor.project_id);
        for (const vendorId of projectVendor.vendor_id) {
          complianceCondition['vendor_id'] = new ObjectId(vendorId);
          complianceCondition['status'] = true;
          const compliance = await this.ComplianceModel.aggregate([
            {
              $match: complianceCondition,
            },
            {
              $lookup: {
                from: 'masterrequirementmodels',
                let: {
                  letId: '$compliance_items.master_requirement_id',
                  tempId: '$template_items.master_requirement_id',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $or: [
                          { $in: ['$_id', '$$letId'] },
                          { $in: ['$_id', '$$tempId'] },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      requirement_description: 1,
                      coverage_type_name: 1,
                      coverage_type_uuid: 1,
                      default_comment: 1,
                      uuid: 1,
                      OCR: 1,
                    },
                  },
                ],
                as: 'master_requirement',
              },
            },
            {
              $addFields: {
                compliance_items: {
                  $map: {
                    input: '$compliance_items',
                    as: 'rel',
                    in: {
                      $mergeObjects: [
                        '$$rel',
                        {
                          master_requirement: {
                            $arrayElemAt: [
                              '$master_requirement',
                              {
                                $indexOfArray: [
                                  '$master_requirement._id',
                                  '$$rel.master_requirement_id',
                                ],
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              $addFields: {
                template_items: {
                  $map: {
                    input: '$template_items',
                    as: 'rel',
                    in: {
                      $mergeObjects: [
                        '$$rel',
                        {
                          master_requirement: {
                            $arrayElemAt: [
                              '$master_requirement',
                              {
                                $indexOfArray: [
                                  '$master_requirement._id',
                                  '$$rel.master_requirement_id',
                                ],
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              $project: {
                master_requirement: 0,
              },
            },
          ]);

          if (compliance.length < 1) {
            throw new ServiceError(
              'Compliance Not Found',
              HttpStatus.NOT_FOUND,
            );
          }

          complianceResponse.push(compliance[0] as unknown as complianceModel);
          delete complianceCondition.vendor_id;
        }

        const project = await this.ProjectModel.findOne(projectCondition);
        if (!project) {
          throw new ServiceError('Project Not Found', HttpStatus.NOT_FOUND);
        }

        projectResponse.push(project);

        delete projectCondition._id;
        delete complianceCondition.project_id;
      }
    }

    return { compliances: complianceResponse, projects: projectResponse };
  }

  async getProjects({
    client_id,
    project_ids,
  }: {
    client_id: string;
    project_ids: string[];
  }): Promise<projectModel[]> {
    const projectCondition: Record<string, unknown> = {};
    const projectResponse: projectModel[] = [];
    if (client_id) {
      projectCondition['client.client_id'] = new ObjectId(client_id);
    }

    if (project_ids && project_ids.length > 0) {
      for (const project_id of project_ids) {
        projectCondition['_id'] = new ObjectId(project_id);
        const project = await this.ProjectModel.findOne(projectCondition);
        if (!project) {
          throw new ServiceError('Project Not Found', HttpStatus.NOT_FOUND);
        }

        projectResponse.push(project);

        delete projectCondition._id;
      }
    }

    return projectResponse;
  }

  // type FilteredData = ;

  //This function is to check if advanced filter is being appied or not
  async advanceFilter(
    body: ReportCreator,
    compliances: complianceModel[],
    projects: projectModel[],
  ): Promise<[compliances: complianceModel[], projects: projectModel[]]> {
    if (body.coverage_type) {
      for (const compliance of compliances) {
        for (let i = compliance.compliance_items.length - 1; i >= 0; i--) {
          const object = compliance.compliance_items[i];
          if (object.master_requirement) {
            if (
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

    if (
      body.insurance_co ||
      body.broker ||
      body.client_stage ||
      (body.start_date && body.closing_date)
    ) {
      for (let i = projects.length - 1; i >= 0; i--) {
        if (
          body.client_stage &&
          projects[i]?.deal_summary?.client_stage !== body.client_stage
        ) {
          projects.splice(i, 1);
        }

        if (body.start_date && body.closing_date) {
          if (body.closing_date < body.start_date) {
            throw new ServiceError('Closing date must be gretaer!');
          }

          const dbClosingDate = projects[i].project_schedule
            .closing_date as unknown as Date;

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
            dbDate.getTime() <= reqStartDate.getTime() &&
            dbDate.getTime() >= reqCloseDate.getTime()
          ) {
            projects.splice(i, 1);
          }
        }

        if (body.broker || body.insurance_co) {
          const contactDetails = await this.getContactDetails(
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

  async getContactDetails(id: string) {
    const response = await this.ProjectModel.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $unwind: '$assigned_vendor',
      },
      {
        $lookup: {
          from: 'vendormodels',
          localField: 'assigned_vendor.vendor_id',
          foreignField: '_id',
          as: 'vendor',
        },
      },
      {
        $unwind: '$vendor',
      },
      {
        $lookup: {
          from: 'contactmodels',
          localField: 'vendor.contacts_id',
          foreignField: '_id',
          as: 'contact_details',
        },
      },
      {
        $unwind: '$contact_details',
      },
      {
        $project: {
          _id: '$contact_details._id',
          first_name: '$contact_details.first_name',
          last_name: '$contact_details.last_name',
          company_name: '$contact_details.company_name',
          email: '$contact_details.email',
          type: '$contact_details.type',
        },
      },
    ]);

    const result = await this.ProjectModel.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'contactmodels',
          localField: 'contacts',
          foreignField: '_id',
          as: 'contactsInfo',
        },
      },
      {
        $unwind: '$contactsInfo',
      },
      {
        $project: {
          _id: '$contactsInfo._id',
          first_name: '$contactsInfo.first_name',
          last_name: '$contactsInfo.last_name',
          company_name: '$contactsInfo.company_name',
          email: '$contactsInfo.email',
          type: '$contactsInfo.type',
        },
      },
    ]);

    const contactDetails = response.concat(result);
    return this.groupData(contactDetails);
  }

  async groupData(contactInfo: any) {
    const res = contactInfo.reduce((result: any, item: any) => {
      const key = item.type;
      // const company = item['company'];
      if (!result[key]) {
        if (key === 'Broker') {
          result[`${key}_CE`] = [];
          result[`${key}_NAME`] = [];
        }

        result[key] = [];
      }

      if (key === 'Broker') {
        result[`${key}_CE`].push(item.company_name + ' , ' + item.email);
        result[`${key}_NAME`].push(item.first_name + ' ' + item.last_name);
      }

      result[key].push(item.company_name);

      return result;
    }, {});

    for (const key in res) {
      res[key] = [...new Set(res[key])];
    }

    return res;
  }
}
