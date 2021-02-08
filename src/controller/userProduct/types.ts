import { Request, RequestHandler } from 'express';

export type AddCartRequest = Request<
  undefined,
  unknown,
  { productId: string; userEmail: string },
  { keyword: string }
>;
export type AddCartHandler = RequestHandler<
  unknown,
  unknown,
  { productId: string; userEmail: string },
  { keyword: string }
>;

export type AddWishRequest = Request<
  undefined,
  unknown,
  { productId: string; userEmail: string },
  { keyword: string }
>;
export type AddWishHandler = RequestHandler<
  unknown,
  unknown,
  { productId: string; userEmail: string },
  { keyword: string }
>;

export type RemoveCartRequest = Request<
  undefined,
  unknown,
  { productId: string; userEmail: string },
  { keyword: string }
>;
export type RemoveCartHandler = RequestHandler<
  unknown,
  unknown,
  { productId: string; userEmail: string },
  { keyword: string }
>;

export type RemoveWishRequest = Request<
  undefined,
  unknown,
  { productId: string; userEmail: string },
  { keyword: string }
>;
export type RemoveWishHandler = RequestHandler<
  unknown,
  unknown,
  { productId: string; userEmail: string },
  { keyword: string }
>;
