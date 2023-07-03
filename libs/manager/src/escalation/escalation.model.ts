import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type EscalationModelDocument = HydratedDocument<EscalationModel>;

@Schema()
export class EscalationModel {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  compliance_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  project_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  client_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  user_id: ObjectId;

  @AutoMap()
  @Prop({ type: Date, required: true })
  date: Date;

  @AutoMap()
  @Prop({ type: [String] })
  coverage_types: string[];

  @AutoMap()
  @Prop({ type: Boolean, default: true })
  status: boolean;

  @AutoMap()
  @Prop({ type: String })
  comments: string;
}

export const EscalationModelSchema =
  SchemaFactory.createForClass(EscalationModel);
