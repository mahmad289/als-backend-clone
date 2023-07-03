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
export class CoverageSummaryReportCreator {
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
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  client_stage: string;
}
