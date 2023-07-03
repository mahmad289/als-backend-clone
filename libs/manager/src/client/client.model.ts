import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type ClientModelDocument = HydratedDocument<ClientModel>;

@Schema()
export class ClientModel {
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
      message: 'Client Name already exist',
    },
  })
  name: string;

  @Prop({ type: [SchemaTypes.ObjectId] })
  contacts_id: ObjectId[];

  @AutoMap()
  @Prop({ type: String, required: true })
  client_type: string;

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
  @Prop({ type: [SchemaTypes.ObjectId], default: [] })
  tags: ObjectId[];

  @AutoMap()
  @Prop({ type: String })
  state: string;

  @AutoMap()
  @Prop({ type: String })
  zip: string;

  //is optional field to add total projects of a client in response
  @AutoMap()
  total_projects?: number;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  company_manager: ObjectId;
}

export const ClientModelSchema = SchemaFactory.createForClass(ClientModel);
