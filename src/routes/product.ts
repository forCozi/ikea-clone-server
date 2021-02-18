import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

import {
  getProducts,
  getProduct,
  searchProduct,
  getHomeFurnishing,
  imageUpload,
  createReview,
  getReview,
} from '../controller/product/product';

const router = express.Router();

try {
  fs.accessSync(path.join('src', 'uploads', 'reviews'));
} catch (e) {
  console.log('폴더가 없어서 생성합니다.');
  fs.mkdirSync(path.join('src', 'uploads'));
  fs.mkdirSync(path.join('src', 'uploads', 'reviews'));
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, res, done) {
      done(null, 'src/uploads/reviews');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      done(null, basename + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

//NOTE:상품검색
router.get('/search', searchProduct);

//NOTE:상품리스트조회
router.get('/list/:cateId', getProducts);

//NOTE:상품디테일조회
router.get('/homefurnishing/:cateId', getHomeFurnishing);

//NOTE:이미지 업로드
router.post('/images', upload.array('image'), imageUpload);

//NOTE:리뷰 작성
router.post('/review', createReview);

//NOTE:리뷰조회
router.get('/review/:productId', getReview);

//NOTE:상품디테일조회
router.get('/:productId', getProduct);

export default router;
