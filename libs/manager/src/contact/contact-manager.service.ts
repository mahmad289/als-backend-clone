import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ContactCreator } from 'als/building-block/RequestableDto/Contact/ContactCreator';
import { ContactUpdate } from 'als/building-block/RequestableDto/Contact/ContactUpdate';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { ContactCompleteResponseDto } from 'als/building-block/TransferableDto/Contact/Contact';
import { ContactPartialResponseDto } from 'als/building-block/TransferableDto/Contact/ContactPartial';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  createQueryparams,
  getQueryConditions,
} from 'als/building-block/utils/queryParams';
import { isEmpty } from 'lodash';
import { Model } from 'mongoose';

import {
  ContactModel as contactModel,
  ContactModelDocument,
} from './contact.model';
import { IContactService } from './contact.service';

@Injectable()
export class ContactManagerService
  extends AutomapperProfile
  implements IContactService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(contactModel.name)
    readonly ContactModel: Model<ContactModelDocument>,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        contactModel,
        ContactCompleteResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
      );
      createMap(
        mapper,
        contactModel,
        ContactPartialResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
      );
    };
  }

  async create(createPayloadDto: ContactCreator) {
    try {
      const res = await this.ContactModel.create(createPayloadDto);
      return this.mapper.map(res, contactModel, ContactCompleteResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getById(id: string) {
    try {
      const res = await this.ContactModel.findById(id);

      return this.mapper.map(res, contactModel, ContactCompleteResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async update(id: string, updatePayloadDto: ContactUpdate) {
    try {
      const res = await this.ContactModel.findOneAndUpdate(
        {
          _id: id,
        },
        updatePayloadDto,
        { new: true, overwrite: false },
      );

      return this.mapper.map(res, contactModel, ContactCompleteResponseDto);
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
          ['first_name', 'last_name', 'email'],
        );

        pagination = paginationData;
        queryConditions.$or = getQueryConditions(conditions);
      }

      const totalCount = await this.ContactModel.find(queryConditions).count();
      const skip = pagination.limit * (pagination.page - 1);
      const res = await this.ContactModel.find(queryConditions)
        .skip(skip)
        .limit(pagination.limit)
        .sort({ _id: -1 });

      const page = pagination.page;
      const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
      const data = this.mapper.mapArray(
        res,
        contactModel,
        ContactPartialResponseDto,
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
  async find(conditions: Partial<Record<string, unknown>>) {
    try {
      const res = await this.ContactModel.find(conditions);

      return this.mapper.mapArray(
        res,
        contactModel,
        ContactCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async deleteAll() {
    try {
      await this.ContactModel.deleteMany();
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
