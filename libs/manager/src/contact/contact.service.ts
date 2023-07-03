import { ContactCreator } from 'als/building-block/RequestableDto/Contact/ContactCreator';
import { ContactUpdate } from 'als/building-block/RequestableDto/Contact/ContactUpdate';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { ContactCompleteResponseDto } from 'als/building-block/TransferableDto/Contact/Contact';
import { ContactPartialResponseDto } from 'als/building-block/TransferableDto/Contact/ContactPartial';
import { IGetAllResponse } from 'als/building-block/utils/genericInterface';

export abstract class IContactService {
  abstract create(
    createPayloadDto: ContactCreator,
  ): Promise<ContactCompleteResponseDto>;
  abstract getById(id: string): Promise<ContactCompleteResponseDto | null>;
  abstract update(
    id: string,
    updatePayloadDto: ContactUpdate,
  ): Promise<ContactCompleteResponseDto | null>;
  abstract getAll(
    query?: SearchableDto,
  ): Promise<IGetAllResponse<ContactPartialResponseDto>>;
  abstract deleteAll(): Promise<void>;
  abstract find(
    conditions: Partial<Record<string, unknown>>,
  ): Promise<ContactCompleteResponseDto[]>;
}
