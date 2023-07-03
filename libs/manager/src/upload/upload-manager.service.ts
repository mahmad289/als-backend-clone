import { HttpStatus, Injectable } from '@nestjs/common';
import { ServiceError } from 'als/building-block/utils/apiError';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  fileExists,
  isFilenameFormatUUIDv4,
} from 'als/building-block/utils/uploadHelpers';
import { Response } from 'express';
import { resolve } from 'path';

import { IUploadService } from './upload-service';

const INVALID_FILENAME = 'Invalid Filename';
const NOT_FOUND = 'File Not Found';
@Injectable()
export class UploadManagerService implements IUploadService {
  async savedFilePath(file: Express.Multer.File) {
    return {
      filename: file.originalname,
      key: file.filename,
    };
  }

  async getFile(fileName: string, res: Response) {
    try {
      const isValidFilename: boolean = isFilenameFormatUUIDv4(fileName);
      if (!isValidFilename) {
        throw new ServiceError(INVALID_FILENAME, HttpStatus.BAD_REQUEST);
      }

      const filePath = `uploads/${fileName}`;
      const fileAvailable: boolean = fileExists(filePath);
      if (!fileAvailable) {
        throw new ServiceError(NOT_FOUND, HttpStatus.BAD_REQUEST);
      }

      res.sendFile(resolve(filePath));
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
