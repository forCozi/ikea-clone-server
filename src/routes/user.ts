import express from 'express';
import {
  changePassword,
  deleteUser,
  findPassword,
  logIn,
  logOut,
  signUp,
  verifiEmail,
} from '../controller/user/user';

const router = express.Router();

//NOTE: 회원가입
router.post('/', signUp);

//NOTE: 이메일 인증
router.post('/verif', verifiEmail);

//NOTE: 로그인
router.post('/login', logIn);

//NOTE: 비밀번호 변경링크 이메일 전송
router.get('/find/:email', findPassword);

//NOTE: 비밀번호 변경
router.patch('/find', changePassword);

//:NOTE:로그아웃
router.get('/logout/:email', logOut);

//NOTE: 회원탈퇴
router.delete('/:email', deleteUser);

export default router;
