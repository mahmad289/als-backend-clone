import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetComplianceDocumentListDto {
  @ApiProperty({ description: 'Project id' })
  @IsMongoId()
  @IsNotEmpty()
  project_id: string;

  @ApiProperty({ description: 'vendor id' })
  @IsMongoId()
  @IsNotEmpty()
  vendor_id: string;
}
