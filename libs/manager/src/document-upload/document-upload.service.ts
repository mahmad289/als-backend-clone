import { DocumentUploadCreator } from 'als/building-block/RequestableDto/DocumentUpload/DocumentUploadCreator';
import { DocumentUploadUpdate } from 'als/building-block/RequestableDto/DocumentUpload/DocumentUploadUpdate';
import { InboxSearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { DocumentUploadCompleteResponseDto } from 'als/building-block/TransferableDto/DocumentUpload/DocumentUpload';
import { DocumentUploadPartialResponseDto } from 'als/building-block/TransferableDto/DocumentUpload/DocumentUploadPartial';
import { IGetAllResponse } from 'als/building-block/utils/genericInterface';

export abstract class IDocumentUploadService {
  abstract create(
    DocumentUploadPayloadDto: DocumentUploadCreator,
  ): Promise<DocumentUploadCompleteResponseDto>;
  abstract getById(
    id: string,
  ): Promise<DocumentUploadCompleteResponseDto | null>;

  abstract update(
    id: string,
    updatePayloadDto: DocumentUploadUpdate,
  ): Promise<DocumentUploadCompleteResponseDto | null>;

  abstract getAll(
    query?: InboxSearchableDto,
  ): Promise<IGetAllResponse<DocumentUploadPartialResponseDto>>;

  abstract unreadCount(): Promise<number>;

  abstract deleteAll(): Promise<void>;
}
