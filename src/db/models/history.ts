import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import { sequelize } from './sequelize';

class History extends Model {
  public readonly id!: number;

  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

History.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'History',
    tableName: 'history',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associate = (db: DbType): void => {
  db.History.belongsTo(db.Product);
  db.History.belongsTo(db.User);
  db.History.hasOne(db.Payment);
};

export default History;
