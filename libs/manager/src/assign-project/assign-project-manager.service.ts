import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AssignProjectCreator } from 'als/building-block/RequestableDto/AssignProject/AssignProjectCreator';
import { AssignProjectCompleteResponseDto } from 'als/building-block/TransferableDto/AssignProject/AssignProject';
import { ContactCompleteResponseDto } from 'als/building-block/TransferableDto/Contact/Contact';
import { ServiceError } from 'als/building-block/utils/apiError';
import {
  COVERAGE_TYPE_UUID,
  DOCUMENT_TYPE_UUID,
} from 'als/building-block/utils/enum';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

import { ContactModel, ContactModelDocument } from '../contact/contact.model';
import { MasterRequirementModel } from '../requirement-group/model/master-requirement.model';
import { TemplateModel } from '../requirement-group/model/template.model';
import {
  AssignProjectModel,
  AssignProjectModelDocument,
} from './assign-project.model';
import { IAssignProjectService } from './assign-project.service';

@Injectable()
export class AssignProjectManagerService
  extends AutomapperProfile
  implements IAssignProjectService
{
  constructor(
    @InjectModel(AssignProjectModel.name)
    readonly assignProjectModel: Model<AssignProjectModelDocument>,
    @InjectModel(TemplateModel.name)
    readonly template: Model<TemplateModel>,
    @InjectModel(MasterRequirementModel.name)
    readonly masterRequirementModel: Model<MasterRequirementModel>,
    @InjectModel(ContactModel.name)
    private readonly contactModel: Model<ContactModelDocument>,
    @InjectMapper() readonly mapper: Mapper,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, AssignProjectModel, AssignProjectCompleteResponseDto);
      createMap(
        mapper,
        AssignProjectModel,
        AssignProjectCompleteResponseDto,
        forMember(
          d => d.vendor,
          mapFrom(s => s.vendor),
        ),
        forMember(
          d => d.compliance,
          mapFrom(s => s.compliance),
        ),
        forMember(
          d => d.project,
          mapFrom(s => s.project),
        ),
        forMember(
          d => d.contact,
          mapFrom(s => s.contact),
        ),
      );
    };
  }

  async create(createPayloadDto: AssignProjectCreator) {
    try {
      const res = await this.assignProjectModel.create(createPayloadDto);

      return this.mapper.map(
        res,
        AssignProjectModel,
        AssignProjectCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getById(id: string) {
    try {
      const res = await this.assignProjectModel.findById(id);

      return this.mapper.map(
        res,
        AssignProjectModel,
        AssignProjectCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findOne(
    conditions: Partial<Record<keyof AssignProjectModel, unknown>>,
  ) {
    try {
      const res = await this.assignProjectModel.findOne(conditions);

      return this.mapper.map(
        res,
        AssignProjectModel,
        AssignProjectCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async vendorDashboard(uuid: string, contact: ContactCompleteResponseDto) {
    try {
      const compliantProject = await this.assignProjectModel.aggregate([
        {
          $match: { uuid: uuid, contact_id: contact._id },
        },
        //  vendor
        {
          $lookup: {
            from: 'vendormodels',
            localField: 'vendor_id',
            foreignField: '_id',
            as: 'vendor',
          },
        },
        //  compliance
        {
          $lookup: {
            from: 'compliancemodels',
            localField: 'compliance_id',
            foreignField: '_id',
            as: 'compliance',
          },
        },
        // project
        {
          $lookup: {
            from: 'projectmodels',
            localField: 'project_id',
            foreignField: '_id',
            as: 'project',
          },
        },
        //contact
        {
          $lookup: {
            from: 'contactmodels',
            localField: 'contact_id',
            foreignField: '_id',
            as: 'contact',
          },
        },
        // unwind
        {
          $unwind: {
            path: '$vendor',
          },
        },
        {
          $unwind: {
            path: '$project',
          },
        },
        {
          $unwind: {
            path: '$compliance',
          },
        },
        {
          $unwind: {
            path: '$contact',
          },
        },
        {
          $addFields: {
            complianceStatus: '$compliance.status',
          },
        },
        {
          $match: {
            complianceStatus: true,
          },
        },
      ]);

      if (compliantProject.length < 1) {
        throw new ServiceError('Compliance not found', HttpStatus.BAD_REQUEST);
      }

      if (compliantProject[0].project.contacts.length > 0) {
        let projectContacts = [];
        projectContacts = await this.contactModel.find({
          _id: { $in: compliantProject[0].project.contacts },
          type: { $in: ['General Contractor', 'Partnership'] },
        });

        compliantProject[0].project.contacts = projectContacts;
      }

      for (const template_item of compliantProject[0].compliance
        .template_items) {
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
                    compliantProject[0].compliance?.acord_28_ocr_data?.extracted_data?.expiration_date;
                  template_item.broker =
                    compliantProject[0].compliance?.acord_28_ocr_data?.extracted_data?.producer_name;
                  template_item.named_insured =
                    compliantProject[0].compliance?.acord_28_ocr_data?.extracted_data?.named_insured;
                  template_item.carrier =
                    compliantProject[0].compliance?.acord_28_ocr_data?.extracted_data?.company_name;
                  template_item.policy_number =
                    compliantProject[0].compliance?.acord_28_ocr_data?.extracted_data?.policy_number;
                } else {
                  template_item.broker =
                    compliantProject[0].compliance?.acord_25_ocr_data?.extracted_data?.producer;
                  template_item.named_insured =
                    compliantProject[0].compliance?.acord_25_ocr_data?.extracted_data?.insured;

                  const insurers = [];
                  if (
                    compliantProject[0].compliance.acord_25_ocr_data
                      ?.extracted_data.insurer_A
                  ) {
                    insurers.push(
                      compliantProject[0].compliance.acord_25_ocr_data
                        ?.extracted_data.insurer_A,
                    );
                  }

                  if (
                    compliantProject[0].compliance.acord_25_ocr_data
                      ?.extracted_data.insurer_B
                  ) {
                    insurers.push(
                      compliantProject[0].compliance.acord_25_ocr_data
                        ?.extracted_data.insurer_B,
                    );
                  }

                  if (
                    compliantProject[0].compliance.acord_25_ocr_data
                      ?.extracted_data.insurer_C
                  ) {
                    insurers.push(
                      compliantProject[0].compliance.acord_25_ocr_data
                        ?.extracted_data.insurer_C,
                    );
                  }

                  if (
                    compliantProject[0].compliance.acord_25_ocr_data
                      ?.extracted_data.insurer_D
                  ) {
                    insurers.push(
                      compliantProject[0].compliance.acord_25_ocr_data
                        ?.extracted_data.insurer_D,
                    );
                  }

                  if (
                    compliantProject[0].compliance.acord_25_ocr_data
                      ?.extracted_data.insurer_E
                  ) {
                    insurers.push(
                      compliantProject[0].compliance.acord_25_ocr_data
                        ?.extracted_data.insurer_E,
                    );
                  }

                  if (
                    compliantProject[0].compliance.acord_25_ocr_data
                      ?.extracted_data.insurer_F
                  ) {
                    insurers.push(
                      compliantProject[0].compliance.acord_25_ocr_data
                        ?.extracted_data.insurer_F,
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
                      compliantProject[0].compliance?.acord_25_ocr_data
                        ?.extracted_data?.cgl_policy_exp || '';
                    template_item.policy_number =
                      compliantProject[0].compliance?.acord_25_ocr_data
                        ?.extracted_data?.cgl_policy_number || '';
                  }

                  if (
                    template_item?.master_requirement?.coverage_type_uuid ===
                    COVERAGE_TYPE_UUID.AL
                  ) {
                    template_item.expiration_date =
                      compliantProject[0].compliance?.acord_25_ocr_data
                        ?.extracted_data?.al_exp || '';
                    template_item.policy_number =
                      compliantProject[0].compliance?.acord_25_ocr_data
                        ?.extracted_data?.al_policy_number || '';
                  }

                  if (
                    template_item?.master_requirement?.coverage_type_uuid ===
                    COVERAGE_TYPE_UUID.UL
                  ) {
                    template_item.expiration_date =
                      compliantProject[0].compliance?.acord_25_ocr_data
                        ?.extracted_data?.ul_exp || '';
                    template_item.policy_number =
                      compliantProject[0].compliance?.acord_25_ocr_data
                        ?.extracted_data?.ul_policy_number || '';
                  }

                  if (
                    template_item?.master_requirement?.coverage_type_uuid ===
                    COVERAGE_TYPE_UUID.WC
                  ) {
                    template_item.expiration_date =
                      compliantProject[0].compliance?.acord_25_ocr_data
                        ?.extracted_data?.wc_exp || '';
                    template_item.policy_number =
                      compliantProject[0].compliance?.acord_25_ocr_data
                        ?.extracted_data?.wc_policy_number || '';
                  }
                }
              }
            }
          }
        }
      }

      for (const compliance_item of compliantProject[0].compliance
        .compliance_items) {
        const masterRequirement = await this.masterRequirementModel.findById(
          new ObjectId(compliance_item.master_requirement_id),
        );

        compliance_item.master_requirement = masterRequirement;
      }

      return this.mapper.map(
        compliantProject[0],
        AssignProjectModel,
        AssignProjectCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
