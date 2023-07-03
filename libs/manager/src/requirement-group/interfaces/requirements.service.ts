import { RequirementsCopyCreator } from 'als/building-block/RequestableDto/Requirements/RequirementsCopyCreator';
import { RequirementsCreator } from 'als/building-block/RequestableDto/Requirements/RequirementsCreator';
import {
  RequirementsRemoveTemplate,
  RequirementsUpdate,
} from 'als/building-block/RequestableDto/Requirements/RequirementsUpdate';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import {
  RequirementsCompletePopulatedResponseDto,
  RequirementsCompleteResponseDto,
} from 'als/building-block/TransferableDto/Requirements/Requirements';
import { RequirementsPartialResponseDto } from 'als/building-block/TransferableDto/Requirements/RequirementsPartial';
import { IGetAllResponse } from 'als/building-block/utils/genericInterface';

export abstract class IRequirementService {
  abstract getAll(
    query?: SearchableDto,
  ): Promise<IGetAllResponse<RequirementsPartialResponseDto>>;
  abstract updateRequirements(
    id: string,
    updateRequirmentPayload: RequirementsUpdate,
  ): Promise<RequirementsCompleteResponseDto | null>;
  abstract createCopy(
    createPayloadDto: RequirementsCopyCreator,
  ): Promise<RequirementsCompleteResponseDto>;
  abstract create(
    createPayloadDto: RequirementsCreator,
  ): Promise<RequirementsCompleteResponseDto>;
  abstract getById(
    id: string,
  ): Promise<RequirementsCompletePopulatedResponseDto | null>;

  abstract removeTemplate(
    id: string,
    updateRequirmentPayload: RequirementsRemoveTemplate,
  ): Promise<RequirementsCompleteResponseDto>;
  abstract deleteAll(): Promise<void>;
}
