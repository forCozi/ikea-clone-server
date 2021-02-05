import { Request } from 'express';
import Product from '../../db/models/product';

export type ListRequest = Request<
  { cateId: number },
  Product[] | string,
  undefined,
  {
    limit?: string;
    lastId?: string;
    offset?: string;
    filters: { [key: string]: unknown };
  }
>;

export type DetailRequest = Request<
  { productId: number },
  Product | string,
  undefined,
  undefined
>;
