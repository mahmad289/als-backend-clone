import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { InjectQueue } from '@nestjs/bullmq';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ESCALATION_QUEUE } from 'als/building-block/constants';
import { EscalationCreator } from 'als/building-block/RequestableDto/Escalation/EscalationCreator';
import { EscalationUpdate } from 'als/building-block/RequestableDto/Escalation/EscalationUpdate';
import { EscalationResponseDto } from 'als/building-block/TransferableDto/Escalation/Escalation';
import { ServiceError } from 'als/building-block/utils/apiError';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import { Queue } from 'bullmq';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

import {
  ComplianceModel as complianceModel,
  ComplianceModelDocument,
} from '../compliance/model/compliance.model';
import {
  EscalationModel as escalationModel,
  EscalationModelDocument,
} from './escalation.model';
import { IEscalationService } from './escalation.service';

@Injectable()
export class EscalationManagerService
  extends AutomapperProfile
  implements IEscalationService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(escalationModel.name)
    readonly EscalationModel: Model<EscalationModelDocument>,
    @InjectModel(complianceModel.name)
    readonly ComplianceModel: Model<ComplianceModelDocument>,
    @InjectQueue(ESCALATION_QUEUE)
    private readonly escalationQueue: Queue,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        escalationModel,
        EscalationResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.coverage_types,
          mapFrom(s => s.coverage_types),
        ),
      );
    };
  }

  async create(createPayloadDto: EscalationCreator) {
    try {
      const res = await this.EscalationModel.create(createPayloadDto);
      const compliance = await this.ComplianceModel.findOneAndUpdate(
        {
          _id: createPayloadDto.compliance_id,
        },
        {
          $set: {
            in_escalation: true,
            escalation_id: res._id,
          },
        },
        { new: true },
      );

      if (!compliance) {
        throw new ServiceError('No compliance found', HttpStatus.NOT_FOUND);
      }

      await this.toggleEscalation(res?._id.toString(), true);
      return this.mapper.map(res, escalationModel, EscalationResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getById(id: string) {
    try {
      const res = await this.EscalationModel.findById(id);

      return this.mapper.map(res, escalationModel, EscalationResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getByComplianceId(id: string) {
    try {
      const res = await this.EscalationModel.findOne({
        compliance_id: id,
      });

      return this.mapper.map(res, escalationModel, EscalationResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async update(id: string, updatePayloadDto: EscalationUpdate) {
    try {
      const res = await this.EscalationModel.findOneAndUpdate(
        {
          _id: id,
        },
        updatePayloadDto,
        { new: true, overwrite: false },
      );

      if (res?.status) {
        this.toggleEscalation(id, res.status);
      }

      return this.mapper.map(res, escalationModel, EscalationResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async updateEscalationStatus(id: string) {
    const escalation = await this.getById(id);
    return await this.toggleEscalation(id, !escalation.status);
  }

  async toggleEscalation(id: string, status: boolean) {
    try {
      const escalation = await this.getById(id);

      if (!escalation) {
        throw new ServiceError('Escalation not found', HttpStatus.NOT_FOUND);
      }

      const compliance = await this.ComplianceModel.findOneAndUpdate(
        {
          escalation_id: id,
        },
        {
          $set: {
            in_escalation: status,
          },
        },
        { new: true },
      );

      await this.setItemEscalationStatus(id, status);

      if (!compliance) {
        throw new ServiceError('No compliance found', HttpStatus.NOT_FOUND);
      }

      const res = await this.EscalationModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            status: status,
          },
        },
        { new: true },
      );

      return this.mapper.map(res, escalationModel, EscalationResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async sendEscalationEmail() {
    try {
      const res = await this.EscalationModel.find({
        status: true,
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      });

      if (res.length > 0) {
        await this.escalationQueue.add(ESCALATION_QUEUE, res);
      }
      // return this.mapper.mapArray(res, escalationModel, EscalationResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async setItemEscalationStatus(id: string, status: boolean) {
    try {
      const compliance = await this.ComplianceModel.aggregate([
        {
          $match: {
            escalation_id: new ObjectId(id),
          },
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

      // get escalation
      const escalation = await this.EscalationModel.findById(id);

      // if no escalation found throw error
      if (!escalation) {
        throw errorHandler(
          new ServiceError('Escalation not found', HttpStatus.NOT_FOUND),
        );
      }

      const matched_items: any = [];
      const not_matched_items: any = [];

      for (const compliance_item of compliance[0].compliance_items) {
        if (
          escalation.coverage_types.includes(
            compliance_item.master_requirement.coverage_type_uuid,
          )
        ) {
          matched_items.push(compliance_item._id);
        } else {
          not_matched_items.push(compliance_item._id);
        }
      }

      for (const template_item of compliance[0].template_items) {
        if (
          escalation.coverage_types.includes(
            template_item.master_requirement.coverage_type_uuid,
          )
        ) {
          matched_items.push(template_item._id);
        } else {
          not_matched_items.push(template_item._id);
        }
      }

      // set is_escalated to true for matched items using arrayFilters
      if (status === true) {
        await this.ComplianceModel.updateMany(
          {
            _id: new ObjectId(compliance[0]._id),
          },
          {
            $set: {
              'compliance_items.$[elem].is_escalated': true,
              'template_items.$[elem].is_escalated': true,
            },
          },
          {
            arrayFilters: [
              {
                'elem._id': {
                  $in: matched_items,
                },
              },
            ],
          },
        );

        // set is_escalated to false for not matched items using arrayFilters
        await this.ComplianceModel.updateMany(
          {
            _id: new ObjectId(compliance[0]._id),
          },
          {
            $set: {
              'compliance_items.$[elem].is_escalated': false,
              'template_items.$[elem].is_escalated': false,
            },
          },
          {
            arrayFilters: [
              {
                'elem._id': {
                  $in: not_matched_items,
                },
              },
            ],
          },
        );
      } else {
        await this.ComplianceModel.updateMany(
          {
            _id: new ObjectId(compliance[0]._id),
          },
          {
            $set: {
              'compliance_items.$[elem].is_escalated': false,
              'template_items.$[elem].is_escalated': false,
            },
          },
          {
            arrayFilters: [
              {
                'elem._id': {
                  $in: matched_items,
                },
              },
            ],
          },
        );
      }
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
