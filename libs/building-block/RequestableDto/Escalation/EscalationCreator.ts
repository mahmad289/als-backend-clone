import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class EscalationCreator {
  @ApiProperty()
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

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  coverage_types: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comments: string;
}
