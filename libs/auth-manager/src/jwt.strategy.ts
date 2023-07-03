import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IUserService } from 'als/manager/user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

import {
  TokenPayloadDecodedByPassport,
  UserAssignedToRequest,
} from './jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: IUserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(
    payload: TokenPayloadDecodedByPassport,
  ): Promise<UserAssignedToRequest> {
    const user = await this.userService.getById(payload.sub.toString());

    if (!user) {
      throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
    }

    return { userId: payload.sub, role: payload.role };
  }
}
