import { CommunicationTemplateCreator } from 'als/building-block/RequestableDto/CommunicationTemplate/CommunicationTemplateCreator';
import { CommunicationTemplateUpdate } from 'als/building-block/RequestableDto/CommunicationTemplate/CommunicationTemplateUpdate';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { CommunicationTemplateCompleteResponseDto } from 'als/building-block/TransferableDto/CommunicationTemplate/CommunicationTemplate';
import { CommunicationTemplatePartialResponseDto } from 'als/building-block/TransferableDto/CommunicationTemplate/CommuniccationTemplatePartial';
import { IGetAllResponse } from 'als/building-block/utils/genericInterface';

export abstract class ICommunicationTemplateService {
  abstract create(
    createPayloadDto: CommunicationTemplateCreator,
  ): Promise<CommunicationTemplateCompleteResponseDto>;
  abstract getById(
    id: string,
  ): Promise<CommunicationTemplateCompleteResponseDto | null>;
  abstract update(
    id: string,
    updatePayloadDto: CommunicationTemplateUpdate,
  ): Promise<CommunicationTemplateCompleteResponseDto | null>;
  abstract getAll(
    query?: SearchableDto,
  ): Promise<IGetAllResponse<CommunicationTemplatePartialResponseDto>>;
  abstract deleteAll(): Promise<void>;
  abstract findOne(
    conditions: Partial<Record<string, unknown>>,
  ): Promise<CommunicationTemplateCompleteResponseDto | null>;
  abstract find(
    conditions: Partial<Record<string, unknown>>,
  ): Promise<CommunicationTemplateCompleteResponseDto[]>;
  abstract softDelete(id: string): Promise<any>;
}
