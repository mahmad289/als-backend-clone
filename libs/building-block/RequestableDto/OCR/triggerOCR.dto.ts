import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class TriggerOCR {
  @ApiProperty({ description: 'document_type' })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['acord_25', 'acord_28'], {
    message: `document type must be of the following values [acord_25, acord_28]`,
  })
  document_type: string;
  @ApiProperty({ description: 'file name' })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty({ description: 'compliance id' })
  @IsString()
  @IsNotEmpty()
  compliance_id: string;
}
