import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

class HFCategory extends Model {
  public readonly id!: number;

  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HFCategory.init(
  {
    name: {
      type: DataTypes.STRING(32),
    },
  },
  {
    sequelize,
    modelName: 'HFCategory',
    tableName: 'hfCategory',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associate = (db: DbType): void => {
  db.HFCategory.belongsTo(db.HomeFurnishing);
};
export default HFCategory;
