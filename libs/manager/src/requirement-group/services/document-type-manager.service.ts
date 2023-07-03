import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentTypeCreator } from 'als/building-block/RequestableDto/DocumentType/DocumentTypeCreator';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { DocumentTypeResponseDto } from 'als/building-block/TransferableDto/DocumentType/DocumentType';
import { DocumentTypePartialResponseDto } from 'als/building-block/TransferableDto/DocumentType/DocumentTypePartial';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  createQueryparams,
  getQueryConditions,
} from 'als/building-block/utils/queryParams';
import { isEmpty } from 'lodash';
import { Model } from 'mongoose';

import { IDocumentTypeService } from '../interfaces/document-type.service';
import {
  DocumentTypeModel as documentTypeModel,
  DocumentTypeModelDocument,
} from '../model/document-type.model';

@Injectable()
export class DocumentTypeManagerService
  extends AutomapperProfile
  implements IDocumentTypeService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(documentTypeModel.name)
    readonly DocumentTypeModel: Model<DocumentTypeModelDocument>,
  ) {
    super(mapper);
  }
  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        documentTypeModel,
        DocumentTypeResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
      );
      createMap(
        mapper,
        documentTypeModel,
        DocumentTypePartialResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
      );
    };
  }

  async create(createPayloadDto: DocumentTypeCreator) {
    try {
      const res = await this.DocumentTypeModel.create(createPayloadDto);
      return this.mapper.map(res, documentTypeModel, DocumentTypeResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getById(id: string) {
    try {
      const res = await this.DocumentTypeModel.findById(id);

      return this.mapper.map(res, documentTypeModel, DocumentTypeResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getByUuid(uuid: string) {
    try {
      const res = await this.DocumentTypeModel.findOne({ uuid });

      return this.mapper.map(res, documentTypeModel, DocumentTypeResponseDto);
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

      const totalCount = await this.DocumentTypeModel.find(
        queryConditions,
      ).count();

      const skip = pagination.limit * (pagination.page - 1);
      const res = await this.DocumentTypeModel.find(queryConditions)
        .skip(skip)
        .limit(pagination.limit)
        .sort({ _id: -1 });

      const page = pagination.page;
      const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
      const data = this.mapper.mapArray(
        res,
        documentTypeModel,
        DocumentTypePartialResponseDto,
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
      await this.DocumentTypeModel.deleteMany();
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
