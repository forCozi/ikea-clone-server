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
  SuccessPaypalHandler,
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
    const exCartItem = await user.getCartItem({
      where: { id: req.body.productId },
    });
    if (exCartItem.length !== 0)
      return res.status(404).send('이미 장바구니에 있습니다.');
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
      attributes: ['id', 'title', 'slCost', 'prCost', 'summary', 'size'],
      order: [['createdAt', 'DESC']],
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
      attributes: ['id', 'title', 'slCost', 'prCost', 'summary', 'size'],
      order: [['createdAt', 'DESC']],
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
      order: [['createdAt', 'DESC']],
      include: [
        { model: Payment },
        {
          model: Product,
          attributes: ['title', 'slCost', 'prCost', 'summary'],
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

export const successPaypal: SuccessPaypalHandler = async (req, res, next) => {
  try {
    const histories = [];
    const user = await User.findOne({ where: { email: req.user?.email } });
    if (!user) return res.status(404).send('사용자가 없습니다.');
    //히스토리에 페이먼트아이디가 들어가야한다. 여러개 상품을 한번에 구매하니까
    const payment = await Payment.create({
      payerID: req.body.payment.payerID,
      email: req.body.userInfo.email,
      paid: req.body.payment.paid,
      returnUrl: req.body.payment.returnUrl,
      paymentToken: req.body.payment.paymentToken,
      cancelled: req.body.payment.paid === true,
      address: req.body.userInfo.address,
      totalPrice: req.body.userInfo.totalPrice,
    });
    for (let i = 0; i < req.body.productInfo.length; i++) {
      histories.push(
        await History.create({
          quantity: req.body.productInfo[i].quantity,
          UserId: user.id,
          ProductId: req.body.productInfo[i].id,
          PaymentId: payment.id,
        })
      );
    }

    if (payment) {
      for (let i = 0; i < req.body.productInfo.length; i++) {
        await user.removeCartItem(req.body.productInfo[i].id);
      }
    }
    res.status(201).json(histories);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
