import { IsMongoId } from 'class-validator';

export class GetRuleDto {
  @IsMongoId({ message: 'id must be a valid mongodb id' })
  id: string;

  @IsMongoId({ message: 'master_requirement_id must be a valid mongodb id' })
  master_requirement_id: string;
}
