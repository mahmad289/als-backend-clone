import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { UserCreator } from 'als/building-block/RequestableDto/User/UserCreator';
import { UserPasswordUpdate } from 'als/building-block/RequestableDto/User/UserPasswordUpdate';
import { UserUpdate } from 'als/building-block/RequestableDto/User/UserUpdate';
import {
  UserCompleteResponseDto,
  UserCompleteResponsewithPasswordDto,
} from 'als/building-block/TransferableDto/User/User';
import { UserPartialResponseDto } from 'als/building-block/TransferableDto/User/UserPartial';
import { ServiceError } from 'als/building-block/utils/apiError';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  createQueryparams,
  getQueryConditions,
} from 'als/building-block/utils/queryParams';
import { hash } from 'bcryptjs';
import * as bcrypt from 'bcryptjs';
import { isEmpty } from 'lodash';
import { Model } from 'mongoose';

import { UserModel as userModel, UserModelDocument } from './user.model';
import { IUserService } from './user.service';

@Injectable()
export class UserManagerService
  extends AutomapperProfile
  implements IUserService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(userModel.name)
    readonly UserModel: Model<UserModelDocument>,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        userModel,
        UserCompleteResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
      );
      createMap(
        mapper,
        userModel,
        UserPartialResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
      );
      createMap(
        mapper,
        userModel,
        UserCompleteResponsewithPasswordDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.password,
          mapFrom(s => s.password),
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
          ['first_name', 'last_name', 'username'],
        );

        pagination = paginationData;
        queryConditions.$or = getQueryConditions(conditions);
      }

      const totalCount = await this.UserModel.find({
        ...queryConditions,
        is_deleted: false,
      }).count();

      const skip = pagination.limit * (pagination.page - 1);
      const res = await this.UserModel.find({
        ...queryConditions,
        is_deleted: false,
      })
        .skip(skip)
        .limit(pagination.limit)
        .sort({ _id: -1 });

      const page = pagination.page;
      const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
      const data = this.mapper.mapArray(res, userModel, UserPartialResponseDto);

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
  async create(alsUserPayload: UserCreator) {
    try {
      const hashPassword = await hash(alsUserPayload.password, 10);
      alsUserPayload.password = hashPassword;
      const res = await this.UserModel.create(alsUserPayload);
      return this.mapper.map(res, userModel, UserCompleteResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async getById(id: string) {
    try {
      const res = await this.UserModel.findOne({
        _id: id,
        is_deleted: false,
      });

      return this.mapper.map(res, userModel, UserCompleteResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async update(id: string, updatePayloadDto: UserUpdate) {
    try {
      const res = await this.UserModel.findOneAndUpdate(
        {
          _id: id,
        },
        updatePayloadDto,
        { new: true, overwrite: false },
      );

      return this.mapper.map(res, userModel, UserCompleteResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async updatePassword(id: string, updatePayloadDto: UserPasswordUpdate) {
    try {
      const user = await this.userWithPassword({
        _id: id,
      });

      if (
        user &&
        (await bcrypt.compare(updatePayloadDto.password, user.password))
      ) {
        const newhashPassword = await hash(updatePayloadDto.newPassword, 10);
        await this.UserModel.findOneAndUpdate(
          {
            _id: id,
          },
          { password: newhashPassword },
          { new: true, overwrite: false },
        );

        return { message: 'Password Updated Successfully' };
      }

      throw new ServiceError(
        'Invalid Password or User',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async findOne(conditions: Partial<Record<string, unknown>>) {
    try {
      const res = await this.UserModel.findOne({
        ...conditions,
        is_deleted: false,
      });

      return this.mapper.map(res, userModel, UserCompleteResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async deleteAll() {
    try {
      await this.UserModel.deleteMany();
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async userWithPassword(conditions: Partial<Record<string, unknown>>) {
    try {
      const res = await this.UserModel.findOne(conditions);

      return this.mapper.map(
        res,
        userModel,
        UserCompleteResponsewithPasswordDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async dropDatabase() {
    try {
      await this.UserModel.db.dropDatabase();
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async deleteOne(id: string) {
    try {
      const res = await this.UserModel.findOneAndUpdate(
        {
          _id: id,
          is_deleted: false,
        },
        {
          is_deleted: true,
        },
        { new: true, overwrite: false },
      );

      if (!res) {
        throw new ServiceError('User not found', HttpStatus.NOT_FOUND);
      }

      return HttpStatus.NO_CONTENT;
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
