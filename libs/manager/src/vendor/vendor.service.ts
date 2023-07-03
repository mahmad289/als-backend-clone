import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { VendorCreator } from 'als/building-block/RequestableDto/Vendor/VendorCreator';
import {
  VendorContactUpdate,
  VendorUpdate,
} from 'als/building-block/RequestableDto/Vendor/VendorUpdate';
import { VendorCompleteResponseDto } from 'als/building-block/TransferableDto/Vendor/Vendor';
import { VendorPartialResponseDto } from 'als/building-block/TransferableDto/Vendor/VendorPartial';

export abstract class IVendorService {
  abstract create(
    createPayloadDto: VendorCreator,
  ): Promise<VendorCompleteResponseDto>;
  abstract getById(id: string): Promise<VendorCompleteResponseDto | null>;

  abstract update(
    id: string,
    updatePayloadDto: VendorUpdate,
  ): Promise<VendorCompleteResponseDto | null>;
  abstract assignContacts(
    id: string,
    contactUpdatePayloadDto: VendorContactUpdate,
  ): Promise<VendorCompleteResponseDto>;
  abstract getAll(query?: SearchableDto): Promise<{
    page: number;
    perPage: number;
    total: number;
    data: VendorPartialResponseDto[];
  }>;
  abstract deleteAll(): Promise<void>;
  abstract dropDatabase(): Promise<void>;
}
