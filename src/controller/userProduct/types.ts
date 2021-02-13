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
export interface PaypalInfo {
  address: Address;
  cancelled: boolean;
  email: string;
  paid: boolean;
  payerID: string;
  paymentID: string;
  paymentToken: string;
  returnUrl: string;
}
export interface Address {
  city: string;
  country_code: string;
  line1: string;
  postal_code: string;
  recipient_name: string;
  state: string;
}
export interface CartProduct {
  id: string;
  title: string;
  slCost: string;
  size: string;
  quantity: number;
  [key: string]: string | number | undefined;
}
export type SuccessPaypalReq = {
  payment: PaypalInfo;
  userInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    totalPrice: number;
  };
  productInfo: CartProduct[];
};
export type SuccessPaypalHandler = RequestHandler<
  unknown,
  unknown,
  SuccessPaypalReq,
  unknown
>;
