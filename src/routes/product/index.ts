import express from 'express';
import BCatecory from '../../db/models/BigCategory';
import Product from '../../db/models/product';
import ProdImage from '../../db/models/productImage';
import SCatecory from '../../db/models/smallCategory';
import User from '../../db/models/user';
import { DetailRequest, ListRequest } from './types';

const router = express.Router();

router.get('/list/:cateId', async (req: ListRequest, res, next) => {
  try {
    if (!req.params.cateId) {
      return res.status(404).send('카테고리를 찾을 수 없습니다.');
    }
    const limit = req.query.limit ? parseInt(req.query.limit) : 32;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const products = await Product.findAll({
      where: { SCategoryId: req.params.cateId },
      limit,
      offset,
      order: ['createdAt'],
      attributes: { exclude: ['updatedAt'] },
      include: [
        { model: ProdImage, limit: 2, order: ['id'] },
        { model: User, as: 'cartUser' },
      ],
    });
    res.status(200).json(products);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/:productId', async (req: DetailRequest, res, next) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.productId },
      attributes: { exclude: ['BCategoryId', 'SCategoryId', 'updatedAt'] },
      include: [
        { model: BCatecory, attributes: ['id', 'name'] },
        { model: SCatecory, attributes: ['id', 'name'] },
        {
          model: ProdImage,
          attributes: { exclude: ['createdAt', 'ProductId', 'updatedAt'] },
        },
      ],
    });
    if (!product) {
      return res.status(404).send('해당 상품을 찾을 수 없습니다.');
    }
    return res.status(200).send(product);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
export default router;
