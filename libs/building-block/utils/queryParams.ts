import { SearchableDto } from '../RequestableDto/searchable.dto';

export function createQueryparams(query: SearchableDto, fields: string[]) {
  let conditions = [];
  const page = parseInt(query.page);
  const pagination = {
    limit: parseInt(query.limit ? query.limit : '0'),
    page: !page || page === 0 ? 1 : page,
  };

  if (query.keyword) {
    for (const field of fields) {
      conditions.push({
        [field]: { $regex: query.keyword, $options: 'i' },
      });
    }
  }

  if (conditions.length < 1) {
    conditions = [{}];
  }

  return { pagination, conditions };
}

export function getQueryConditions(conditions: any) {
  const $or: Record<string, unknown>[] = [];
  if (conditions && conditions.length > 0) {
    conditions.forEach((condition: any) => {
      $or.push(condition);
    });
  }

  return $or;
}
