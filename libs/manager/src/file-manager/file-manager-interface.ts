import { GetComplianceDocumentListDto } from 'als/building-block/RequestableDto/Compliance/GetComplianceDocumentList';
import { DocumentNameUpdate } from 'als/building-block/RequestableDto/FileManager/DocumentNameUpdate';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { GetAllDocumentsResponseDto } from 'als/building-block/TransferableDto/FileManager/GetAllDocuments';
import { GetDocumentsCompleteResponseDto } from 'als/building-block/TransferableDto/FileManager/GetDocuments';
import { IGetAllResponse } from 'als/building-block/utils/genericInterface';

export abstract class IFileManagerService {
  abstract getAll(
    query?: SearchableDto,
  ): Promise<IGetAllResponse<GetAllDocumentsResponseDto>>;
  abstract getDocuments(
    uuid: string,
    query?: SearchableDto,
  ): Promise<IGetAllResponse<GetDocumentsCompleteResponseDto>>;
  abstract editName(
    updateNameDto: DocumentNameUpdate,
  ): Promise<{ message: string }>;
  abstract complianceDocumentDetail(
    complianceDocumentListDto: GetComplianceDocumentListDto,
  ): Promise<GetDocumentsCompleteResponseDto[]>;
}
