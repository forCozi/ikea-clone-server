import cryptoRandomString from 'crypto-random-string';
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import Cart from '../../db/models/cart';
import History from '../../db/models/history';
import Payment from '../../db/models/payment';
import User from '../../db/models/user';
import { SuccessPaypalReq } from './types';
import {
  addCart,
  addWish,
  getCart,
  getHistory,
  getWish,
  removeCart,
  removeWish,
  successPaypal,
} from './userProduct';

let req: MockRequest<any>;
let res: MockResponse<any>;
let next: jest.Mock<any, any>;
beforeEach(() => {
  User.findOne = jest.fn();
  Cart.destroy = jest.fn();
  Cart.findOne = jest.fn();
  Cart.findAll = jest.fn();
  Payment.create = jest.fn();
  History.create = jest.fn();
  Cart.destroy = jest.fn();
  Payment.findAll = jest.fn();
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('ADD WISH', () => {
  test('should be function', () => {
    expect(typeof addWish).toBe('function');
  });
  test('should call User.findOne', async () => {
    req.user = { email: 'email' };
    req.body = { userEmail: 'email', productId: '123' };
    const addWishItem = jest.fn();
    (User.findOne as jest.Mock).mockReturnValue({ addWishItem });
    await addWish(req, res, next);
    expect(User.findOne).toBeCalledWith({ where: { email: 'email' } });
    expect(addWishItem).toBeCalledWith('123');
  });
  test('should return 404 when user not exist', async () => {
    req.user = { email: 'email' };
    req.body = { userEmail: 'email', productId: '123' };
    (User.findOne as jest.Mock).mockReturnValue(null);
    await addWish(req, res, next);
    expect(res.statusCode).toBe(404);
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (User.findOne as jest.Mock).mockReturnValue(rejectedPromise);
    await addWish(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});

describe('REMOVE WISH', () => {
  test('should be function', () => {
    expect(typeof removeWish).toBe('function');
  });
  test('should call User.findOne', async () => {
    req.user = { email: 'email' };
    req.query = { email: 'email', productid: '123' };
    const removeWishItem = jest.fn();
    (User.findOne as jest.Mock).mockReturnValue({ removeWishItem });
    await removeWish(req, res, next);
    expect(User.findOne).toBeCalledWith({ where: { email: 'email' } });
    expect(removeWishItem).toBeCalledWith('123');
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (User.findOne as jest.Mock).mockReturnValue(rejectedPromise);
    await removeWish(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});

describe('ADD CART', () => {
  test('should be function', () => {
    expect(typeof addCart).toBe('function');
  });
  test('should call User.findOne and Cart.findOne', async () => {
    req.user = { email: 'email' };
    req.body = { userEmail: 'email', productId: '123' };
    const update = jest.fn();
    (User.findOne as jest.Mock).mockReturnValue({ id: '1' });
    (Cart.findOne as jest.Mock).mockReturnValue({ update, quantity: 1 });
    await addCart(req, res, next);
    expect(User.findOne).toBeCalledWith({ where: { email: 'email' } });
    expect(Cart.findOne).toBeCalledWith({
      where: { ProductId: '123', UserId: '1' },
    });
  });
  test('should return 404 when user not exist', async () => {
    req.user = { email: 'email' };
    req.body = { userEmail: 'email', productId: '123' };
    (User.findOne as jest.Mock).mockReturnValue(null);
    await addCart(req, res, next);
    expect(res.statusCode).toBe(404);
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (User.findOne as jest.Mock).mockReturnValue(rejectedPromise);
    await addCart(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});

describe('REMOVE CART', () => {
  test('should be function', () => {
    expect(typeof removeCart).toBe('function');
  });
  test('should call User.findOne', async () => {
    req.user = { email: 'email' };
    req.query = { email: 'email', productid: '123' };
    (User.findOne as jest.Mock).mockReturnValue({ id: '1' });
    await removeCart(req, res, next);
    expect(User.findOne).toBeCalledWith({ where: { email: 'email' } });
    expect(Cart.destroy).toBeCalledWith({
      where: { UserId: '1', ProductId: '123' },
    });
    expect(res.statusCode).toBe(201);
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (User.findOne as jest.Mock).mockReturnValue(rejectedPromise);
    await removeCart(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});

describe('GET WISHLIST', () => {
  test('should be function', () => {
    expect(typeof getWish).toBe('function');
  });
  test('should call User.findOne and return 404', async () => {
    req.params = { email: 'yhg0337@naver.com' };
    (User.findOne as jest.Mock).mockReturnValue(false);
    await getWish(req, res, next);
    expect(User.findOne).toBeCalledWith({ where: { email: req.params.email } });
    expect(res.statusCode).toBe(404);
  });
  test('should call user.getWishItem and return 200', async () => {
    req.params = { email: 'yhg0337@naver.com' };
    const getWishItem = jest.fn();
    (User.findOne as jest.Mock).mockReturnValue({ getWishItem });
    await getWish(req, res, next);
    expect(getWishItem).toBeCalledTimes(1);
    expect(res.statusCode).toBe(200);
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (User.findOne as jest.Mock).mockReturnValue(rejectedPromise);
    await getWish(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});

describe('GET CARTS', () => {
  test('should be function', () => {
    expect(typeof getCart).toBe('function');
  });
  test('should call User.findOne and return 404', async () => {
    req.params = { email: 'yhg0337@naver.com' };
    (User.findOne as jest.Mock).mockReturnValue(false);
    await getCart(req, res, next);
    expect(User.findOne).toBeCalledWith({ where: { email: req.params.email } });
    expect(res.statusCode).toBe(404);
  });
  test('should call Cart.findAll and return 200', async () => {
    req.params = { email: 'yhg0337@naver.com' };
    (User.findOne as jest.Mock).mockReturnValue(true);
    await getCart(req, res, next);
    expect(Cart.findAll).toBeCalledTimes(1);
    expect(res.statusCode).toBe(200);
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (User.findOne as jest.Mock).mockReturnValue(rejectedPromise);
    await getCart(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});

describe('GET HISTORY', () => {
  test('should be function', () => {
    expect(typeof getHistory).toBe('function');
  });
  test('should call User.findOne and return 404', async () => {
    req.params = { email: 'yhg0337@naver.com' };
    (User.findOne as jest.Mock).mockReturnValue(false);
    await getHistory(req, res, next);
    expect(User.findOne).toBeCalledWith({ where: { email: req.params.email } });
    expect(res.statusCode).toBe(404);
  });
  test('should call Payment.findAll and return 200', async () => {
    req.params = { email: 'yhg0337@naver.com' };
    (User.findOne as jest.Mock).mockReturnValue(true);
    await getHistory(req, res, next);
    expect(Payment.findAll).toBeCalledTimes(1);
    expect(res.statusCode).toBe(200);
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (User.findOne as jest.Mock).mockReturnValue(rejectedPromise);
    await getHistory(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});

describe('PAYPAL SUCCESS', () => {
  beforeEach(() => {
    (req.body as SuccessPaypalReq) = {
      userInfo: {
        address: '1',
        email: '1',
        name: '1',
        phone: '1',
        totalPrice: 111,
      },
      payment: {
        email: '1',
        address: {
          city: '1',
          country_code: '1',
          line1: '1',
          postal_code: '1',
          recipient_name: '1',
          state: '1',
        },
        cancelled: false,
        paid: true,
        payerID: '1',
        paymentID: '1',
        paymentToken: '1',
        returnUrl: '1',
      },
      productInfo: [
        { id: '1', quantity: 1, size: '1', slCost: '1', title: '1' },
      ],
    };
  });
  test('should be function', () => {
    expect(typeof successPaypal).toBe('function');
  });
  test('should call User.findOne and return 404', async () => {
    req.user = { email: 'yhg0337@naver.com' };
    (User.findOne as jest.Mock).mockReturnValue(false);
    await successPaypal(req, res, next);
    expect(User.findOne).toBeCalledWith({ where: { email: req.user.email } });
    expect(res.statusCode).toBe(404);
  });
  test('should call Payment.create and fail', async () => {
    req.user = { email: 'yhg0337@naver.com' };
    (User.findOne as jest.Mock).mockReturnValue(true);
    (Payment.create as jest.Mock).mockReturnValue(false);
    await successPaypal(req, res, next);
    expect(Payment.create).toBeCalledTimes(1);
    expect(res.statusCode).toBe(400);
  });
  test('should call History.create and Cart.destroy', async () => {
    req.user = { email: 'yhg0337@naver.com' };
    (Payment.create as jest.Mock).mockReturnValue({
      id: cryptoRandomString({ length: 3 }),
    });
    (User.findOne as jest.Mock).mockReturnValue(true);
    await successPaypal(req, res, next);
    expect(History.create).toBeCalledTimes(req.body.productInfo.length);
    expect(Cart.destroy).toBeCalledTimes(req.body.productInfo.length);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData().length).toBe(req.body.productInfo.length);
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (User.findOne as jest.Mock).mockReturnValue(rejectedPromise);
    await successPaypal(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});
