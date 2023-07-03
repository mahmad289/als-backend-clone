import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

import { ClientCreator } from './ClientCreator';

export class ClientUpdate extends PartialType(ClientCreator) {}

export class ClientContactUpdate {
  @ApiProperty({ description: 'provide a contact_id', default: '' })
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  contact_id: string;
}
