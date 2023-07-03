import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ParamIdDto } from 'als/building-block/RequestableDto/params.dto';
import {
  TagCreator,
  TagUpdate,
} from 'als/building-block/RequestableDto/Tag/TagCreator';
import { ServiceError } from 'als/building-block/utils/apiError';
import { ITagService } from 'als/manager/tag/tag.service';

@ApiTags('Tag')
@ApiBearerAuth()
@Controller('tag')
export class TagController {
  constructor(private tagManagerService: ITagService) {}

  @Get()
  async getAll() {
    try {
      return await this.tagManagerService.getAll();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() tagCreatorPayload: TagCreator) {
    try {
      return await this.tagManagerService.create(tagCreatorPayload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give tag Id',
  })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() tagUpdatePayload: TagUpdate,
  ) {
    try {
      const res = await this.tagManagerService.update(
        param.id,
        tagUpdatePayload,
      );

      if (!res) {
        throw new ServiceError('Failed To Update Tags', HttpStatus.NOT_FOUND);
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
    description: 'Give tag id',
  })
  @Patch('delete/:id')
  async delete(@Param() param: ParamIdDto) {
    try {
      return await this.tagManagerService.delete(param.id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
