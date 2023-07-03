import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OTPVerify {
  @ApiProperty({
    description: 'UUID of project assigned to Vendor',
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @ApiProperty({
    description: 'OTP: One Time Password',
    default: '',
  })
  @IsNotEmpty()
  @IsString()
  otp: string;
}
