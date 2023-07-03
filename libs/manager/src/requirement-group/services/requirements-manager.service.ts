import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { InjectQueue } from '@nestjs/bullmq';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE,
  COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE,
  TEMPLATE_UPDATE_QUEUE,
} from 'als/building-block/constants';
import {
  CompliacneUpdateOnRequirementRuleChangeDto,
  CompliacneUpdateOnRequirementTempChangeDto,
} from 'als/building-block/dtos/compliance-update-on-req-update.dto';
import { TemplateUpdateQueueDto } from 'als/building-block/dtos/update-by-template.queue.dto';
import { RequirementsCopyCreator } from 'als/building-block/RequestableDto/Requirements/RequirementsCopyCreator';
import { RequirementsCreator } from 'als/building-block/RequestableDto/Requirements/RequirementsCreator';
import { RequirementsUpdate } from 'als/building-block/RequestableDto/Requirements/RequirementsUpdate';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import {
  RequirementsCompletePopulatedResponseDto,
  RequirementsCompleteResponseDto,
} from 'als/building-block/TransferableDto/Requirements/Requirements';
import { RequirementsPartialResponseDto } from 'als/building-block/TransferableDto/Requirements/RequirementsPartial';
import { ServiceError } from 'als/building-block/utils/apiError';
import { COMPLIANCE_UPDATE_TEMPLATES } from 'als/building-block/utils/enum';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  createQueryparams,
  getQueryConditions,
} from 'als/building-block/utils/queryParams';
import {
  ComplianceModel as complianceModel,
  ComplianceModelDocument,
} from 'als/manager/compliance/model/compliance.model';
import {
  DocumentUploadModel as documentUploadModel,
  DocumentUploadModelDocument,
} from 'als/manager/document-upload/document-upload.model';
import { Queue } from 'bullmq';
import { includes, isEmpty, pull } from 'lodash';
import { ObjectId } from 'mongodb';
import mongoose, { Model } from 'mongoose';

import { IRequirementService } from '../interfaces/requirements.service';
import { ITemplateService } from '../interfaces/template.service';
import {
  RequirementsModel as requirementsModel,
  RequirementsModelDocument,
} from '../model/requirements.model';
import {
  TemplateModel as templateModel,
  TemplateModelDocument,
} from '../model/template.model';

@Injectable()
export class RequirementsService
  extends AutomapperProfile
  implements IRequirementService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(requirementsModel.name)
    readonly RequirementsModel: Model<RequirementsModelDocument>,
    @InjectModel(templateModel.name)
    readonly TemplateModel: Model<TemplateModelDocument>,
    @InjectModel(documentUploadModel.name)
    readonly DocumentUploadModel: Model<DocumentUploadModelDocument>,
    @InjectModel(complianceModel.name)
    readonly ComplianceModel: Model<ComplianceModelDocument>,
    private TemplateService: ITemplateService,
    @InjectQueue(TEMPLATE_UPDATE_QUEUE)
    private readonly templateUpdateQueue: Queue,
    @InjectQueue(COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE)
    private readonly RequirementRuleUpdateQueue: Queue,
    @InjectQueue(COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE)
    private readonly RequirementTempUpdateQueue: Queue,
  ) {
    super(mapper);
  }
  logger = new Logger();

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        requirementsModel,
        RequirementsCompleteResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.requirement_items,
          mapFrom(s => s.requirement_items),
        ),
      );
      createMap(
        mapper,
        requirementsModel,
        RequirementsPartialResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.requirement_items,
          mapFrom(s => s.requirement_items),
        ),
        forMember(
          d => d.acord28template_id,
          mapFrom(s => s.acord28template_id),
        ),
        forMember(
          d => d.acord25template_id,
          mapFrom(s => s.acord25template_id),
        ),
      );
      // @NOTE: Incase we map an Interfaces to same Interface we have to explicityly register fields
      createMap(
        mapper,
        RequirementsCompletePopulatedResponseDto,
        RequirementsCompletePopulatedResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.requirement_items,
          mapFrom(s => s.requirement_items),
        ),
        forMember(
          d => d.name,
          mapFrom(s => s.name),
        ),
        forMember(
          d => d.acord28template_id,
          mapFrom(s => s.acord28template_id),
        ),
        forMember(
          d => d.acord25template_id,
          mapFrom(s => s.acord25template_id),
        ),
      );
    };
  }

  async create(createPayloadDto: RequirementsCreator) {
    try {
      const res = await this.RequirementsModel.create(createPayloadDto);
      return this.mapper.map(
        res,
        requirementsModel,
        RequirementsCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async getAll(query?: SearchableDto) {
    try {
      const queryConditions: { $or?: Record<string, unknown>[] } = {};
      let pagination: { page: number; limit: number } = {
        page: 1,
        limit: 0,
      };

      if (!isEmpty(query)) {
        const { conditions, pagination: paginationData } = createQueryparams(
          query,
          ['name'],
        );

        pagination = paginationData;
        queryConditions.$or = getQueryConditions(conditions);
      }

      const totalCount = await this.RequirementsModel.find(
        queryConditions,
      ).count();

      const skip = pagination.limit * (pagination.page - 1);
      const res = await this.RequirementsModel.aggregate([
        { $match: queryConditions },
        {
          $sort: { _id: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit:
            pagination.limit == 0
              ? totalCount === 0
                ? 10
                : totalCount
              : pagination.limit,
        },
        {
          $lookup: {
            from: 'projectmodels',
            localField: '_id',
            foreignField: 'assigned_vendor.requirement_group_id',
            as: 'project',
          },
        },
        {
          $lookup: {
            from: 'templatemodels',
            localField: 'acord25template_id',
            foreignField: '_id',
            as: 'acord25template_id',
          },
        },
        {
          $lookup: {
            from: 'templatemodels',
            localField: 'acord28template_id',
            foreignField: '_id',
            as: 'acord28template_id',
          },
        },
      ]);

      for (const requirement of res) {
        const assignedVendors = requirement.project.flatMap(
          (project: any) => project.assigned_vendor,
        );

        const totalAssignments = assignedVendors.reduce(
          (count: number, vendor: any) => {
            if (
              vendor.requirement_group_id.toString() ===
              requirement._id.toString()
            ) {
              return count + 1;
            } else {
              return count;
            }
          },
          0,
        );

        requirement.total_assignments = totalAssignments;
      }

      const page = pagination.page;
      const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
      const data = this.mapper.mapArray(
        res,
        requirementsModel,
        RequirementsPartialResponseDto,
      );

      return {
        page,
        perPage: perPage ? perPage : totalCount,
        total: totalCount,
        data,
      };
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async updateRequirements(
    id: string,
    updateRequirmentPayload: RequirementsUpdate,
  ) {
    try {
      const requirement = await this.RequirementsModel.findById(id);

      if (!requirement) {
        return null;
      }

      let requirement_items_ids: ObjectId[] = requirement.requirement_items;
      if (updateRequirmentPayload.id) {
        const exist = includes(
          requirement.requirement_items.map(item => item.toString()),
          updateRequirmentPayload.id.toString(),
        );

        if (exist) {
          requirement_items_ids = pull(
            requirement.requirement_items.map(item => item.toString()),
            updateRequirmentPayload.id.toString(),
          ).map(item => new ObjectId(item));

          // @UPDATING: Removing Rule From Existing Compliances
          const queueDateForCompliacne: CompliacneUpdateOnRequirementRuleChangeDto =
            {
              action: COMPLIANCE_UPDATE_TEMPLATES.REMOVED,
              master_requirement_id: updateRequirmentPayload.id,
              requirement_group_id: new ObjectId(id),
            };

          this.RequirementRuleUpdateQueue.add(
            COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE,
            queueDateForCompliacne,
          );

          // HERE I NEED TO UPDATE NOTIFICATIONS!
          const notifications = await this.DocumentUploadModel.find({
            masterReqId: updateRequirmentPayload.id,
          });

          if (notifications && notifications.length > 0) {
            for (const notification of notifications) {
              // first find the compliance
              const compliance = await this.ComplianceModel.findById({
                _id: notification?.compliance_id,
              });

              // second find item with same doc type uuid!
              // then in compliance we have to find other with same document_type_uuid
              const ComplianceItemWithSameDocType =
                compliance?.compliance_items.filter(
                  el =>
                    el.document_type_uuid === notification.document_type_uuid &&
                    el.master_requirement_id.toString() !==
                      notification.masterReqId?.toString(),
                );

              if (
                ComplianceItemWithSameDocType &&
                ComplianceItemWithSameDocType.length > 0
              ) {
                // Replace the following values:
                // we need to update existing notification
                // document still present we just need to update the notification
                await this.DocumentUploadModel.findByIdAndUpdate(
                  notification._id,
                  {
                    $set: {
                      item_id: ComplianceItemWithSameDocType[0]._id,
                      masterReqId:
                        ComplianceItemWithSameDocType[0].master_requirement_id,
                    },
                  },
                  { new: true },
                );
              } else {
                // soft delete the notification
                await this.DocumentUploadModel.findByIdAndUpdate(
                  notification._id,

                  {
                    $set: {
                      isDeleted: true,
                    },
                  },
                  {
                    new: true,
                  },
                );
              }
            }
          }
        } else {
          requirement_items_ids = requirement.requirement_items.concat([
            updateRequirmentPayload.id,
          ]);
          // @UPDATING: Adding Newly Added Rule To Existing Compliances
          const queueDateForCompliacne: CompliacneUpdateOnRequirementRuleChangeDto =
            {
              action: COMPLIANCE_UPDATE_TEMPLATES.ADDED,
              master_requirement_id: updateRequirmentPayload.id,
              requirement_group_id: new ObjectId(id),
            };

          this.RequirementRuleUpdateQueue.add(
            COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE,
            queueDateForCompliacne,
          );
        }
      }

      // @UPDATING: Changing Compliances template_items if requirement's template changes
      if (updateRequirmentPayload.acord25template_id) {
        const check = await this.TemplateModel.findById(
          updateRequirmentPayload.acord25template_id,
        );

        const enabled_rule = check?.rules.filter(el => el.is_enabled);
        if (enabled_rule && enabled_rule.length < 1) {
          throw new ServiceError(
            'Selected template does not have any active rule!',
            HttpStatus.BAD_REQUEST,
          );
        }

        const reqTempChangeQueueData: CompliacneUpdateOnRequirementTempChangeDto =
          {
            requirement_group_id: new ObjectId(id),
            old_template_id: requirement.acord25template_id,
            new_template_id: updateRequirmentPayload.acord25template_id,
          };

        if (
          updateRequirmentPayload.acord25template_id?.toString() !=
          requirement.acord25template_id?.toString()
        ) {
          this.RequirementTempUpdateQueue.add(
            COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE,
            reqTempChangeQueueData,
          );
        }
      }

      if (updateRequirmentPayload.acord28template_id) {
        const check = await this.TemplateModel.findById(
          updateRequirmentPayload.acord28template_id,
        );

        const enabled_rule = check?.rules.filter(el => el.is_enabled);
        if (enabled_rule && enabled_rule.length < 1) {
          throw new ServiceError(
            'Selected template does not have any active rule!',
            HttpStatus.BAD_REQUEST,
          );
        }

        const reqTempChangeQueueData: CompliacneUpdateOnRequirementTempChangeDto =
          {
            requirement_group_id: new ObjectId(id),
            old_template_id: requirement.acord28template_id,
            new_template_id: updateRequirmentPayload.acord28template_id,
          };

        if (
          updateRequirmentPayload.acord28template_id?.toString() !=
          requirement.acord28template_id?.toString()
        ) {
          this.RequirementTempUpdateQueue.add(
            COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE,
            reqTempChangeQueueData,
          );
        }
      }

      const res = await this.RequirementsModel.findOneAndUpdate(
        {
          _id: new ObjectId(id),
        },
        {
          ...(updateRequirmentPayload.name && {
            name: updateRequirmentPayload.name,
          }),
          ...(updateRequirmentPayload.acord25template_id && {
            acord25template_id: updateRequirmentPayload.acord25template_id,
          }),
          ...(updateRequirmentPayload.acord28template_id && {
            acord28template_id: updateRequirmentPayload.acord28template_id,
          }),
          requirement_items: requirement_items_ids,
        },
        { new: true, overwrite: false },
      );

      return this.mapper.map(
        res,
        requirementsModel,
        RequirementsCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async getById(id: string) {
    try {
      const res = (await this.RequirementsModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'masterrequirementmodels',
            let: { requirement_items: '$requirement_items' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$_id', '$$requirement_items'],
                  },
                },
              },
              // { $project: { requirement_description: 1 } },
            ],
            as: 'requirement_items',
          },
        },
        {
          $limit: 1,
        },
      ])) as RequirementsCompletePopulatedResponseDto[];

      return this.mapper.map(
        res[0],
        RequirementsCompletePopulatedResponseDto,
        RequirementsCompletePopulatedResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async createCopy(createPayloadDto: RequirementsCopyCreator) {
    try {
      // first find the requirements:
      const existingRequirements = await this.RequirementsModel.findById(
        createPayloadDto.id,
      );

      // if doesn't exist
      if (!existingRequirements) {
        throw new ServiceError(
          "Requirement Group with that particular id doesn't exist!",
          HttpStatus.BAD_REQUEST,
        );
      }

      // prepare payload
      const payload: RequirementsCreator = {
        name: createPayloadDto.name,
        requirement_items: existingRequirements.requirement_items,
      };

      if (existingRequirements.acord28template_id) {
        payload.acord28template_id = existingRequirements.acord28template_id;
      }

      if (existingRequirements.acord25template_id) {
        payload.acord25template_id = existingRequirements.acord25template_id;
      }

      // save data
      const res = await this.RequirementsModel.create(payload);
      return this.mapper.map(
        res,
        requirementsModel,
        RequirementsCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async removeTemplate(id: any, updateRequirements: any) {
    try {
      const queryCondition: { $and: Record<string, unknown>[] } = { $and: [] };
      const updatePayload: { $unset: Record<string, unknown> } = {
        $unset: {},
      };

      const template = await this.TemplateService.getById(
        updateRequirements.acord25template_id ??
          updateRequirements.acord28template_id,
      );

      const activeRules: string[] = template.rules
        .filter(el => el.is_enabled)
        .map(el => el._id.toString());

      if (activeRules.length > 0) {
        const rulesToBeRemoved: TemplateUpdateQueueDto = {
          template_id: template._id.toString(),
          rules_id: activeRules,
          action: COMPLIANCE_UPDATE_TEMPLATES.REMOVED,
        };

        await this.templateUpdateQueue.add(
          TEMPLATE_UPDATE_QUEUE,
          rulesToBeRemoved,
        );
      }

      queryCondition.$and.push({ _id: id });

      if (updateRequirements.acord25template_id) {
        queryCondition.$and.push({
          acord25template_id: updateRequirements.acord25template_id,
        });
        updatePayload.$unset['acord25template_id'] = '';
      }

      if (updateRequirements.acord28template_id) {
        queryCondition.$and.push({
          acord28template_id: updateRequirements.acord28template_id,
        });
        updatePayload.$unset['acord28template_id'] = '';
      }

      const res = await this.RequirementsModel.findOneAndUpdate(
        queryCondition,
        updatePayload,
        { new: true },
      );

      if (res) {
        // remove the notifications
        await this.DocumentUploadModel.updateMany(
          {
            item_type: 'template',
            templateRuleId: { $in: activeRules },
          },
          {
            isDeleted: true,
          },
        );
      }

      return this.mapper.map(
        res,
        requirementsModel,
        RequirementsCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async deleteAll() {
    try {
      await this.RequirementsModel.deleteMany();
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
