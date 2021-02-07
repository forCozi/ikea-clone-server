import dotenv from 'dotenv-flow';

dotenv.config();

type ConfigType = {
  username: string;
  password: string;
  database: string;
  host: string;
  [key: string]: string | boolean;
};
interface IConfigGroup {
  development: ConfigType;
  test: ConfigType;
  production: ConfigType;
}
const config: IConfigGroup = {
  development: {
    username: 'ikea',
    password: process.env.DB_PASSWORD as string,
    database: 'ikea_clone',
    host: process.env.DB_HOST as string,
    dialect: 'mysql',
  },
  test: {
    username: 'ikea',
    password: process.env.DB_PASSWORD as string,
    database: 'ikea_clone',
    host: process.env.DB_HOST as string,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: 'ikea',
    password: process.env.DB_PASSWORD as string,
    database: 'ikea_clone',
    host: process.env.DB_HOST as string,
    dialect: 'mysql',
  },
};
export default config;
