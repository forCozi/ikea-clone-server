import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import { sequelize } from './sequelize';

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
      defaultValue: '',
    },
    sizes: {
      type: DataTypes.STRING(256),
      defaultValue: '',
    },
  },
  {
    sequelize,
    modelName: 'HFImage',
    tableName: 'HF_IMAGE',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associate = (db: DbType): void => {
  db.HFImage.hasOne(db.HomeFurnishing);
};
export default HFImage;
