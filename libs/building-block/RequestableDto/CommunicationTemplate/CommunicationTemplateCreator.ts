import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class CommunicationTemplateCreator {
  @ApiProperty({
    description: 'Template name is required',
    default: 'Template name',
  })
  @IsString()
  template_name: string;

  @ApiProperty({
    description: 'Template type is required',
    default: 'Template type',
  })
  @IsString()
  template_type: string;

  @ApiProperty({
    description: 'Template is required',
    default: 'Dummy html template',
  })
  @IsString()
  template: string;

  @ApiProperty({
    description: 'Subject is required',
    default: 'Subject',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Created_by type is required',
    default: 'als-user',
  })
  @IsMongoId()
  created_by: ObjectId;

  @ApiProperty({
    description: 'Template is required',
    default: [
      {
        name: 'clientName',
        resolve_to: 'name',
        entity_type: 'client',
      },
      {
        name: 'clientName',
        resolve_to: 'name',
        entity_type: 'client',
      },
    ],
  })
  @IsArray()
  tags: EntitiesInvolved[];

  @AutoMap()
  @IsBoolean()
  @IsOptional()
  system_generated: boolean;
}

export class EntitiesInvolved {
  @ApiProperty({
    description: 'name is required',
    default: ' name',
  })
  name: string;

  @ApiProperty({
    description: 'resolve_to are required',
    default: ['name', 'client_type', 'address_1'],
  })
  resolve_to: string;
  @ApiProperty({
    description: 'entity type are required',
    default: ['client', 'vendor', 'contact'],
  })
  entity_type: string;
}
