import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommunicationCreator } from 'als/building-block/RequestableDto/Communication/CommunicationCreator';
import { CommunicationResponseDto } from 'als/building-block/TransferableDto/Communication/Communication';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

import {
  AutoNotificationModel,
  AutoNotificationModelDocument,
} from '../auto-notification/auto-notification.model';
import { VendorModel, VendorModelDocument } from '../vendor/vendor.model';
import {
  CommunicationModel,
  CommunicationModelDocument,
} from './communication.model';
import { ICommunicationService } from './communication.service';

@Injectable()
export class CommunicationManagerService
  extends AutomapperProfile
  implements ICommunicationService
{
  constructor(
    @InjectModel(CommunicationModel.name)
    readonly communicationModel: Model<CommunicationModelDocument>,

    @InjectModel(VendorModel.name)
    readonly vendorModel: Model<VendorModelDocument>,

    @InjectModel(AutoNotificationModel.name)
    readonly autoNotificationModel: Model<AutoNotificationModelDocument>,

    @InjectMapper() readonly mapper: Mapper,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        CommunicationModel,
        CommunicationResponseDto,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.vendor_id,
          mapFrom(s => s.vendor_id),
        ),
        forMember(
          d => d.project_id,
          mapFrom(s => s.project_id),
        ),
        forMember(
          d => d.contact_id,
          mapFrom(s => s.contact_id),
        ),
        forMember(
          d => d.notification_id,
          mapFrom(s => s.notification_id),
        ),
        forMember(
          d => d.template_id,
          mapFrom(s => s.template_id),
        ),
        forMember(
          d => d.compliance_id,
          mapFrom(s => s.compliance_id),
        ),
        forMember(
          d => d.client_id,
          mapFrom(s => s.client_id),
        ),
        forMember(
          d => d.communication_type,
          mapFrom(s => s.communication_type),
        ),
        forMember(
          d => d.recipient_type,
          mapFrom(s => s.recipient_type),
        ),
        forMember(
          d => d.notification,
          mapFrom(s => s.notification),
        ),
        forMember(
          d => d.vendor,
          mapFrom(s => s.vendor),
        ),
        forMember(
          d => d.contact,
          mapFrom(s => s.contact),
        ),
      );
    };
  }

  async create(createPayloadDto: CommunicationCreator) {
    try {
      const res = await this.communicationModel.create(createPayloadDto);
      return this.mapper.map(res, CommunicationModel, CommunicationResponseDto);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async find(conditions: Record<string, any>) {
    try {
      if (conditions.project_id) {
        conditions.project_id = new ObjectId(conditions.project_id);
      }

      if (conditions.vendor_id) {
        conditions.vendor_id = new ObjectId(conditions.vendor_id);
      }

      const resAuto = await this.communicationModel.aggregate([
        {
          $match: {
            ...conditions,
            communication_type: 'auto_notification',
          },
        },
        {
          $lookup: {
            from: 'vendormodels',
            localField: 'vendor_id',
            foreignField: '_id',
            as: 'vendor',
          },
        },
        {
          $lookup: {
            from: 'autonotificationmodels',
            localField: 'notification_id',
            foreignField: '_id',
            as: 'notification',
          },
        },
        {
          $lookup: {
            from: 'contactmodels',
            localField: 'contact_id',
            foreignField: '_id',
            as: 'contact',
          },
        },
        {
          $unwind: {
            path: '$vendor',
          },
        },
        {
          $unwind: {
            path: '$notification',
          },
        },
        {
          $unwind: {
            path: '$contact',
          },
        },

        {
          $lookup: {
            from: 'usermodels',
            localField: 'notification.sender',
            foreignField: '_id',
            as: 'notification.sender',
          },
        },
        {
          $unwind: {
            path: '$notification.sender',
          },
        },
      ]);

      const resRest = await this.communicationModel.find({
        ...conditions,
        communication_type: { $ne: 'auto_notification' },
      });

      const res = [...resAuto, ...resRest];

      return this.mapper.mapArray(
        res,
        CommunicationModel,
        CommunicationResponseDto,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
