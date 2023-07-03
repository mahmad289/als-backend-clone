import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongodb';

import { ADDITIONAL_INSURED_TYPE } from './../../utils/enum';
import { ProjectCreator } from './ProjectCreator';

class CertificateHolders {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address_1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address_2: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  zip: string;
}

export class AssignedVendor {
  @ApiPropertyOptional({ description: 'must be a valid vendor id' })
  @IsNotEmpty()
  @IsMongoId()
  vendor_id: ObjectId;

  @ApiPropertyOptional({ description: 'must be a valid string' })
  @IsNotEmpty()
  @IsString()
  vendor_name: string;

  @ApiPropertyOptional({ description: 'must be a valid requirement group id' })
  @IsNotEmpty()
  @IsMongoId()
  requirement_group_id: ObjectId;

  @ApiPropertyOptional({ description: 'must be a valid string' })
  @IsNotEmpty()
  @IsString()
  requirement_group_name: string;
}

export class UnAssignedVendor {
  @ApiPropertyOptional({ description: 'must be a valid Mongo id' })
  @IsNotEmpty()
  @IsMongoId()
  vendor_assignement_id: ObjectId;
}

class ProjectSchedule {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  closing_date: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  construction_start_date: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  estimated_construction_completion_date: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  tco_date: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  bldg_rcv: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  bldg_pers_prop: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  hard_costs: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  soft_costs: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  loss_rents: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  estimated_prem_ins_cost: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  in_constructions: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  Initial_comp_rpt_sent: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  replacement_cost: string;
}

export class AdditionalInsured {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEnum(ADDITIONAL_INSURED_TYPE, {
    message: `type must be a valid enum value: ${Object.values(
      ADDITIONAL_INSURED_TYPE,
    )}`,
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}

class DealSummary {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  client_stage: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  engineer: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  analyst: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  total_units: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  total_square_foot: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  elevator_number: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  pool: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  tenancy: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  tenant_number: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  tenant_commercial: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  rehab_or_new_const: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  est_const_period: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  project_description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  other_key_info: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  flood_zone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  eq_zone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  renovation: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  high_risk_area: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sinkhole_exposure: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  exterior_finish: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  water_protection: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  playground_area: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  wind_tier: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  construction_type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  protection: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  structural_system: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  roofing: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fire_protection_safety: string;
}
class PartiesToTheTransaction {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  named_insured_partnership: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  add_l_Ins: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  add_l_Ins_special_member: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  add_l_Ins_tax_credit_investment_fund: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  add_l_Ins_investment_member: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  investor_bank: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  inv_member: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AdditionalInsured)
  additional_insured: AdditionalInsured[];
}

export class ProjectUpdate extends PartialType(
  OmitType(ProjectCreator, ['client'] as const),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CertificateHolders)
  certificate_holders: CertificateHolders[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PartiesToTheTransaction)
  parties_to_the_transaction: PartiesToTheTransaction;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ProjectSchedule)
  project_schedule: ProjectSchedule;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DealSummary)
  deal_summary: DealSummary;
}

export class ContactUpdate {
  @ApiPropertyOptional({ description: 'must be a valid Mongo id' })
  @IsMongoId()
  _id: ObjectId;
}

export class ProjectIds {
  @ApiPropertyOptional({ description: 'must be a valid Mongo id' })
  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @IsMongoId({ each: true })
  @ArrayMinSize(1, {
    message: 'project id must have at least one element',
  })
  project_id: ObjectId[];
}

export class ProjectContactUpdate {
  @ApiProperty({ description: 'provide a contact_id', default: '' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  contact_id: string;
}

export class ProjectNotesUpdate {
  @ApiPropertyOptional({ description: 'must be a string' })
  @IsString()
  notes: string;
}

export class ProjectWaiverUpdate {
  @ApiPropertyOptional({ description: 'must be a string' })
  @IsString()
  waiver: string;
}
