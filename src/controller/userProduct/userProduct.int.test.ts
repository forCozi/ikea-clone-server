import request from 'supertest';
import app from '../../index';
import { sequelize } from '../../db/models';
import { SuccessPaypalReq } from './types';
import cryptoRandomString from 'crypto-random-string';
let sessionCookie: string[];
beforeAll(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('디비가 연결되었습니다.');
  } catch (e) {
    console.error(e);
  }
});
test('SET COOKIE', async () => {
  const res = await request(app)
    .post('/api/user/login')
    .send({ email: 'yhg0337@gmail.com', password: 'Dbdnjsrms1@' });
  sessionCookie = res.header['set-cookie'][0]
    .split(',')
    .map((cookie: string) => {
      return cookie.split(';')[0];
    });
});

describe('POST api/userproduct/wish', () => {
  test('should return 401', async () => {
    const res = await request(app).post('/api/userproduct/wish').send({
      userEmail: 'yhg0337@gmail.com',
      productId: '00141670',
    });
    expect(res.status).toBe(401);
  });
  test('should add wishItem return productId', async () => {
    const res = await request(app)
      .post('/api/userproduct/wish')
      .set('Cookie', sessionCookie)
      .send({
        userEmail: 'yhg0337@gmail.com',
        productId: '00141670',
      });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ productId: '00141670' });
  });
  test('should Handle Error', async () => {
    const res = await request(app)
      .post('/api/userproduct/wish')
      .set('Cookie', sessionCookie)
      .send({
        userEmail: 'yhg0337@gmail.com',
        productId: '00141670111',
      });
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty(
      'name',
      'SequelizeForeignKeyConstraintError'
    );
  });
});

describe('GET api/userproduct/wish/:email', () => {
  test('should retutn 200', async () => {
    const res = await request(app).get(
      '/api/userproduct/wish/yhg0337@gmail.com'
    );
    expect(res.status).toBe(200);
  });
});

describe('POST api/userproduct/cart', () => {
  test('should return 401', async () => {
    const res = await request(app).post('/api/userproduct/cart').send({
      userEmail: 'yhg0337@gmail.com',
      productId: '00141670',
    });
    expect(res.status).toBe(401);
  });
  test('should add cartItem return productId', async () => {
    const res = await request(app)
      .post('/api/userproduct/cart')
      .set('Cookie', sessionCookie)
      .send({
        userEmail: 'yhg0337@gmail.com',
        productId: '00141670',
      });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ productId: '00141670' });
  });
  test('should Handle Error', async () => {
    const res = await request(app)
      .post('/api/userproduct/cart')
      .set('Cookie', sessionCookie)
      .send({
        userEmail: 'yhg0337@gmail.com',
        productId: '00141670111',
      });
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty(
      'name',
      'SequelizeForeignKeyConstraintError'
    );
  });
});

describe('GET api/userproduct/cart/:email', () => {
  test('should retutn 200', async () => {
    const res = await request(app).get(
      '/api/userproduct/cart/yhg0337@gmail.com'
    );
    expect(res.status).toBe(200);
  });
});

describe('DELETE api/userproduct/cart', () => {
  test('should delete cartItem and return productId', async () => {
    const res = await request(app).delete('/api/userproduct/cart').query({
      email: 'yhg0337@gmail.com',
      productid: '00141670',
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ productId: '00141670' });
  });
  test('should handle Error', async () => {
    const res = await request(app).delete('/api/userproduct/cart').query({
      email: 'yhg0337@gmail.com11',
      productId: '00141670111',
    });
    expect(res.status).toBe(404);
    expect(res.text).toBe('사용자가 없습니다.');
  });
});

describe('DELETE api/userproduct/wish', () => {
  test('should delete wishItem and return productId', async () => {
    const res = await request(app).delete('/api/userproduct/wish').query({
      email: 'yhg0337@gmail.com',
      productid: '00141670',
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ productId: '00141670' });
  });
  test('should handle Error', async () => {
    const res = await request(app).delete('/api/userproduct/wish').query({
      email: 'yhg0337@gmail.com11',
      productId: '00141670111',
    });
    expect(res.status).toBe(404);
    expect(res.text).toBe('사용자가 없습니다.');
  });
});

describe('get api/userproduct/history/:email', () => {
  test('should return history', async () => {
    const res = await request(app).get(
      '/api/userproduct/history/yhg0337@gmail.com'
    );
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(6);
  });
  test('should return not found', async () => {
    const res = await request(app).get(
      '/api/userproduct/history/yhg0337@gmail.com11'
    );
    expect(res.status).toBe(404);
    expect(res.text).toBe('사용자가 없습니다.');
  });
});
describe('get api/userproduct/payment/paypal', () => {
  const mockPayment: SuccessPaypalReq = {
    userInfo: {
      address: '1',
      email: cryptoRandomString({ length: 4 }),
      name: '1',
      phone: '1',
      totalPrice: 111,
    },
    payment: {
      email: cryptoRandomString({ length: 4 }),
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
      paymentID: cryptoRandomString({ length: 4 }),
      paymentToken: cryptoRandomString({ length: 4 }),
      returnUrl: cryptoRandomString({ length: 4 }),
    },
    productInfo: [
      { id: '00141670', quantity: 1, size: '1', slCost: '1', title: '1' },
    ],
  };
  test('should return 404 when cookie doesnt exist', async () => {
    const res = await request(app)
      .post('/api/userproduct/payment/paypal')
      .send(mockPayment);
    expect(res.status).toBe(500);
  });
  test('should be created and return histories what length equal req.body.productInfo.length', async () => {
    const res = await request(app)
      .post('/api/userproduct/payment/paypal')
      .set('Cookie', sessionCookie)
      .send(mockPayment);
    expect(res.status).toBe(201);
    expect(res.body.length).toBe(mockPayment.productInfo.length);
  });
});
