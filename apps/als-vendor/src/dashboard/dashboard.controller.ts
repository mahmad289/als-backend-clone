import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { GetContact } from 'als/building-block/decorators/get-contact-decorator';
import { ParamUUIDDto } from 'als/building-block/RequestableDto/params.dto';
import { ContactCompleteResponseDto } from 'als/building-block/TransferableDto/Contact/Contact';
import { IAssignProjectService } from 'als/manager/assign-project/assign-project.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly assignProjectManagerService: IAssignProjectService,
  ) {}

  @ApiParam({
    name: 'uuid',
    description: 'Give vendor contact uuid',
  })
  @Get(':uuid')
  async dashboard(
    @Param() param: ParamUUIDDto,
    @GetContact() contact: ContactCompleteResponseDto,
  ) {
    try {
      return this.assignProjectManagerService.vendorDashboard(
        param.uuid,
        contact,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
