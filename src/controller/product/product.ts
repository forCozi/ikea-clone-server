import { Op, OrderItem } from 'sequelize';
import BCatecory from '../../db/models/BigCategory';
import Product from '../../db/models/product';
import ProdImage from '../../db/models/productImage';
import SCatecory from '../../db/models/smallCategory';
import User from '../../db/models/user';
import {
  DetailHandler,
  HomeFurnishingHandler,
  ListHandler,
  SearchHandler,
} from '../../controller/product/types';
import HomeFurnishing from '../../db/models/homeFurnishing';
import HFImage from '../../db/models/hfImage';
import HFProduct from '../../db/models/hfProduct';
import Cart from '../../db/models/cart';

//NOTE: 검색
export const searchProduct: SearchHandler = async (req, res, next) => {
  try {
    const keyword = req.query.keyword;
    const results = await Product.findAll({
      where: {
        [Op.or]: [
          {
            title: { [Op.like]: `%${keyword}%` },
          },
          // {
          //   detailInfo: { [Op.like]: `%${keyword}%` },
          // },
          // {
          //   summary: { [Op.like]: `%${keyword}%` },
          // },
        ],
      },
      attributes: ['id', 'title'],
      include: [
        { model: SCatecory, attributes: ['name'] },
        { model: ProdImage, attributes: ['src'], limit: 1 },
      ],
      limit: 4,
    });
    res.status(200).json(results);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE:리스트조회
export const getProducts: ListHandler = async (req, res, next) => {
  try {
    if (!req.params.cateId) {
      return res.status(404).send('카테고리를 찾을 수 없습니다.');
    }
    const filter = req.query.filter ? parseInt(req.query.filter) : 0;
    const cfilter = (f: number) => {
      switch (f) {
        case 0:
          return ['createdAt'];
        case 1:
          return ['slCost'];
        case 2:
          return [['slCost', 'DESC']] as OrderItem[];
        case 3:
          return ['grade'];
        case 4:
          return ['title'];
        case 5:
          return [['sold', 'DESC']] as OrderItem[];
        default:
          return ['createdAt'];
      }
    };
    const order = cfilter(filter) as OrderItem[];
    const limit = req.query.limit ? parseInt(req.query.limit) : 24;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const products = await Product.findAll({
      where: { SCategoryId: req.params.cateId },
      limit,
      offset,
      // order: ['createdAt'],
      order,
      attributes: { exclude: ['updatedAt'] },
      include: [
        { model: ProdImage, limit: 2, order: ['id'] },
        { model: Cart, attributes: ['id', 'UserId'] },
      ],
    });
    res.status(200).json(products);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE:디테일 조회
export const getProduct: DetailHandler = async (req, res, next) => {
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
        { model: User, as: 'wishUser', attributes: ['id'] },
      ],
    });
    if (!product) {
      return res.status(404).send('해당 상품을 찾을 수 없습니다.');
    }

    return res.status(200).json(product);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getHomeFurnishing: HomeFurnishingHandler = async (
  req,
  res,
  next
) => {
  try {
    const cateId = parseInt(req.params.cateId) || 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 12;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const list = await HomeFurnishing.findAll({
      where: { HFCategoryId: cateId },
      limit,
      offset,
      order: ['createdAt'],
      attributes: ['id', 'info', 'createdAt'],
      include: [
        { model: HFImage, attributes: { exclude: ['createdAt', 'updatedAt'] } },
        {
          model: HFProduct,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'HomeFurnishingId'],
          },
          include: [
            { model: Product, attributes: ['title', 'summary', 'slCost'] },
          ],
        },
      ],
    });
    return res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
