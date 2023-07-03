import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type RequirementsModelDocument = HydratedDocument<RequirementsModel>;

@Schema()
export class RequirementsModel {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({
    type: String,
    unique: true,
    validate: {
      validator: async function (v: unknown) {
        const count = await this.constructor.countDocuments({
          name: v,
        });

        return count === 0;
      },
      message: 'Name already exist.',
    },
  })
  name: string;

  @Prop({ type: [SchemaTypes.ObjectId] })
  requirement_items: ObjectId[];

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  acord25template_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  acord28template_id: ObjectId;

  @AutoMap()
  @Prop({ type: Number, default: 0 })
  total_assignments: number;
}

export const RequirementsModelSchema =
  SchemaFactory.createForClass(RequirementsModel);
