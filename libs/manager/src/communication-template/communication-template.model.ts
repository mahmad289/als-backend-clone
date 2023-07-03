import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type CommunicationTemplateModelDocument =
  HydratedDocument<CommunicationTemplateModel>;

@Schema({ _id: false })
export class EntitiesInvolved {
  @AutoMap()
  @Prop({ required: true, type: String })
  name: string;

  @AutoMap()
  @Prop({ required: true, type: String })
  resolve_to: string;

  @AutoMap()
  @Prop({ required: true, type: String })
  entity_type: string;
}
const EntitySchema = SchemaFactory.createForClass(EntitiesInvolved);

@Schema()
export class CommunicationTemplateModel {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({ type: String, required: true })
  template_name: string;

  @AutoMap()
  @Prop({
    required: true,
    type: String,
  })
  template_type: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  template: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  subject: string;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  created_by: ObjectId;

  @AutoMap()
  @Prop({ type: [EntitySchema], required: true })
  tags: EntitiesInvolved[];

  @AutoMap()
  @Prop({ type: Boolean, default: true })
  active: boolean;

  @AutoMap()
  @Prop({ type: Boolean, default: false })
  system_generated: boolean;
}

export const CommunicationTemplateModelSchema = SchemaFactory.createForClass(
  CommunicationTemplateModel,
);
