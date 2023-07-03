import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommunicationTemplateCreator } from 'als/building-block/RequestableDto/CommunicationTemplate/CommunicationTemplateCreator';
import { CommunicationTemplateUpdate } from 'als/building-block/RequestableDto/CommunicationTemplate/CommunicationTemplateUpdate';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { CommunicationTemplateCompleteResponseDto } from 'als/building-block/TransferableDto/CommunicationTemplate/CommunicationTemplate';
import { CommunicationTemplatePartialResponseDto } from 'als/building-block/TransferableDto/CommunicationTemplate/CommuniccationTemplatePartial';
import { ServiceError } from 'als/building-block/utils/apiError';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import { createQueryparams } from 'als/building-block/utils/queryParams';
import { isEmpty } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

import {
  CommunicationTemplateModel as communicationTemplateModel,
  CommunicationTemplateModelDocument,
} from './communication-template.model';
import { ICommunicationTemplateService } from './communication-template.service';

@Injectable()
export class CommunicationTemplateManagerService
  extends AutomapperProfile
  implements ICommunicationTemplateService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(communicationTemplateModel.name)
    readonly communicationTemplateModel: Model<CommunicationTemplateModelDocument>,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        communicationTemplateModel,
        CommunicationTemplateCompleteResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.tags,
          mapFrom(s => s.tags),
        ),
        forMember(
          d => d.created_on,
          mapFrom(s => s._id.getTimestamp()),
        ),
      );
      createMap(
        mapper,
        communicationTemplateModel,
        CommunicationTemplatePartialResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.tags,
          mapFrom(s => s.tags),
        ),
        forMember(
          d => d.created_on,
          mapFrom(s => s._id.getTimestamp()),
        ),
      );
    };
  }

  async create(
    communicationTemplatePayload: CommunicationTemplateCreator,
  ): Promise<CommunicationTemplateCompleteResponseDto> {
    try {
      const res = await this.communicationTemplateModel.create(
        communicationTemplatePayload,
      );

      return this.mapper.map(
        res,
        communicationTemplateModel,
        CommunicationTemplateCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findOne(
    conditions: Partial<Record<keyof CommunicationTemplateUpdate, unknown>>,
  ) {
    try {
      const res = await this.communicationTemplateModel.findOne({
        ...conditions,
        active: true,
      });

      return this.mapper.map(
        res,
        communicationTemplateModel,
        CommunicationTemplateCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async find(
    conditions: Partial<Record<keyof CommunicationTemplateUpdate, unknown>>,
  ) {
    try {
      const res = await this.communicationTemplateModel.find({
        ...conditions,
        active: true,
      });

      return this.mapper.mapArray(
        res,
        communicationTemplateModel,
        CommunicationTemplateCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getAll(query?: SearchableDto) {
    try {
      const queryConditions: { $or?: Record<string, unknown>[] } = {};
      const pagination: { page: number; limit: number } = {
        page: 1,
        limit: 0,
      };

      if (!isEmpty(query)) {
        const queryParams = createQueryparams(query as SearchableDto, [
          'template_name',
          'template_type',
          'subject',
        ]);

        const conditions = queryParams.conditions;

        pagination.limit = queryParams.pagination.limit;

        pagination.page = queryParams.pagination.page;

        const $or: Record<string, unknown>[] = [];

        if (conditions && conditions.length > 0) {
          conditions.forEach(condition => {
            $or.push(condition);
          });
        }

        if ($or.length > 0) {
          queryConditions.$or = $or;
        }
      }

      const totalCount = await this.communicationTemplateModel
        .find({
          ...queryConditions,
          active: true,
        })
        .count();

      const skip = pagination.limit * (pagination.page - 1);
      let data = await this.communicationTemplateModel.aggregate([
        {
          $match: { ...queryConditions, active: true },
        },
        {
          $lookup: {
            from: 'usermodels',
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by',
          },
        },
        {
          $unwind: {
            path: '$created_by',
          },
        },
        {
          $project: {
            _id: 1,
            template_name: 1,
            template_type: 1,
            template: 1,
            subject: 1,
            system_generated: 1,
            'created_by._id': 1,
            'created_by.email': 1,
            'created_by.first_name': 1,
            'created_by.last_name': 1,
            tags: 1,
          },
        },
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
      ]);

      const page = pagination.page;
      const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;

      data = this.mapper.mapArray(
        data,
        communicationTemplateModel,
        CommunicationTemplateCompleteResponseDto,
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

  async getById(id: string) {
    try {
      const dbResponse = await this.communicationTemplateModel.aggregate([
        {
          $match: { _id: new ObjectId(id), active: true },
        },
        {
          $lookup: {
            from: 'usermodels',
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by',
          },
        },
        {
          $unwind: {
            path: '$created_by',
          },
        },
        {
          $project: {
            _id: 1,
            template_name: 1,
            template_type: 1,
            template: 1,
            subject: 1,
            system_generated: 1,
            'created_by._id': 1,
            'created_by.email': 1,
            'created_by.first_name': 1,
            'created_by.last_name': 1,
            tags: 1,
          },
        },
      ]);

      return this.mapper.map(
        dbResponse[0],
        communicationTemplateModel,
        CommunicationTemplateCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async update(id: string, updatePayloadDto: CommunicationTemplateUpdate) {
    try {
      if (updatePayloadDto.template_type) {
        const res = await this.communicationTemplateModel.findOne({
          _id: id,
          system_generated: true,
        });

        if (res) {
          throw new ServiceError(
            'Template type of system generated templates can not be updated',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const res = await this.communicationTemplateModel.findOneAndUpdate(
        {
          _id: id,
        },
        updatePayloadDto,
        { new: true, overwrite: false },
      );

      return this.mapper.map(
        res,
        communicationTemplateModel,
        CommunicationTemplatePartialResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async deleteAll() {
    try {
      await this.communicationTemplateModel.deleteMany();
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async softDelete(id: string) {
    try {
      const res = await this.communicationTemplateModel.findOneAndUpdate(
        {
          _id: id,
          active: true,
          system_generated: false,
        },
        {
          active: false,
        },
        {
          new: true,
          overwrite: false,
        },
      );

      if (!res) {
        throw new ServiceError(
          'Communication Template not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return HttpStatus.NO_CONTENT;
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
