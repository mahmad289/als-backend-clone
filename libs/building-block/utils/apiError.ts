import { HttpStatus } from '@nestjs/common';

export class ServiceError extends Error {
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}
