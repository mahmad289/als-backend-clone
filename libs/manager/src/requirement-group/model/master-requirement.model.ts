import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type MasterRequirementModelDocument =
  HydratedDocument<MasterRequirementModel>;

@Schema()
export class MasterRequirementModel {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (v: unknown) {
        const count = await this.constructor.countDocuments({
          uuid: v,
        });

        return count === 0;
      },
      message: 'uuid already exist.',
    },
  })
  uuid: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  coverage_type_uuid: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  coverage_type_name: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  document_type_uuid: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  document_type_name: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  requirement_description: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  order: number;

  @AutoMap()
  @Prop({ type: String, required: true })
  requirement_rule: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  default_comment: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  OCR: string;

  @AutoMap()
  @Prop({ type: [String], required: false })
  OCR_KEY?: string[];
}

export const MasterRequirementModelSchema = SchemaFactory.createForClass(
  MasterRequirementModel,
);
