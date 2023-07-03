import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  COMMUNICATION_RECIPIENT_TYPE,
  COMMUNICATION_TYPE,
} from 'als/building-block/utils/enum';
import { ObjectId } from 'mongodb';
import { HydratedDocument, SchemaTypes } from 'mongoose';

import { AutoNotificationModelDocument } from '../auto-notification/auto-notification.model';
import { ContactModelDocument } from '../contact/contact.model';
import { VendorModelDocument } from '../vendor/vendor.model';

export type CommunicationModelDocument = HydratedDocument<CommunicationModel>;

@Schema()
export class CommunicationModel {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  vendor_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  project_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  contact_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  notification_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  template_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  compliance_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  client_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  escalation_id: ObjectId;

  @AutoMap()
  @Prop({
    type: String,
    required: true,
    enum: COMMUNICATION_TYPE,
  })
  communication_type: string;

  @AutoMap()
  @Prop({
    type: String,
    required: true,
    enum: COMMUNICATION_RECIPIENT_TYPE,
  })
  recipient_type: string;

  @AutoMap()
  @Prop({ required: true, type: String })
  subject: string;

  @AutoMap()
  @Prop({ required: true, type: String })
  body: string;

  @AutoMap()
  @Prop({ type: SchemaTypes.Date, default: Date.now })
  timestamp: Date;

  // automap
  @AutoMap()
  vendor: VendorModelDocument;

  @AutoMap()
  notification: AutoNotificationModelDocument;

  @AutoMap()
  contact: ContactModelDocument;
}

export const CommunicationModelSchema =
  SchemaFactory.createForClass(CommunicationModel);
