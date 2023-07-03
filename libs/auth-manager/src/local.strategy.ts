import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserCompleteResponsewithPasswordDto } from 'als/building-block/TransferableDto/User/User';
import { Strategy } from 'passport-local';

import { AuthManagerService } from './auth-manager.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthManagerService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<UserCompleteResponsewithPasswordDto> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
