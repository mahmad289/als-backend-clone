import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ParamIdDto } from 'als/building-block/RequestableDto/params.dto';
import { RequirementsCopyCreator } from 'als/building-block/RequestableDto/Requirements/RequirementsCopyCreator';
import { RequirementsCreator } from 'als/building-block/RequestableDto/Requirements/RequirementsCreator';
import {
  RequirementsRemoveTemplate,
  RequirementsUpdate,
} from 'als/building-block/RequestableDto/Requirements/RequirementsUpdate';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { ServiceError } from 'als/building-block/utils/apiError';
import { IRequirementService } from 'als/manager/requirement-group/interfaces/requirements.service';

@ApiBearerAuth()
@ApiTags('Requirements')
@Controller('requirements')
export class RequirementsController {
  constructor(private requirementService: IRequirementService) {}

  @Post('create')
  async create(@Body() creatorPayload: RequirementsCreator) {
    try {
      return await this.requirementService.create(creatorPayload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create-copy')
  async createCopy(@Body() creatorPayload: RequirementsCopyCreator) {
    try {
      return await this.requirementService.createCopy(creatorPayload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAll(@Query() query: SearchableDto) {
    try {
      return await this.requirementService.getAll(query);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async updateItemList(
    @Param()
    param: ParamIdDto,
    @Body() updateRequirementPayload: RequirementsUpdate,
  ) {
    try {
      return await this.requirementService.updateRequirements(
        param.id,
        updateRequirementPayload,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findById(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      const res = await this.requirementService.getById(param.id);
      if (!res) {
        throw new ServiceError(
          'requirment group_id not found',
          HttpStatus.NOT_FOUND,
        );
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
    description: 'Requirement id ',
  })
  @Patch('remove-template/:id')
  async templateUnassign(
    @Param()
    param: ParamIdDto,
    @Body() updateRequirementPayload: RequirementsRemoveTemplate,
  ) {
    try {
      return await this.requirementService.removeTemplate(
        param.id,
        updateRequirementPayload,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
