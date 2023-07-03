import { HttpStatus } from '@nestjs/common';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { UserCreator } from 'als/building-block/RequestableDto/User/UserCreator';
import { UserPasswordUpdate } from 'als/building-block/RequestableDto/User/UserPasswordUpdate';
import { UserUpdate } from 'als/building-block/RequestableDto/User/UserUpdate';
import {
  UserCompleteResponseDto,
  UserCompleteResponsewithPasswordDto,
} from 'als/building-block/TransferableDto/User/User';
import { UserPartialResponseDto } from 'als/building-block/TransferableDto/User/UserPartial';
import { IGetAllResponse } from 'als/building-block/utils/genericInterface';

export abstract class IUserService {
  abstract getAll(
    query?: SearchableDto,
  ): Promise<IGetAllResponse<UserPartialResponseDto>>;
  abstract create(
    alsUserPayload: UserCreator,
  ): Promise<UserCompleteResponseDto>;
  abstract getById(id: string): Promise<UserCompleteResponseDto | null>;
  abstract update(
    id: string,
    updatePayloadDto: UserUpdate,
  ): Promise<UserCompleteResponseDto | null>;
  abstract updatePassword(
    id: string,
    updatePayloadDto: UserPasswordUpdate,
  ): Promise<{ message: string }>;
  abstract findOne(
    conditions: Partial<Record<string, unknown>>,
  ): Promise<UserCompleteResponseDto | null>;
  abstract deleteAll(): Promise<void>;
  abstract userWithPassword(
    conditions: Partial<Record<string, unknown>>,
  ): Promise<UserCompleteResponsewithPasswordDto | null>;
  abstract dropDatabase(): Promise<void>;
  abstract deleteOne(id: string): Promise<HttpStatus>;
}
