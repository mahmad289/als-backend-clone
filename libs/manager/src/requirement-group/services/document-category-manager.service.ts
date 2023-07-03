import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentCategoryCreator } from 'als/building-block/RequestableDto/DocumentCategory/DocumentCategoryCreator';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { DocumentCategoryCompleteResponseDto } from 'als/building-block/TransferableDto/DocumentCategory/DocumentCategory';
import { DocumentCategoryPartialResponseDto } from 'als/building-block/TransferableDto/DocumentCategory/DocumentCategoryPartial';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  createQueryparams,
  getQueryConditions,
} from 'als/building-block/utils/queryParams';
import { isEmpty } from 'lodash';
import { Model } from 'mongoose';

import { IDocumentCategoryService } from '../interfaces/document-category.service';
import {
  DocumentCategoryModel as documentCategoryModel,
  DocumentCategoryModelDocument,
} from '../model/document-category.model';

@Injectable()
export class DocumentCategoryManagerService
  extends AutomapperProfile
  implements IDocumentCategoryService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(documentCategoryModel.name)
    readonly DocumentCategoryModel: Model<DocumentCategoryModelDocument>,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        documentCategoryModel,
        DocumentCategoryCompleteResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
      );
      createMap(
        mapper,
        documentCategoryModel,
        DocumentCategoryPartialResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
      );
    };
  }

  async create(createPayloadDto: DocumentCategoryCreator) {
    try {
      const res = await this.DocumentCategoryModel.create(createPayloadDto);
      return this.mapper.map(
        res,
        documentCategoryModel,
        DocumentCategoryCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getById(id: string) {
    try {
      const res = await this.DocumentCategoryModel.findById(id);

      return this.mapper.map(
        res,
        documentCategoryModel,
        DocumentCategoryCompleteResponseDto,
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

      const totalCount = await this.DocumentCategoryModel.find(
        queryConditions,
      ).count();

      const skip = pagination.limit * (pagination.page - 1);
      const res = await this.DocumentCategoryModel.find(queryConditions)
        .skip(skip)
        .limit(pagination.limit)
        .sort({ _id: -1 });

      const page = pagination.page;
      const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
      const data = this.mapper.mapArray(
        res,
        documentCategoryModel,
        DocumentCategoryPartialResponseDto,
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
      await this.DocumentCategoryModel.deleteMany();
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
