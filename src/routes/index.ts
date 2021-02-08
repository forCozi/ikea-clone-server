import express from 'express';
import userRouter from './user';
import productRouter from './product';
import userProductRouter from './userProduct';

const router = express.Router();

router.use('/user', userRouter);
router.use('/product', productRouter);
router.use('/userproduct/', userProductRouter);

export default router;
