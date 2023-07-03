import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProjectCompleteResponseDTO } from 'als/building-block/TransferableDto/Project/Project';
import { MasterRequirementModelDocument } from 'als/manager/requirement-group/model/master-requirement.model';
import { IsOptional } from 'class-validator';
import { ObjectId } from 'mongodb';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type ComplianceModelDocument = HydratedDocument<ComplianceModel>;

@Schema()
export class ComplianceItems {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  master_requirement_id: ObjectId;

  @AutoMap()
  @Prop({ type: String, required: true })
  required_limit: string;

  @AutoMap()
  @Prop({ type: String })
  actual_limit: string;

  @AutoMap()
  @Prop({ type: String })
  status: string;

  @AutoMap()
  @Prop({ type: String })
  comment: string;

  @AutoMap()
  @Prop({ type: Boolean })
  show: boolean;

  @AutoMap()
  @Prop({ type: Boolean })
  waiver: boolean;

  @AutoMap()
  @Prop({ type: Boolean })
  post_closing: boolean;

  @AutoMap()
  @Prop({ type: String })
  document_name: string;

  @AutoMap()
  @Prop({ type: String })
  original_filename: string;

  @AutoMap()
  @Prop({ type: String })
  document_type_uuid: string;

  @AutoMap()
  @Prop({ type: Date, required: false })
  effective_date?: string;

  @AutoMap()
  @Prop({ type: Date, required: false })
  expiry_date?: string;

  @AutoMap()
  @Prop({ type: [String], required: false })
  OCR_KEY?: string[];

  @AutoMap()
  master_requirement?: MasterRequirementModelDocument;

  @AutoMap()
  @Prop({ type: Boolean, required: false })
  is_escalated?: boolean;
}

const ComplianceItemSchema = SchemaFactory.createForClass(ComplianceItems);

@Schema()
export class TemplateItems {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  template_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  template_rule_id: ObjectId;

  @AutoMap()
  @Prop({ type: String })
  actual_limit: string;

  @AutoMap()
  @Prop({ type: String })
  status: string;

  @AutoMap()
  @Prop({ type: Boolean })
  show: boolean;

  @AutoMap()
  @Prop({ type: Boolean })
  waiver: boolean;

  @AutoMap()
  @Prop({ type: Boolean })
  post_closing: boolean;

  @AutoMap()
  @Prop({ type: String })
  document_name: string;

  @AutoMap()
  @Prop({ type: String })
  original_filename: string;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  master_requirement_id: ObjectId;

  @AutoMap()
  @Prop({ type: String })
  document_type_uuid: string;

  @AutoMap()
  @Prop({ type: Date, required: false })
  effective_date?: string;

  @AutoMap()
  @Prop({ type: Date, required: false })
  expiry_date?: string;

  @AutoMap()
  @Prop({ type: String, required: false })
  policy_number?: string;

  @AutoMap()
  @Prop({ type: String, required: false })
  named_insured?: string;

  @AutoMap()
  @Prop({ type: [String], required: false })
  OCR_KEY?: string[];

  @AutoMap()
  master_requirement?: MasterRequirementModelDocument;

  @AutoMap()
  @Prop({ type: Boolean, required: false })
  is_escalated?: boolean;
}

const TemplateItemSchema = SchemaFactory.createForClass(TemplateItems);

// ----------

@Schema()
export class ComplianceModel {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  vendor_id: ObjectId;

  @AutoMap()
  @Prop({ type: String })
  vendor_name: string;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  project_id: ObjectId;

  @AutoMap()
  @Prop({ type: String })
  project_name: string;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  client_id: ObjectId;

  @AutoMap()
  @Prop({ type: String })
  client_name: string;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  requirement_group_id: ObjectId;

  @AutoMap()
  @Prop({ type: [ComplianceItemSchema], required: true })
  compliance_items: ComplianceItems[];

  @AutoMap()
  @Prop({ type: [TemplateItemSchema], required: true })
  template_items: TemplateItems[];

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  user_id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  escalation_id: ObjectId;

  @AutoMap()
  @IsOptional()
  @Prop({ type: Boolean, default: false })
  in_escalation: boolean;

  @AutoMap()
  @IsOptional()
  @Prop({ type: Boolean, default: true })
  status: boolean;

  // FOR AUTOMAPPER
  @AutoMap()
  project: ProjectCompleteResponseDTO;

  @AutoMap()
  @Prop({ type: SchemaTypes.Mixed, required: false })
  acord_28_ocr_data?: Record<string, any>;

  @AutoMap()
  @Prop({ type: SchemaTypes.Mixed, required: false })
  acord_25_ocr_data?: Record<string, any>;
}

export const ComplianceModelSchema =
  SchemaFactory.createForClass(ComplianceModel);
