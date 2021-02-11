import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import cryptoRandomString from 'crypto-random-string';
import User from '../../db/models/user';
import passport from 'passport';
import Product from '../../db/models/product';
import Cart from '../../db/models/cart';
import Payment from '../../db/models/payment';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

//NOTE:회원가입
export const signUp: RequestHandler = async (req, res, next) => {
  try {
    const randomNumber = cryptoRandomString({ length: 4 });
    const exUser = await User.findOne({ where: { email: req.body.email } });
    if (exUser) return res.status(401).send('이미 존재하는 이메일 입니다.');

    await transporter.sendMail({
      from: `"IKEA" <${process.env.NODEMAILER_USER}>`,
      to: req.body.email,
      subject: 'IKEA 회원가입 인증번호',
      text: '안녕하세요!!',
      html: `<span>아래 인증번호를 입력하세요 </span><h1>${randomNumber}</h1><span>아니면 아래 링크를 확인해주세요</span><br/><a href='${process.env.SERVER_DOMAIN}/api/user/verif?email=${req.body.email}&number=${randomNumber}'>이동</a>`,
    });
    const hashedPassword = await bcrypt.hash(req.body.password, 11);
    const user = await User.create({
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
      birth: req.body.birth,
      address: req.body.address,
      phone: req.body.phone,
      gender: req.body.gender,
      verification: randomNumber,
      valid: 0,
    });
    if (!user) return res.status(400).send('회원가입중 오류 발생');
    const fullUser = await User.findOne({
      where: { id: user.id },
      attributes: ['id', 'email', 'name'],
    });
    return res.status(201).json(fullUser);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE:이메일 인증
export const verifiEmail: RequestHandler = async (req, res, next) => {
  try {
    const email = req.body.email || req.query.email;
    const randomNum = req.body.number || req.query.number;
    const user = await User.findOne({
      where: { email: email, verification: randomNum },
    });
    if (!user) return res.status(400).send('인증번호가 맞지 않습니다.');
    await user.update({ valid: 1, verification: '' });
    return res.status(200).send('회원가입 성공! 로그인해주세요');
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE:로그인
export const logIn: RequestHandler = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.message);
    }
    return req.login(user, async loginErr => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const computedUser = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ['password', 'token', 'valid', 'verification', 'updatedAt'],
        },
        include: [
          {
            model: Cart,
            attributes: ['id'],
          },
          {
            model: Product,
            as: 'wishItem',
            attributes: ['id'],
          },
          {
            model: Payment,
            attributes: ['id'],
          },
        ],
      });
      return res.status(200).json(computedUser);
    });
  })(req, res, next);
};

//NOTE: 비밀번호 변경링크 이메일 전송
export const findPassword: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });
    if (!user) return res.status(404).send('존재하지 않는 이메일입니다.');

    await transporter.sendMail({
      from: `"IKEA" <${process.env.NODEMAILER_USER}>`,
      to: req.params.email,
      subject: 'IKEA 비밀번호 변경',
      text: '안녕하세요!!',
      html: `<h2>${user.name}님! 아래 링크를 통해 비밀번호를 변경해주세요! </h2><a href='${process.env.CLIENT_DOMAIN}/user/signin/change/${req.params.email}'>이동</a>`,
    });
    return res
      .status(200)
      .send(`${req.params.email}로 이메일을 전송하였습니다.`);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 비밀번호 변경
export const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 11);
    const changedUser = await User.update(
      { password: hashedPassword },
      { where: { email: req.body.email } }
    );
    if (!changedUser)
      return res.status(403).send('변경중 오류가 발생하였습니다.');

    return res
      .status(201)
      .send('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//:NOTE:로그아웃
export const logOut: RequestHandler = async (req, res, next) => {
  try {
    await req.logout();
    req.session.destroy(() => {
      res.send('성공적으로 로그아웃 되었습니다.');
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 회원탈퇴
export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const exUser = await User.findOne({ where: { email: req.params.email } });
    if (!exUser) {
      return res.status(404).send('회원정보가 없습니다.');
    }
    const result = await User.destroy({ where: { email: req.params.email } });
    if (!result) {
      return res.status(404).send('회원삭제에 실패하였습니다.');
    }
    return res.status(200).send('성공적으로 회원정보가 삭제되었습니다.');
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE:회원정보수정
export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const exUser = await User.findOne({ where: { email: req.user?.email } });
    if (!exUser) {
      return res.status(404).send('회원정보가 없습니다.');
    }
    await exUser.update(req.body.data);
    return res.status(201).send(req.body.data);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
