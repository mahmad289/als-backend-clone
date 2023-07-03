import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserCompleteResponsewithPasswordDto } from 'als/building-block/TransferableDto/User/User';
import {
  initWinston,
  winstonLogger,
} from 'als/building-block/utils/winstonLogger';
import { UserModelDocument } from 'als/manager/user/user.model';
import { IUserService } from 'als/manager/user/user.service';
import * as bcrypt from 'bcryptjs';

import { GenerateJWTTokenPayload } from './jwt.interface';

@Injectable()
export class AuthManagerService {
  constructor(
    private jwtService: JwtService,
    private userService: IUserService,
  ) {
    initWinston('apps/als-hq/logs');
  }

  /**
   * It runs when we hit login route.
   * @constructor
   * @param {string} email
   * @param {string} password
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<UserCompleteResponsewithPasswordDto | null> {
    const user = await this.userService.userWithPassword({
      email: email,
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      winstonLogger.infoLog.info(`User ${user.email} logged in`);
      return user;
    }

    return null;
  }

  // A utility function to generate JWT token
  async generateAccessToken(user: UserModelDocument) {
    const payload: GenerateJWTTokenPayload = {
      role: user.role,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      img_url: user.img_url,
      sub: user._id,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : '',
      }),
    };
  }
}
