import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExpAndEffDate {
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  tag_id: string;
}
