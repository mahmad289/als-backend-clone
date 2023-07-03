import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class DealSummaryReportCreator {
  @AutoMap()
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({ description: 'must be a valid vendor id' })
  @IsNotEmpty()
  @IsArray()
  @ArrayUnique()
  @IsMongoId({ each: true })
  project_id: string[];
}
