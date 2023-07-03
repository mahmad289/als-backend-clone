import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Reflector } from '@nestjs/core';
import { IContactService } from 'als/manager/contact/contact.service';
import * as jwt from 'jsonwebtoken';

import { IS_PUBLIC_KEY } from '../decorators/IsPublic';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly contactService: IContactService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // @ For Public Routes, Exclude authentication checks
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // @ Authentication Logic
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }

    try {
      if (authHeader && authHeader.startsWith('Bearer')) {
        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(
          token,
          process.env.JWT_SECRET ? process.env.JWT_SECRET : '',
        );

        const contact = await this.contactService.getById(decoded._id);

        if (!contact) {
          throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
        }

        req.contact = contact;
        return true;
      }
    } catch (error) {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }

    return false;
  }
}
