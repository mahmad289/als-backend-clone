import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MasterRequirementCreator } from 'als/building-block/RequestableDto/MasterRequirement/MasterRequirementCreator';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { MasterRequirementCompleteResponseDto } from 'als/building-block/TransferableDto/MasterRequirement/MasterRequirement';
import { MasterRequirementPartialResponseDto } from 'als/building-block/TransferableDto/MasterRequirement/MasterRequirementPartial';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  createQueryparams,
  getQueryConditions,
} from 'als/building-block/utils/queryParams';
import { isEmpty } from 'lodash';
import { FilterQuery, Model } from 'mongoose';

import { IMasterRequirementService } from '../interfaces/master-requirement.service';
import {
  MasterRequirementModel as masterRequirementModel,
  MasterRequirementModelDocument,
} from '../model/master-requirement.model';

@Injectable()
export class MasterRequirementManagerService
  extends AutomapperProfile
  implements IMasterRequirementService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(masterRequirementModel.name)
    readonly MasterRequirementModel: Model<MasterRequirementModelDocument>,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        masterRequirementModel,
        MasterRequirementCompleteResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
      );
      createMap(
        mapper,
        masterRequirementModel,
        MasterRequirementPartialResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
      );
    };
  }

  async create(createPayloadDto: MasterRequirementCreator) {
    try {
      const res = await this.MasterRequirementModel.create(createPayloadDto);
      return this.mapper.map(
        res,
        masterRequirementModel,
        MasterRequirementCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getAll(query?: SearchableDto) {
    try {
      const queryConditions: {
        $or?: Record<string, unknown>[];
        $and?: Record<string, unknown>[];
      } = {};

      let pagination: { page: number; limit: number } = {
        page: 1,
        limit: 0,
      };

      if (!isEmpty(query)) {
        const { conditions, pagination: paginationData } = createQueryparams(
          query,
          ['requirement_description', 'coverage_type_name'],
        );

        pagination = paginationData;
        queryConditions.$or = getQueryConditions(conditions);
      }

      queryConditions.$and = [
        { document_type_name: { $ne: 'Acord 25' } },
        { document_type_name: { $ne: 'Acord 28' } },
      ];

      const totalCount = await this.MasterRequirementModel.find(
        queryConditions,
      ).count();

      const skip = pagination.limit * (pagination.page - 1);
      const res = await this.MasterRequirementModel.find(queryConditions)
        .skip(skip)
        .limit(pagination.limit);

      const page = pagination.page;
      const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
      const data = this.mapper.mapArray(
        res,
        masterRequirementModel,
        MasterRequirementPartialResponseDto,
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

  async find(
    filterQuery: FilterQuery<MasterRequirementModelDocument>,
    query?: SearchableDto,
  ) {
    const queryConditions: {
      $or?: Record<string, unknown>[];
      $and?: Record<string, unknown>[];
    } = {};

    let pagination: { page: number; limit: number } = {
      page: 1,
      limit: 0,
    };

    if (!isEmpty(query)) {
      const { conditions, pagination: paginationData } = createQueryparams(
        query,
        ['requirement_description', 'coverage_type_name'],
      );

      pagination = paginationData;
      queryConditions.$or = getQueryConditions(conditions);
    }

    if (filterQuery.document_type_name) {
      filterQuery.document_type_name =
        filterQuery.document_type_name === 'acord25' ? 'Acord 25' : 'Acord 28';
    }

    queryConditions.$and = [filterQuery];

    const totalCount = await this.MasterRequirementModel.find(
      queryConditions,
    ).count();

    const skip = pagination.limit * (pagination.page - 1);
    const res = await this.MasterRequirementModel.find(queryConditions)
      .skip(skip)
      .limit(pagination.limit);

    const page = pagination.page;
    const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
    const data = this.mapper.mapArray(
      res,
      masterRequirementModel,
      MasterRequirementPartialResponseDto,
    );

    return {
      page,
      perPage: perPage ? perPage : totalCount,
      total: totalCount,
      data,
    };
  }
  async getById(id: string) {
    try {
      const res = await this.MasterRequirementModel.findById(id);
      if (!res) {
        return null;
      }

      return this.mapper.map(
        res,
        masterRequirementModel,
        MasterRequirementPartialResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async deleteAll() {
    try {
      await this.MasterRequirementModel.deleteMany();
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
