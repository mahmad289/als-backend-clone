import { IsNotEmpty, IsString } from 'class-validator';

export class CoverageTypeCreator {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
