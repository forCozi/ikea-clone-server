import { RequestHandler } from 'express';

export type AddCartHandler = RequestHandler<
  unknown,
  unknown,
  { productId: string; userEmail: string },
  unknown
>;

export type AddWishHandler = RequestHandler<
  unknown,
  unknown,
  { productId: string; userEmail: string },
  unknown
>;

export type RemoveCartHandler = RequestHandler<
  unknown,
  unknown,
  unknown,
  { productid: string; email: string }
>;

export type RemoveWishHandler = RequestHandler<
  unknown,
  unknown,
  unknown,
  { productid: string; email: string }
>;

export type GetCartHandler = RequestHandler<
  { email: string },
  unknown,
  unknown,
  unknown
>;

export type GetWishHandler = RequestHandler<
  { email: string },
  unknown,
  unknown,
  unknown
>;

export type GetHistoryHandler = RequestHandler<
  { email: string },
  unknown,
  unknown,
  unknown
>;
