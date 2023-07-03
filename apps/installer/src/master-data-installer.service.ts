import { faker } from '@faker-js/faker';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { userInstallerData } from 'als/building-block/installerData/userInstallerData';
import { ClientCreator } from 'als/building-block/RequestableDto/Client/ClientCreator';
import { ContactCreator } from 'als/building-block/RequestableDto/Contact/ContactCreator';
import { UserCreator } from 'als/building-block/RequestableDto/User/UserCreator';
import { VendorCreator } from 'als/building-block/RequestableDto/Vendor/VendorCreator';
import { CONTACT_TYPE_CATEGORY_ENUM } from 'als/building-block/utils/enum';
import {
  createClients,
  createContacts,
  createVendors,
} from 'als/building-block/utils/fakeData';
import {
  initWinston,
  winstonLogger,
} from 'als/building-block/utils/winstonLogger';
import { IClientService } from 'als/manager/client/client.service';
import { IContactService } from 'als/manager/contact/contact.service';
import { ITagService } from 'als/manager/tag/tag.service';
import { IUserService } from 'als/manager/user/user.service';
import { IVendorService } from 'als/manager/vendor/vendor.service';
import { ObjectId } from 'mongodb';

faker.seed(4868543);
@Injectable()
export class MasterDataInstallerService {
  constructor(
    private userService: IUserService,
    private contactService: IContactService,
    private clientService: IClientService,
    private vendorService: IVendorService,
    private tagService: ITagService,
  ) {
    initWinston('logs');
  }

  async dropMasterDataCollection() {
    try {
      Logger.warn('[-] DROPPING MASTER DATA COLLECTIONS');
      await Promise.all([
        this.userService.deleteAll(),
        this.vendorService.deleteAll(),
        this.clientService.deleteAll(),
        this.contactService.deleteAll(),
      ]);

      Logger.warn('[-] MASTER DATA COLLECTIONS DROPPED!');
    } catch (e) {
      Logger.error('Error while dropping master data collections', e);
      winstonLogger.errorLog.error(e.stack);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async addContact<T>(
    data: T & { contacts_id: ObjectId[] },
    type: CONTACT_TYPE_CATEGORY_ENUM,
  ): Promise<T> {
    const contacts = await this.contactService.find({ contact_type: type });
    let contactsIdArray: ObjectId[] = [];
    if (contacts && contacts.length > 0) {
      const ids = contacts.map(contact => contact._id);
      contactsIdArray = faker.helpers.uniqueArray(ids, Math.random() * 10);
    }

    data.contacts_id = contactsIdArray;
    return data;
  }

  async createContacts(contactData: ContactCreator[]) {
    for (const contact of contactData) {
      try {
        const contactResponse = await this.contactService.create(contact);

        Logger.log(`Contact created with id: ${contactResponse._id}`);
      } catch (error) {
        winstonLogger.errorLog.error(error.stack);
        Logger.log(`Error while creating user, ${error.message}`);
      }
    }
  }
  async createUsers(alsUserData: UserCreator[]) {
    for (const alsUser of alsUserData) {
      try {
        const user = await this.userService.create(alsUser);
        Logger.log(`Als user created with id: ${user._id}`);
      } catch (error) {
        winstonLogger.errorLog.error(error.stack);
        Logger.log(`Error while creating user, ${error.message}`);
      }
    }
  }

  async createClients(clientData: ClientCreator[]) {
    const alsUserCreated = await this.userService.getAll();
    const userIds = alsUserCreated.data.map(el => el._id);
    for (const client of clientData) {
      try {
        client.company_manager = faker.helpers.arrayElement(userIds);
        const clientResponse = await this.clientService.create(
          await this.addContact(client, CONTACT_TYPE_CATEGORY_ENUM.CLIENT),
        );

        Logger.log(`Client created with id: ${clientResponse._id}`);
      } catch (error) {
        error(error.stack);
        Logger.log(`Error while creating user, ${error.message}`);
      }
    }
  }
  async createVendors(vendorData: VendorCreator[]) {
    for (const vendor of vendorData) {
      try {
        const vendorResponse = await this.vendorService.create(
          await this.addContact(vendor, CONTACT_TYPE_CATEGORY_ENUM.VENDOR),
        );

        Logger.log(`Vendor created with id: ${vendorResponse._id}`);
      } catch (error) {
        winstonLogger.errorLog.error(error.stack);
        Logger.log(`Error while creating vendor, ${error.message}`);
      }
    }
  }

  async checkInsertedData() {
    try {
      const alsUserCreated = await this.userService.getAll();
      Logger.log(`Als user created: ${alsUserCreated?.total}`);
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.log(`Unable to get users: ${error.message}`);
    }

    try {
      const clientCreated = await this.clientService.getAll();
      Logger.log(`Clients created: ${clientCreated?.total}`);
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.log(`Unable to get clients: ${error.message}`);
    }

    try {
      const VendorCreated = await this.vendorService.getAll();
      Logger.log(`Vendors created: ${VendorCreated?.data.length}`);
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.log(`Unable to get vendors: ${error.message}`);
    }

    try {
      const contactCreated = await this.contactService.getAll();
      Logger.log(`Contacts created: ${contactCreated?.data.length}`);
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.log(`Unable to get contacts: ${error.message}`);
    }
  }

  async dropDatabase() {
    try {
      Logger.warn('[-] DROPPING WHOLE DATABASE');
      await this.vendorService.dropDatabase();
      Logger.warn('[-] WHOLE DATABASE DROPPED');
    } catch (e) {
      winstonLogger.errorLog.error(e.stack);
      Logger.error('Error while dropping whole database', e);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async installMasterData() {
    try {
      const alsUsers = await this.userService.getAll();
      const tagList = await this.tagService.findAll();
      // const tagList = await this.
      if (alsUsers?.data && alsUsers?.data.length > 0) {
        Logger.warn('[-] RECORDS ALREADY EXIST IN DATABASE!');
        return;
      } else {
        if (tagList.length > 0) {
          Logger.warn('[-] SEEDING MASTER DATA!');
          const alsUserData = userInstallerData;
          const contactData = createContacts(500);
          let clientData = createClients(200);
          let vendorData = createVendors(200);
          const tagsIds = tagList.map(el => el._id);

          clientData = clientData.map(el => {
            return { ...el, tags: faker.helpers.arrayElements(tagsIds, 2) };
          });

          vendorData = vendorData.map(el => {
            return { ...el, tags: faker.helpers.arrayElements(tagsIds, 2) };
          });

          await Promise.all([
            this.createUsers(alsUserData),
            this.createContacts(contactData),
          ]);

          await Promise.all([
            this.createClients(clientData),
            this.createVendors(vendorData),
          ]);
          await this.checkInsertedData();
          Logger.warn('[-] MASTER DATA SEEDED!');
          return 'Installer data seeded!';
        } else {
          Logger.warn('[-] SEED THE TAGS DATA FIRST!');
        }
      }
    } catch (e) {
      winstonLogger.errorLog.error(e.stack);
      Logger.error('Error while seeding data', e);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async installUATMasterData() {
    try {
      const alsUsers = await this.userService.getAll();
      if (alsUsers?.data && alsUsers?.data.length > 0) {
        Logger.warn('[-] RECORDS ALREADY EXIST IN DATABASE!');
        return;
      } else {
        Logger.warn('[-] SEEDING MASTER DATA!');
        const alsUserData = userInstallerData;
        await this.createUsers(alsUserData);
        Logger.warn('[-] MASTER DATA SEEDED!');
        return 'Installer data seeded!';
      }
    } catch (e) {
      winstonLogger.errorLog.error(e.stack);
      Logger.error('Error while seeding data', e);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async dropUATMasterDataCollection() {
    try {
      Logger.warn('[-] DROPPING MASTER DATA COLLECTIONS');
      await this.userService.deleteAll(),
        Logger.warn('[-] MASTER DATA COLLECTIONS DROPPED!');
    } catch (e) {
      Logger.error('Error while dropping master data collections', e);
      winstonLogger.errorLog.error(e.stack);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
