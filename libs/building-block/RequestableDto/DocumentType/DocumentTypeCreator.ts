import { IsNotEmpty, IsString } from 'class-validator';

export class DocumentTypeCreator {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  document_category_uuid: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
