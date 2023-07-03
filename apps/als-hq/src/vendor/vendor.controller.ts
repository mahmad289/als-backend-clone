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
import { VendorDetailSearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { VendorCreator } from 'als/building-block/RequestableDto/Vendor/VendorCreator';
import {
  VendorContactUpdate,
  VendorUpdate,
} from 'als/building-block/RequestableDto/Vendor/VendorUpdate';
import { ServiceError } from 'als/building-block/utils/apiError';
import { IVendorService } from 'als/manager/vendor/vendor.service';

@ApiBearerAuth()
@ApiTags('Vendor')
@Controller('vendor')
export class VendorController {
  constructor(private vendorService: IVendorService) {}

  @Get()
  async findAll(@Query() query: VendorDetailSearchableDto) {
    try {
      return await this.vendorService.getAll(query);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give vendor id',
  })
  @Get(':id')
  async findById(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      const res = await this.vendorService.getById(param.id);
      if (!res) {
        throw new ServiceError('Vendor not found', HttpStatus.NOT_FOUND);
      }

      return res;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create')
  async create(@Body() vendorCreatePayload: VendorCreator) {
    try {
      return await this.vendorService.create(vendorCreatePayload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give vendor id',
  })
  @Patch(':id')
  async update(
    @Param()
    param: ParamIdDto,
    @Body() vendorUpdatePayload: VendorUpdate,
  ) {
    try {
      const res = await this.vendorService.update(
        param.id,
        vendorUpdatePayload,
      );

      if (!res) {
        throw new ServiceError('Failed To Update Vendor', HttpStatus.NOT_FOUND);
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
    description: 'Give vendor id',
  })
  @Patch(':id/assign-contact')
  async assignContact(
    @Param()
    param: ParamIdDto,
    @Body() vendorContactUpdatePayload: VendorContactUpdate,
  ) {
    try {
      return await this.vendorService.assignContacts(
        param.id,
        vendorContactUpdatePayload,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
