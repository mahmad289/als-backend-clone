import { Response } from 'express';

export abstract class IUploadService {
  abstract savedFilePath(file: Express.Multer.File): Promise<{
    filename: string;
    key: string;
  }>;

  abstract getFile(fileName: string, res: Response): Promise<void>;
}
