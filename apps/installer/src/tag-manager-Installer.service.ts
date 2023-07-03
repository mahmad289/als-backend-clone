import { faker } from '@faker-js/faker';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  initWinston,
  winstonLogger,
} from 'als/building-block/utils/winstonLogger';
import { ITagService } from 'als/manager/tag/tag.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class TagsInstallerService {
  constructor(private tagService: ITagService) {
    initWinston('logs');
  }
  async tagData(numOfParents: number, countOfTags: number) {
    try {
      const IdsArray: ObjectId[] = [];
      for (let i = 0; i < countOfTags; i++) {
        if (i < numOfParents) {
          const res = await this.tagService.create({
            name: faker.company.name(),
          });

          Logger.log(`creating Parent Tag with id ${res._id}`);
          IdsArray.push(res._id);
        } else {
          const res = await this.tagService.create({
            name: faker.internet.userName(),
            parent: faker.helpers.arrayElement(IdsArray),
          });

          Logger.log(`creating Child Tag with id ${res._id}`);
          IdsArray.push(res._id);
        }
      }
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.log(`Unable to get Projects: ${error.message}`);
    }
  }

  async dropTagsDataCollection() {
    try {
      Logger.warn('[-] DROPING TAGS DATA COLLECTIONS');
      await this.tagService.deleteAll();
      Logger.warn('[-] TAGS DATA COLLECTIONS DROPPED');
    } catch (e) {
      winstonLogger.errorLog.error(e.stack);
      Logger.error('Error while dropping tags data collection', e);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }
  async installTagData() {
    try {
      const existingTags = await this.tagService.getAll();
      if (existingTags && existingTags.length > 0) {
        Logger.warn('[-] TAGS ALREADY EXIST IN DATABASE!');
      } else {
        Logger.warn('[-] SEEDING TAGS DATA!');

        await this.tagData(5, 50);

        Logger.warn(`[-]TAGS LIST SEEDED!  `);
      }
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.error('Error while seeding  tags', error);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
