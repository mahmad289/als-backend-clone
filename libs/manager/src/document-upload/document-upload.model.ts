import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose, { HydratedDocument } from 'mongoose';

import { VendorModel } from '../vendor/vendor.model';

export type DocumentUploadModelDocument = HydratedDocument<DocumentUploadModel>;

@Schema()
export class DocumentUploadModel {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({ type: ObjectId, required: true })
  compliance_id: ObjectId;

  @AutoMap()
  @Prop({ type: String, required: true })
  item_type: string;

  @AutoMap()
  @Prop({ type: ObjectId, required: true })
  item_id: ObjectId;

  @AutoMap()
  @Prop({ type: ObjectId, required: true })
  contact_id: ObjectId;

  @AutoMap()
  @Prop({ type: String, required: true })
  document_type_uuid: string;

  @AutoMap()
  @Prop({ type: Boolean, default: false })
  is_read: boolean;

  @AutoMap()
  @Prop({ type: String })
  original_filename: string;

  @AutoMap()
  @Prop({ type: String })
  document_name: string;

  @AutoMap()
  @Prop({ type: String })
  company_name: string; //vendor

  // for auto map
  @AutoMap()
  @Prop({ type: mongoose.SchemaTypes.ObjectId })
  masterReqId?: ObjectId;

  @AutoMap()
  @Prop({ type: mongoose.SchemaTypes.ObjectId })
  templateRuleId?: ObjectId;

  @AutoMap()
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @AutoMap()
  document_type_name: string;

  @AutoMap()
  project_name: string;

  @AutoMap()
  address: string;

  @AutoMap()
  name: string;

  @AutoMap()
  vendor: VendorModel;

  @AutoMap()
  effective_date: Date;

  @AutoMap()
  expiry_date: Date;

  @AutoMap()
  contact_name: string;
}

export const DocumentUploadModelSchema =
  SchemaFactory.createForClass(DocumentUploadModel);
