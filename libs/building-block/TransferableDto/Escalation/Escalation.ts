import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class EscalationResponseDto {
  @AutoMap()
  @IsMongoId()
  @IsNotEmpty()
  _id: ObjectId;

  @AutoMap()
  @IsMongoId()
  @IsNotEmpty()
  compliance_id: ObjectId;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  project_id: ObjectId;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  client_id: ObjectId;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  user_id: ObjectId;

  @AutoMap()
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  coverage_types: string[];

  @AutoMap()
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  comments: string;

  @AutoMap()
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
