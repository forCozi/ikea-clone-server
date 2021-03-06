/* eslint-disable @typescript-eslint/no-explicit-any */
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import {
  createReview,
  getHomeFurnishing,
  getProduct,
  getProducts,
  getReview,
  imageUpload,
  searchProduct,
} from './product';
import Product from '../../db/models/product';
import HomeFurnishing from '../../db/models/homeFurnishing';
import Review from '../../db/models/review';
import ReviewImage from '../../db/models/reviewImage';
import User from '../../db/models/user';

let req: MockRequest<any>;
let res: MockResponse<any>;
let next: jest.Mock<any, any>;
beforeEach(() => {
  Product.findAll = jest.fn();
  Product.findOne = jest.fn();
  HomeFurnishing.findAll = jest.fn();
  Review.create = jest.fn();
  ReviewImage.create = jest.fn();
  Review.findOne = jest.fn();
  Review.findAll = jest.fn();
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
    req.query = { limit: 32, offset: 1, filter: 1 };
    (Product.findAll as jest.Mock).mockReturnValue({ 11: 11 });
    await getProducts(req, res, next);
    expect(Product.findAll).toBeCalledTimes(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ 11: 11 });
  });
  test('should switch filter', async () => {
    for (let i = 0; i < 7; i++) {
      req.params = { cateId: 1 };
      req.query = { limit: 32, offset: 1, filter: i };
      (Product.findAll as jest.Mock).mockReturnValue(req.query.filter);
      await getProducts(req, res, next);
      expect(Product.findAll).toBeCalled();
      expect(res.statusCode).toBe(200);
    }
    expect(Product.findAll).toBeCalledTimes(7);
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

describe('GET HOMEFURNISHING', () => {
  test('should be function', async () => {
    expect(typeof getHomeFurnishing).toBe('function');
  });
  test('should return 200', async () => {
    req.query = { limit: 1, offset: 1 };
    req.params = { cateId: 1 };
    (HomeFurnishing.findAll as jest.Mock).mockReturnValue({ 1: 1 });
    await getHomeFurnishing(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ 1: 1 });
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (HomeFurnishing.findAll as jest.Mock).mockReturnValue(rejectedPromise);
    await getHomeFurnishing(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});

describe('CREATE IMAGE', () => {
  test('should be function', () => {
    expect(typeof imageUpload).toBe('function');
  });
  test('should call', async () => {
    req.files = [{ filename: '123' }];
    await imageUpload(req, res, next);
    expect(res._getJSONData()).toEqual(['123']);
  });
});

describe('CREATE REVIEW', () => {
  test('should be function', () => {
    expect(typeof createReview).toBe('function');
  });
  test('should call Product.findOne and return 404', async () => {
    (Product.findOne as jest.Mock).mockReturnValue(false);
    await createReview(req, res, next);
    expect(Product.findOne).toBeCalledTimes(1);
    expect(res.statusCode).toBe(404);
  });
  test('if product.grade = 0', async () => {
    req.body = { grade: 3 };
    const update = jest.fn();
    (Product.findOne as jest.Mock).mockReturnValue({ grade: 0, update });
    await createReview(req, res, next);
    expect(Product.findOne).toBeCalledTimes(1);
    expect(update).toBeCalledTimes(1);
    expect(Review.create).toBeCalledTimes(1);
  });
  test('should call ReviewImage.create and Review.findOne', async () => {
    req.body = { grade: 3, images: [1] };
    const update = jest.fn();
    (Product.findOne as jest.Mock).mockReturnValue({ grade: 3, update });
    (Review.create as jest.Mock).mockReturnValue({ id: 1 });
    await createReview(req, res, next);
    expect(update).toBeCalledTimes(1);
    expect(Review.create).toBeCalledTimes(1);
    expect(ReviewImage.create).toBeCalledTimes(1);
    expect(res.statusCode).toBe(201);
  });
});

describe('GET REVIEW', () => {
  test('should be function', () => {
    expect(typeof getReview).toBe('function');
  });
  test('should call Review.findAll', async () => {
    req.params = { productId: '11' };
    (Review.findAll as jest.Mock).mockReturnValue([1, 2, 3]);
    await getReview(req, res, next);
    expect(Review.findAll).toBeCalledWith({
      where: { ProductId: '11' },
      order: [['createdAt', 'DESC']],
      include: [
        { model: ReviewImage, attributes: ['src'] },
        { model: User, attributes: ['id', 'name'] },
      ],
      attributes: { exclude: ['updatedAt'] },
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual([1, 2, 3]);
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (Review.findAll as jest.Mock).mockReturnValue(rejectedPromise);
    await getReview(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});
