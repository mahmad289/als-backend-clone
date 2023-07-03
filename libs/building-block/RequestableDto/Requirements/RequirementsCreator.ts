import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class RequirementsCreator {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsMongoId({ each: true })
  requirement_items: ObjectId[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  acord25template_id?: ObjectId;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  acord28template_id?: ObjectId;
}
