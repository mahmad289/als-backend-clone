import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ContactCompleteResponseDto } from '../TransferableDto/Contact/Contact';

export const GetContact = createParamDecorator(
  (data: unknown, context: ExecutionContext): ContactCompleteResponseDto => {
    const req = context.switchToHttp().getRequest();
    return req.contact;
  },
);
