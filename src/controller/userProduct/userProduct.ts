import { RequestHandler } from 'express';
import Cart from '../../db/models/cart';
import History from '../../db/models/history';
import Payment from '../../db/models/payment';
import Product from '../../db/models/product';
import ProdImage from '../../db/models/productImage';
import User from '../../db/models/user';
import { changePassword } from '../user/user';
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

//NOTE:위시 아이템 추가
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

//NOTE:장바구니 아이템 추가
export const addCart: AddCartHandler = async (req, res, next) => {
  try {
    if (req.user?.email !== req.body.userEmail) {
      return res.status(401).send('다시로그인 해주세요');
    }
    const user = await User.findOne({ where: { email: req.body.userEmail } });
    if (!user) return res.status(404).send('사용자가 없습니다.');
    const exCartItem = await Cart.findOne({
      where: { ProductId: req.body.productId, UserId: user.id },
    });
    if (exCartItem) {
      await exCartItem.update({ quantity: exCartItem.quantity + 1 });
      return res.status(201).json({ productId: req.body.productId });
    }
    await Cart.create({
      quantity: 1,
      UserId: user.id,
      ProductId: req.body.productId,
    });
    return res.status(201).json({ productId: req.body.productId });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE:위시리스트 아이템 삭제
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

//NOTE:장바구니 아이템 삭제
export const removeCart: RemoveCartHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.query.email } });
    if (!user) return res.status(404).send('사용자가 없습니다.');
    await Cart.destroy({
      where: { UserId: user.id, ProductId: req.query.productid },
    });
    return res.status(201).json({ productId: req.query.productid });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE:위시리스트 조회
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

//NOTE:장바구니리스트 조회
export const getCart: GetCartHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });
    if (!user) return res.status(404).send('사용자가 없습니다.');
    const cartLists = await Cart.findAll({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'quantity', 'UserId'],
      include: [
        {
          model: Product,
          attributes: {
            exclude: [
              'detailInfo',
              'grade',
              'sold',
              'BCategoryId',
              'SCategoryId',
              'createdAt',
              'updatedAt',
            ],
          },
          include: [
            {
              model: ProdImage,
              attributes: { exclude: ['createdAt', 'updatedAt', 'ProductId'] },
              limit: 1,
            },
          ],
        },
      ],
    });
    return res.status(200).json(cartLists);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE:구매내역 조회
export const getHistory: GetHistoryHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });
    if (!user) return res.status(404).send('사용자가 없습니다.');
    const payments = await Payment.findAll({
      where: { UserId: user.id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: History,
          attributes: ['quantity', 'id'],
          include: [
            {
              model: Product,
              attributes: ['title', 'slCost', 'prCost', 'summary'],
              include: [{ model: ProdImage, attributes: ['src'] }],
            },
          ],
        },
      ],
    });
    return res.status(200).json(payments);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE:페이팔 결제 성공
export const successPaypal: SuccessPaypalHandler = async (req, res, next) => {
  try {
    const histories = [];
    const user = await User.findOne({ where: { email: req.user?.email } });
    if (!user) return res.status(404).send('사용자가 없습니다.');

    const payment = await Payment.create({
      payerID: req.body.payment.payerID,
      email: req.body.userInfo.email,
      paid: req.body.payment.paid,
      returnUrl: req.body.payment.returnUrl,
      paymentToken: req.body.payment.paymentToken,
      cancelled: req.body.payment.paid === true,
      address: req.body.userInfo.address,
      totalPrice: req.body.userInfo.totalPrice,
      UserId: user.id,
    });
    if (!payment) return res.status(400).send('오류가 발생하였습니다.');
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

    for (let i = 0; i < req.body.productInfo.length; i++) {
      await Cart.destroy({
        where: { UserId: user.id, ProductId: req.body.productInfo[i].id },
      });
      // await user.removeCartItem(req.body.productInfo[i].id);
    }
    res.status(201).json(histories);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const changeCart: RequestHandler = async (req, res, next) => {
  try {
    const changedCart = await Cart.update(
      { quantity: req.body.quantity },
      { where: { id: req.body.cartId } }
    );
    if (!changedCart) return res.status(400).send('실패');
    return res.status(201).json(req.body);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
