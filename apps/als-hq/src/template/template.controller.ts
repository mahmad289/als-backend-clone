import {
  Body,
  Controller,
  Delete,
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
import { GetTemplateDto } from 'als/building-block/RequestableDto/Template/GetTemplateDto';
import { TemplateCopyCreator } from 'als/building-block/RequestableDto/Template/TemplateCopyCreator';
import {
  RuleDto,
  TemplateCreator,
} from 'als/building-block/RequestableDto/Template/TemplateCreator';
import {
  TemplateNameUpdate,
  TemplateRuleUpdate,
  TemplateUpdate,
} from 'als/building-block/RequestableDto/Template/TemplateUpdate';
import { ITemplateService } from 'als/manager/requirement-group/interfaces/template.service';

@ApiBearerAuth()
@ApiTags('Template')
@Controller('template')
export class TemplateController {
  constructor(private templateService: ITemplateService) {}

  @Post('create')
  async create(@Body() templateCreator: TemplateCreator) {
    try {
      return await this.templateService.create(templateCreator);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create-copy')
  async createCopy(@Body() creatorPayload: TemplateCopyCreator) {
    try {
      return await this.templateService.createCopy(creatorPayload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async get(@Query() getTemplateDto: GetTemplateDto) {
    try {
      return await this.templateService.find(getTemplateDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give Template Id',
  })
  @Get(':id')
  async findById(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      return await this.templateService.getById(param.id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give Template Id',
  })
  @Get(':id/:master_requirement_id')
  async findRuleById(
    @Param('id') id: string,
    @Param('master_requirement_id') master_requirement_id: string,
  ) {
    try {
      return await this.templateService.getRuleById(id, master_requirement_id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give Template Id',
  })
  @Patch(':id')
  async update(
    @Param()
    param: ParamIdDto,
    @Body() templateUpdate: TemplateUpdate,
  ) {
    try {
      return await this.templateService.update(param.id, templateUpdate);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @ApiParam({
    name: 'id',
    description: 'Give Template Id',
  })
  @Patch('update-name/:id')
  async templateNameEdit(
    @Param()
    param: ParamIdDto,
    @Body() name: TemplateNameUpdate,
  ) {
    try {
      return await this.templateService.templateNameEdit(param.id, name);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteTemplate(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      return await this.templateService.deleteOne(param.id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('toggle-rule/:id')
  async toggleRuleStatus(
    @Param()
    param: ParamIdDto,
    @Body() templateRuleUpdate: TemplateRuleUpdate,
  ) {
    try {
      return await this.templateService.toggleRuleStatus(
        param.id,
        templateRuleUpdate.master_requirement_id,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/:master_requirement_id')
  async UpdateRuleById(
    @Param('id') id: string,
    @Param('master_requirement_id') master_requirement_id: string,
    @Body() ruleUpdate: RuleDto,
  ) {
    try {
      return await this.templateService.updateRuleById(
        id,
        master_requirement_id,
        ruleUpdate,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
