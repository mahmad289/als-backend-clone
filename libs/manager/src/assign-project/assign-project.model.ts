import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ComplianceCompleteResponsDto } from 'als/building-block/TransferableDto/Compliance/Compliance';
import { ContactCompleteResponseDto } from 'als/building-block/TransferableDto/Contact/Contact';
import { ProjectCompleteResponseDTO } from 'als/building-block/TransferableDto/Project/Project';
import { VendorCompleteResponseDto } from 'als/building-block/TransferableDto/Vendor/Vendor';
import { ObjectId } from 'mongodb';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type AssignProjectModelDocument = HydratedDocument<AssignProjectModel>;

@Schema()
export class AssignProjectModel {
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
  @Prop({ type: SchemaTypes.ObjectId })
  vendor_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  requirement_group_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  compliance_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  project_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  contact_id: ObjectId;

  // for AutoMap fields
  @AutoMap()
  vendor?: VendorCompleteResponseDto;

  @AutoMap()
  compliance?: ComplianceCompleteResponsDto;

  @AutoMap()
  project?: ProjectCompleteResponseDTO;

  @AutoMap()
  contact?: ContactCompleteResponseDto;
}

export const AssignProjectModelSchema =
  SchemaFactory.createForClass(AssignProjectModel);
