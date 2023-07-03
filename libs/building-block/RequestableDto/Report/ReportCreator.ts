import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class ProjectVendor {
  @ApiProperty({ description: 'must be a valid project id' })
  @IsNotEmpty()
  @IsMongoId()
  project_id: ObjectId;

  @ApiProperty({ description: 'must be a valid vendor id' })
  @IsNotEmpty()
  @IsArray()
  @ArrayUnique()
  @IsMongoId({ each: true })
  vendor_id: ObjectId[];
}

export class ReportCreator {
  @AutoMap()
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  client_id: string;

  @AutoMap()
  @ApiProperty()
  @ValidateNested()
  @Type(() => ProjectVendor)
  projectVendor: ProjectVendor[];

  @AutoMap()
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @IsOptional()
  coverage_type: string[];

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  insurance_co: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  client_stage: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  broker: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  closing_date: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  start_date: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  expiration_date: string;

  @AutoMap()
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(
    [
      'compliance_review_report',
      'full_compliance_report',
      'non_compliance_report',
      'closing_summary_brief',
      'closing_summary_grid',
      'coi_schedule_of_insurance',
      'deal_summary_report',
      'policy_expiration_report',
      'excel_test',
      'expiration_report',
      'post_closing_summary',
      'escalation_report',
    ],
    {
      message: 'report value must be one of the allowed report types',
    },
  )
  report: string;
}
