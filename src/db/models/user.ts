import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import { sequelize } from './sequelize';

class User extends Model {
  public readonly id!: number;
  public email!: string;
  public password!: string;
  public name!: string;
  public bitrh!: string;
  public phone!: string;
  public address!: string;
  public gender!: string;
  public token!: string;
  public valid!: boolean;
  public verification!: string;
  public loginType!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    email: {
      type: DataTypes.STRING(30),
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
    },
    name: {
      type: DataTypes.STRING(30),
    },
    birth: {
      type: DataTypes.STRING(15),
    },
    phone: {
      type: DataTypes.STRING(14),
    },
    address: {
      type: DataTypes.STRING(100),
    },
    gender: {
      type: DataTypes.TINYINT,
    },
    token: {
      type: DataTypes.STRING(100),
    },
    valid: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    verification: {
      type: DataTypes.STRING(30),
    },
    loginType: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'user',
    modelName: 'User',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: DbType): void => {
  db.User.hasMany(db.History);
  db.User.hasMany(db.Review);
  db.User.belongsToMany(db.Product, { through: 'Cart' });
  db.User.belongsToMany(db.Product, { through: 'WishList' });
};
export default User;