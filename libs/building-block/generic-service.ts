// src/service.ts
import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { Document, FilterQuery, Model } from 'mongoose';

import { SearchableDto } from './RequestableDto/searchable.dto';

/**
 * Abstract base service that other services can extend to provide base CRUD
 * functionality such as to create, find, update and delete data.
 */
@Injectable()
export abstract class GenericService<T extends Document> {
  private readonly modelName: string;

  /**
   * The constructor must receive the injected model from the child service in
   * order to provide all the proper base functionality.
   *
   * @param {Model} model - The injected model.
   */
  constructor(private readonly model: Model<T>) {
    // Services who extend this service already contain a property called

    for (const modelName of Object.keys(model.collection.conn.models)) {
      if (model.collection.conn.models[modelName] === this.model) {
        this.modelName = modelName;
        break;
      }
    }
  }

  createQueryparams(query: SearchableDto) {
    const conditions = [];
    const page = parseInt(query.page);
    const pagination = {
      limit: parseInt(query.limit ? query.limit : '0'),
      page: !page || page === 0 ? 1 : page,
    };

    if (query.keyword) {
      conditions.push({
        first_name: { $regex: query.keyword, $options: 'i' },
      });
      conditions.push({
        last_name: { $regex: query.keyword, $options: 'i' },
      });
    }

    return { pagination, conditions };
  }

  /**
   * Find one entry and return the result.
   *
   * @throws InternalServerErrorException
   */
  async findOne(
    conditions: Partial<Record<keyof T, unknown>>,
  ): Promise<T | null> {
    return await this.model.findOne(conditions as FilterQuery<T>);
  }

  async find(
    conditions: Partial<Record<keyof T, unknown>>,
  ): Promise<T[] | null> {
    return await this.model.find(conditions as FilterQuery<T>);
  }

  async getAll(query?: SearchableDto) {
    const queryConditions: { $or?: Record<string, unknown>[] } = {};
    const pagination: { page: number; limit: number } = {
      page: 1,
      limit: 0,
    };

    if (!isEmpty(query)) {
      const queryParams = this.createQueryparams(query);
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

    const totalCount = await this.model.find(queryConditions).count();
    const skip = pagination.limit * (pagination.page - 1);
    const data = await this.model
      .find(queryConditions)
      .skip(skip)
      .limit(pagination.limit);

    const page = pagination.page;
    const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;

    return {
      page,
      perPage: perPage ? perPage : totalCount,
      total: totalCount,
      data,
    };
  }

  async create<T>(createPayloadDto: T) {
    return await this.model.create(createPayloadDto);
  }

  async getById(id: string) {
    return await this.model.findById(id);
  }

  async update<T>(
    id: string,
    updatePayloadDto: Partial<Record<keyof T, unknown>>,
  ) {
    return await this.model.findOneAndUpdate(
      {
        _id: id,
      },
      updatePayloadDto,
      { new: true, overwrite: false },
    );
  }

  // More methods here such as: create, update and delete.
}
