import { Request, RequestHandler } from 'express';

export type AddCartRequest = Request<
  undefined,
  unknown,
  { productId: string; userEmail: string },
  unknown
>;
export type AddCartHandler = RequestHandler<
  unknown,
  unknown,
  { productId: string; userEmail: string },
  unknown
>;

export type AddWishRequest = Request<
  undefined,
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

export type RemoveCartRequest = Request<
  undefined,
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

export type RemoveWishRequest = Request<
  undefined,
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
