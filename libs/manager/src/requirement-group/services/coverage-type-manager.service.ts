import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CoverageTypeCreator } from 'als/building-block/RequestableDto/CoverageType/CoverageTypeCreator';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { CoverageTypeCompleteResponseDto } from 'als/building-block/TransferableDto/CoverageTypes/CoverageTypes';
import { CoverageTypePartialResponseDto } from 'als/building-block/TransferableDto/CoverageTypes/CoverageTypesPartial';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  createQueryparams,
  getQueryConditions,
} from 'als/building-block/utils/queryParams';
import { isEmpty } from 'lodash';
import { Model } from 'mongoose';

import { ICoverageTypeService } from '../interfaces/coverage-type.service';
import {
  CoverageTypeModel as coverageTypeModel,
  CoverageTypeModelDocument,
} from '../model/coverage-type.model';

@Injectable()
export class CoverageTypeManagerService
  extends AutomapperProfile
  implements ICoverageTypeService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(coverageTypeModel.name)
    readonly CoverageTypeModel: Model<CoverageTypeModelDocument>,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        coverageTypeModel,
        CoverageTypeCompleteResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
      );
      createMap(
        mapper,
        coverageTypeModel,
        CoverageTypePartialResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
      );
    };
  }

  async create(createPayloadDto: CoverageTypeCreator) {
    try {
      const res = await this.CoverageTypeModel.create(createPayloadDto);
      return this.mapper.map(
        res,
        coverageTypeModel,
        CoverageTypeCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getById(id: string) {
    try {
      const res = await this.CoverageTypeModel.findById(id);

      return this.mapper.map(
        res,
        coverageTypeModel,
        CoverageTypeCompleteResponseDto,
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

      const totalCount = await this.CoverageTypeModel.find(
        queryConditions,
      ).count();

      const skip = pagination.limit * (pagination.page - 1);
      const res = await this.CoverageTypeModel.find(queryConditions)
        .skip(skip)
        .limit(pagination.limit)
        .sort({ _id: -1 });

      const page = pagination.page;
      const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
      const data = this.mapper.mapArray(
        res,
        coverageTypeModel,
        CoverageTypeCompleteResponseDto,
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

  async deleteAll() {
    try {
      await this.CoverageTypeModel.deleteMany();
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
