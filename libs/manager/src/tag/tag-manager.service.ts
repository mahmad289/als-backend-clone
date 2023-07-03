import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TagCreator,
  TagUpdate,
} from 'als/building-block/RequestableDto/Tag/TagCreator';
import { TagCompleteResponseDto } from 'als/building-block/TransferableDto/Tag/Tag';
import { TagPartialResponseDto } from 'als/building-block/TransferableDto/Tag/TagPartial';
import { ServiceError } from 'als/building-block/utils/apiError';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import { buildTree, findDescendants } from 'als/building-block/utils/helper';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

import { VendorModel } from '../vendor/vendor.model';
import { TagModel, TagModelDocument } from './tag.model';
import { ITagService } from './tag.service';

@Injectable()
export class TagManagerService
  extends AutomapperProfile
  implements ITagService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(TagModel.name)
    readonly tagModel: Model<TagModelDocument>,
    @InjectModel(VendorModel.name)
    readonly VendorModel: Model<VendorModel>,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        TagModel,
        TagCompleteResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.children,
          mapFrom(s => s.children),
        ),
        forMember(
          d => d.parent,
          mapFrom(s => s.parent),
        ),
      );
      createMap(
        mapper,
        TagModel,
        TagPartialResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.children,
          mapFrom(s => s.children),
        ),
        forMember(
          d => d.parent,
          mapFrom(s => s.parent),
        ),
      );
    };
  }

  async create(tagCreatorPayload: TagCreator) {
    try {
      if (tagCreatorPayload.parent) {
        const parent = await this.tagModel.findOne({
          _id: tagCreatorPayload.parent,
        });

        if (!parent) {
          Logger.warn(
            `PARENT TAG WITH ID ${tagCreatorPayload.parent} NOT FOUND`,
          );
          throw new ServiceError('Parent tag not found!', HttpStatus.NOT_FOUND);
        }
      }

      const existingTag = await this.tagModel.findOne({
        name: tagCreatorPayload.name,
        active: true,
      });

      if (existingTag) {
        Logger.warn(`TAG WITH NAME ${tagCreatorPayload.name} ALREADY EXISTS`);
        throw new ServiceError(
          'Tag name already exist.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (tagCreatorPayload.parent) {
        const result = await this.getAncestors(tagCreatorPayload.parent);
        if (result.length >= 5) {
          throw new ServiceError(
            "Can't create tag maximum level reached!",
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const res = await this.tagModel.create(tagCreatorPayload);

      Logger.warn('[-] TAG CREATED SUCCESSFULLY');
      return this.mapper.map(res, TagModel, TagCompleteResponseDto);
    } catch (error) {
      Logger.error(`Error while creating Tags, ${error.message}`);
      throw errorHandler(error);
    }
  }

  async update(id: string, editTagPayload: TagUpdate) {
    try {
      if (editTagPayload.parent) {
        // we find the above from that level
        const ancestors = await this.getAncestors(editTagPayload.parent);
        const data = await this.tagModel.find({
          active: true,
        });

        const descendants = findDescendants(data, new ObjectId(id));
        const level = ancestors.length + descendants.length + 1;

        if (level > 5) {
          throw new ServiceError(
            "Can't update tag maximum level reached!",
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const res = await this.tagModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: editTagPayload,
        },
        {
          new: true,
        },
      );

      return this.mapper.map(res, TagModel, TagCompleteResponseDto);
    } catch (error) {
      Logger.error(`Error while updating Tags, ${error.message}`);
      throw errorHandler(error);
    }
  }

  async getAll() {
    try {
      const response = await this.tagModel
        .find({ active: true })
        .sort({ _id: -1 })
        .lean();

      const tags = [];
      for (const tag of response) {
        const vendors = await this.VendorModel.find({ tags: tag._id }).lean();
        tags.push({ ...tag, vendor_count: vendors.length });
      }

      let res = JSON.parse(JSON.stringify(tags));
      res = buildTree(res);
      Logger.warn('[-] GET ALL TAGS');
      return this.mapper.mapArray(res, TagModel, TagCompleteResponseDto);
    } catch (error) {
      Logger.error(`Error while getting Tags, ${error.message}`);
      throw errorHandler(error);
    }
  }

  async delete(id: string) {
    try {
      const tag = await this.tagModel.findOne({ _id: id });

      if (!tag) {
        Logger.warn(`[-] TAG WITH ID ${id} NOT FOUND`);
        throw new ServiceError('Tag not found!', HttpStatus.BAD_REQUEST);
      }

      const data = await this.tagModel.find({
        active: true,
      });

      const tagsToDel = findDescendants(data, tag._id);

      tagsToDel.push(tag._id);

      await this.tagModel.updateMany(
        { _id: { $in: tagsToDel } },
        {
          $set: { active: false },
        },
        {
          new: true,
        },
      );

      Logger.warn('[-] TAG DELETED SUCCESSFULLY');
      return HttpStatus.NO_CONTENT;
    } catch (error) {
      Logger.error(`Error while deleting Tags, ${error.message}`);
      throw errorHandler(error);
    }
  }

  async getById(id: string) {
    try {
      const res = await this.tagModel.findById(id);
      Logger.warn('[-] GET TAG BY ID');
      return this.mapper.map(res, TagModel, TagCompleteResponseDto);
    } catch (error) {
      Logger.error(`Error while getting Tag, ${error.message}`);
      throw errorHandler(error);
    }
  }
  async deleteAll() {
    try {
      await this.tagModel.deleteMany();
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findAll() {
    try {
      const data = await this.tagModel.find({ active: true });
      return this.mapper.mapArray(data, TagModel, TagCompleteResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async getAncestors(_id: ObjectId) {
    const result: ObjectId[] = [];
    const document = await this.tagModel.findById(_id);
    if (document && document.parent) {
      result.push(document.parent);
      const ancestors = await this.getAncestors(document.parent);
      result.push(...ancestors);
    }

    return result;
  }
}
