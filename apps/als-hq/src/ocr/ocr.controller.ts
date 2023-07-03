import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OCRDto } from 'als/building-block/RequestableDto/OCR/OCR.dto';
import { TriggerOCR } from 'als/building-block/RequestableDto/OCR/triggerOCR.dto';
import { IComplianceService } from 'als/manager/compliance/services/compliance.service';
import { NotificationGateway } from 'apps/als-hq/notification/notification.gateway';

@ApiBearerAuth()
@ApiTags('OCR')
@Controller('ocr')
export class OcrController {
  constructor(
    @Inject('OCR_SERVICE') private ocrService: ClientProxy,
    private complianceService: IComplianceService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  @Post()
  async create(@Body() triggerOCRPayload: TriggerOCR) {
    try {
      this.ocrService.emit('<event_name>', triggerOCRPayload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern()
  async handleEvent(@Payload() payload: OCRDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);

    await this.complianceService.updateComplianceValue(payload);
    const res = await this.complianceService.updateComplianceStatus(
      payload.compliance_id,
    );

    await this.complianceService.updateComplianceOCRData(payload);

    this.notificationGateway.notifyOfOcrResult({
      compliance_id: payload.compliance_id,
      client_id: res.client_id.toString(),
      project_id: res.project_id.toString(),
      vendor_id: res.vendor_id.toString(),
    });
    return 'response here';
  }
}
