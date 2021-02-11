import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import { sequelize } from './sequelize';

class HFProduct extends Model {
  public readonly id!: number;

  public top!: string;
  public left!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HFProduct.init(
  {
    top: {
      type: DataTypes.STRING(32),
    },
    left: {
      type: DataTypes.STRING(32),
    },
  },
  {
    sequelize,
    modelName: 'HFProduct',
    tableName: 'HF_PRODUCT',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associate = (db: DbType): void => {
  db.HFProduct.belongsTo(db.HomeFurnishing);
  db.HFProduct.belongsTo(db.Product);
};
export default HFProduct;
