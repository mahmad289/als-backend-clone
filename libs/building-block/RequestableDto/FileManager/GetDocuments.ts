import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetDocuments {
  @ApiProperty({
    description: 'document type uuid of the original document type',
  })
  @AutoMap()
  @IsNotEmpty()
  @IsString()
  uuid: string;
}
