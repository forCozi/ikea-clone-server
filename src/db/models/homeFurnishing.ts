import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import { sequelize } from './sequelize';

class HomeFurnishing extends Model {
  public readonly id!: number;

  public info!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HomeFurnishing.init(
  {
    info: {
      type: DataTypes.STRING(512),
    },
  },
  {
    sequelize,
    modelName: 'HomeFurnishing',
    tableName: 'homeFurnishing',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associate = (db: DbType): void => {
  db.HomeFurnishing.belongsTo(db.HFCategory);
  db.HomeFurnishing.belongsTo(db.HFImage);
  db.HomeFurnishing.hasMany(db.HFProduct);
};
export default HomeFurnishing;
