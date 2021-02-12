import request from 'supertest';
import app from '../../index';
import { sequelize } from '../../db/models';

beforeAll(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('디비가 연결되었습니다.');
  } catch (e) {
    console.error(e);
  }
});
describe('GET api/product/search', () => {
  test('should return Product', async () => {
    const res = await request(app)
      .get('/api/product/search')
      .query({ keyword: '콤플레멘트' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(4);
    expect(res.body).toHaveLength(4);
  });
  test('should return empty arr', async () => {
    const res = await request(app)
      .get('/api/product/search')
      .query({ keyword: { name: '콤플레멘트' } });
    expect(res.body).toEqual([]);
  });
});

describe('GET api/product/list/:cateId', () => {
  test('should return products with limit', async () => {
    const res = await request(app)
      .get('/api/product/list/1')
      .query({ limit: 1 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
  test('should return products', async () => {
    const res = await request(app)
      .get('/api/product/list/1')
      .query({ limit: 1 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
  test('should handle Error', async () => {
    const res = await request(app)
      .get('/api/product/list/1')
      .query({ limit: 'asdasd' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('name', 'SequelizeDatabaseError');
  });
});

describe('GET api/product/:productId', () => {
  test('should return Product', async () => {
    const res = await request(app).get('/api/product/00181982');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', '00181982');
  });
  test('should handle Error', async () => {
    const res = await request(app).get('/api/product/undefined');

    expect(res.status).toBe(404);
    expect(res.text).toBe('해당 상품을 찾을 수 없습니다.');
  });
});

describe('GET api/product/homefurnishing/:cateId', () => {
  test('should return Product', async () => {
    const res = await request(app)
      .get('/api/product/homefurnishing/1')
      .query({ limit: 2 });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
  test('should handle Error', async () => {
    const res = await request(app)
      .get('/api/product/homefurnishing/1')
      .query({ limit: { ee: '12ss' } });

    expect(res.status).toBe(500);
  });
});
