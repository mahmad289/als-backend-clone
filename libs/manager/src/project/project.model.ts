import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ADDITIONAL_INSURED_TYPE } from 'als/building-block/utils/enum';
import { IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Date, HydratedDocument, SchemaTypes } from 'mongoose';

export type ProjectModelDocument = HydratedDocument<ProjectModel>;

@Schema({ _id: false })
export class CertificateHolders {
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
  @Prop({ type: String })
  state: string;

  @AutoMap()
  @Prop({ type: String })
  zip: string;
}

export const CertificateHoldersSchema =
  SchemaFactory.createForClass(CertificateHolders);

@Schema()
export class AssignedVendor {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  vendor_id: ObjectId;

  @AutoMap()
  @Prop({ type: String })
  vendor_name: string;

  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId })
  requirement_group_id: ObjectId;

  @AutoMap()
  @Prop({ type: String })
  requirement_group_name: string;
}

export const AssignedVendorSchema =
  SchemaFactory.createForClass(AssignedVendor);

@Schema({ _id: false })
export class SingleDocument {
  @AutoMap()
  @Prop({ type: String })
  name: string;

  @AutoMap()
  @Prop({ type: String })
  key: string;
}

export const SingleDocumentSchema =
  SchemaFactory.createForClass(SingleDocument);

@Schema()
export class Document {
  @AutoMap()
  @Prop({ type: String })
  type: string;

  @AutoMap()
  @Prop({ type: [SingleDocumentSchema], default: [] })
  documents: SingleDocument[];
}

export const DocumentSchema = SchemaFactory.createForClass(Document);

@Schema()
export class DealSummary {
  @AutoMap()
  @Prop({ type: String })
  client_stage: string;

  @AutoMap()
  @Prop({ type: String })
  engineer: string;

  @AutoMap()
  @Prop({ type: String })
  analyst: string;

  @AutoMap()
  @Prop({ type: String })
  total_units: string;

  @AutoMap()
  @Prop({ type: String })
  total_square_foot: string;

  @AutoMap()
  @Prop({ type: String })
  elevator_number: string;

  @AutoMap()
  @Prop({ type: String })
  pool: string;

  @AutoMap()
  @Prop({ type: String })
  tenancy: string;

  @AutoMap()
  @Prop({ type: String })
  tenant_number: string;

  @AutoMap()
  @Prop({ type: String })
  tenant_commercial: string;

  @AutoMap()
  @Prop({ type: String })
  rehab_or_new_const: string;

  @AutoMap()
  @Prop({ type: String })
  est_const_period: string;

  @AutoMap()
  @Prop({ type: String })
  project_description: string;

  @AutoMap()
  @Prop({ type: String })
  other_key_info: string;

  @AutoMap()
  @Prop({ type: String })
  flood_zone: string;

  @AutoMap()
  @Prop({ type: String })
  eq_zone: string;

  @AutoMap()
  @Prop({ type: String })
  renovation: string;

  @AutoMap()
  @Prop({ type: String })
  high_risk_area: string;

  @AutoMap()
  @Prop({ type: String })
  sinkhole_exposure: string;

  @AutoMap()
  @Prop({ type: String })
  exterior_finish: string;

  @AutoMap()
  @Prop({ type: String })
  water_protection: string;

  @AutoMap()
  @Prop({ type: String })
  playground_area: string;

  @AutoMap()
  @Prop({ type: String })
  wind_tier: string;

  @AutoMap()
  @Prop({ type: String })
  construction_type: string;

  @AutoMap()
  @Prop({ type: String })
  protection: string;

  @AutoMap()
  @Prop({ type: String })
  structural_system: string;

  @AutoMap()
  @Prop({ type: String })
  roofing: string;

  @AutoMap()
  @Prop({ type: String })
  fire_protection_safety: string;
}

export const DealSummarySchema = SchemaFactory.createForClass(DealSummary);

@Schema()
export class ProjectSchedule {
  @AutoMap()
  @Prop({ type: Date })
  closing_date: Date;

  @AutoMap()
  @Prop({ type: Date })
  construction_start_date: Date;

  @AutoMap()
  @Prop({ type: Date })
  estimated_construction_completion_date: Date;

  @AutoMap()
  @Prop({ type: Date })
  tco_date: Date;

  @AutoMap()
  @Prop({ type: String })
  bldg_rcv: string;

  @AutoMap()
  @Prop({ type: String })
  bldg_pers_prop: string;

  @AutoMap()
  @Prop({ type: String })
  hard_costs: string;

  @AutoMap()
  @Prop({ type: String })
  soft_costs: string;

  @AutoMap()
  @Prop({ type: String })
  loss_rents: string;

  @AutoMap()
  @Prop({ type: String })
  estimated_prem_ins_cost: string;

  @AutoMap()
  @Prop({ type: String })
  in_constructions: string;

  @AutoMap()
  @Prop({ type: String })
  Initial_comp_rpt_sent: string;

  @AutoMap()
  @Prop({ type: String })
  replacement_cost: string;
}

export const ProjectScheduleSchema =
  SchemaFactory.createForClass(ProjectSchedule);

@Schema()
export class MaterialDocumentAndCertificate {
  @AutoMap()
  @Prop({ type: String })
  name: string;

  @AutoMap()
  @Prop({ type: Date })
  vers_date: Date;

  @AutoMap()
  @Prop({ type: String })
  comments: string;

  @AutoMap()
  @Prop({ type: String, enum: ['R', 'Y', 'G'], default: 'R' })
  status: string;
}

export const MaterialDocumentAndCertificateSchema =
  SchemaFactory.createForClass(MaterialDocumentAndCertificate);

@Schema()
export class Client {
  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  client_id: ObjectId;

  @AutoMap()
  @Prop({ required: true })
  name: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

@Schema()
export class Manager {
  @AutoMap()
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  manager_id: ObjectId;

  @AutoMap()
  @Prop({ required: true })
  name: string;
}

export const ManagerSchema = SchemaFactory.createForClass(Manager);

// -----------------------
// Additional Insured
//------------------------
@Schema({ _id: false })
export class AdditionalInsured {
  @AutoMap()
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @AutoMap()
  @IsString()
  @Prop({ type: String, enum: ADDITIONAL_INSURED_TYPE, required: true })
  type: string;
}

export const AdditionalInsuredSchema =
  SchemaFactory.createForClass(AdditionalInsured);

//--------------------------
@Schema()
export class PartiesToTheTransaction {
  @AutoMap()
  @Prop({
    type: String,
  })
  named_insured_partnership: string;

  @AutoMap()
  @Prop({
    type: String,
  })
  add_l_Ins: string;

  @AutoMap()
  @Prop({
    type: String,
  })
  add_l_Ins_special_member: string;

  @AutoMap()
  @Prop({
    type: String,
  })
  add_l_Ins_tax_credit_investment_fund: string;

  @AutoMap()
  @Prop({
    type: String,
  })
  add_l_Ins_investment_member: string;

  @AutoMap()
  @Prop({
    type: String,
  })
  investor_bank: string;

  @AutoMap()
  @Prop({
    type: String,
  })
  inv_member: string;

  @AutoMap()
  @Prop({ type: [AdditionalInsuredSchema] })
  additional_insured: AdditionalInsured[];
}

export const PartiesToTheTransactionSchema = SchemaFactory.createForClass(
  PartiesToTheTransaction,
);

@Schema()
export class ProjectModel {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  @Prop({ type: ClientSchema })
  client: Client;

  @AutoMap()
  @Prop({
    type: String,
    unique: true,
    required: true,
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
  property_name: string;

  @AutoMap()
  @Prop({ type: String })
  county: string;

  @AutoMap()
  @Prop({ type: String })
  zip: string;

  @AutoMap()
  @Prop({ type: [SchemaTypes.ObjectId] })
  contacts: ObjectId[];

  @AutoMap()
  @Prop({ type: [CertificateHoldersSchema], default: [] })
  certificate_holders: CertificateHolders[];

  @AutoMap()
  @Prop({ type: ManagerSchema })
  manager: Manager;

  @AutoMap()
  @Prop({ type: [DocumentSchema], default: [] })
  documents: Document[];

  @AutoMap()
  @Prop({ type: [AssignedVendorSchema], default: [] })
  assigned_vendor: AssignedVendor[];

  @AutoMap()
  @Prop({ type: PartiesToTheTransactionSchema })
  parties_to_the_transaction: PartiesToTheTransaction;

  @AutoMap()
  @Prop({ type: ProjectScheduleSchema })
  project_schedule: ProjectSchedule;

  @AutoMap()
  @Prop({ type: DealSummarySchema })
  deal_summary: DealSummary;

  @AutoMap()
  @Prop({ type: [MaterialDocumentAndCertificateSchema], default: [] })
  material_documents: MaterialDocumentAndCertificate[];

  @AutoMap()
  @Prop({ type: [MaterialDocumentAndCertificateSchema], default: [] })
  certificates: MaterialDocumentAndCertificate[];

  @AutoMap()
  @Prop({ type: String })
  notes: string;

  @AutoMap()
  @Prop({ type: String })
  waivers: string;
}

export const ProjectModelSchema = SchemaFactory.createForClass(ProjectModel);
