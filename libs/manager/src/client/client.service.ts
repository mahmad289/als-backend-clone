import { ClientCreator } from 'als/building-block/RequestableDto/Client/ClientCreator';
import {
  ClientContactUpdate,
  ClientUpdate,
} from 'als/building-block/RequestableDto/Client/ClientUpdate';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { ClientCompleteResponseDto } from 'als/building-block/TransferableDto/Client/Client';
import { ClientPartialResponseDto } from 'als/building-block/TransferableDto/Client/ClientPartial';
import { IGetAllResponse } from 'als/building-block/utils/genericInterface';

export abstract class IClientService {
  abstract create(
    createPayloadDto: ClientCreator,
  ): Promise<ClientCompleteResponseDto>;
  abstract getById(id: string): Promise<ClientCompleteResponseDto | null>;
  abstract update(
    id: string,
    updatePayloadDto: ClientUpdate,
  ): Promise<ClientCompleteResponseDto | null>;
  abstract getAll(
    query?: SearchableDto,
  ): Promise<IGetAllResponse<ClientPartialResponseDto>>;
  abstract assignContacts(
    id: string,
    contactUpdatePayloadDto: ClientContactUpdate,
  ): Promise<ClientCompleteResponseDto>;
  abstract deleteAll(): Promise<void>;
}
