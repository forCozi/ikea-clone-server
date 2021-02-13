import request from 'supertest';
import app from '../../index';
import { sequelize } from '../../db/models';
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
