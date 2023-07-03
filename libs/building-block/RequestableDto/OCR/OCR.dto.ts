import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class OCRDto {
  @IsNotEmpty()
  @IsString()
  Exception: string;
  @IsNotEmpty()
  @IsString()
  _id: string;
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  compliance_id: string;
  @IsNotEmpty()
  @IsString()
  document_type: string;
  @IsNotEmpty()
  extracted_data: Record<string, any>;
  @IsNotEmpty()
  @IsString()
  path: string;
  @IsNotEmpty()
  @IsString()
  status: string;
}
