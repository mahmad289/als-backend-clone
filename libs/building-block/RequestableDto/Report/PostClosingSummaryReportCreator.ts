import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
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

export class PostClosingSummaryReportCreator {
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
}
