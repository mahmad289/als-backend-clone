import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

import { VendorCreator } from './VendorCreator';

export class VendorUpdate extends PartialType(VendorCreator) {}

export class VendorContactUpdate {
  @ApiProperty({ description: 'provide a contact_id', default: '' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  contact_id: string;
}
