import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

class HFImage extends Model {
  public readonly id!: number;

  public src!: string;
  public srcSet!: string;
  public sizes!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
HFImage.init(
  {
    src: { type: DataTypes.STRING(128) },
    srcSet: {
      type: DataTypes.TEXT,
    },
    sizes: {
      type: DataTypes.STRING(256),
    },
  },
  {
    sequelize,
    modelName: 'HFImage',
    tableName: 'hFImage',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associate = (db: DbType): void => {
  db.HFImage.belongsTo(db.HomeFurnishing);
};
export default HFImage;
