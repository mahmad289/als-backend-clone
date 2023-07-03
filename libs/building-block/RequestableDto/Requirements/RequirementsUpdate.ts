import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class RequirementsUpdate {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  id: ObjectId;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

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

export class RequirementsRemoveTemplate extends OmitType(RequirementsUpdate, [
  'id',
  'name',
] as const) {}
