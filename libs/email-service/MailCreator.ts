import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MailCreator {
  @IsNotEmpty()
  @IsEmail()
  to: string;

  @IsOptional()
  @IsString()
  subject: string;

  @IsNotEmpty()
  text?: string;

  @IsEmail()
  @IsOptional()
  cc?: string;

  @IsOptional()
  @IsString()
  html?: string;
}
