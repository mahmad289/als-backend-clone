import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CoiRequirementDto } from 'als/building-block/RequestableDto/MasterRequirement/CoiRequirementDto';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { IMasterRequirementService } from 'als/manager/requirement-group/interfaces/master-requirement.service';

@ApiBearerAuth()
@ApiTags('Master Requirement')
@Controller('master-requirement')
export class MasterRequirementController {
  constructor(private masterRequirementService: IMasterRequirementService) {}

  @Get()
  async getAll(@Query() query: SearchableDto) {
    try {
      return await this.masterRequirementService.getAll(query);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':document_type_name')
  async getCoiRequirement(
    @Param() param: CoiRequirementDto,
    @Query() query: SearchableDto,
  ) {
    try {
      return await this.masterRequirementService.find(
        { document_type_name: param.document_type_name },
        query,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
