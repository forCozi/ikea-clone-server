/* eslint-disable @typescript-eslint/no-explicit-any */
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import User from '../../db/models/user';
import bcrypt from 'bcrypt';
import {
  changePassword,
  deleteUser,
  findPassword,
  logIn,
  logOut,
  signUp,
  transporter,
  updateUser,
  verifiEmail,
} from './user';
import passport from 'passport';

let req: MockRequest<any>;
let res: MockResponse<any>;
let next: jest.Mock<any, any>;
beforeEach(() => {
  User.update = jest.fn();
  User.create = jest.fn();
  User.findOne = jest.fn();
  User.destroy = jest.fn();
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
describe('SIGNUP CONTROLLER', () => {
  beforeEach(() => {
    transporter.sendMail = jest.fn();
    bcrypt.hash = jest.fn();
  });
  test('should be function', () => {
    expect(typeof signUp).toBe('function');
  });
  test('should call User.findOne and sendMail', async () => {
    req.body = {
      email: 'yhg0337@gmail.com',
    };
    await signUp(req, res, next);
    expect(User.findOne).toBeCalledTimes(1);
    expect(transporter.sendMail).toBeCalledTimes(1);
  });
  test('should return 401 email already exist', async () => {
    req.body = {
      email: 'yhg0337@gmail.com',
    };
    (User.findOne as jest.Mock).mockReturnValue(true);
    await signUp(req, res, next);
    expect(User.findOne).toBeCalledTimes(1);
    expect(res.statusCode).toBe(401);
  });
  test('should hash password', async () => {
    req.body = {
      password: '123123',
    };
    await signUp(req, res, next);
    expect(bcrypt.hash).toBeCalledWith('123123', 11);
  });

  test('should call User.create', async () => {
    req.body = {
      email: 'yhg0337@gmail.com',
      name: 'yhg0337@gmail.com',
      password: '123123',
      birth: 'yhg0337@gmail.com',
      address: 'yhg0337@gmail.com',
      phone: 'yhg0337@gmail.com',
      gender: 'yhg0337@gmail.com',
      verification: 'yhg0337@gmail.com',
      valid: 0,
    };
    await signUp(req, res, next);
    expect(User.create).toBeCalledTimes(1);
    expect(res.statusCode).toBe(400);
  });
  test('should return 201', async () => {
    req.body = {
      email: 'yhg0337@gmail.com',
    };
    (User.findOne as jest.Mock).mockReturnValue(false);
    (User.create as jest.Mock).mockReturnValue(true);
    await signUp(req, res, next);
    expect(res.statusCode).toBe(201);
  });
  test('should handle Error', async () => {
    req.body = {
      email: 'yhg0337@gmail.com',
    };
    const errorMsg = { message: '에러발생' };
    const rejectedPromise = Promise.reject(errorMsg);
    (bcrypt.hash as jest.Mock).mockReturnValue(rejectedPromise);
    await signUp(req, res, next);
    expect(next).toBeCalledWith({ message: '에러발생' });
  });
});

describe('VERIFIEMAIL', () => {
  test('should be function and return 400', () => {
    expect(typeof verifiEmail).toBe('function');
  });
  test('should call User.findOne', async () => {
    req.query = {
      email: 'yhg0337@gmail.com',
      number: '123',
    };
    (User.findOne as jest.Mock).mockReturnValue(false);
    await verifiEmail(req, res, next);
    expect(User.findOne).toBeCalledTimes(1);
    expect(res.statusCode).toBe(400);
  });
  test('should call user.update', async () => {
    const update = jest.fn();
    req.body = {
      email: 'yhg0337@gmail.com',
      number: '123',
    };
    (User.findOne as jest.Mock).mockReturnValue({ update });
    await verifiEmail(req, res, next);
    expect(update).toBeCalledTimes(1);
    expect(res.statusCode).toBe(200);
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (User.findOne as jest.Mock).mockReturnValue(rejectedPromise);
    await verifiEmail(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});

describe('LOGIN', () => {
  //   beforeEach(() => {
  //     passport.authenticate = jest.fn();
  //   });
  test('should be function', () => {
    expect(typeof logIn).toBe('function');
  });
  test('should call passport', async () => {
    passport.use = jest.fn();
    req.body = {
      email: '123123123123123123',
      password: 'l1484418',
    };
    await logIn(req, res, next);
    expect(next).toBeCalled();
  });
});

describe('FIND PASSWORD', () => {
  test('should be function', () => {
    expect(typeof findPassword).toBe('function');
  });
  test('should call User.findOne and return 404', async () => {
    (User.findOne as jest.Mock).mockReturnValue(null);
    await findPassword(req, res, next);
    expect(res.statusCode).toBe(404);
  });
  test('should call sendEmail', async () => {
    req.params = { email: 'yhg0337@gmail.com' };
    (User.findOne as jest.Mock).mockReturnValue(true);
    await findPassword(req, res, next);
    expect(transporter.sendMail).toBeCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getData()).toBe('yhg0337@gmail.com로 이메일을 전송하였습니다.');
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (User.findOne as jest.Mock).mockReturnValue(rejectedPromise);
    await findPassword(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});

describe('CHANGE PASSWORD', () => {
  test('should be function', () => {
    expect(typeof changePassword).toBe('function');
  });
  test('should call bcrypt and update', async () => {
    req.body = { email: '111', password: 111 };
    (bcrypt.hash as jest.Mock).mockReturnValue(11);
    await changePassword(req, res, next);
    expect(bcrypt.hash).toBeCalledWith(111, 11);
    expect(User.update).toBeCalledWith(
      { password: 11 },
      { where: { email: '111' } }
    );
    expect(res.statusCode).toBe(403);
  });
  test('should return 201', async () => {
    req.body = { email: '111', password: 111 };
    (bcrypt.hash as jest.Mock).mockReturnValue(11);
    (User.update as jest.Mock).mockReturnValue(true);
    await changePassword(req, res, next);
    expect(bcrypt.hash).toBeCalledWith(111, 11);
    expect(res.statusCode).toBe(201);
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (bcrypt.hash as jest.Mock).mockReturnValue(rejectedPromise);
    await changePassword(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});

describe('LOGOUT', () => {
  test('should be function', () => {
    expect(typeof logOut).toBe('function');
  });
  test('should call logOut and session', async () => {
    req.logout = jest.fn();
    req.session = { destroy: jest.fn() };
    await logOut(req, res, next);
    expect(req.session.destroy).toBeCalled();
  });
  test('should ', async () => {
    req.logout = jest.fn();
    req.session = { destroy: (cb: () => void) => cb() };
    await logOut(req, res, next);
    expect(res._getData()).toBe('성공적으로 로그아웃 되었습니다.');
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    req.logout = jest.fn();
    req.session = { destroy: jest.fn() };
    (req.logout as jest.Mock).mockReturnValue(rejectedPromise);
    await logOut(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});

describe('DELETE USER', () => {
  test('should be function', () => {
    expect(typeof deleteUser).toBe('function');
  });
  test('should call User.findOne and return 404', async () => {
    (User.findOne as jest.Mock).mockReturnValue(null);
    await deleteUser(req, res, next);
    expect(res.statusCode).toBe(404);
  });
  test('should call User.destroy and return 404', async () => {
    (User.findOne as jest.Mock).mockReturnValue(true);
    (User.destroy as jest.Mock).mockReturnValue(null);
    await deleteUser(req, res, next);
    expect(res.statusCode).toBe(404);
  });
  test('should deleteUser and return 200', async () => {
    (User.findOne as jest.Mock).mockReturnValue(true);
    (User.destroy as jest.Mock).mockReturnValue(true);
    await deleteUser(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getData()).toBe('성공적으로 회원정보가 삭제되었습니다.');
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (User.findOne as jest.Mock).mockReturnValue(rejectedPromise);
    await deleteUser(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});

describe('UPDATE USEr', () => {
  test('should be function', () => {
    expect(typeof updateUser).toBe('function');
  });
  test('should call User.findOne and return 404', async () => {
    (User.findOne as jest.Mock).mockReturnValue(null);
    await updateUser(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getData()).toBe('회원정보가 없습니다.');
  });
  test('should call selectedUser.update', async () => {
    req.body = { data: { password: 1 } };
    const update = jest.fn();
    (User.findOne as jest.Mock).mockReturnValue({ update });
    await updateUser(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({ password: 1 });
  });
  test('should handle Error', async () => {
    const errorMsg = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMsg);
    (User.findOne as jest.Mock).mockReturnValue(rejectedPromise);
    await updateUser(req, res, next);
    expect(next).toBeCalledWith(errorMsg);
  });
});
