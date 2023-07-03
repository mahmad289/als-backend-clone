import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { initWinston, winstonLogger } from '../utils/winstonLogger';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private configService: ConfigService) {
    initWinston('apps/als-hq/logs');
  }
  transform(value: any) {
    const fileSize = parseInt(this.configService.get('FILE_SIZE_MB') || '5');
    if (value.size > fileSize * 1024 * 1024) {
      winstonLogger.errorLog.error(
        `File size must be less than ${fileSize} MB`,
      );
      throw new BadRequestException(
        `File size must be less than ${fileSize} MB`,
      );
    }

    const allowedExtensions = [
      '.jpeg',
      '.jpg',
      '.png',
      '.pdf',
      '.doc',
      '.docx',
      '.docm',
      '.dotx',
      '.dotm',
      '.xls',
      '.xlsx',
      '.xlsm',
      '.xlsb',
    ];

    const extension = value.originalname.substr(
      value.originalname.lastIndexOf('.'),
    );

    if (!allowedExtensions.includes(extension)) {
      throw new BadRequestException(
        winstonLogger.errorLog.error(
          `File extension must be one of: ${allowedExtensions.join(', ')}`,
        ),
        `File extension must be one of: ${allowedExtensions.join(', ')}`,
      );
    }

    return value;
  }
}
