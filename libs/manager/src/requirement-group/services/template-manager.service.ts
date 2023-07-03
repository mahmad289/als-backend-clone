import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { InjectQueue } from '@nestjs/bullmq';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TEMPLATE_UPDATE_QUEUE } from 'als/building-block/constants';
import { TemplateUpdateQueueDto } from 'als/building-block/dtos/update-by-template.queue.dto';
import { TemplateCopyCreator } from 'als/building-block/RequestableDto/Template/TemplateCopyCreator';
import {
  RuleDto,
  TemplateCreator,
} from 'als/building-block/RequestableDto/Template/TemplateCreator';
import {
  TemplateNameUpdate,
  TemplateUpdate,
} from 'als/building-block/RequestableDto/Template/TemplateUpdate';
import { TemplateCompleteResponseDto } from 'als/building-block/TransferableDto/Template/Template';
import { ServiceError } from 'als/building-block/utils/apiError';
import {
  COMPLIANCE_UPDATE_TEMPLATES,
  TEMPLATE_TYPE_QUERY_ENUM,
} from 'als/building-block/utils/enum';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  ComplianceModel as complianceModel,
  ComplianceModelDocument,
} from 'als/manager/compliance/model/compliance.model';
import {
  DocumentUploadModel as documentUploadModel,
  DocumentUploadModelDocument,
} from 'als/manager/document-upload/document-upload.model';
import { Queue } from 'bullmq';
import { isEmpty } from 'lodash';
import { ObjectId } from 'mongodb';
import mongoose, { FilterQuery, Model } from 'mongoose';

import { IMasterRequirementService } from '../interfaces/master-requirement.service';
import { ITemplateService } from '../interfaces/template.service';
import {
  RuleEntity,
  TemplateModel as templateModel,
  TemplateModelDocument,
} from '../model/template.model';

@Injectable()
export class TemplateManagerService
  extends AutomapperProfile
  implements ITemplateService
{
  constructor(
    @InjectMapper()
    readonly mapper: Mapper,
    @InjectModel(templateModel.name)
    readonly TemplateModel: Model<TemplateModelDocument>,
    @InjectModel(documentUploadModel.name)
    readonly DocumentUploadModel: Model<DocumentUploadModelDocument>,
    @InjectModel(complianceModel.name)
    readonly ComplianceModel: Model<ComplianceModelDocument>,
    @InjectQueue(TEMPLATE_UPDATE_QUEUE)
    private readonly templateUpdateQueue: Queue,
    private masterRequirement: IMasterRequirementService,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        templateModel,
        TemplateCompleteResponseDto,
        forMember(
          d => d.rules,
          mapFrom(s => s.rules),
        ),
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
      );
      createMap(mapper, RuleEntity, RuleEntity);
    };
  }

  async create(templateCreator: TemplateCreator) {
    const data = await this.TemplateModel.findOne({
      template_name: templateCreator.template_name,
      active: true,
    });

    if (data) {
      throw new ServiceError('Template name already exist', HttpStatus.OK);
    }

    const res = await this.TemplateModel.create(templateCreator);
    return this.mapper.map(res, templateModel, TemplateCompleteResponseDto);
  }

  async find(filterQuery: FilterQuery<TemplateModelDocument>) {
    if (filterQuery.type) {
      filterQuery.type =
        filterQuery.type === TEMPLATE_TYPE_QUERY_ENUM.ACCORD_25
          ? 'Acord 25'
          : 'Acord 28';
    }

    const res = await this.TemplateModel.find({
      ...filterQuery,
      active: true,
    }).sort({ _id: -1 });

    return this.mapper.mapArray(
      res,
      templateModel,
      TemplateCompleteResponseDto,
    );
  }

  async getById(id: string) {
    try {
      const res = await this.TemplateModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id), active: true } },
        {
          $lookup: {
            from: 'masterrequirementmodels',
            let: { letId: '$rules.master_requirement_id' },
            pipeline: [
              { $match: { $expr: { $in: ['$_id', '$$letId'] } } },
              {
                $project: {
                  coverage_type_name: 1,
                  document_type_name: 1,
                  default_comment: 1,
                  requirement_rule: 1,
                },
              },
            ],
            as: 'lookupRelations',
          },
        },
        {
          $addFields: {
            rules: {
              $map: {
                input: '$rules',
                as: 'rel',
                in: {
                  $mergeObjects: [
                    '$$rel',
                    {
                      coverage_type_name: {
                        $arrayElemAt: [
                          '$lookupRelations.coverage_type_name',
                          {
                            $indexOfArray: [
                              '$lookupRelations._id',
                              '$$rel._id',
                            ],
                          },
                        ],
                      },
                    },
                    {
                      document_type_name: {
                        $arrayElemAt: [
                          '$lookupRelations.document_type_name',
                          {
                            $indexOfArray: [
                              '$lookupRelations._id',
                              '$$rel._id',
                            ],
                          },
                        ],
                      },
                    },
                    {
                      requirement_rule: {
                        $arrayElemAt: [
                          '$lookupRelations.requirement_rule',
                          {
                            $indexOfArray: [
                              '$lookupRelations._id',
                              '$$rel._id',
                            ],
                          },
                        ],
                      },
                    },
                    {
                      default_comment: {
                        $arrayElemAt: [
                          '$lookupRelations.default_comment',
                          {
                            $indexOfArray: [
                              '$lookupRelations._id',
                              '$$rel._id',
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
            lookupRelations: 0,
          },
        },
      ]);

      if (res.length < 1) {
        throw new ServiceError(
          `template id doesn't exist`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.mapper.map(
        res[0],
        templateModel,
        TemplateCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getRuleById(
    id: string,
    master_requirement_id: string,
  ): Promise<RuleEntity | unknown> {
    try {
      let res = await this.TemplateModel.findOne({
        _id: new ObjectId(id),
        'rules.master_requirement_id': new ObjectId(master_requirement_id),
      });

      if (!res) {
        const template = await this.TemplateModel.findById(id);
        if (!template) {
          throw new ServiceError(
            `template id doesn't exist`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const masterRequirement = await this.masterRequirement.getById(
          master_requirement_id,
        );

        if (!masterRequirement) {
          throw new ServiceError(
            `Master Requirement id doesn't exist`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const newRule: RuleDto = {
          condition: 'Required',
          is_enabled: false,
          name: '',
          master_requirement_id: masterRequirement._id,
          value: masterRequirement.requirement_rule,
          message: masterRequirement.default_comment,
        };

        await this.update(id, {
          rules: [...template.rules, newRule],
        });
        res = await this.TemplateModel.findOne({
          _id: new ObjectId(id),
          'rules.master_requirement_id': new ObjectId(master_requirement_id),
        });
      }

      if (!res) {
        throw new ServiceError(
          `master_requirement_id doesn't exist`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const rule = res.rules.filter(
        rule => rule.master_requirement_id.toString() === master_requirement_id,
      );

      return this.mapper.map(rule[0], RuleEntity, RuleEntity);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async update(id: string, templateUpdate: TemplateUpdate) {
    try {
      const template = await this.TemplateModel.findOne({ _id: id });

      if (!template) {
        throw new ServiceError(
          `Template with 'id' ${id} doesn't exist`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const rules_to_update: Record<string, any>[] = [];
      const rules_to_remove: ObjectId[] = [];
      const rulesToBeAddedInCompliance: string[] = [];
      const rulesToBeRemovedInCompliance: string[] = [];

      template.rules?.forEach(oldRule => {
        let match = false;
        templateUpdate.rules.forEach((newRule, index) => {
          if (
            oldRule.master_requirement_id.toString() ===
            newRule.master_requirement_id.toString()
          ) {
            rules_to_update.push({ ...newRule, _id: oldRule._id });
            //Conditions to check if we have to remove template from a compliance or not
            if (newRule.hasOwnProperty('is_enabled')) {
              if (oldRule.is_enabled && !newRule.is_enabled) {
                rulesToBeRemovedInCompliance.push(oldRule._id.toString());
              }

              if (!oldRule.is_enabled && newRule.is_enabled) {
                rulesToBeAddedInCompliance.push(oldRule._id.toString());
              }
            }

            templateUpdate.rules.splice(index, 1);
            match = true;
          }
        });

        if (!match) {
          rules_to_remove.push(oldRule._id);
          if (oldRule.is_enabled) {
            rulesToBeRemovedInCompliance.push(oldRule._id.toString());
          }
        }
      });

      //! REMOVE
      await this.TemplateModel.updateOne(
        { _id: id },
        { $pull: { rules: { _id: { $in: rules_to_remove } } } },
        { new: true },
      );

      //!  UPDATE
      // @FIXME: UPDATE CASE TO BE STILL HANDLED
      // Build $set operator dynamically based on update data
      const setOperator: Record<string, any> = {};
      const arrayFilters: Record<string, any>[] = [];
      rules_to_update.forEach((data, index) => {
        const elementKey = `element${index}`;
        setOperator[`rules.$[${elementKey}].name`] = data.name;
        setOperator[`rules.$[${elementKey}].condition`] = data.condition;
        setOperator[`rules.$[${elementKey}].value`] = data.value || '';
        setOperator[`rules.$[${elementKey}].message`] = data.message;

        if (data.hasOwnProperty('is_enabled')) {
          setOperator[`rules.$[${elementKey}].is_enabled`] = data.is_enabled;
        }

        arrayFilters.push({
          [`${elementKey}.master_requirement_id`]: data.master_requirement_id,
        });
      });

      // Construct and execute update query
      await this.TemplateModel.updateOne(
        { _id: id },
        { $set: setOperator },
        { arrayFilters },
      );

      // ! ADD
      const res = await this.TemplateModel.findByIdAndUpdate(
        { _id: id },
        { $push: { rules: { $each: templateUpdate.rules } } },
        { new: true },
      );

      // @Updating Compliances through Queue to reflect rules removed from template
      if (rulesToBeRemovedInCompliance.length > 0) {
        const rulesToBeRemoved: TemplateUpdateQueueDto = {
          template_id: id,
          rules_id: rulesToBeRemovedInCompliance,
          action: COMPLIANCE_UPDATE_TEMPLATES.REMOVED,
        };

        await this.templateUpdateQueue.add(
          TEMPLATE_UPDATE_QUEUE,
          rulesToBeRemoved,
        );
      }

      // @Updating Compliances through Queue to reflect newly added rules of template
      if (res?.rules) {
        res.rules.forEach(existingRule => {
          templateUpdate.rules.forEach(newlyAddedRule => {
            if (
              existingRule.master_requirement_id.toString() ===
                newlyAddedRule.master_requirement_id.toString() &&
              existingRule.is_enabled
            ) {
              rulesToBeAddedInCompliance.push(existingRule._id.toString());
            }
          });
        });

        // Que
        if (rulesToBeAddedInCompliance.length > 0) {
          const rulesToBeAdded: TemplateUpdateQueueDto = {
            template_id: id,
            rules_id: rulesToBeAddedInCompliance,
            action: COMPLIANCE_UPDATE_TEMPLATES.ADDED,
          };

          this.templateUpdateQueue.add(TEMPLATE_UPDATE_QUEUE, rulesToBeAdded);
        }
      }

      return this.mapper.map(res, templateModel, TemplateCompleteResponseDto);
    } catch (e) {
      throw errorHandler(e);
    }
  }

  async updateRuleById(
    id: string,
    master_requirement_id: string,
    templateUpdate: RuleDto,
  ) {
    try {
      const temp = await this.TemplateModel.findById(id);
      if (!temp) {
        throw new ServiceError("Template doesn't exist!", HttpStatus.NOT_FOUND);
      }

      const oldRule = temp.rules.find(
        rule => rule.master_requirement_id.toString() === master_requirement_id,
      );

      const dataToUpdate = {
        ...templateUpdate,
        is_enabled: oldRule?.is_enabled,
        _id: oldRule?._id,
      };

      const template = await this.TemplateModel.findOneAndUpdate(
        {
          _id: id,
          'rules.master_requirement_id': new ObjectId(master_requirement_id),
        },
        {
          $set: {
            'rules.$': dataToUpdate,
          },
        },
        { new: true },
      );

      return this.mapper.map(
        template,
        templateModel,
        TemplateCompleteResponseDto,
      );
    } catch (e) {
      throw errorHandler(e);
    }
  }

  async deleteOne(id: string) {
    try {
      const res = await this.TemplateModel.findOneAndUpdate(
        {
          _id: id,
          active: true,
        },
        {
          active: false,
        },
        { new: true, overwrite: false },
      );

      if (!res) {
        throw new ServiceError('Template not found', HttpStatus.BAD_REQUEST);
      }

      return {
        message: 'Template Item Deleted Successfully',
      };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async deleteAll() {
    try {
      await this.TemplateModel.deleteMany();
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async createCopy(createPayloadDto: TemplateCopyCreator) {
    try {
      // first find the requirements:
      const existingTemplate = await this.TemplateModel.findById(
        createPayloadDto.id,
      );

      // if doesn't exist
      if (!existingTemplate) {
        throw new ServiceError(
          "Template with that particular id doesn't exist!",
          HttpStatus.BAD_REQUEST,
        );
      }

      // const templateWithSameName = await this.TemplateModel.findOne({
      //   template_name: createPayloadDto.name,
      // });

      // if (templateWithSameName) {
      //   throw new ServiceError(
      //     'Template with same name already exist',
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }

      // prepare payload
      const payload = {
        template_name: createPayloadDto.name,
        rules: existingTemplate.rules,
        type: existingTemplate.type,
      };

      // save data
      const res = await this.TemplateModel.create(payload);
      return this.mapper.map(res, templateModel, TemplateCompleteResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async toggleRuleStatus(id: string, master_requirement_id: string) {
    try {
      const res = (await this.getRuleById(
        id,
        master_requirement_id,
      )) as RuleDto;

      if (isEmpty(res)) {
        throw new ServiceError('Rule not found', HttpStatus.BAD_REQUEST);
      }

      // Updating Compliance
      const check = await this.TemplateModel.findById(id);
      const enabled_rule = check?.rules.filter(el => el.is_enabled);
      if (enabled_rule && enabled_rule.length < 2 && res.is_enabled) {
        throw new ServiceError(
          'Template must have one active rule!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const template = await this.TemplateModel.findOneAndUpdate(
        {
          _id: id,
          'rules.master_requirement_id': new ObjectId(master_requirement_id),
        },
        {
          $set: {
            'rules.$.is_enabled': !res.is_enabled,
          },
        },
        { new: true },
      );

      if (template) {
        const rule = template.rules.find(
          el =>
            el.master_requirement_id.toString() ===
            master_requirement_id.toString(),
        );

        if (rule) {
          if (rule.is_enabled) {
            // shift into added queue
            const rulesToBeRemoved: TemplateUpdateQueueDto = {
              template_id: id,
              rules_id: [rule._id.toString()],
              action: COMPLIANCE_UPDATE_TEMPLATES.ADDED,
            };

            await this.templateUpdateQueue.add(
              TEMPLATE_UPDATE_QUEUE,
              rulesToBeRemoved,
            );
          } else {
            //! remove the notification
            // here i need to update :
            // like if i find the notification against rule id
            // its means i have parent notification deactivate
            // so we transfer the notification control over other
            // rule id of same document type uuid
            // else otherwise deleted then it work fine

            // lets say we have more then one notification of same rule id but have different compliance
            // then we have to do same for each notification

            const notifications = await this.DocumentUploadModel.find({
              templateRuleId: rule._id,
            });

            if (notifications && notifications.length > 0) {
              for (const notification of notifications) {
                // first find the compliance
                const compliance = await this.ComplianceModel.findById({
                  _id: notification?.compliance_id,
                });

                // second find item with same doc type uuid!
                // then in compliance we have to find other with same document_type_uuid
                const ruleWithSameDocType = compliance?.template_items.filter(
                  el =>
                    el.document_type_uuid === notification.document_type_uuid &&
                    el.template_rule_id.toString() !==
                      notification.templateRuleId?.toString(),
                );

                if (ruleWithSameDocType && ruleWithSameDocType.length > 0) {
                  // Replace the following values:
                  // we need to update existing notification
                  // document still present we just need to update the notification
                  await this.DocumentUploadModel.findByIdAndUpdate(
                    notification._id,
                    {
                      $set: {
                        item_id: ruleWithSameDocType[0]._id,
                        templateRuleId: ruleWithSameDocType[0].template_rule_id,
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

            // shift into remove queue
            const rulesToBeRemoved: TemplateUpdateQueueDto = {
              template_id: id,
              rules_id: [rule._id.toString()],
              action: COMPLIANCE_UPDATE_TEMPLATES.REMOVED,
            };

            await this.templateUpdateQueue.add(
              TEMPLATE_UPDATE_QUEUE,
              rulesToBeRemoved,
            );
          }
        }
      }

      if (template) {
        return this.mapper.map(
          template,
          templateModel,
          TemplateCompleteResponseDto,
        );
      }

      return this.mapper.map(
        template,
        templateModel,
        TemplateCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async templateNameEdit(id: string, name: TemplateNameUpdate) {
    try {
      const template = await this.TemplateModel.findByIdAndUpdate(
        id,
        {
          $set: {
            template_name: name.template_name,
          },
        },
        { new: true },
      );

      if (template) {
        return this.mapper.map(
          template,
          templateModel,
          TemplateCompleteResponseDto,
        );
      }
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
