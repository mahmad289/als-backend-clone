import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type DocumentTypeModelDocument = HydratedDocument<DocumentTypeModel>;

@Schema()
export class DocumentTypeModel {
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
  document_category_uuid: string;
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
}

export const DocumentTypeModelSchema =
  SchemaFactory.createForClass(DocumentTypeModel);
