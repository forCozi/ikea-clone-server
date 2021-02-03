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
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'payment',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associate = (db: DbType): void => {
  db.Payment.belongsTo(db.History);
};
export default Payment;
