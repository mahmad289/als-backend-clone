import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { USER_ROLE_ENUM } from 'als/building-block/utils/enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserCreator {
  @ApiProperty({ description: 'username', default: 'john' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'email', default: 'john@als.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'password', default: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ default: '89898898' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ description: 'role', default: USER_ROLE_ENUM.ADMIN })
  @IsOptional()
  @IsEnum(USER_ROLE_ENUM, {
    message: `role must be one of the following [${USER_ROLE_ENUM}]`,
  })
  role: string;

  @ApiPropertyOptional({ default: 'john' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiPropertyOptional({ default: 'wick' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  last_name: string;
}
