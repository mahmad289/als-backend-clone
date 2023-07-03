import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GetComplianceDocumentListDto } from 'als/building-block/RequestableDto/Compliance/GetComplianceDocumentList';
import { DocumentNameUpdate } from 'als/building-block/RequestableDto/FileManager/DocumentNameUpdate';
import {
  FileSearchableDto,
  GetDocumentsSearchableDto,
} from 'als/building-block/RequestableDto/searchable.dto';
import { GetAllDocumentsResponseDto } from 'als/building-block/TransferableDto/FileManager/GetAllDocuments';
import { GetDocumentsCompleteResponseDto } from 'als/building-block/TransferableDto/FileManager/GetDocuments';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  createQueryparams,
  getQueryConditions,
} from 'als/building-block/utils/queryParams';
import { isEmpty } from 'lodash';
import { ObjectId } from 'mongodb';
import mongoose, { Model } from 'mongoose';

import {
  ComplianceModel,
  ComplianceModelDocument,
} from '../compliance/model/compliance.model';
import { IComplianceService } from '../compliance/services/compliance.service';
import {
  DocumentUploadModel as documentUploadModel,
  DocumentUploadModelDocument,
} from '../document-upload/document-upload.model';
import {
  DocumentTypeModel,
  DocumentTypeModelDocument,
} from './../requirement-group/model/document-type.model';
import { IFileManagerService } from './file-manager-interface';

@Injectable()
export class FileManagerService
  extends AutomapperProfile
  implements IFileManagerService
{
  constructor(
    @InjectModel(documentUploadModel.name)
    readonly documentUploadModel: Model<DocumentUploadModelDocument>,

    @InjectModel(DocumentTypeModel.name)
    readonly documentTypeModel: Model<DocumentTypeModelDocument>,

    @InjectModel(ComplianceModel.name)
    readonly complianceModel: Model<ComplianceModelDocument>,
    @InjectMapper() readonly mapper: Mapper,

    private readonly ComplianceService: IComplianceService,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        documentUploadModel,
        GetDocumentsCompleteResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.uploaded_at,
          mapFrom(s => s._id.getTimestamp()),
        ),
      );
      createMap(
        mapper,
        GetDocumentsCompleteResponseDto,
        GetAllDocumentsResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.document_type_uuid,
          mapFrom(s => s.document_type_uuid),
        ),
        forMember(
          d => d.count,
          mapFrom(s => s.count),
        ),
      );
    };
  }

  async getAll(query?: FileSearchableDto) {
    try {
      const queryConditions: { $or?: Record<string, unknown>[] } = {};
      let pagination: { page: number; limit: number } = {
        page: 1,
        limit: 0,
      };

      if (!isEmpty(query)) {
        const { conditions, pagination: paginationData } = createQueryparams(
          { limit: query.limit, page: query.page, keyword: query.keyword },
          ['_id'],
        );

        pagination = paginationData;
        if (query.doc_type_uuid && query.doc_type_uuid.length) {
          queryConditions.$or = [
            { document_type_uuid: query.doc_type_uuid.trim() },
          ];
        } else {
          queryConditions.$or = getQueryConditions(conditions);
        }
      }

      // count total unique document type
      const countByUUID = await this.getDocumentCountByUUID();
      // Set total count to [{ count: 0 }] if there is no document
      const totalCount = countByUUID.length <= 0 ? [{ count: 0 }] : countByUUID;
      const skip = pagination.limit * (pagination.page - 1);
      // we have to retrieve and group by and count document
      let res: any[];
      // check if the query params have the vendor or client id
      if (query?.client_id || query?.vendor_id) {
        const pipeline = this.groupByDocumentName(query);
        pipeline.push(
          { $match: queryConditions },
          {
            $sort: {
              _id: 1,
            },
          },
          {
            $skip: skip,
          },
          {
            $limit:
              pagination.limit == 0
                ? totalCount[0].count === 0
                  ? 10
                  : totalCount[0].count
                : pagination.limit,
          },
        );
        res = await this.documentUploadModel.aggregate(pipeline);
      } else {
        // we have build the complete list
        res = await this.documentTypeModel.aggregate([
          // 01: Group by on the name field
          {
            $group: {
              _id: '$name',
              document_type_uuid: { $first: '$uuid' },
            },
          },
          {
            $addFields: {
              count: 0,
            },
          },
          { $match: queryConditions },
          {
            $sort: {
              _id: 1,
            },
          },
          {
            $skip: skip,
          },
          {
            $limit:
              pagination.limit == 0
                ? totalCount[0].count === 0
                  ? 10
                  : totalCount[0].count
                : pagination.limit,
          },
        ]);
        const pipeline = this.groupByDocumentName(query);
        const uploadedDocument = await this.documentUploadModel.aggregate(
          pipeline,
        );

        if (uploadedDocument.length > 0) {
          res.forEach(el => {
            const matchingDoc = uploadedDocument.find(
              el2 => el?.document_type_uuid === el2?.document_type_uuid,
            );

            if (matchingDoc) {
              el.count = matchingDoc.count;
            }
          });
        }
      }

      const page = pagination.page;
      const perPage =
        pagination.limit !== 0 ? pagination.limit : totalCount[0].count;

      const data = this.mapper.mapArray(
        res,
        GetDocumentsCompleteResponseDto,
        GetAllDocumentsResponseDto,
      );

      return {
        page,
        perPage: perPage ? perPage : totalCount[0].count,
        total: totalCount[0].count,
        data,
      };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getDocuments(uuid: string, query?: GetDocumentsSearchableDto) {
    try {
      const queryConditions: { $or?: Record<string, unknown>[] } = {};
      let pagination: { page: number; limit: number } = {
        page: 1,
        limit: 0,
      };

      if (!isEmpty(query)) {
        const { conditions, pagination: paginationData } = createQueryparams(
          query,
          ['original_filename', 'project_name', 'company_name', 'address'],
        );

        pagination = paginationData;
        queryConditions.$or = getQueryConditions(conditions);
      }

      let totalCount = await this.documentUploadModel.aggregate([
        // 01: First match on the basis of uuid
        {
          $match: {
            document_type_uuid: uuid,
            isDeleted: false,
          },
        },
        //02: Look up: to get compliance data
        {
          $lookup: {
            from: 'compliancemodels',
            let: {
              compliance_id: '$compliance_id',
              vendor_id: query?.vendor_id
                ? new mongoose.Types.ObjectId(query?.vendor_id)
                : undefined,
              client_id: query?.client_id
                ? new mongoose.Types.ObjectId(query?.client_id)
                : undefined,
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$compliance_id'] },
                      {
                        $cond: {
                          if: { $ne: ['$$vendor_id', undefined] },
                          then: { $eq: ['$vendor_id', '$$vendor_id'] },
                          else: true,
                        },
                      },
                      {
                        $cond: {
                          if: { $ne: ['$$client_id', undefined] },
                          then: { $eq: ['$client_id', '$$client_id'] },
                          else: true,
                        },
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  compliance_items: 1,
                  template_items: 1,
                  vendor_id: 1,
                  vendor_name: 1,
                  project_id: 1,
                  project_name: 1,
                },
              },
            ],
            as: 'compliance_data',
          },
        },
        //03: unwind : its an array with single element
        {
          $unwind: {
            path: '$compliance_data',
          },
        },
        {
          $count: 'count',
        },
      ]);

      // if there is no document //
      totalCount = totalCount.length <= 0 ? [{ count: 0 }] : totalCount;

      const skip = pagination.limit * (pagination.page - 1);
      const res = await this.documentUploadModel.aggregate([
        // 01: First match on the basis of uuid
        {
          $match: {
            document_type_uuid: uuid,
            isDeleted: false,
          },
        },
        //02: Look up: to get compliance data
        {
          $lookup: {
            from: 'compliancemodels',
            let: {
              compliance_id: '$compliance_id',
              vendor_id: query?.vendor_id
                ? new mongoose.Types.ObjectId(query?.vendor_id)
                : undefined,
              client_id: query?.client_id
                ? new mongoose.Types.ObjectId(query?.client_id)
                : undefined,
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$compliance_id'] },
                      {
                        $cond: {
                          if: { $ne: ['$$vendor_id', undefined] },
                          then: { $eq: ['$vendor_id', '$$vendor_id'] },
                          else: true,
                        },
                      },
                      {
                        $cond: {
                          if: { $ne: ['$$client_id', undefined] },
                          then: { $eq: ['$client_id', '$$client_id'] },
                          else: true,
                        },
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  compliance_items: 1,
                  template_items: 1,
                  vendor_id: 1,
                  vendor_name: 1,
                  project_id: 1,
                  project_name: 1,
                },
              },
            ],
            as: 'compliance_data',
          },
        },

        //03: unwind : its an array with single element
        {
          $unwind: {
            path: '$compliance_data',
          },
        },
        //00: Get document type detail
        {
          $lookup: {
            from: 'documenttypemodels',
            localField: 'document_type_uuid',
            foreignField: 'uuid',
            as: 'document_type_detail',
          },
        },
        // 00: Unwind document type detail to get name
        {
          $unwind: {
            path: '$document_type_detail',
          },
        },
        //04: shift the fields on the root level
        {
          $addFields: {
            vendor_id: '$compliance_data.vendor_id',
            vendor_name: '$compliance_data.vendor_name',
            project_name: '$compliance_data.project_name',
            compliance_items: '$compliance_data.compliance_items',
            template_items: '$compliance_data.template_items',
            name: '$document_type_detail.name',
          },
        },

        //05: Look up for vendor name field
        {
          $lookup: {
            from: 'vendormodels',
            localField: 'vendor_id',
            foreignField: '_id',
            as: 'vendor_detail',
          },
        },

        //05.1: Look up for contact_detail
        {
          $lookup: {
            from: 'contactmodels',
            localField: 'contact_id',
            foreignField: '_id',
            as: 'contact_detail',
          },
        },

        //06: unwind: its an array with single element
        {
          $unwind: {
            path: '$vendor_detail',
          },
        },

        {
          $unwind: {
            path: '$contact_detail',
          },
        },
        //07: filter the template item on the basis of item_id
        {
          $addFields: {
            template_items: {
              $filter: {
                input: '$template_items',
                as: 'obj',
                cond: {
                  $eq: ['$$obj._id', '$item_id'],
                },
              },
            },
          },
        },
        //08: filter the compliance item on the basis of item_id
        {
          $addFields: {
            compliance_items: {
              $filter: {
                input: '$compliance_items',
                as: 'obj',
                cond: {
                  $eq: ['$$obj._id', '$item_id'],
                },
              },
            },
          },
        },
        //09: Remove template_items or compliance items on the base of item_type
        {
          $addFields: {
            compliance_items: {
              $cond: {
                if: { $ne: ['$item_type', 'compliance'] },
                then: '$$REMOVE',
                else: {
                  $arrayElemAt: ['$compliance_items', 0],
                },
              },
            },
            template_items: {
              $cond: {
                if: { $ne: ['$item_type', 'compliance'] },
                then: {
                  $arrayElemAt: ['$template_items', 0],
                },
                else: '$$REMOVE',
              },
            },
          },
        },
        //10: Set the values on the root level if exist
        {
          $addFields: {
            original_filename: {
              $ifNull: [
                '$compliance_items.original_filename',
                '$template_items.original_filename',
              ],
            },
            document_name: {
              $ifNull: [
                '$compliance_items.document_name',
                '$template_items.document_name',
              ],
            },
            document_type_uuid: {
              $ifNull: [
                '$compliance_items.document_type_uuid',
                '$template_items.document_type_uuid',
              ],
            },
            company_name: {
              $ifNull: ['$vendor_detail.vendor_name', ''],
            },
            contact_name: {
              $concat: [
                { $ifNull: ['$contact_detail.first_name', ''] },
                ' ',
                { $ifNull: ['$contact_detail.last_name', ''] },
              ],
            },
            address: {
              $ifNull: ['$contact_detail.address_1', ''],
            },
            expiry_date: {
              $ifNull: ['$compliance_items.expiry_date', ''],
            },
            effective_date: {
              $ifNull: ['$compliance_items.effective_date', ''],
            },
          },
        },

        //11: Remove the fields that i don't need
        {
          $project: {
            compliance_data: 0,
            template_items: 0,
            compliance_items: 0,
            vendor_detail: 0,
            contact_detail: 0,
            document_type_detail: 0,
            __v: 0,
          },
        },
        {
          $match: queryConditions,
        },
        {
          $sort: {
            original_filename: 1,
            document_name: 1,
            company_name: 1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit:
            pagination.limit == 0
              ? totalCount[0].count === 0
                ? 10
                : totalCount[0].count
              : pagination.limit,
        },
      ]);

      const page = pagination.page;
      const perPage =
        pagination.limit !== 0 ? pagination.limit : totalCount[0].count;

      const data = this.mapper.mapArray(
        res,
        documentUploadModel,
        GetDocumentsCompleteResponseDto,
      );

      return {
        page,
        perPage: perPage ? perPage : totalCount[0].count,
        total: totalCount[0].count,
        data,
      };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async editName(updateNameDto: DocumentNameUpdate) {
    try {
      if (updateNameDto.item_type === 'compliance') {
        await this.complianceModel.updateMany(
          {
            _id: updateNameDto.compliance_id,
          },
          {
            $set: {
              'compliance_items.$[element].original_filename':
                updateNameDto.original_filename,
            },
          },
          {
            arrayFilters: [
              {
                'element.document_type_uuid': updateNameDto.document_type_uuid,
              },
            ],
          },
        );
      } else {
        await this.complianceModel.updateMany(
          {
            _id: updateNameDto.compliance_id,
          },
          {
            $set: {
              'template_items.$[element].original_filename':
                updateNameDto.original_filename,
            },
          },
          {
            arrayFilters: [
              {
                'element.document_type_uuid': updateNameDto.document_type_uuid,
              },
            ],
          },
        );
      }

      return { message: 'file name updated successfully' };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  private async getDocumentCountByUUID() {
    const countByUUID = await this.documentTypeModel.aggregate([
      {
        $group: {
          _id: '$uuid',
        },
      },
      {
        $count: 'count',
      },
    ]);

    return countByUUID;
  }

  async complianceDocumentDetail(
    complianceDocumentListDto: GetComplianceDocumentListDto,
  ) {
    try {
      const compliance =
        await this.ComplianceService.complianceByVendorAndProject(
          complianceDocumentListDto.project_id,
          complianceDocumentListDto.vendor_id,
        );

      const res = await this.documentUploadModel.aggregate([
        // 01: First match on the basis of uuid
        {
          $match: {
            compliance_id: new ObjectId(compliance._id),
            isDeleted: false,
          },
        },
        //02: Look up: to get compliance data
        {
          $lookup: {
            from: 'compliancemodels',
            let: { compliance_id: '$compliance_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$_id', ['$$compliance_id']],
                  },
                },
              },
              {
                $project: {
                  compliance_items: 1,
                  template_items: 1,
                  vendor_id: 1,
                  vendor_name: 1,
                  project_id: 1,
                  project_name: 1,
                },
              },
            ],
            as: 'compliance_data',
          },
        },

        //03: unwind : its an array with single element
        {
          $unwind: {
            path: '$compliance_data',
          },
        },
        //00: Get document type detail
        {
          $lookup: {
            from: 'documenttypemodels',
            localField: 'document_type_uuid',
            foreignField: 'uuid',
            as: 'document_type_detail',
          },
        },
        // 00: Unwind document type detail to get name
        {
          $unwind: {
            path: '$document_type_detail',
          },
        },
        //04: shift the fields on the root level
        {
          $addFields: {
            vendor_id: '$compliance_data.vendor_id',
            vendor_name: '$compliance_data.vendor_name',
            project_name: '$compliance_data.project_name',
            compliance_items: '$compliance_data.compliance_items',
            template_items: '$compliance_data.template_items',
            name: '$document_type_detail.name',
          },
        },

        //05: Look up for vendor name field
        {
          $lookup: {
            from: 'vendormodels',
            localField: 'vendor_id',
            foreignField: '_id',
            as: 'vendor_detail',
          },
        },

        //05.1: Look up for contact_detail
        {
          $lookup: {
            from: 'contactmodels',
            localField: 'contact_id',
            foreignField: '_id',
            as: 'contact_detail',
          },
        },

        //06: unwind: its an array with single element
        {
          $unwind: {
            path: '$contact_detail',
          },
        },

        //06: unwind: its an array with single element
        {
          $unwind: {
            path: '$vendor_detail',
          },
        },
        //07: filter the template item on the basis of item_id
        {
          $addFields: {
            template_items: {
              $filter: {
                input: '$template_items',
                as: 'obj',
                cond: {
                  $eq: ['$$obj._id', '$item_id'],
                },
              },
            },
          },
        },
        //08: filter the compliance item on the basis of item_id
        {
          $addFields: {
            compliance_items: {
              $filter: {
                input: '$compliance_items',
                as: 'obj',
                cond: {
                  $eq: ['$$obj._id', '$item_id'],
                },
              },
            },
          },
        },
        //09: Remove template_items or compliance items on the base of item_type
        {
          $addFields: {
            compliance_items: {
              $cond: {
                if: { $ne: ['$item_type', 'compliance'] },
                then: '$$REMOVE',
                else: {
                  $arrayElemAt: ['$compliance_items', 0],
                },
              },
            },
            template_items: {
              $cond: {
                if: { $ne: ['$item_type', 'compliance'] },
                then: {
                  $arrayElemAt: ['$template_items', 0],
                },
                else: '$$REMOVE',
              },
            },
          },
        },
        //10: Set the values on the root level if exist
        {
          $addFields: {
            original_filename: {
              $ifNull: [
                '$compliance_items.original_filename',
                '$template_items.original_filename',
              ],
            },
            document_name: {
              $ifNull: [
                '$compliance_items.document_name',
                '$template_items.document_name',
              ],
            },
            document_type_uuid: {
              $ifNull: [
                '$compliance_items.document_type_uuid',
                '$template_items.document_type_uuid',
              ],
            },
            company_name: {
              $ifNull: ['$vendor_detail.vendor_name', ''],
            },
            contact_name: {
              $concat: [
                { $ifNull: ['$contact_detail.first_name', ''] },
                ' ',
                { $ifNull: ['$contact_detail.last_name', ''] },
              ],
            },
            address: {
              $ifNull: ['$contact_detail.address_1', ''],
            },
            expiry_date: {
              $ifNull: ['$compliance_items.expiry_date', ''],
            },
            effective_date: {
              $ifNull: ['$compliance_items.effective_date', ''],
            },
          },
        },

        //11: Remove the fields that i don't need
        {
          $project: {
            compliance_data: 0,
            template_items: 0,
            compliance_items: 0,
            vendor_detail: 0,
            contact_detail: 0,
            document_type_detail: 0,
            __v: 0,
          },
        },
        {
          $sort: {
            original_filename: 1,
            document_name: 1,
            company_name: 1,
          },
        },
      ]);

      return this.mapper.mapArray(
        res,
        documentUploadModel,
        GetDocumentsCompleteResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  private groupByDocumentName(query: any) {
    const pipeline: mongoose.PipelineStage[] = [
      {
        $match: { isDeleted: false },
      },
      {
        $lookup: {
          from: 'documenttypemodels',
          localField: 'document_type_uuid',
          foreignField: 'uuid',
          as: 'document_type_detail',
        },
      },
      {
        $lookup: {
          from: 'compliancemodels',
          let: {
            compliance_id: '$compliance_id',
            vendor_id: query?.vendor_id
              ? new mongoose.Types.ObjectId(query?.vendor_id)
              : undefined,
            client_id: query?.client_id
              ? new mongoose.Types.ObjectId(query?.client_id)
              : undefined,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$compliance_id'] },
                    {
                      $cond: {
                        if: { $ne: ['$$vendor_id', undefined] },
                        then: { $eq: ['$vendor_id', '$$vendor_id'] },
                        else: true,
                      },
                    },
                    {
                      $cond: {
                        if: { $ne: ['$$client_id', undefined] },
                        then: { $eq: ['$client_id', '$$client_id'] },
                        else: true,
                      },
                    },
                  ],
                },
              },
            },
          ],
          as: 'compliance_detail',
        },
      },
      {
        $unwind: {
          path: '$compliance_detail',
        },
      },
      {
        $addFields: {
          compliance_items: {
            $filter: {
              input: '$compliance_detail.compliance_items',
              as: 'obj',
              cond: {
                $eq: ['$$obj._id', '$item_id'],
              },
            },
          },
        },
      },
      {
        $addFields: {
          template_items: {
            $filter: {
              input: '$compliance_detail.template_items',
              as: 'obj',
              cond: {
                $eq: ['$$obj._id', '$item_id'],
              },
            },
          },
        },
      },
      {
        $addFields: {
          compliance_items: {
            $cond: {
              if: { $ne: ['$item_type', 'compliance'] },
              then: '$$REMOVE',
              else: {
                $arrayElemAt: ['$compliance_items', 0],
              },
            },
          },
          template_items: {
            $cond: {
              if: { $ne: ['$item_type', 'compliance'] },
              then: {
                $arrayElemAt: ['$template_items', 0],
              },
              else: '$$REMOVE',
            },
          },
        },
      },
      {
        $addFields: {
          expiry_date: {
            $ifNull: [
              '$compliance_items.expiry_date',
              '$template_items.expiry_date',
            ],
          },
        },
      },
      {
        $unwind: {
          path: '$document_type_detail',
        },
      },
      {
        $group: {
          _id: '$document_type_detail.name',
          document_type_uuid: { $first: '$document_type_uuid' },
          count: { $sum: 1 },
        },
      },
    ];

    return pipeline;
  }
}
