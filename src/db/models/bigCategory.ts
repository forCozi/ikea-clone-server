import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

class BCatecory extends Model {
  public readonly id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BCatecory.init(
  {
    name: {
      type: DataTypes.STRING(32),
    },
  },
  {
    sequelize,
    modelName: 'BCategory',
    tableName: 'bCategory',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associate = (db: DbType): void => {
  db.BCatecory.hasMany(db.SCatecory);
  db.BCatecory.hasMany(db.Product);
};

export default BCatecory;
