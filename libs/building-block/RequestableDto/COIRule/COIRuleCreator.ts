import { IsNotEmpty, IsString } from 'class-validator';

export class COIRuleCreator {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  friendly_name: string;
}
