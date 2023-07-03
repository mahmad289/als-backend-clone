import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type TemplateModelDocument = HydratedDocument<TemplateModel>;

@Schema()
export class RuleEntity {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({ type: String })
  name: string;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  master_requirement_id: ObjectId;

  @AutoMap()
  @Prop({ type: String, required: true })
  condition: string;

  @AutoMap()
  @Prop({ type: String })
  value: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  message: string;

  @AutoMap()
  @Prop({ type: Boolean, required: true, default: false })
  is_enabled: boolean;
}

const RuleSchema = SchemaFactory.createForClass(RuleEntity);

// ----------

@Schema()
export class TemplateModel {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({
    type: String,
    required: true,
  })
  template_name: string;

  @AutoMap()
  @Prop({ type: [RuleSchema], required: true })
  rules: RuleEntity[];

  @AutoMap()
  @Prop({ type: String, required: true })
  type: string;

  @AutoMap()
  @Prop({ type: Boolean, required: true, default: true })
  active: boolean;
}

export const TemplateModelSchema = SchemaFactory.createForClass(TemplateModel);
