import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';

import { RequirementsCreator } from '../RequestableDto/Requirements/RequirementsCreator';
import { TemplateCompleteResponseDto } from '../TransferableDto/Template/Template';

faker.seed(4868543);

interface requirementGroupInterface {
  name: string;
  requirement_items: ObjectId[];
  acord25template_id?: ObjectId;
  acord28template_id?: ObjectId;
}

export function createRequirmentGroup(
  numOfreq_group: number,
  data: ObjectId[],
  templates: TemplateCompleteResponseDto[],
): RequirementsCreator[] {
  const requirements = [];
  for (let i = 0; i < numOfreq_group; i++) {
    const randIndex = Math.floor(Math.random() * templates.length);
    const reqGroup: requirementGroupInterface = {
      name: `${faker.company.name()}-${Date.now().toString()}`,
      requirement_items: [
        ...faker.helpers.uniqueArray(data, Math.random() * 10),
      ],
    };

    if (templates[randIndex].type === 'Acord 25') {
      reqGroup.acord25template_id = templates[randIndex]._id;
    } else {
      reqGroup.acord28template_id = templates[randIndex]._id;
    }

    requirements.push(reqGroup);
  }

  return requirements;
}
