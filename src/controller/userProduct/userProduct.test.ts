import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import User from '../../db/models/user';
import { addCart, addWish, removeCart, removeWish } from './userProduct';

let req: MockRequest<any>;
let res: MockResponse<any>;
let next: jest.Mock<any, any>;
beforeEach(() => {
  User.findOne = jest.fn();
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
  test('should call User.findOne', async () => {
    req.user = { email: 'email' };
    req.body = { userEmail: 'email', productId: '123' };
    const addCartItem = jest.fn();
    (User.findOne as jest.Mock).mockReturnValue({ addCartItem });
    await addCart(req, res, next);
    expect(User.findOne).toBeCalledWith({ where: { email: 'email' } });
    expect(addCartItem).toBeCalledWith('123');
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
    const removeCartItem = jest.fn();
    (User.findOne as jest.Mock).mockReturnValue({ removeCartItem });
    await removeCart(req, res, next);
    expect(User.findOne).toBeCalledWith({ where: { email: 'email' } });
    expect(removeCartItem).toBeCalledWith('123');
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (User.findOne as jest.Mock).mockReturnValue(rejectedPromise);
    await removeCart(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});
