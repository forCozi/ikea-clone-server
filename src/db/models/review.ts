import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

class Review extends Model {
  public readonly id!: number;

  public title!: string;
  public content!: string;
  public grade!: number;
  public recommend!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Review.init(
  {
    title: {
      type: DataTypes.STRING(128),
    },
    content: {
      type: DataTypes.TEXT,
    },
    grade: {
      type: DataTypes.FLOAT,
    },
    recommend: {
      type: DataTypes.TINYINT,
    },
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'review',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associate = (db: DbType): void => {
  db.Review.belongsTo(db.Product);
  db.Review.belongsTo(db.User);
};

export default Review;
