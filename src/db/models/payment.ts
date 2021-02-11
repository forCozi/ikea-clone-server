import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import { sequelize } from './sequelize';

class Payment extends Model {
  public readonly id!: number;

  public payerID!: string;
  public paid!: boolean;
  public email!: string;
  public returnUrl!: string;
  public paymentToken!: string;
  public cancelled!: boolean;
  public address!: string;
  public totalPrice!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Payment.init(
  {
    payerID: {
      type: DataTypes.STRING(128),
    },
    paid: {
      type: DataTypes.TINYINT,
    },
    email: {
      type: DataTypes.STRING(64),
    },
    returnUrl: {
      type: DataTypes.STRING(64),
    },
    paymentToken: {
      type: DataTypes.STRING(100),
    },
    cancelled: {
      type: DataTypes.TINYINT,
    },
    address: {
      type: DataTypes.STRING(256),
    },
    totalPrice: {
      type: DataTypes.STRING(24),
    },
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'PAYMENT',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associate = (db: DbType): void => {
  db.Payment.hasMany(db.History);
  db.Payment.belongsTo(db.User);
};
export default Payment;
