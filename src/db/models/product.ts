import { BelongsToManyGetAssociationsMixin, DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import User from './user';
import { sequelize } from './sequelize';

class Product extends Model {
  public id!: string;
  public title!: string;
  public prCost!: number;
  public slCost!: number;
  public detailInfo!: string;
  public summary!: string;
  public size!: string;
  public sold!: number;
  public grade!: number;
  public SCategoryId!: number;

  public reviewLength?: number;

  public cartUser!: [];
  public wishLength!: number;

  public getWishUser!: BelongsToManyGetAssociationsMixin<User>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Product.init(
  {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(50),
      defaultValue: '',
    },
    prCost: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    slCost: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    detailInfo: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    summary: {
      type: DataTypes.STRING(128),
      defaultValue: '',
    },
    size: {
      type: DataTypes.STRING(30),
      defaultValue: '',
    },
    sold: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    grade: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'PRODUCT',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: DbType): void => {
  db.Product.hasMany(db.ProdImage);
  db.Product.hasMany(db.Review);
  db.Product.hasMany(db.History);
  db.Product.hasMany(db.HFProduct);
  db.Product.belongsTo(db.BCatecory);
  db.Product.belongsTo(db.SCatecory);
  db.Product.hasMany(db.Cart);
  db.Product.belongsToMany(db.User, { through: 'WISHLIST', as: 'wishUser' });
};
export default Product;
