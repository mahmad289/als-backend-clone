import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { GetContact } from 'als/building-block/decorators/get-contact-decorator';
import { ComplianceUpdate } from 'als/building-block/RequestableDto/Compliance/ComplianceUpdate';
import { ParamIdDto } from 'als/building-block/RequestableDto/params.dto';
import { ContactCompleteResponseDto } from 'als/building-block/TransferableDto/Contact/Contact';
import { IComplianceService } from 'als/manager/compliance/services/compliance.service';
import { NotificationGateway } from 'apps/als-vendor/notification/notification.gateway';

@ApiTags('Compliance')
@Controller('compliance')
export class ComplianceController {
  constructor(
    private readonly complianceManagerService: IComplianceService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  @ApiParam({
    name: 'id',
    description: 'Give compliance id',
  })
  @Patch(':id')
  async update(
    @Param()
    param: ParamIdDto,
    @Body() alsCompliancePayload: ComplianceUpdate,
    @GetContact() contact: ContactCompleteResponseDto,
  ) {
    try {
      const res = await this.complianceManagerService.update(
        param.id,
        alsCompliancePayload,
        contact._id,
      );

      if (
        res &&
        alsCompliancePayload.file_name &&
        alsCompliancePayload.item_id &&
        alsCompliancePayload.item_type
      ) {
        this.notificationGateway.notifyInboxCount();
      }

      return res;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give compliance id',
  })
  @Get(':id')
  async findById(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      return await this.complianceManagerService.getById(param.id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
