/* eslint-disable @typescript-eslint/no-explicit-any */
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import { getProduct, getProducts, searchProduct } from './product';
import Product from '../../db/models/product';

let req: MockRequest<any>;
let res: MockResponse<any>;
let next: jest.Mock<any, any>;
beforeEach(() => {
  Product.findAll = jest.fn();
  Product.findOne = jest.fn();
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
describe('SEARCH CONTROLLER', () => {
  beforeEach(() => {
    Product.findAll = jest.fn();
  });
  test('should be Function', () => {
    expect(typeof searchProduct).toBe('function');
  });
  test('should call Product.findAll', async () => {
    req.query = { keyword: '검색어' };
    await searchProduct(req, res, next);
    expect(Product.findAll).toBeCalledTimes(1);
  });
  test('should return 200', async () => {
    (Product.findAll as jest.Mock).mockReturnValue(1);
    req.query = { keyword: '검색어' };
    await searchProduct(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(1);
  });
  test('should Handle Error', async () => {
    const errorMsg = { message: '에러발생' };
    const rejectedPromise = Promise.reject(errorMsg);
    (Product.findAll as jest.Mock).mockReturnValue(rejectedPromise);
    await searchProduct(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});
describe('GET PRODUCT LIST', () => {
  test('should be function', () => {
    expect(typeof getProducts).toBe('function');
  });
  test('should return 404', async () => {
    await getProducts(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getData()).toBe('카테고리를 찾을 수 없습니다.');
  });
  test('should return 200', async () => {
    req.params = { cateId: 1 };
    req.query = { limit: 32, offset: 1 };
    (Product.findAll as jest.Mock).mockReturnValue({ 11: 11 });
    await getProducts(req, res, next);
    expect(Product.findAll).toBeCalledTimes(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ 11: 11 });
  });
  test('should Handle Error', async () => {
    req.params = { cateId: 1 };
    const errorMsg = { message: '에러발생' };
    const rejectedPromise = Promise.reject(errorMsg);
    (Product.findAll as jest.Mock).mockReturnValue(rejectedPromise);
    await getProducts(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});
describe('GET DETAIL PRODUCT', () => {
  test('should be function', () => {
    expect(typeof getProduct).toBe('function');
  });
  test('should call Product.findOne', async () => {
    await getProduct(req, res, next);
    expect(Product.findOne).toBeCalled();
  });
  test('should return 404', async () => {
    (Product.findOne as jest.Mock).mockReturnValue(null);
    await getProduct(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getData()).toBe('해당 상품을 찾을 수 없습니다.');
  });
  test('should return 404', async () => {
    (Product.findOne as jest.Mock).mockReturnValue({ 11: 11 });
    await getProduct(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ 11: 11 });
  });
  test('should Handle Error', async () => {
    req.params = { productId: 1 };
    const errorMsg = { message: '에러발생' };
    const rejectedPromise = Promise.reject(errorMsg);
    (Product.findOne as jest.Mock).mockReturnValue(rejectedPromise);
    await getProduct(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});
