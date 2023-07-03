import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ClosingSummaryGridReportCreator {
  @AutoMap()
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({ description: 'must be a valid vendor id' })
  @IsNotEmpty()
  @IsArray()
  @ArrayUnique()
  @IsMongoId({ each: true })
  project_id: string[];

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
  closing_date: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  start_date: string;
}
