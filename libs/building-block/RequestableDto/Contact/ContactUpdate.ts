import { PartialType } from '@nestjs/swagger';

import { ContactCreator } from './ContactCreator';

export class ContactUpdate extends PartialType(ContactCreator) {}
