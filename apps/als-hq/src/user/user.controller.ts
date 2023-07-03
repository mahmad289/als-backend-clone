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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthManagerService } from 'als/auth-manager/auth-manager.service';
import { LocalAuthGuard } from 'als/auth-manager/local-auth.guard';
import { IsPublic } from 'als/building-block/decorators/IsPublic';
import { ParamIdDto } from 'als/building-block/RequestableDto/params.dto';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { UserCreator } from 'als/building-block/RequestableDto/User/UserCreator';
import { UserPasswordUpdate } from 'als/building-block/RequestableDto/User/UserPasswordUpdate';
import { UserUpdate } from 'als/building-block/RequestableDto/User/UserUpdate';
import { ServiceError } from 'als/building-block/utils/apiError';
import { UserModelDocument } from 'als/manager/user/user.model';
import { IUserService } from 'als/manager/user/user.service';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private authService: AuthManagerService,
    private userService: IUserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @IsPublic()
  @Post('login')
  async login(@Req() req: Record<string, unknown>) {
    try {
      return this.authService.generateAccessToken(
        req.user as UserModelDocument,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(@Query() query: SearchableDto) {
    try {
      return await this.userService.getAll(query);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create')
  async create(@Body() userPayload: UserCreator) {
    try {
      return await this.userService.create(userPayload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give user_id',
  })
  @Get(':id')
  async findById(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      const res = await this.userService.getById(param.id);
      if (!res) {
        throw new ServiceError('User not found', HttpStatus.NOT_FOUND);
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
    description: 'Give user_id',
  })
  @Patch(':id')
  async update(
    @Param()
    param: ParamIdDto,
    @Body() userPayload: UserUpdate,
  ) {
    try {
      const res = await this.userService.update(param.id, userPayload);
      if (!res) {
        throw new ServiceError('Failed To Update User', HttpStatus.NOT_FOUND);
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
    description: 'Give user_id',
  })
  @Patch('update-password/:id')
  async updatePassword(
    @Param()
    param: ParamIdDto,
    @Body() userPayload: UserPasswordUpdate,
  ) {
    try {
      return await this.userService.updatePassword(param.id, userPayload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @ApiParam({
    name: 'id',
    description: 'Give user_id',
  })
  @Patch('delete/:id')
  async deleteOne(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      const res = await this.userService.deleteOne(param.id);
      if (!res) {
        throw new ServiceError('Failed To Delete User', HttpStatus.NOT_FOUND);
      }

      return res;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
