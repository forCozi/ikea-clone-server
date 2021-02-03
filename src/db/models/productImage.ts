import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import { sequelize } from './sequelize';

class ProdImage extends Model {
  public readonly id!: number;

  public src!: string;
  public srcSet!: string;
  public info!: string;
  public sizes!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProdImage.init(
  {
    src: {
      type: DataTypes.STRING(128),
    },
    info: {
      type: DataTypes.STRING(128),
    },
    srcSet: {
      type: DataTypes.TEXT,
    },
    sizes: {
      type: DataTypes.STRING(256),
    },
  },
  {
    sequelize,
    modelName: 'ProdImage',
    tableName: 'prodImage',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: DbType): void => {
  db.ProdImage.belongsTo(db.Product);
};
export default ProdImage;
