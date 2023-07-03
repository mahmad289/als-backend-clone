import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { InjectQueue } from '@nestjs/bullmq';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { InjectModel } from '@nestjs/mongoose';
import { NAME_UPDATE_QUEUE } from 'als/building-block/constants';
import { ClientCreator } from 'als/building-block/RequestableDto/Client/ClientCreator';
import {
  ClientContactUpdate,
  ClientUpdate,
} from 'als/building-block/RequestableDto/Client/ClientUpdate';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { ClientCompleteResponseDto } from 'als/building-block/TransferableDto/Client/Client';
import { ClientPartialResponseDto } from 'als/building-block/TransferableDto/Client/ClientPartial';
import { ServiceError } from 'als/building-block/utils/apiError';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  createQueryparams,
  getQueryConditions,
} from 'als/building-block/utils/queryParams';
import { Queue } from 'bullmq';
import { isEmpty } from 'lodash';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

import {
  ClientModel as clientModel,
  ClientModelDocument,
} from './client.model';
import { IClientService } from './client.service';

@Injectable()
export class ClientManagerService
  extends AutomapperProfile
  implements IClientService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(clientModel.name)
    readonly ClientModel: Model<ClientModelDocument>,
    @InjectQueue(NAME_UPDATE_QUEUE)
    private readonly nameUpdateConsumer: Queue,
  ) {
    super(mapper);
  }

  logger = new Logger();

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        clientModel,
        ClientCompleteResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.contacts_id,
          mapFrom(s => s.contacts_id),
        ),
        forMember(
          d => d.tags,
          mapFrom(s => s.tags),
        ),
        forMember(
          d => d.company_manager,
          mapFrom(s => s.company_manager),
        ),
      );
      createMap(
        mapper,
        clientModel,
        ClientPartialResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.contacts_id,
          mapFrom(s => s.contacts_id),
        ),
        forMember(
          d => d.tags,
          mapFrom(s => s.tags),
        ),
        forMember(
          d => d.company_manager,
          mapFrom(s => s.company_manager),
        ),
      );
    };
  }

  async create(createPayloadDto: ClientCreator) {
    try {
      const res = await this.ClientModel.create(createPayloadDto);
      return this.mapper.map(res, clientModel, ClientCompleteResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getById(id: string) {
    try {
      const res = await this.ClientModel.aggregate([
        {
          $match: { _id: new ObjectId(id) },
        },
        {
          $lookup: {
            from: 'tagmodels',
            localField: 'tags',
            foreignField: '_id',
            as: 'tags',
          },
        },
        {
          $lookup: {
            from: 'contactmodels',
            localField: 'contacts_id',
            foreignField: '_id',
            as: 'contacts_id',
          },
        },
        {
          $lookup: {
            from: 'usermodels',
            localField: 'company_manager',
            foreignField: '_id',
            as: 'company_manager',
          },
        },
        {
          $unwind: {
            path: '$company_manager',
          },
        },
      ]);

      return this.mapper.map(res[0], clientModel, ClientCompleteResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async update(id: string, updatePayloadDto: ClientUpdate) {
    try {
      const oldClient = await this.ClientModel.findById(id);
      if (oldClient?.name !== updatePayloadDto.name) {
        const result = await this.ClientModel.find({
          _id: { $ne: id },
          name: updatePayloadDto.name,
        });

        if (result && result.length > 0) {
          throw new ServiceError(
            'Client Name already exists',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const res = await this.ClientModel.findOneAndUpdate(
        {
          _id: id,
        },
        updatePayloadDto,
        { new: true, overwrite: false },
      );

      if (oldClient?.name !== res?.name) {
        const nameUpdateData = {
          client_id: new ObjectId(id),
          client_name: res?.name,
          type: 'client',
        };

        await this.nameUpdateConsumer.add(NAME_UPDATE_QUEUE, {
          ...nameUpdateData,
        });
      }

      return this.mapper.map(res, clientModel, ClientCompleteResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async assignContacts(
    id: string,
    contactUpdatePayloadDto: ClientContactUpdate,
  ) {
    try {
      const alreadExists = await this.ClientModel.findOne({
        _id: new ObjectId(id),
        contacts_id: new ObjectId(contactUpdatePayloadDto.contact_id),
      });

      if (alreadExists) {
        const res = await this.ClientModel.findOneAndUpdate(
          {
            _id: id,
          },
          {
            $pull: {
              contacts_id: contactUpdatePayloadDto.contact_id,
            },
          },
          { new: true, overwrite: false },
        );

        if (!res) {
          throw new ServiceError(
            'Failed To Update Contact',
            HttpStatus.BAD_REQUEST,
          );
        }

        return this.mapper.map(res, clientModel, ClientCompleteResponseDto);
      }

      const res = await this.ClientModel.findOneAndUpdate(
        {
          _id: new ObjectId(id),
        },
        {
          $push: {
            contacts_id: [contactUpdatePayloadDto.contact_id],
          },
        },
        { new: true, overwrite: false },
      );

      if (!res) {
        throw new ServiceError(
          'Failed To Update Contact',
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.mapper.map(res, clientModel, ClientCompleteResponseDto);
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
          [
            'name',
            'client_type',
            'address_1',
            'address_2',
            'city',
            'state',
            'zip',
          ],
        );

        pagination = paginationData;
        queryConditions.$or = getQueryConditions(conditions);
      }

      const totalCount: number = await this.ClientModel.find(
        queryConditions,
      ).count();

      const skip: number = pagination.limit * (pagination.page - 1);
      const res = await this.ClientModel.aggregate([
        { $match: queryConditions },
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
        {
          $lookup: {
            from: 'projectmodels',
            localField: '_id',
            foreignField: 'client.client_id',
            as: 'project',
          },
        },
        {
          $addFields: {
            total_projects: { $size: '$project' },
          },
        },
        {
          $project: {
            project: 0,
          },
        },
      ]);

      const page = pagination.page;
      const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
      const data = this.mapper.mapArray(
        res,
        clientModel,
        ClientPartialResponseDto,
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
      await this.ClientModel.deleteMany();
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
