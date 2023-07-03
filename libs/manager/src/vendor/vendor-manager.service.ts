import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { InjectQueue } from '@nestjs/bullmq';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  NAME_UPDATE_QUEUE,
  PROJECT_ASSIGNEE_QUEUE,
} from 'als/building-block/constants';
import { VendorDetailSearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { VendorCreator } from 'als/building-block/RequestableDto/Vendor/VendorCreator';
import {
  VendorContactUpdate,
  VendorUpdate,
} from 'als/building-block/RequestableDto/Vendor/VendorUpdate';
import { VendorCompleteResponseDto } from 'als/building-block/TransferableDto/Vendor/Vendor';
import { VendorPartialResponseDto } from 'als/building-block/TransferableDto/Vendor/VendorPartial';
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

import { AssignProjectModel } from '../assign-project/assign-project.model';
import {
  ComplianceModel,
  ComplianceModelDocument,
} from '../compliance/model/compliance.model';
import {
  ProjectModel as projectModel,
  ProjectModelDocument,
} from '../project/project.model';
import {
  VendorModel as vendorModel,
  VendorModelDocument,
} from './vendor.model';
import { IVendorService } from './vendor.service';

@Injectable()
export class VendorManagerService
  extends AutomapperProfile
  implements IVendorService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(vendorModel.name)
    readonly VendorModel: Model<VendorModelDocument>,
    @InjectModel(projectModel.name)
    readonly ProjectModel: Model<ProjectModelDocument>,
    @InjectModel(ComplianceModel.name)
    readonly ComplianceModel: Model<ComplianceModelDocument>,
    @InjectQueue(PROJECT_ASSIGNEE_QUEUE)
    private readonly projectAssigneeQueue: Queue,
    @InjectModel(AssignProjectModel.name)
    readonly AssignProjectModel: Model<AssignProjectModel>,
    @InjectQueue(NAME_UPDATE_QUEUE)
    private readonly nameUpdateConsumer: Queue,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        vendorModel,
        VendorPartialResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.tags,
          mapFrom(s => s.tags),
        ),
      );
      createMap(
        mapper,
        vendorModel,
        VendorCompleteResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.contacts,
          mapFrom(s => s.contacts_id),
        ),
        forMember(
          d => d.tags,
          mapFrom(s => s.tags),
        ),
      );
    };
  }

  async create(createPayloadDto: VendorCreator) {
    try {
      const res = await this.VendorModel.create(createPayloadDto);
      return this.mapper.map(res, vendorModel, VendorCompleteResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getById(id: string) {
    try {
      const res = await this.VendorModel.aggregate([
        {
          $match: { _id: new ObjectId(id) },
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
            from: 'tagmodels',
            localField: 'tags',
            foreignField: '_id',
            as: 'tags',
          },
        },
      ]);

      return this.mapper.map(res[0], vendorModel, VendorCompleteResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async update(id: string, updatePayloadDto: VendorUpdate) {
    try {
      const oldVendor = await this.VendorModel.findById(id);
      if (oldVendor?.username !== updatePayloadDto.username) {
        const result = await this.VendorModel.find({
          _id: { $ne: id },
          username: updatePayloadDto.username,
        });

        if (result && result.length > 0) {
          throw new ServiceError(
            'Username already exists',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const res = await this.VendorModel.findOneAndUpdate(
        {
          _id: id,
        },
        updatePayloadDto,
        { new: true, overwrite: false },
      );

      if (oldVendor?.vendor_name !== res?.vendor_name) {
        const nameUpdateData = {
          vendor_id: new ObjectId(id),
          vendor_name: res?.vendor_name,
          type: 'vendor',
        };

        await this.nameUpdateConsumer.add(NAME_UPDATE_QUEUE, {
          ...nameUpdateData,
        });
      }

      return this.mapper.map(res, vendorModel, VendorCompleteResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async assignContacts(
    id: string,
    contactUpdatePayloadDto: VendorContactUpdate,
  ) {
    try {
      const alreadExists = await this.VendorModel.findOne({
        _id: new ObjectId(id),
        contacts_id: new ObjectId(contactUpdatePayloadDto.contact_id),
      });

      if (alreadExists) {
        const res = await this.VendorModel.findOneAndUpdate(
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

        await this.AssignProjectModel.deleteMany({
          vendor_id: new ObjectId(id),
          contact_id: new ObjectId(contactUpdatePayloadDto.contact_id),
        });

        return this.mapper.map(res, vendorModel, VendorCompleteResponseDto);
      }

      const res = await this.VendorModel.findOneAndUpdate(
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

      // get all compliances for this vendor
      const compliances = await this.ComplianceModel.find({
        vendor_id: new ObjectId(id),
        status: 'true',
      });

      for (const compliance of compliances) {
        const com_object = {
          _id: compliance._id,
          user_id: compliance.user_id,
          vendor_id: compliance.vendor_id,
          vendor_name: compliance.vendor_name,
          project_id: compliance.project_id,
          project_name: compliance.project_name,
          client_id: compliance.client_id,
          client_name: compliance.client_name,
          requirement_group_id: compliance.requirement_group_id,
        };

        await this.projectAssigneeQueue.add(PROJECT_ASSIGNEE_QUEUE, {
          ...com_object,
        });
      }

      return this.mapper.map(res, vendorModel, VendorCompleteResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getAll(query?: VendorDetailSearchableDto) {
    try {
      const queryConditions: {
        _id?: { $in: ObjectId[] };
        $or?: Record<string, unknown>[];
      } = {};

      let pagination: { page: number; limit: number } = {
        page: 1,
        limit: 0,
      };

      if (!isEmpty(query)) {
        const { conditions, pagination: paginationData } = createQueryparams(
          query,
          [
            'vendor_name',
            'address_1',
            'address_2',
            'city',
            'scope_of_work',
            'zip',
          ],
        );

        pagination = paginationData;
        queryConditions.$or = getQueryConditions(conditions);
      }

      if (query?.keyword) {
        const numberSearch = Number(query.keyword.replace(/[\s,]+/g, ''));
        if (numberSearch && queryConditions.$or) {
          queryConditions.$or.push({
            direct_dial: { $eq: numberSearch },
          });
        }
      }

      const totalCount = await this.VendorModel.find(queryConditions).count();
      const skip = pagination.limit * (pagination.page - 1);
      // get filter vendor Ids on the base of query
      if (query?.client_id || query?.project_id || query?.vendor_id) {
        const vendorIds = await this.getVendorIds(query);
        queryConditions['_id'] = { $in: vendorIds };
      }

      const res: any = await this.VendorModel.find(queryConditions)
        .skip(skip)
        .limit(pagination.limit)
        .sort({ _id: -1 })
        .lean();

      if (res && res.length > 0) {
        for (const v of res) {
          v['project_count'] = await this.ProjectModel.find({
            'assigned_vendor.vendor_id': v._id,
          }).count();
        }
      }

      const page = pagination.page;
      const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
      const data = this.mapper.mapArray(
        res,
        vendorModel,
        VendorPartialResponseDto,
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

  async getVendorIds(query?: VendorDetailSearchableDto) {
    if (query) {
      const vendorIds: ObjectId[] = [];
      const queryConditions: Record<string, any> = {};

      if (query.client_id) {
        queryConditions['client.client_id'] = new ObjectId(query.client_id);
      }

      if (query.project_id) {
        queryConditions['_id'] = new ObjectId(query.project_id);
      }

      if (query.client_id || query.project_id) {
        const projects = await this.ProjectModel.find(queryConditions);
        if (projects.length > 0) {
          projects.forEach(project => {
            if (project.assigned_vendor && project.assigned_vendor.length > 0) {
              project.assigned_vendor.forEach(vendor => {
                if (query.vendor_id) {
                  if (query.vendor_id === vendor.vendor_id.toString()) {
                    vendorIds.push(vendor.vendor_id);
                  }
                } else {
                  vendorIds.push(vendor.vendor_id);
                }
              });
            }
          });
        }
      } else if (query.vendor_id) {
        vendorIds.push(new ObjectId(query.vendor_id));
      }

      return vendorIds;
    }

    return [];
  }

  async deleteAll() {
    try {
      await this.VendorModel.deleteMany();
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async dropDatabase() {
    try {
      await this.VendorModel.db.dropDatabase();
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
