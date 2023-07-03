import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class TagCreator {
  @ApiProperty({ description: 'parent id of the tag' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  parent?: ObjectId;

  @ApiProperty({ description: 'name', default: 'Corporate' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class TagUpdate extends PartialType(TagCreator) {}
