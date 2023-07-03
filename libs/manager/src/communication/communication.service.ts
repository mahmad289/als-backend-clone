import { CommunicationCreator } from 'als/building-block/RequestableDto/Communication/CommunicationCreator';
import { CommunicationResponseDto } from 'als/building-block/TransferableDto/Communication/Communication';

export abstract class ICommunicationService {
  abstract create(
    createPayloadDto: CommunicationCreator,
  ): Promise<CommunicationResponseDto>;
  abstract find(
    conditions: Record<string, any>,
  ): Promise<CommunicationResponseDto[]>;
}
