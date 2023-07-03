import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CommunicationByVendorAndProjectDto {
  @IsMongoId()
  @IsNotEmpty()
  vendor_id: string;

  @IsMongoId()
  @IsNotEmpty()
  project_id: string;
}
