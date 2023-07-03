import { DocumentTypeCreator } from 'als/building-block/RequestableDto/DocumentType/DocumentTypeCreator';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { DocumentTypeResponseDto } from 'als/building-block/TransferableDto/DocumentType/DocumentType';
import { DocumentTypePartialResponseDto } from 'als/building-block/TransferableDto/DocumentType/DocumentTypePartial';
import { IGetAllResponse } from 'als/building-block/utils/genericInterface';

export abstract class IDocumentTypeService {
  abstract create(
    createPayloadDto: DocumentTypeCreator,
  ): Promise<DocumentTypeResponseDto>;
  abstract getById(id: string): Promise<DocumentTypeResponseDto | null>;
  abstract getByUuid(id: string): Promise<DocumentTypeResponseDto | null>;
  abstract getAll(
    query?: SearchableDto,
  ): Promise<IGetAllResponse<DocumentTypePartialResponseDto>>;
  abstract deleteAll(): Promise<void>;
}
