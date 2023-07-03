import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type ContactModelDocument = HydratedDocument<ContactModel>;

@Schema()
export class ContactModel {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({ type: String, required: true })
  first_name: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  last_name: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  company_name: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  title: string;

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
  @Prop({ type: String, required: true })
  phone_number: string;

  @AutoMap()
  @Prop({ type: String })
  address_1: string;

  @AutoMap()
  @Prop({ type: String })
  address_2: string;

  @AutoMap()
  @Prop({ type: String })
  address_3: string;

  @AutoMap()
  @Prop({ type: String })
  city: string;

  @AutoMap()
  @Prop({ type: String })
  state: string;

  @AutoMap()
  @Prop({ type: String })
  zip: string;

  @AutoMap()
  @Prop({ type: String })
  fax: string;

  @AutoMap()
  @Prop({ type: String })
  direct: string;

  @AutoMap()
  @Prop({ type: String })
  mobile: string;

  @AutoMap()
  @Prop({ required: true })
  type: string;

  @AutoMap()
  @Prop({ type: String, required: true })
  contact_type: string;
}

export const ContactModelSchema = SchemaFactory.createForClass(ContactModel);
