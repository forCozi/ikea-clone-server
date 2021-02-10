import History from '../../db/models/history';
import Payment from '../../db/models/payment';
import Product from '../../db/models/product';
import ProdImage from '../../db/models/productImage';
import User from '../../db/models/user';
import {
  AddCartHandler,
  AddWishHandler,
  GetCartHandler,
  GetWishHandler,
  RemoveCartHandler,
  RemoveWishHandler,
  GetHistoryHandler,
} from './types';

export const addWish: AddWishHandler = async (req, res, next) => {
  try {
    if (req.user?.email !== req.body.userEmail) {
      return res.status(401).send('다시로그인 해주세요');
    }
    const user = await User.findOne({ where: { email: req.body.userEmail } });
    if (!user) return res.status(404).send('사용자가 없습니다.');
    await user.addWishItem(req.body.productId);
    return res.status(201).json({ productId: req.body.productId });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const addCart: AddCartHandler = async (req, res, next) => {
  try {
    if (req.user?.email !== req.body.userEmail) {
      return res.status(401).send('다시로그인 해주세요');
    }
    const user = await User.findOne({ where: { email: req.body.userEmail } });
    if (!user) return res.status(404).send('사용자가 없습니다.');
    await user.addCartItem(req.body.productId);

    return res.status(201).json({ productId: req.body.productId });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const removeWish: RemoveWishHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.query.email } });
    if (!user) return res.status(404).send('사용자가 없습니다.');
    await user.removeWishItem(req.query.productid);
    return res.status(201).json({ productId: req.query.productid });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const removeCart: RemoveCartHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.query.email } });
    if (!user) return res.status(404).send('사용자가 없습니다.');
    await user.removeCartItem(req.query.productid);
    return res.status(201).json({ productId: req.query.productid });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getWish: GetWishHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });
    if (!user) return res.status(404).send('사용자가 없습니다.');
    const wishList = await user.getWishItem({
      attributes: ['id', 'title', 'slCost', 'summary', 'size'],
      include: [
        {
          model: ProdImage,
          limit: 1,
          attributes: { exclude: ['createdAt', 'updatedAt', 'productId'] },
        },
      ],
    });
    return res.status(200).json(wishList);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getCart: GetCartHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });
    if (!user) return res.status(404).send('사용자가 없습니다.');
    const cartList = await user.getCartItem({
      attributes: ['id', 'title', 'slCost', 'summary', 'size'],
      include: [
        {
          model: ProdImage,
          limit: 1,
          attributes: { exclude: ['createdAt', 'updatedAt', 'productId'] },
        },
      ],
    });
    return res.status(200).json(cartList);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getHistory: GetHistoryHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });
    if (!user) return res.status(404).send('사용자가 없습니다.');
    const history = await History.findAll({
      where: { UserId: user.id },
      include: [
        { model: Payment },
        {
          model: Product,
          attributes: ['title', 'slCost', 'summary'],
          include: [{ model: ProdImage, attributes: ['src'] }],
        },
      ],
    });
    return res.status(200).json(history);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
