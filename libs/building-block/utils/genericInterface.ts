import { ObjectId } from 'mongodb';

export interface IGetAllResponse<T> {
  page: number;
  perPage: number;
  total: number;
  data: T[];
}

export interface INode {
  _id: ObjectId;
  parent: ObjectId;
  name: string;
  count: number;
  children?: INode[] | [];
}
