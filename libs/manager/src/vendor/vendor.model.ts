import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type VendorModelDocument = HydratedDocument<VendorModel>;

@Schema()
export class VendorModel {
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
          username: v,
        });

        return count === 0;
      },
      message: 'Username already exist.',
    },
  })
  username: string;

  @Prop({ type: [SchemaTypes.ObjectId] })
  contacts_id: ObjectId[];

  @AutoMap()
  @Prop({ type: String })
  email: string;

  @AutoMap()
  @Prop({ type: String })
  first_name: string;

  @AutoMap()
  @Prop({ type: String })
  last_name: string;

  @AutoMap()
  @Prop({ type: String })
  address_1: string;

  @AutoMap()
  @Prop({ type: String })
  address_2: string;

  @AutoMap()
  @Prop({ type: String })
  city: string;

  @AutoMap()
  @Prop({ type: [SchemaTypes.ObjectId], required: true })
  tags: ObjectId[];

  @AutoMap()
  @Prop({ type: String })
  state: string;

  @AutoMap()
  @Prop({ type: String })
  zip: string;

  @AutoMap()
  @Prop({
    type: String,
    required: true,
  })
  vendor_name: string;

  @AutoMap()
  @Prop({ type: String })
  alias: string;

  @AutoMap()
  @Prop({ type: String })
  phone_number: string;

  @AutoMap()
  @Prop({ type: String })
  scope_of_work: string;

  @AutoMap()
  @Prop({ type: String })
  title: string;

  @AutoMap()
  @Prop({ type: Number })
  direct_dial: number;

  // -----
  // AUTOMAP
  @AutoMap()
  project_count: number;
}

export const VendorModelSchema = SchemaFactory.createForClass(VendorModel);
