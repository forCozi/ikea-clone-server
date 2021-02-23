import express, { NextFunction, Request, Response } from 'express';
import expressSession from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv-flow';
import router from './routes';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import passport from 'passport';
import passportConfig from './passport';
import { sequelize } from './db/models';
import { Error } from 'sequelize/types';

const test = process.env.NODE_ENV === 'test';
const prod = process.env.NODE_ENV === 'production';
console.log('****', process.env.NODE_ENV, '****');
if (!test) {
  dotenv.config();
  sequelize
    .sync({ force: false })
    .then(() => console.log('디비가 연결되었습니다.'))
    .catch(e => console.error(e));
}
const PORT = prod ? process.env.PROD_PORT : test ? 7777 : process.env.DEV_PORT;

const app = express();
passportConfig();

if (prod) {
  morgan('combined');
  app.use(cors({ origin: true, credentials: true }));
} else {
  morgan('dev');
  app.use(cors({ origin: true, credentials: true }));
}
app.use('/u/r', express.static(path.join(__dirname, 'uploads/reviews')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_KEY));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_KEY as string,
    cookie: {
      httpOnly: true,
      secure: false, // https -> true
      domain: prod ? '.wongeun.com' : undefined,
    },
    name: 'rnbck',
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
  res.send('이케아 클론 프로젝트 백앤드 서버');
});

app.use('/api', router);
// app.use('/scrap', insertRouter);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json(err);
});
app.listen(PORT, () => {
  console.log(`${PORT}번 포트에서 서버실행`);
});

export default app;
