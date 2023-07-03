import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type OTPModelDocument = HydratedDocument<OTPModel>;

@Schema()
export class OTPModel {
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
          email: v,
        });

        return count === 0;
      },
      message: 'Email already exist.',
    },
  })
  email: string;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  contact_id: ObjectId;

  @AutoMap()
  @Prop({ type: Number, default: 0 })
  attempts: number;

  @AutoMap()
  @Prop({ type: String, required: true })
  otp: string;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  project_assignee: ObjectId;
}

export const OTPModelSchema = SchemaFactory.createForClass(OTPModel);
