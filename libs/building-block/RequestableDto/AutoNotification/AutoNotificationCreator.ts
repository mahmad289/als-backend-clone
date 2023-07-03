import { AutoMap } from '@automapper/classes';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AutoNotificationCreator {
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  @IsEnum(['update', 'request'], {
    message: `type must be of the following values 'update' , 'request'`,
  })
  type: string;
}
