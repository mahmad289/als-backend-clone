import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type AutoNotificationModelDocument =
  HydratedDocument<AutoNotificationModel>;

@Schema({ _id: false })
export class Template {
  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  template_id: ObjectId;

  @AutoMap()
  @Prop({ type: String })
  template_name: string;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);

@Schema()
export class AutoNotificationModel {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({ type: String, required: true })
  name: string;

  @AutoMap()
  @Prop({ type: String, enum: ['update', 'request'], required: true })
  type: string;

  @AutoMap()
  @Prop({ type: Number })
  days: number;

  @AutoMap()
  @Prop({ type: String, enum: ['before', 'after', 'every'] })
  schedule_type: string;

  @AutoMap()
  @Prop({ type: [SchemaTypes.ObjectId] })
  applies_to: ObjectId[];

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  project_id: ObjectId;

  @AutoMap()
  @Prop({ type: [String] })
  compliance_statuses: string[];

  @AutoMap()
  @Prop({ type: [String] })
  documents: string[];

  @AutoMap()
  @Prop({ type: TemplateSchema })
  template: Template;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  sender: ObjectId;

  @AutoMap()
  @Prop({ type: Boolean, default: true })
  active: boolean;

  @AutoMap()
  @Prop({ type: Boolean, default: false })
  is_deleted: boolean;

  @AutoMap()
  @Prop({ type: Date })
  last_sent: Date;

  @AutoMap()
  @Prop({ type: Boolean, default: false })
  company_manager: boolean;

  @AutoMap()
  @Prop({ type: Boolean, default: false })
  producer: boolean;

  @AutoMap()
  @Prop({ type: Number, default: 0 })
  count: number;

  @AutoMap()
  @Prop({ type: Number, default: 0 })
  sent_times: number;

  // for auto map
  @AutoMap()
  project_name: string;
}

export const AutoNotificationModelSchema = SchemaFactory.createForClass(
  AutoNotificationModel,
);
