import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OTPGenerate {
  @ApiProperty({
    description: "uuid generated for vendor's contact for specific project",
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  uuid: string;
}
