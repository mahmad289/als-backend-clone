import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentUploadCreator } from 'als/building-block/RequestableDto/DocumentUpload/DocumentUploadCreator';
import { DocumentUploadUpdate } from 'als/building-block/RequestableDto/DocumentUpload/DocumentUploadUpdate';
import { InboxSearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import {
  DocumentUploadCompleteResponseDto,
  DocumentUploadDetailResponseDto,
} from 'als/building-block/TransferableDto/DocumentUpload/DocumentUpload';
import { DocumentUploadPartialResponseDto } from 'als/building-block/TransferableDto/DocumentUpload/DocumentUploadPartial';
import { ServiceError } from 'als/building-block/utils/apiError';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import { IGetAllResponse } from 'als/building-block/utils/genericInterface';
import {
  createQueryparams,
  getQueryConditions,
} from 'als/building-block/utils/queryParams';
import { ObjectID } from 'bson';
import { isEmpty } from 'lodash';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

import {
  ComplianceItems,
  ComplianceModel,
  TemplateItems,
} from '../compliance/model/compliance.model';
import { TemplateModel } from '../requirement-group/model/template.model';
import { VendorModel } from '../vendor/vendor.model';
import {
  DocumentUploadModel as documentUploadModel,
  DocumentUploadModelDocument,
} from './document-upload.model';
import { IDocumentUploadService } from './document-upload.service';

@Injectable()
export class DocumentUploadManagerService
  extends AutomapperProfile
  implements IDocumentUploadService
{
  constructor(
    @InjectModel(TemplateModel.name)
    readonly template: Model<TemplateModel>,
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(documentUploadModel.name)
    readonly DocumentUploadModel: Model<DocumentUploadModelDocument>,
    @InjectModel(ComplianceModel.name)
    readonly ComplianceModel: Model<ComplianceModel>,
    @InjectModel(VendorModel.name)
    readonly VendorModel: Model<VendorModel>,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        documentUploadModel,
        DocumentUploadCompleteResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.compliance,
          mapFrom(s => s.compliance_id),
        ),
        forMember(
          d => d.created_at,
          mapFrom(s => s._id.getTimestamp()),
        ),
        forMember(
          d => d.item_id,
          mapFrom(s => s.item_id),
        ),
        forMember(
          d => d.contact_id,
          mapFrom(s => s.contact_id),
        ),
      );
      createMap(
        mapper,
        documentUploadModel,
        DocumentUploadPartialResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.compliance,
          mapFrom(s => s.compliance_id),
        ),
        forMember(
          d => d.created_at,
          mapFrom(s => s._id.getTimestamp()),
        ),
        forMember(
          d => d.item_id,
          mapFrom(s => s.item_id),
        ),
        forMember(
          d => d.contact_id,
          mapFrom(s => s.contact_id),
        ),
        forMember(
          d => d.vendor,
          mapFrom(s => s.vendor),
        ),
      );
    };
  }
  async create(
    DocumentUploadPayloadDto: DocumentUploadCreator,
  ): Promise<DocumentUploadCompleteResponseDto> {
    try {
      const item_id_array: ObjectID[] = [];
      const compliance = await this.ComplianceModel.findOne({
        _id: DocumentUploadPayloadDto.compliance_id,
      });

      if (compliance && DocumentUploadPayloadDto.item_type === 'compliance') {
        const item_data = compliance.compliance_items.find(
          item =>
            item._id.toString() === DocumentUploadPayloadDto.item_id.toString(),
        );

        compliance.compliance_items?.forEach(item => {
          if (item.document_type_uuid === item_data?.document_type_uuid) {
            item_id_array.push(item._id);
          }
        });
      } else if (
        compliance &&
        DocumentUploadPayloadDto.item_type === 'template'
      ) {
        const item_data = compliance.template_items.find(
          item =>
            item._id.toString() === DocumentUploadPayloadDto.item_id.toString(),
        );

        compliance.template_items?.forEach(item => {
          if (item.document_type_uuid === item_data?.document_type_uuid) {
            item_id_array.push(item._id);
          }
        });
      }

      const notication = await this.DocumentUploadModel.findOneAndUpdate(
        {
          compliance_id: DocumentUploadPayloadDto.compliance_id,
          item_id: { $in: item_id_array },
          item_type: DocumentUploadPayloadDto.item_type,
          isDeleted: false,
        },
        {
          $set: { is_read: false },
        },
      );

      if (notication) {
        return this.mapper.map(
          notication,
          documentUploadModel,
          DocumentUploadCompleteResponseDto,
        );
      } else {
        const res = await this.DocumentUploadModel.create(
          DocumentUploadPayloadDto,
        );

        return this.mapper.map(
          res,
          documentUploadModel,
          DocumentUploadCompleteResponseDto,
        );
      }
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getById(id: string): Promise<DocumentUploadDetailResponseDto> {
    try {
      await this.DocumentUploadModel.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          is_read: true,
        },
      );
      const res = await this.DocumentUploadModel.aggregate([
        {
          $match: {
            _id: new ObjectID(id),
          },
        },
        {
          $lookup: {
            from: 'compliancemodels',
            localField: 'compliance_id',
            foreignField: '_id',
            as: 'compliance_id',
          },
        },
        {
          $unwind: {
            path: '$compliance_id',
          },
        },
        {
          $lookup: {
            from: 'contactmodels',
            localField: 'contact_id',
            foreignField: '_id',
            as: 'contact_id',
          },
        },
        {
          $unwind: {
            path: '$contact_id',
          },
        },
        // For compliance items
        {
          $lookup: {
            from: 'masterrequirementmodels',
            let: {
              letId: '$compliance_id.compliance_items.master_requirement_id',
            },
            pipeline: [{ $match: { $expr: { $in: ['$_id', '$$letId'] } } }],
            as: 'lookupRelations',
          },
        },
        {
          $addFields: {
            'compliance_id.compliance_items': {
              $map: {
                input: '$compliance_id.compliance_items',
                as: 'rel',
                in: {
                  $mergeObjects: [
                    '$$rel',
                    {
                      master_requirement: {
                        $arrayElemAt: [
                          '$lookupRelations',
                          {
                            $indexOfArray: [
                              '$lookupRelations._id',
                              '$$rel.master_requirement_id',
                            ],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        // For template items
        {
          $lookup: {
            from: 'masterrequirementmodels',
            let: {
              letId: '$compliance_id.template_items.master_requirement_id',
            },
            pipeline: [{ $match: { $expr: { $in: ['$_id', '$$letId'] } } }],
            as: 'lookupRelations2',
          },
        },
        {
          $addFields: {
            'compliance_id.template_items': {
              $map: {
                input: '$compliance_id.template_items',
                as: 'rel',
                in: {
                  $mergeObjects: [
                    '$$rel',
                    {
                      master_requirement: {
                        $arrayElemAt: [
                          '$lookupRelations2',
                          {
                            $indexOfArray: [
                              '$lookupRelations2._id',
                              '$$rel.master_requirement_id',
                            ],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        // unset unused fields
        {
          $project: {
            lookupRelations: 0,
            lookupRelations2: 0,
          },
        },
      ]);

      if (!res || res.length < 1) {
        throw new ServiceError('Document not found', HttpStatus.NOT_FOUND);
      }

      const item = res[0].compliance_id.compliance_items.find(
        (el: ComplianceItems) =>
          el._id.toString() === res[0].item_id.toString(),
      );

      if (item) {
        res[0].compliance_id.compliance_items =
          res[0].compliance_id.compliance_items.filter(
            (el: ComplianceItems) =>
              el.document_type_uuid === item.document_type_uuid,
          );
      } else {
        res[0].compliance_id.compliance_items = [];
      }

      const item1 = res[0].compliance_id.template_items.find(
        (el: TemplateItems) => el._id.toString() === res[0].item_id.toString(),
      );

      if (item1) {
        res[0].compliance_id.template_items =
          res[0].compliance_id.template_items.filter(
            (el: TemplateItems) =>
              el.document_type_uuid === item1.document_type_uuid,
          );
      } else {
        res[0].compliance_id.template_items = [];
      }

      const vendor = await this.VendorModel.findOne({
        _id: res[0].compliance_id.vendor_id,
      }).lean();

      for (const template_item of res[0].compliance_id.template_items) {
        const template = await this.template.findById(
          template_item.template_id,
        );

        if (template) {
          template_item.template_name = template.template_name;
          if (template.rules.length > 0) {
            for (const rule of template?.rules) {
              if (
                rule._id.toString() ===
                template_item.template_rule_id.toString()
              ) {
                template_item.rule_detail = rule;
              }
            }
          }
        }
      }

      // Create a new object with the additional `vendor` property
      const mappedResponse = {
        ...this.mapper.map(
          res[0],
          documentUploadModel,
          DocumentUploadCompleteResponseDto,
        ),
        vendor: vendor,
      };

      return mappedResponse;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async update(
    id: string,
    updatePayloadDto: DocumentUploadUpdate,
  ): Promise<DocumentUploadCompleteResponseDto> {
    try {
      const res = await this.DocumentUploadModel.findOneAndUpdate(
        {
          _id: id,
        },
        updatePayloadDto,
        { new: true, overwrite: false },
      );

      return this.mapper.map(
        res,
        documentUploadModel,
        DocumentUploadCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getAll(
    query?: InboxSearchableDto,
  ): Promise<IGetAllResponse<DocumentUploadPartialResponseDto>> {
    try {
      const queryConditions: { $or?: Record<string, unknown>[] } = {};
      let pagination: { page: number; limit: number } = {
        page: 1,
        limit: 0,
      };

      const dropdownConditions: Record<string, unknown> = {};
      const searchQuery: string[] = [];
      const queryItems: Omit<
        InboxSearchableDto,
        'limit' | 'page' | 'keyword' | 'is_read' | 'start_date' | 'end_date'
      > = {
        client_id: query?.client_id || null,
        project_id: query?.project_id || null,
        vendor_id: query?.vendor_id || null,
      };

      Object.keys(queryItems).forEach(key => {
        const fieldName = key.split('_')[0];
        queryItems[key as keyof typeof queryItems]
          ? (dropdownConditions[key] =
              queryItems[key as keyof typeof queryItems])
          : searchQuery.push(`${fieldName}_name`);
      });

      Object.keys(queryItems).forEach(
        key =>
          queryItems[key as keyof typeof queryItems] === null &&
          delete queryItems[key as keyof typeof queryItems],
      );

      if (!isEmpty(query)) {
        const { conditions, pagination: paginationData } = createQueryparams(
          query,
          searchQuery,
        );

        pagination = paginationData;
        queryConditions.$or = getQueryConditions(conditions);
      }

      const compliances = await this.ComplianceModel.find({
        $and: [
          queryConditions,
          {
            ...dropdownConditions,
            status: true,
          },
        ],
      }).select('_id');

      const compliancesIds = compliances.map(compliance => compliance._id);
      //query object for Document upload model
      const documentQuery: Record<string, any> = {
        $and: [],
      };

      documentQuery.$and.push({ compliance_id: { $in: compliancesIds } });

      //check if is_read exist then add it in the query
      if (query?.is_read) {
        documentQuery.$and.push({ is_read: JSON.parse(query.is_read) });
      }

      //check for date range conditions
      if (query?.start_date && query?.end_date) {
        const startDate = new Date(query.start_date).getTime();
        const endDate = new Date(query.end_date).getTime();

        documentQuery.$and.push({
          _id: {
            $gte: new ObjectId(
              Math.floor(startDate / 1000).toString(16) + '0000000000000000',
            ),
            $lt: new ObjectId(
              Math.floor(endDate / 1000).toString(16) + '0000000000000000',
            ),
          },
        });
      }

      // remove the soft deleted elements
      documentQuery.$and.push({
        isDeleted: false,
      });

      const totalCount = await this.DocumentUploadModel.find(
        documentQuery,
      ).count();

      const skip = pagination.limit * (pagination.page - 1);
      const res = await this.DocumentUploadModel.aggregate([
        {
          $match: documentQuery,
        },
        {
          $lookup: {
            from: 'compliancemodels',
            localField: 'compliance_id',
            foreignField: '_id',
            as: 'compliance_id',
          },
        },
        {
          $lookup: {
            from: 'vendormodels',
            localField: 'compliance_id.vendor_id',
            foreignField: '_id',
            as: 'vendor',
          },
        },
        {
          $lookup: {
            from: 'documenttypemodels',
            localField: 'document_type_uuid',
            foreignField: 'uuid',
            as: 'document_type_data',
          },
        },
        {
          $unwind: {
            path: '$compliance_id',
          },
        },
        {
          $unwind: {
            path: '$vendor',
          },
        },
        {
          $unwind: {
            path: '$document_type_data',
          },
        },
        {
          $addFields: {
            document_type_name: '$document_type_data.name',
          },
        },
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
      ]);

      const page = pagination.page;
      const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
      const data = this.mapper.mapArray(
        res,
        documentUploadModel,
        DocumentUploadPartialResponseDto,
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

  async unreadCount(): Promise<number> {
    try {
      //get all compliance ids with status true
      const compliances = await this.ComplianceModel.find({
        status: true,
      });

      const compliancesIds = compliances.map(compliance => compliance._id);

      // get all document upload ids with is_read false and compliance ids from above

      const unreadCount = await this.DocumentUploadModel.find({
        compliance_id: { $in: compliancesIds },
        is_read: false,
      }).count();

      return unreadCount;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async deleteAll() {
    try {
      await this.DocumentUploadModel.deleteMany();
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
