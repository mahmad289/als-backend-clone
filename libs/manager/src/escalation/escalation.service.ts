import { EscalationCreator } from 'als/building-block/RequestableDto/Escalation/EscalationCreator';
import { EscalationUpdate } from 'als/building-block/RequestableDto/Escalation/EscalationUpdate';
import { EscalationResponseDto } from 'als/building-block/TransferableDto/Escalation/Escalation';

export abstract class IEscalationService {
  abstract create(
    createPayloadDto: EscalationCreator,
  ): Promise<EscalationResponseDto>;
  abstract getById(id: string): Promise<EscalationResponseDto | null>;
  abstract getByComplianceId(id: string): Promise<EscalationResponseDto | null>;
  abstract update(
    id: string,
    updatePayloadDto: EscalationUpdate,
  ): Promise<EscalationResponseDto | null>;
  abstract toggleEscalation(
    id: string,
    status: boolean,
  ): Promise<EscalationResponseDto>;
  abstract updateEscalationStatus(id: string): Promise<EscalationResponseDto>;
  abstract sendEscalationEmail(): Promise<void>;
  abstract setItemEscalationStatus(id: string, status: boolean): Promise<void>;
}
