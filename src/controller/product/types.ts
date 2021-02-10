import { Request, RequestHandler } from 'express';
import Product from '../../db/models/product';
export type SearchRequest = Request<
  undefined,
  Product[],
  undefined,
  { keyword: string }
>;
export type SearchHandler = RequestHandler<
  unknown,
  Product[],
  undefined,
  { keyword: string }
>;

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
export type ListHandler = RequestHandler<
  { cateId: number },
  Product[] | string,
  undefined,
  {
    limit?: string;
    lastId?: string;
    offset?: string;
    filter: string;
  }
>;

export type DetailRequest = Request<
  { productId: number },
  Product | string,
  undefined,
  undefined
>;
export type DetailHandler = RequestHandler<
  { productId: number },
  Product | string,
  undefined,
  undefined
>;
