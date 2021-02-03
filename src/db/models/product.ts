import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

class Product extends Model {
  public readonly id!: number;
  public title!: string;
  public prCost!: number;
  public slCost!: number;
  public detailInfo!: string;
  public size!: string;
  public sold!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Product.init(
  {
    title: {
      type: DataTypes.STRING(50),
    },
    prCost: {
      type: DataTypes.INTEGER,
    },
    slCost: {
      type: DataTypes.INTEGER,
    },
    detailInfo: {
      type: DataTypes.TEXT,
    },
    size: {
      type: DataTypes.STRING(30),
    },
    sold: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'product',
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
  db.Product.belongsToMany(db.User, { through: 'Cart' });
  db.Product.belongsToMany(db.User, { through: 'WishList' });
};
export default Product;
