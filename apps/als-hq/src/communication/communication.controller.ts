import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CommunicationByVendorAndProjectDto } from 'als/building-block/RequestableDto/Communication/CommunicationByVendorAndProject';
import { ICommunicationService } from 'als/manager/communication/communication.service';

@ApiTags('Communication')
@Controller('communication')
export class CommunicationController {
  constructor(private communicationService: ICommunicationService) {}
  @ApiParam({
    name: 'project_id',
    description: 'Give project id',
  })
  @ApiParam({
    name: 'vendor_id',
    description: 'Give vendor id',
  })
  @Get(':project_id/:vendor_id')
  async communicationByVendorAndProject(
    @Param()
    communicationByVendorAndProjectDto: CommunicationByVendorAndProjectDto,
  ) {
    try {
      return await this.communicationService.find({
        project_id: communicationByVendorAndProjectDto.project_id,
        vendor_id: communicationByVendorAndProjectDto.vendor_id,
      });
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
