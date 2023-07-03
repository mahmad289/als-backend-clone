import { CoverageTypeCreator } from 'als/building-block/RequestableDto/CoverageType/CoverageTypeCreator';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { CoverageTypeCompleteResponseDto } from 'als/building-block/TransferableDto/CoverageTypes/CoverageTypes';
import { CoverageTypePartialResponseDto } from 'als/building-block/TransferableDto/CoverageTypes/CoverageTypesPartial';
import { IGetAllResponse } from 'als/building-block/utils/genericInterface';

export abstract class ICoverageTypeService {
  abstract getAll(
    query?: SearchableDto,
  ): Promise<IGetAllResponse<CoverageTypePartialResponseDto>>;
  abstract create(
    coverageTypePayload: CoverageTypeCreator,
  ): Promise<CoverageTypeCompleteResponseDto>;
  abstract getById(id: string): Promise<CoverageTypeCompleteResponseDto | null>;
  abstract deleteAll(): Promise<void>;
}
