import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

class SCatecory extends Model {
  public readonly id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SCatecory.init(
  {
    name: {
      type: DataTypes.STRING(32),
    },
  },
  {
    sequelize,
    modelName: 'SCategory',
    tableName: 'sCategory',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associate = (db: DbType): void => {
  db.SCatecory.belongsTo(db.BCatecory);
  db.SCatecory.hasMany(db.Product);
};

export default SCatecory;
