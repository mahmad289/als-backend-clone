import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class RequirementsCopyCreator {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  id: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  name: string;
}
