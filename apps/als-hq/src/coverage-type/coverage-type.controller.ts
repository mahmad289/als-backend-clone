import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { ICoverageTypeService } from 'als/manager/requirement-group/interfaces/coverage-type.service';

@ApiBearerAuth()
@ApiTags('Master Requirement')
@Controller('coverage-type')
export class CoverageTypeController {
  constructor(private coverageTypeService: ICoverageTypeService) {}

  @Get()
  async getAll(@Query() query: SearchableDto) {
    try {
      return await this.coverageTypeService.getAll(query);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
