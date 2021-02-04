import express from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import cryptoRandomString from 'crypto-random-string';
import User from '../db/models/user';

const router = express.Router();

//NOTE: 회원가입
router.post('/', async (req, res, next) => {
  try {
    const randomNumber = cryptoRandomString({ length: 4 });
    const exUser = await User.findOne({ where: { email: req.body.email } });
    if (exUser) return res.status(401).send('이미 존재하는 이메일 입니다.');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });
    await transporter.sendMail({
      from: `"IKEA" <${process.env.NODEMAILER_USER}>`,
      to: req.body.email,
      subject: 'IKEA 회원가입 인증번호',
      text: '안녕하세요!!',
      html: `<span>아래 인증번호를 입력하세요 </span><h1>${randomNumber}</h1>`,
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
    if (!user) return res.status(500).send('회원가입중 오류 발생');
    const fullUser = await User.findOne({
      where: { id: user.id },
      attributes: ['id', 'email', 'name'],
    });
    return res.status(201).json(fullUser);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//NOTE: 이메일 인증
router.post('/verif', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email, verification: req.body.number },
    });
    if (!user) return res.status(400).send('인증번호가 맞지 않습니다.');
    await user.update({ valid: 1, verification: '' });
    return res.status(200).send('회원가입 성공! 로그인해주세요');
  } catch (e) {
    console.error(e);
    next(e);
  }
});

export default router;