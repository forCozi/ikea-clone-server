import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import { sequelize } from './sequelize';

class ReviewImage extends Model {
  public readonly id!: number;

  public src!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ReviewImage.init(
  {
    src: {
      type: DataTypes.STRING(256),
    },
  },
  {
    sequelize,
    modelName: 'ReviewImage',
    tableName: 'REVIEW_IMAGE',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associate = (db: DbType): void => {
  db.ReviewImage.belongsTo(db.Review);
};

export default ReviewImage;
