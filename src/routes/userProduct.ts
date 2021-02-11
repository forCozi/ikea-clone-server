import express from 'express';
import {
  addCart,
  addWish,
  getCart,
  getHistory,
  getWish,
  removeCart,
  removeWish,
  successPaypal,
} from '../controller/userProduct/userProduct';

const router = express.Router();

//NOTE:위시리스트추가
router.post('/wish', addWish);

//NOTE:장바구니추가
router.post('/cart', addCart);

//NOTE:위시리스트삭제
router.delete('/wish', removeWish);

//NOTE:장바구니삭제
router.delete('/cart', removeCart);

//NOTE:위시조회
router.get('/wish/:email', getWish);

//NOTE:카트조회
router.get('/cart/:email', getCart);

//NOTE:내역조회
router.get('/history/:email', getHistory);

//NOTE:페이팔 결제 성공
router.post('/payment/paypal', successPaypal);
export default router;
