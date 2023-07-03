import { IsMongoId, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ParamIdDto {
  @IsMongoId({ message: 'id must be a valid mongodb id' })
  id: string;
}

export class ParamUUIDDto {
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  uuid: string;
}
