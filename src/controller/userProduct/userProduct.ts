import User from '../../db/models/user';
import {
  AddCartHandler,
  AddWishHandler,
  RemoveCartHandler,
  RemoveWishHandler,
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
