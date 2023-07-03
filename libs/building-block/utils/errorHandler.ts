import { HttpStatus } from '@nestjs/common';
import { MongoError } from 'mongodb';

import { ServiceError } from './apiError';
import { winstonLogger } from './winstonLogger';

export function errorHandler(error: any) {
  if (error instanceof MongoError) {
    winstonLogger.errorLog.error(error.stack);
    throw new Error(`MongoDB error: ${error.message}`);
  } else if (error instanceof ServiceError) {
    winstonLogger.errorLog.error(error.stack);
    throw error;
  } else if (error instanceof Object) {
    winstonLogger.errorLog.error(error.message);
    throw new ServiceError(
      error.errors[Object.keys(error.errors)[0]].message ||
        'Something went wrong',
      HttpStatus.BAD_REQUEST,
    );
  } else {
    throw new Error('Something went wrong');
  }
}
