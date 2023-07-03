import { DocumentCategoryCreator } from 'als/building-block/RequestableDto/DocumentCategory/DocumentCategoryCreator';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { DocumentCategoryCompleteResponseDto } from 'als/building-block/TransferableDto/DocumentCategory/DocumentCategory';
import { DocumentCategoryPartialResponseDto } from 'als/building-block/TransferableDto/DocumentCategory/DocumentCategoryPartial';
import { IGetAllResponse } from 'als/building-block/utils/genericInterface';

export abstract class IDocumentCategoryService {
  abstract getAll(
    query?: SearchableDto,
  ): Promise<IGetAllResponse<DocumentCategoryPartialResponseDto>>;
  abstract create(
    documentCategoryPayload: DocumentCategoryCreator,
  ): Promise<DocumentCategoryCompleteResponseDto>;
  abstract getById(
    id: string,
  ): Promise<DocumentCategoryCompleteResponseDto | null>;
  abstract deleteAll(): Promise<void>;
}
