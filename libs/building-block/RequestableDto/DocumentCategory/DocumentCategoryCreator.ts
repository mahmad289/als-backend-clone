import { IsNotEmpty, IsString } from 'class-validator';

export class DocumentCategoryCreator {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
