import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type TagModelDocument = HydratedDocument<TagModel>;

@Schema()
export class TagModel {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({ type: String })
  name: string;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, default: null })
  parent: ObjectId;

  @AutoMap()
  @Prop({ type: Number, default: 0 })
  count: number;

  @AutoMap()
  @Prop({ type: Boolean, default: true })
  active: boolean;

  // for Mapper only
  @AutoMap()
  children: TagModel[];

  @AutoMap()
  vendor_count: number;
}

export const TagModelSchema = SchemaFactory.createForClass(TagModel);
