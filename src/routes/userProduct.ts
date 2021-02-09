import express from 'express';
import {
  addCart,
  addWish,
  removeCart,
  removeWish,
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
export default router;
