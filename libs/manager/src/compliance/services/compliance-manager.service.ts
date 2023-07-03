import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ComplianceCreator } from 'als/building-block/RequestableDto/Compliance/ComplianceCreator';
import { ComplianceItemUpdateDto } from 'als/building-block/RequestableDto/Compliance/ComplianceItemUpdate';
import { ComplianceUpdate } from 'als/building-block/RequestableDto/Compliance/ComplianceUpdate';
import { UpdateDocumentDateDto } from 'als/building-block/RequestableDto/Compliance/UpdateDocumentDate';
import { DocumentUploadCreator } from 'als/building-block/RequestableDto/DocumentUpload/DocumentUploadCreator';
import { OCRDto } from 'als/building-block/RequestableDto/OCR/OCR.dto';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { ComplianceCompleteResponsDto } from 'als/building-block/TransferableDto/Compliance/Compliance';
import { ServiceError } from 'als/building-block/utils/apiError';
import {
  COMPLIANCE_ITEM_STATUS_ENUM,
  COMPLIANCE_UPDATE_TEMPLATES,
  COVERAGE_TYPE_UUID,
  DOCUMENT_TYPE_UUID,
  TEMPLATE_RULE_CONDITION_ENUM,
} from 'als/building-block/utils/enum';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  createQueryparams,
  getQueryConditions,
} from 'als/building-block/utils/queryParams';
import {
  DocumentUploadModel as documentUploadModel,
  DocumentUploadModelDocument,
} from 'als/manager/document-upload/document-upload.model';
import { IDocumentUploadService } from 'als/manager/document-upload/document-upload.service';
import { IProjectService } from 'als/manager/project/project-service';
import { IMasterRequirementService } from 'als/manager/requirement-group/interfaces/master-requirement.service';
import { MasterRequirementModel } from 'als/manager/requirement-group/model/master-requirement.model';
import {
  RequirementsModel as requirementModel,
  RequirementsModelDocument,
} from 'als/manager/requirement-group/model/requirements.model';
import {
  RuleEntity,
  TemplateModel,
  TemplateModel as templateModel,
  TemplateModelDocument,
} from 'als/manager/requirement-group/model/template.model';
import { isEmpty } from 'lodash';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

import {
  ComplianceItems,
  ComplianceModel,
  ComplianceModel as complianceModel,
  ComplianceModelDocument,
  TemplateItems,
} from '../model/compliance.model';
import { IComplianceService } from './compliance.service';

@Injectable()
export class ComplianceManagerService
  extends AutomapperProfile
  implements IComplianceService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(complianceModel.name)
    readonly ComplianceModel: Model<ComplianceModelDocument>,
    @InjectModel(requirementModel.name)
    readonly RequirementModel: Model<RequirementsModelDocument>,
    @InjectModel(documentUploadModel.name)
    readonly DocumentUploadModel: Model<DocumentUploadModelDocument>,
    @InjectModel(TemplateModel.name)
    readonly template: Model<TemplateModel>,
    @InjectModel(templateModel.name)
    readonly TemplateModel: Model<TemplateModelDocument>,
    private masterRequirement: IMasterRequirementService,
    private documentUpload: IDocumentUploadService,
    private projectService: IProjectService,
    @InjectModel(MasterRequirementModel.name)
    readonly masterRequirementModel: Model<MasterRequirementModel>,
  ) {
    super(mapper);
  }
  logger = new Logger();

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        complianceModel,
        ComplianceCompleteResponsDto,
        forMember(
          d => d.compliance_items,
          mapFrom(s => s.compliance_items),
        ),
        forMember(
          d => d.template_items,
          mapFrom(s => s.template_items),
        ),
        forMember(
          d => d.project,
          mapFrom(s => s.project),
        ),
        forMember(
          d => d.escalation_id,
          mapFrom(s => s.escalation_id),
        ),
      );
    };
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
          ['project_name', 'client_name'],
        );

        pagination = paginationData;
        queryConditions.$or = getQueryConditions(conditions);
      }

      const totalCount = await this.ComplianceModel.find(
        queryConditions,
      ).count();

      const skip = pagination.limit * (pagination.page - 1);
      const res = await this.ComplianceModel.find(queryConditions)
        .skip(skip)
        .limit(pagination.limit)
        .sort({ _id: -1 });

      const page = pagination.page;
      const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
      const data = this.mapper.mapArray(
        res,
        complianceModel,
        ComplianceCompleteResponsDto,
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

  async create(complianceCreatorPayloadDto: ComplianceCreator) {
    const compliance_items: Omit<ComplianceItems, '_id'>[] = [];
    const template_items: Omit<TemplateItems, '_id'>[] = [];
    const req_group = await this.RequirementModel.aggregate([
      {
        $match: {
          _id: new ObjectId(complianceCreatorPayloadDto.requirement_group_id),
        },
      },
      {
        $lookup: {
          from: 'masterrequirementmodels',
          localField: 'requirement_items',
          foreignField: '_id',
          as: 'requirement_items',
        },
      },
    ]);

    req_group[0].requirement_items.forEach(
      (requirement: MasterRequirementModel) =>
        compliance_items.push({
          master_requirement_id: requirement._id,
          required_limit: requirement.requirement_rule,
          actual_limit: '',
          status: COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED,
          comment: requirement.default_comment,
          show: true,
          waiver: false,
          post_closing: false,
          document_name: '',
          original_filename: '',
          document_type_uuid: requirement.document_type_uuid,
          ...(requirement.OCR_KEY && {
            OCR_KEY: requirement.OCR_KEY,
          }),
        }),
    );

    if (req_group[0].acord25template_id) {
      const acord25template = await this.TemplateModel.aggregate([
        {
          $match: {
            _id: new ObjectId(req_group[0].acord25template_id),
          },
        },
        {
          $lookup: {
            from: 'masterrequirementmodels',
            localField: 'rules.master_requirement_id',
            foreignField: '_id',
            as: 'rule_requirement',
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
                      master_requirement_detail: {
                        $arrayElemAt: [
                          '$rule_requirement',
                          {
                            $indexOfArray: [
                              '$rule_requirement._id',
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
      ]);

      acord25template[0].rules.forEach(
        (rule: {
          _id: any;
          is_enabled: boolean;
          master_requirement_detail: {
            _id: any;
            document_type_uuid: any;
            OCR_KEY: string[];
          };
        }) => {
          if (rule.is_enabled) {
            template_items.push({
              template_id: req_group[0].acord25template_id,
              template_rule_id: rule._id,
              actual_limit: '',
              status: COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED,
              show: true,
              waiver: false,
              post_closing: false,
              document_name: '',
              original_filename: '',
              master_requirement_id: rule.master_requirement_detail._id,
              document_type_uuid:
                rule.master_requirement_detail.document_type_uuid,
              ...(rule.master_requirement_detail.OCR_KEY && {
                OCR_KEY: rule.master_requirement_detail.OCR_KEY,
              }),
            });
          }
        },
      );
    }

    if (req_group[0].acord28template_id) {
      const acord28template = await this.TemplateModel.aggregate([
        {
          $match: {
            _id: new ObjectId(req_group[0].acord28template_id),
          },
        },
        {
          $lookup: {
            from: 'masterrequirementmodels',
            localField: 'rules.master_requirement_id',
            foreignField: '_id',
            as: 'rule_requirement',
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
                      master_requirement_detail: {
                        $arrayElemAt: [
                          '$rule_requirement',
                          {
                            $indexOfArray: [
                              '$rule_requirement._id',
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
      ]);

      acord28template[0].rules.forEach(
        (rule: {
          _id: any;
          is_enabled: boolean;
          master_requirement_detail: {
            _id: any;
            document_type_uuid: any;
            OCR_KEY: string[];
          };
        }) => {
          if (rule.is_enabled) {
            template_items.push({
              template_id: req_group[0].acord28template_id,
              template_rule_id: rule._id,
              actual_limit: '',
              status: COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED,
              show: true,
              waiver: false,
              post_closing: false,
              document_name: '',
              original_filename: '',
              policy_number: '',
              named_insured: '',
              master_requirement_id: rule.master_requirement_detail._id,
              document_type_uuid:
                rule.master_requirement_detail.document_type_uuid,
              ...(rule.master_requirement_detail.OCR_KEY && {
                OCR_KEY: rule.master_requirement_detail.OCR_KEY,
              }),
            });
          }
        },
      );
    }

    try {
      const compliance = await this.ComplianceModel.create({
        user_id: complianceCreatorPayloadDto.user_id,
        vendor_id: complianceCreatorPayloadDto.vendor_id,
        vendor_name: complianceCreatorPayloadDto.vendor_name,
        project_id: complianceCreatorPayloadDto.project_id,
        project_name: complianceCreatorPayloadDto.project_name,
        requirement_group_id: complianceCreatorPayloadDto.requirement_group_id,
        client_id: complianceCreatorPayloadDto.client_id,
        client_name: complianceCreatorPayloadDto.client_name,
        compliance_items,
        template_items,
      });

      return this.mapper.map(
        compliance,
        complianceModel,
        ComplianceCompleteResponsDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async update(
    id: string,
    updatePayloadDto: ComplianceUpdate,
    contactId: ObjectId,
  ) {
    try {
      const condition: Record<string, unknown> = {
        _id: id,
      };

      const filename: any = {};
      if (updatePayloadDto.item_type === 'compliance') {
        condition['compliance_items._id'] = new ObjectId(
          updatePayloadDto.item_id,
        );

        filename['compliance_items.$.document_name'] =
          updatePayloadDto.file_name;
        filename['compliance_items.$.original_filename'] =
          updatePayloadDto.original_filename;

        filename['compliance_items.$.status'] =
          COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED;
      }

      if (updatePayloadDto.item_type === 'template') {
        condition['template_items._id'] = new ObjectId(
          updatePayloadDto.item_id,
        );

        filename['template_items.$.document_name'] = updatePayloadDto.file_name;
        filename['template_items.$.original_filename'] =
          updatePayloadDto.original_filename;

        filename['template_items.$.status'] =
          COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED;
      }

      const compliance = await this.ComplianceModel.findOneAndUpdate(
        condition,
        {
          $set: filename,
        },
        { new: true },
      );

      let document_type_uuid = null;
      let masterReqId;
      let templateRuleId;

      if (compliance && updatePayloadDto.item_type === 'compliance') {
        compliance.compliance_items.forEach(item => {
          if (item._id.toString() === updatePayloadDto.item_id.toString()) {
            document_type_uuid = item.document_type_uuid;
            masterReqId = item.master_requirement_id;
          }
        });
      }

      if (compliance && updatePayloadDto.item_type === 'template') {
        compliance.template_items.forEach(item => {
          if (item._id.toString() === updatePayloadDto.item_id.toString()) {
            document_type_uuid = item.document_type_uuid;
            templateRuleId = item.template_rule_id;
          }
        });
      }

      if (compliance && document_type_uuid) {
        const payload: DocumentUploadCreator = {
          compliance_id: new ObjectId(id),
          item_type: updatePayloadDto.item_type,
          item_id: new ObjectId(updatePayloadDto.item_id),
          contact_id: new ObjectId(contactId),
          document_type_uuid: document_type_uuid,
          is_read: false,
        };

        if (masterReqId) {
          payload.masterReqId = masterReqId;
        }

        if (templateRuleId) {
          payload.templateRuleId = templateRuleId;
        }

        this.documentUpload.create(payload);
      }

      if (document_type_uuid != null) {
        await this.ComplianceModel.updateMany(
          {
            _id: id,
          },
          {
            $set: {
              'template_items.$[element].document_name':
                updatePayloadDto.file_name,
              'template_items.$[element].original_filename':
                updatePayloadDto.original_filename,

              'template_items.$[element].status':
                COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED,
            },
            $unset: {
              'template_items.$[element].effective_date': '',
              'template_items.$[element].expiry_date': '',
            },
          },
          {
            arrayFilters: [
              { 'element.document_type_uuid': document_type_uuid },
            ],
          },
        );

        await this.ComplianceModel.updateMany(
          {
            _id: id,
          },
          {
            $set: {
              'compliance_items.$[element].document_name':
                updatePayloadDto.file_name,
              'compliance_items.$[element].original_filename':
                updatePayloadDto.original_filename,

              'compliance_items.$[element].status':
                COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED,
            },
            $unset: {
              'compliance_items.$[element].effective_date': '',
              'compliance_items.$[element].expiry_date': '',
            },
          },
          {
            arrayFilters: [
              { 'element.document_type_uuid': document_type_uuid },
            ],
          },
        );
      }

      const res = await this.ComplianceModel.findOne(condition);
      return this.mapper.map(
        res,
        complianceModel,
        ComplianceCompleteResponsDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findOne(conditions: Partial<Record<keyof ComplianceModel, unknown>>) {
    try {
      const compliance = await this.ComplianceModel.findOne(conditions);

      return this.mapper.map(
        compliance,
        complianceModel,
        ComplianceCompleteResponsDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getById(id: string) {
    try {
      const res: any = await this.ComplianceModel.findById(id).lean();
      if (!res) {
        throw new ServiceError('Compliance not found', HttpStatus.BAD_REQUEST);
      }

      if (res.project_id) {
        const project = await this.projectService.getById(res.project_id);
        if (project) {
          res.project = project;
        }
      }

      for (const template_item of res.template_items) {
        const masterRequirement = await this.masterRequirementModel
          .findById(template_item.master_requirement_id)
          .lean();

        template_item.master_requirement = masterRequirement;
      }

      for (const compliance_item of res.compliance_items) {
        const masterRequirement = await this.masterRequirementModel
          .findById(new ObjectId(compliance_item.master_requirement_id))
          .lean();

        compliance_item.master_requirement = masterRequirement;
      }

      // return res;
      return this.mapper.map(
        res,
        ComplianceModel,
        ComplianceCompleteResponsDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getComplianceForReview(
    client_id: string,
    project_id: string,
    vendor_id: string,
  ) {
    try {
      const res: any = await this.ComplianceModel.findOne({
        client_id: new ObjectId(client_id),
        project_id: new ObjectId(project_id),
        vendor_id: new ObjectId(vendor_id),
        status: true,
      }).lean();

      if (!res) {
        throw new ServiceError('Compliance not found', HttpStatus.BAD_REQUEST);
      }

      for (const template_item of res.template_items) {
        const template = await this.template.findById(
          template_item.template_id,
        );

        if (template) {
          template_item.template_name = template.template_name;
          if (template.rules.length > 0) {
            for (const rule of template?.rules) {
              if (
                rule._id.toString() ===
                template_item.template_rule_id.toString()
              ) {
                template_item.rule_detail = rule;
                const masterRequirement =
                  await this.masterRequirementModel.findById(
                    rule.master_requirement_id,
                  );

                template_item.master_requirement = masterRequirement;

                if (
                  template_item?.master_requirement?.document_type_uuid ===
                  DOCUMENT_TYPE_UUID.ACORD_28
                ) {
                  template_item.expiration_date =
                    res?.acord_28_ocr_data?.extracted_data?.expiration_date;
                  template_item.broker =
                    res?.acord_28_ocr_data?.extracted_data?.producer_name;
                  template_item.named_insured =
                    res?.acord_28_ocr_data?.extracted_data?.named_insured;
                  template_item.carrier =
                    res?.acord_28_ocr_data?.extracted_data?.company_name;
                  template_item.policy_number =
                    res?.acord_28_ocr_data?.extracted_data?.policy_number;
                } else {
                  template_item.broker =
                    res?.acord_25_ocr_data?.extracted_data?.producer;
                  template_item.named_insured =
                    res?.acord_25_ocr_data?.extracted_data?.insured;

                  const insurers = [];
                  if (res.acord_25_ocr_data?.extracted_data.insurer_A) {
                    insurers.push(
                      res.acord_25_ocr_data?.extracted_data.insurer_A,
                    );
                  }

                  if (res.acord_25_ocr_data?.extracted_data.insurer_B) {
                    insurers.push(
                      res.acord_25_ocr_data?.extracted_data.insurer_B,
                    );
                  }

                  if (res.acord_25_ocr_data?.extracted_data.insurer_C) {
                    insurers.push(
                      res.acord_25_ocr_data?.extracted_data.insurer_C,
                    );
                  }

                  if (res.acord_25_ocr_data?.extracted_data.insurer_D) {
                    insurers.push(
                      res.acord_25_ocr_data?.extracted_data.insurer_D,
                    );
                  }

                  if (res.acord_25_ocr_data?.extracted_data.insurer_E) {
                    insurers.push(
                      res.acord_25_ocr_data?.extracted_data.insurer_E,
                    );
                  }

                  if (res.acord_25_ocr_data?.extracted_data.insurer_F) {
                    insurers.push(
                      res.acord_25_ocr_data?.extracted_data.insurer_F,
                    );
                  }

                  template_item.carrier =
                    insurers.length < 1
                      ? insurers[0]
                        ? insurers[0]
                        : ''
                      : `Various (${insurers.join(', ')})`;
                  if (
                    template_item?.master_requirement?.coverage_type_uuid ===
                    COVERAGE_TYPE_UUID.GL
                  ) {
                    template_item.expiration_date =
                      res?.acord_25_ocr_data?.extracted_data?.cgl_policy_exp ||
                      '';
                    template_item.policy_number =
                      res?.acord_25_ocr_data?.extracted_data
                        ?.cgl_policy_number || '';
                  }

                  if (
                    template_item?.master_requirement?.coverage_type_uuid ===
                    COVERAGE_TYPE_UUID.AL
                  ) {
                    template_item.expiration_date =
                      res?.acord_25_ocr_data?.extracted_data?.al_exp || '';
                    template_item.policy_number =
                      res?.acord_25_ocr_data?.extracted_data
                        ?.al_policy_number || '';
                  }

                  if (
                    template_item?.master_requirement?.coverage_type_uuid ===
                    COVERAGE_TYPE_UUID.UL
                  ) {
                    template_item.expiration_date =
                      res?.acord_25_ocr_data?.extracted_data?.ul_exp || '';
                    template_item.policy_number =
                      res?.acord_25_ocr_data?.extracted_data
                        ?.ul_policy_number || '';
                  }

                  if (
                    template_item?.master_requirement?.coverage_type_uuid ===
                    COVERAGE_TYPE_UUID.WC
                  ) {
                    template_item.expiration_date =
                      res?.acord_25_ocr_data?.extracted_data?.wc_exp || '';
                    template_item.policy_number =
                      res?.acord_25_ocr_data?.extracted_data
                        ?.wc_policy_number || '';
                  }
                }
              }
            }
          }
        }
      }

      for (const compliance_item of res.compliance_items) {
        const masterRequirement = await this.masterRequirementModel
          .findById(new ObjectId(compliance_item.master_requirement_id))
          .lean();

        compliance_item.master_requirement = masterRequirement;
      }

      return this.mapper.map(
        res,
        ComplianceModel,
        ComplianceCompleteResponsDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  // FIXME: Please Verify If template Items need to be removed as well
  async updateByRequirementGroup(
    requirement_group_id: string,
    master_requirement_id: string,
    action: string,
  ) {
    try {
      if (action === COMPLIANCE_UPDATE_TEMPLATES.REMOVED) {
        await this.ComplianceModel.updateMany(
          {
            requirement_group_id: new ObjectId(requirement_group_id),
            'compliance_items.master_requirement_id': new ObjectId(
              master_requirement_id,
            ),
          },
          {
            $pull: {
              compliance_items: {
                master_requirement_id: new ObjectId(master_requirement_id),
              },
            },
          },
        );
      }

      if (action === COMPLIANCE_UPDATE_TEMPLATES.ADDED) {
        const requirement = await this.masterRequirement.getById(
          master_requirement_id,
        );

        if (!requirement) {
          return;
        }

        await this.ComplianceModel.updateMany(
          {
            requirement_group_id: new ObjectId(requirement_group_id),
          },
          {
            $push: {
              compliance_items: {
                master_requirement_id: requirement._id,
                required_limit: requirement.requirement_rule,
                actual_limit: '',
                status: COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED,
                comment: requirement.default_comment,
                show: true,
                waiver: false,
                post_closing: false,
                document_name: '',
                document_type_uuid: requirement.document_type_uuid,
                ...(requirement.OCR_KEY && {
                  OCR_KEY: requirement.OCR_KEY,
                }),
              },
            },
          },
        );
      }
    } catch (error) {
      throw errorHandler(error);
    }
  }
  //when template gets changed
  async updateByTemplate(
    requirement_group_id: string,
    old_template_id: string | undefined,
    new_template_id: string,
  ): Promise<void> {
    try {
      const template_items: Omit<TemplateItems, '_id'>[] = [];
      const compliances = await this.ComplianceModel.find({
        requirement_group_id: new ObjectId(requirement_group_id),
        ...(old_template_id && {
          'template_items.template_id': new ObjectId(old_template_id),
        }),
      });

      if (old_template_id) {
        await this.ComplianceModel.updateMany(
          {
            requirement_group_id: new ObjectId(requirement_group_id),
            'template_items.template_id': new ObjectId(old_template_id),
          },
          {
            $pull: {
              template_items: {
                template_id: new ObjectId(old_template_id),
              },
            },
          },
        );
      }

      const template = await this.TemplateModel.aggregate([
        {
          $match: {
            _id: new ObjectId(new_template_id),
          },
        },
        {
          $lookup: {
            from: 'masterrequirementmodels',
            localField: 'rules.master_requirement_id',
            foreignField: '_id',
            as: 'rule_requirement',
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
                      master_requirement_detail: {
                        $arrayElemAt: [
                          '$rule_requirement',
                          {
                            $indexOfArray: [
                              '$rule_requirement._id',
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
      ]);

      if (template[0]) {
        template[0].rules?.forEach(
          (rule: {
            _id: any;
            master_requirement_detail: {
              _id: any;
              document_type_uuid: any;
              OCR_KEY: string[];
            };
            is_enabled: boolean;
          }) => {
            if (rule.is_enabled) {
              template_items.push({
                template_id: new ObjectId(new_template_id),
                template_rule_id: rule._id,
                actual_limit: '',
                status: COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED,
                show: true,
                waiver: false,
                post_closing: false,
                document_name: '',
                original_filename: '',
                master_requirement_id: rule.master_requirement_detail._id,
                document_type_uuid:
                  rule.master_requirement_detail.document_type_uuid,
                ...(rule.master_requirement_detail.OCR_KEY && {
                  OCR_KEY: rule.master_requirement_detail.OCR_KEY,
                }),
              });
            }
          },
        );
      }

      await this.ComplianceModel.updateMany(
        {
          _id: {
            $in: compliances.map(compliance => new ObjectId(compliance._id)),
          },
        },
        {
          $push: {
            template_items: { $each: template_items },
          },
        },
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }
  //when template gets edited
  async updateByTemplateEdit(
    template_id: string,
    rules_id: string[],
    action: string,
  ) {
    try {
      if (action === COMPLIANCE_UPDATE_TEMPLATES.REMOVED) {
        await this.ComplianceModel.updateMany(
          {
            'template_items.template_id': new ObjectId(template_id),
            'template_items.$.template_rule_id': {
              $in: rules_id.map(rule => new ObjectId(rule)),
            },
          },
          {
            $pull: {
              template_items: {
                template_id: new ObjectId(template_id),
                template_rule_id: {
                  $in: rules_id.map(rule => new ObjectId(rule)),
                },
              },
            },
          },
        );
      }

      if (action === COMPLIANCE_UPDATE_TEMPLATES.ADDED) {
        const template_items: Omit<TemplateItems, '_id'>[] = [];
        const compliances = await this.ComplianceModel.find({
          'template_items.template_id': new ObjectId(template_id),
          'template_items.$.template_rule_id': {
            $in: rules_id.map(rule => new ObjectId(rule)),
          },
        });

        const template = await this.TemplateModel.aggregate([
          {
            $match: {
              _id: new ObjectId(template_id),
            },
          },
          {
            $lookup: {
              from: 'masterrequirementmodels',
              localField: 'rules.master_requirement_id',
              foreignField: '_id',
              as: 'rule_requirement',
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
                        master_requirement_detail: {
                          $arrayElemAt: [
                            '$rule_requirement',
                            {
                              $indexOfArray: [
                                '$rule_requirement._id',
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
        ]);

        if (template[0]) {
          template[0].rules?.forEach(
            (rule: {
              _id: any;
              master_requirement_detail: {
                _id: any;
                document_type_uuid: any;
                OCR_KEY: string[];
              };
              is_enabled: boolean;
            }) => {
              if (
                rules_id.some(ru => ru === rule._id.toString()) &&
                rule.is_enabled
              ) {
                template_items.push({
                  template_id: new ObjectId(template_id),
                  template_rule_id: rule._id,
                  actual_limit: '',
                  status: COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED,
                  show: true,
                  waiver: false,
                  post_closing: false,
                  document_name: '',
                  original_filename: '',
                  master_requirement_id: rule.master_requirement_detail._id,
                  document_type_uuid:
                    rule.master_requirement_detail.document_type_uuid,
                  ...(rule.master_requirement_detail.OCR_KEY && {
                    OCR_KEY: rule.master_requirement_detail.OCR_KEY,
                  }),
                });
              }
            },
          );
        }

        await this.ComplianceModel.updateMany(
          {
            _id: {
              $in: compliances.map(compliance => new ObjectId(compliance._id)),
            },
            'template.$.template_id': new ObjectId(template_id),
          },
          {
            $push: {
              template_items: { $each: template_items },
            },
          },
        );
      }
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async updateComplianceItem(
    id: string,
    complianceItemUpdateDto: ComplianceItemUpdateDto,
  ) {
    try {
      // condition
      const queryConditions: {
        $and: Record<string, unknown>[];
      } = {
        $and: [],
      };

      // payload
      const payload: Record<string, unknown> = {};

      queryConditions.$and.push({ _id: id });

      if (complianceItemUpdateDto.compliance_item) {
        queryConditions.$and.push({
          'compliance_items._id': complianceItemUpdateDto.compliance_item._id,
        });
        payload['compliance_items.$.show'] =
          complianceItemUpdateDto.compliance_item.show;
        payload['compliance_items.$.status'] =
          complianceItemUpdateDto.compliance_item.status;
        payload['compliance_items.$.waiver'] =
          complianceItemUpdateDto.compliance_item.waiver;
        payload['compliance_items.$.post_closing'] =
          complianceItemUpdateDto.compliance_item.post_closing;
        payload['compliance_items.$.comment'] =
          complianceItemUpdateDto.compliance_item.comment;
        payload['compliance_items.$.actual_limit'] =
          complianceItemUpdateDto.compliance_item.actual_limit;
      }

      if (complianceItemUpdateDto.template_item) {
        queryConditions.$and?.push({
          'template_items._id': complianceItemUpdateDto.template_item._id,
        });
        payload['template_items.$.show'] =
          complianceItemUpdateDto.template_item.show;
        payload['template_items.$.status'] =
          complianceItemUpdateDto.template_item.status;
        payload['template_items.$.waiver'] =
          complianceItemUpdateDto.template_item.waiver;
        payload['template_items.$.post_closing'] =
          complianceItemUpdateDto.template_item.post_closing;
        payload['template_items.$.comment'] =
          complianceItemUpdateDto.template_item.comment;
        payload['template_items.$.actual_limit'] =
          complianceItemUpdateDto.template_item.actual_limit;
      }

      // remove keys in payload that has undefined values
      Object.keys(payload).forEach(
        key => payload[key] === undefined && delete payload[key],
      );

      // update Query
      const compliance = await this.ComplianceModel.findOneAndUpdate(
        queryConditions,
        {
          $set: payload,
        },
        { new: true },
      );

      return this.mapper.map(
        compliance,
        complianceModel,
        ComplianceCompleteResponsDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async updateComplianceValue(OcrData: OCRDto) {
    try {
      const res: ComplianceCompleteResponsDto | null =
        await this.ComplianceModel.findById(OcrData.compliance_id);

      if (!res) {
        throw new ServiceError(
          "Compliance with that id doesn't exist!",
          HttpStatus.BAD_REQUEST,
        );
      }

      if (res.template_items.length > 0) {
        for (const template of res.template_items) {
          //Now checking OCR keys as array in our records
          if (template.OCR_KEY && template.OCR_KEY.length > 0) {
            for (const key of template.OCR_KEY) {
              if (OcrData.extracted_data.hasOwnProperty(key)) {
                template.actual_limit = OcrData.extracted_data[key];
              }
            }
          }

          // set the named_insured value and policy number
          if (template.hasOwnProperty('policy_number')) {
            template.policy_number =
              OcrData.extracted_data['policy_number'] ?? '';
          }

          if (template.hasOwnProperty('named_insured')) {
            template.named_insured =
              OcrData.extracted_data['named_insured'] ?? '';
          }
        }
      }

      if (res.compliance_items.length > 0) {
        for (const compliance of res.compliance_items) {
          if (
            compliance.OCR_KEY &&
            OcrData.extracted_data.hasOwnProperty(compliance.OCR_KEY[0])
          ) {
            compliance.actual_limit =
              OcrData.extracted_data[compliance.OCR_KEY[0]];
          }
        }
      }

      const data = await this.ComplianceModel.findByIdAndUpdate(
        { _id: OcrData.compliance_id },
        {
          $set: {
            compliance_items: res.compliance_items,
            template_items: res.template_items,
          },
        },
        {
          new: true,
        },
      );

      return this.mapper.map(
        data,
        complianceModel,
        ComplianceCompleteResponsDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async updateComplianceStatus(id: string) {
    try {
      const res = await this.ComplianceModel.aggregate([
        //01: match the compliance
        {
          $match: { _id: new ObjectId(id) },
        },
        {
          $lookup: {
            from: 'templatemodels',
            let: { letId: '$template_items.template_id' },
            pipeline: [
              { $match: { $expr: { $in: ['$_id', '$$letId'] } } },
              {
                $project: {
                  rules: 1,
                },
              },
            ],
            as: 'lookupRelations',
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
                      template_detail: {
                        $arrayElemAt: [
                          '$lookupRelations',
                          {
                            $indexOfArray: [
                              '$lookupRelations._id',
                              '$$rel.template_id',
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
      ]);

      if (res.length <= 0) {
        throw new ServiceError(
          "Compliance with that id doesn't exist!",
          HttpStatus.BAD_REQUEST,
        );
      }

      for (const template of res[0].template_items) {
        if (template.OCR_KEY && template.OCR_KEY.length > 0) {
          const rule = template.template_detail.rules.find(
            (rule: RuleEntity) =>
              rule._id.toString() === template.template_rule_id.toString(),
          );

          const actual_limit = this.convertToNumber(template.actual_limit);
          const value = this.convertToNumber(rule.value);

          if (actual_limit && value) {
            switch (rule.condition) {
              case TEMPLATE_RULE_CONDITION_ENUM.GREATER_THAN:
                if (actual_limit > value) {
                  template.status = COMPLIANCE_ITEM_STATUS_ENUM.STATUS_GREEN;
                } else {
                  template.status = COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED;
                }

                break;
              case TEMPLATE_RULE_CONDITION_ENUM.GREATER_THAN_OR_EQUAL:
                if (actual_limit >= value) {
                  template.status = COMPLIANCE_ITEM_STATUS_ENUM.STATUS_GREEN;
                } else {
                  template.status = COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED;
                }

                break;
              case TEMPLATE_RULE_CONDITION_ENUM.LESS_THAN:
                if (actual_limit < value) {
                  template.status = COMPLIANCE_ITEM_STATUS_ENUM.STATUS_GREEN;
                } else {
                  template.status = COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED;
                }

                break;
              default:
                break;
            }
          }

          if (rule.condition === TEMPLATE_RULE_CONDITION_ENUM.REQUIRED) {
            if (actual_limit) {
              template.status = COMPLIANCE_ITEM_STATUS_ENUM.STATUS_GREEN;
            } else {
              template.status = COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED;
            }
          }

          delete template.template_detail;
        }
      }

      const data = await this.ComplianceModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            template_items: res[0].template_items,
          },
        },
        {
          new: true,
        },
      );

      return this.mapper.map(
        data,
        complianceModel,
        ComplianceCompleteResponsDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async updateComplianceOCRData(payload: any) {
    try {
      const update: Record<string, unknown> = {};
      if (payload.document_type === 'acord_28') {
        update['acord_28_ocr_data'] = payload;
      } else {
        update['acord_25_ocr_data'] = payload;
      }

      await this.ComplianceModel.findOneAndUpdate(
        { _id: payload.compliance_id },
        {
          $set: update,
        },
        { new: true },
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async updateDocumentDate(
    id: string,
    updateDocumentDto: UpdateDocumentDateDto,
  ) {
    try {
      // find the compliance
      const compliance = await this.ComplianceModel.findOne({
        _id: id,
      });

      if (!compliance) {
        throw new ServiceError('Compliance not found!', HttpStatus.BAD_REQUEST);
      }

      // compliance items
      if (updateDocumentDto.item_type === 'compliance') {
        await this.ComplianceModel.updateMany(
          {
            _id: id,
          },
          {
            $set: {
              ...(updateDocumentDto.effective_date && {
                'compliance_items.$[element].effective_date':
                  updateDocumentDto.effective_date,
              }),

              ...(updateDocumentDto.expiry_date && {
                'compliance_items.$[element].expiry_date':
                  updateDocumentDto.expiry_date,
              }),
            },
          },
          {
            arrayFilters: [
              {
                'element.document_type_uuid':
                  updateDocumentDto.document_type_uuid,
              },
            ],
          },
        );
      }

      // for template items
      if (updateDocumentDto.item_type === 'template') {
        await this.ComplianceModel.updateMany(
          {
            _id: id,
          },
          {
            $set: {
              ...(updateDocumentDto.effective_date && {
                'template_items.$[element].effective_date':
                  updateDocumentDto.effective_date,
              }),

              ...(updateDocumentDto.expiry_date && {
                'template_items.$[element].expiry_date':
                  updateDocumentDto.expiry_date,
              }),
            },
          },
          {
            arrayFilters: [
              {
                'element.document_type_uuid':
                  updateDocumentDto.document_type_uuid,
              },
            ],
          },
        );
      }

      const res = await this.ComplianceModel.findById(id);
      return this.mapper.map(
        res,
        complianceModel,
        ComplianceCompleteResponsDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async complianceByVendorAndProject(project_id: string, vendor_id: string) {
    try {
      let res: any = await this.ComplianceModel.findOne({
        project_id: new ObjectId(project_id),
        vendor_id: new ObjectId(vendor_id),
        status: true,
      }).lean();

      if (!res) {
        throw new ServiceError('Compliance not found', HttpStatus.BAD_REQUEST);
      }

      res = await this.getById(res._id);
      return this.mapper.map(
        res,
        ComplianceModel,
        ComplianceCompleteResponsDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  convertToNumber(str: string): number | undefined {
    try {
      return Number(str.replace(/[\s,]+/g, ''));
    } catch (e) {}
  }
}
