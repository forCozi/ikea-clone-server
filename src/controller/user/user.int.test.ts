import request from 'supertest';
import app from '../../index';
import { sequelize } from '../../db/models';
import cryptoRandomString from 'crypto-random-string';
import User from '../../db/models/user';

let sessionCookie: string[];
beforeAll(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('디비가 연결되었습니다.');
  } catch (e) {
    console.error(e);
  }
});
const newUser = {
  email: `${cryptoRandomString({ length: 5 })}@gmail.com`,
  name: cryptoRandomString({ length: 7 }),
  password: ' 12345678',
  birth: '1999-99-99',
  address: '1999-99-99',
  phone: '999-0099-0099',
  gender: 2,
  verification: cryptoRandomString({ length: 4 }),
  valid: 0,
};
describe('POST api/user/', () => {
  test('should return newUser', async () => {
    const res = await request(app).post('/api/user/').send(newUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('email', newUser.email);
  });
  test('should handle error', async () => {
    const res = await request(app).post('/api/user/').send();
    expect(res.status).toBe(500);
  });
});
describe('POST api/user/verif', () => {
  test('should return 401 before Email verification', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: newUser.email, password: newUser.password });
    expect(res.status).toBe(401);
  });
  test('should return Success verification', async () => {
    const user = await User.findOne({
      where: { email: newUser.email },
      attributes: ['verification'],
    });
    const res = await request(app)
      .post('/api/user/verif')
      .send({ email: newUser.email, number: user?.verification });
    expect(res.status).toBe(200);
  });
  test('should handle Error', async () => {
    const res = await request(app)
      .post('/api/user/verif')
      .send({ email: newUser.email, number: 111 });
    expect(res.status).toBe(400);
  });
});

describe('POST api/user/logIn', () => {
  test('should return 401 when email doesnt exist', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: '123123123', password: 111 });
    expect(res.status).toBe(401);
  });
  test('should return 401 when password wrong', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: newUser.email, password: '111' });
    expect(res.status).toBe(401);
  });
  test('should return Success Login', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: newUser.email, password: newUser.password });
    sessionCookie = res.header['set-cookie'][0]
      .split(',')
      .map((cookie: string) => {
        return cookie.split(';')[0];
      });
    expect(res.status).toBe(200);
  });
  test('should handle Error when alread Logined', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: newUser.email, password: 11 });
    expect(res.status).toBe(500);
  });
});

describe('PATCH api/user/find', () => {
  test('should change password', async () => {
    const res = await request(app)
      .patch('/api/user/find')
      .send({ email: newUser.email, password: '3333' });
    expect(res.status).toBe(201);
  });
});

describe('GET api/user/logout/:email', () => {
  test('should logout', async () => {
    const res = await request(app)
      .get(`/api/user/logout/${newUser.email}`)
      .set('Cookie', sessionCookie);
    expect(res.text).toBe('성공적으로 로그아웃 되었습니다.');
  });
});

describe('DELETE api/user/:email', () => {
  test('should delete user', async () => {
    const res = await request(app).delete(`/api/user/${newUser.email}`);
    expect(res.status).toBe(200);
    expect(res.text).toBe('성공적으로 회원정보가 삭제되었습니다.');
  });
});
