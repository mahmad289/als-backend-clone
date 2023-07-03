import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ManagerModule } from 'als/manager';

import { AuthManagerService } from './auth-manager.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    ManagerModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRY },
    }),
  ],
  providers: [AuthManagerService, LocalStrategy, JwtStrategy],
  exports: [AuthManagerService],
})
export class AuthManagerModule {}
