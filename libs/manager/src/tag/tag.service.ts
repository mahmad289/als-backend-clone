import {
  TagCreator,
  TagUpdate,
} from 'als/building-block/RequestableDto/Tag/TagCreator';
import { TagCompleteResponseDto } from 'als/building-block/TransferableDto/Tag/Tag';

export abstract class ITagService {
  abstract create(
    createPayloadDto: TagCreator,
  ): Promise<TagCompleteResponseDto>;
  abstract update(
    id: string,
    updatePayloadDto: TagUpdate,
  ): Promise<TagCompleteResponseDto | null>;
  abstract getAll(): Promise<TagCompleteResponseDto[]>;
  abstract findAll(): Promise<TagCompleteResponseDto[]>;
  abstract delete(id: string): Promise<any>;
  abstract getById(id: string): Promise<TagCompleteResponseDto | null>;
  abstract deleteAll(): Promise<void>;
}
