import BCatecory, { associate as associateBCatecory } from './bigCategory';
import Cart, { associate as associateCart } from './cart';
import HFCategory, { associate as associateHFCategory } from './hfCategory';
import HFImage, { associate as associateHFImage } from './hfImage';
import HFProduct, { associate as associateHFProduct } from './hfProduct';
import History, { associate as associateHistory } from './history';
import HomeFurnishing, {
  associate as associateHomeFurnishing,
} from './homeFurnishing';
import Payment, { associate as associatePayment } from './payment';
import Product, { associate as associateProduct } from './product';
import ProdImage, { associate as associateProdImage } from './productImage';
import Review, { associate as associateReview } from './review';
import SCatecory, { associate as associateSCatecory } from './smallCategory';
import User, { associate as associateUser } from './user';
import ReviewImage, { associate as associateReviewImage } from './reviewImage';

export * from './sequelize';
const db = {
  User,
  BCatecory,
  SCatecory,
  Product,
  HomeFurnishing,
  HFCategory,
  HFImage,
  Review,
  History,
  Payment,
  HFProduct,
  ProdImage,
  Cart,
  ReviewImage,
};
export type DbType = typeof db;

associateUser(db);
associateProduct(db);
associateReview(db);
associateProdImage(db);
associateHomeFurnishing(db);
associatePayment(db);
associateHFImage(db);
associateHistory(db);
associateHFProduct(db);
associateHFCategory(db);
associateBCatecory(db);
associateSCatecory(db);
associateCart(db);
associateReviewImage(db);
