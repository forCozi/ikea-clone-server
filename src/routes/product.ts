import express from 'express';
import {
  getProducts,
  getProduct,
  searchProduct,
  getHomeFurnishing,
} from '../controller/product/product';

const router = express.Router();

//NOTE:상품검색
router.get('/search', searchProduct);

//NOTE:상품리스트조회
router.get('/list/:cateId', getProducts);

//NOTE:상품디테일조회
router.get('/:productId', getProduct);

//NOTE:상품디테일조회
router.get('/homefurnishing/:cateId', getHomeFurnishing);

export default router;
