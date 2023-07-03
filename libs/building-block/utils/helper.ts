import { ObjectId } from 'mongodb';

import { INode } from './genericInterface';

export function buildTree(
  items: INode[],
  parentId: null | ObjectId = null,
  level = 1,
  maxLevel = 6,
) {
  const result: INode[] = [];
  if (level > maxLevel) {
    return result;
  }

  for (const item of items.filter(i => i.parent === parentId)) {
    const children = buildTree(items, item._id, level + 1, maxLevel);
    if (children.length > 0) {
      item.children = children;
    }

    result.push(item);
  }

  return result;
}

export function findDescendants(data: INode[], _id: ObjectId) {
  const descendants: ObjectId[] = [];

  for (const obj of data) {
    if ((obj.parent ? obj.parent.toString() : '') === _id.toString()) {
      descendants.push(obj['_id']);
      descendants.push(...findDescendants(data, obj['_id']));
    }
  }

  return descendants;
}
