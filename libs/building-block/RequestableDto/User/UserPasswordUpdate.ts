import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserPasswordUpdate {
  @ApiProperty({ description: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'newPassword' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
