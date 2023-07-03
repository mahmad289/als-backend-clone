import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type CoverageTypeModelDocument = HydratedDocument<CoverageTypeModel>;

@Schema()
export class CoverageTypeModel {
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
          name: v,
        });

        return count === 0;
      },
      message: 'Name already exist.',
    },
  })
  name: string;

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
}

export const CoverageTypeModelSchema =
  SchemaFactory.createForClass(CoverageTypeModel);
