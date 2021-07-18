import express from 'express';
import expressSession, { CookieOptions } from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv-flow';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import path from 'path';
import passport from 'passport';

import passportConfig from './passport';
import { sequelize } from './db/models';
import router from './routes';

const test = process.env.NODE_ENV === 'test';
const prod = process.env.NODE_ENV === 'production';

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

let CookieConf: CookieOptions;
if (prod) {
  morgan('combined');
  app.use(helmet());
  app.use(hpp());
  app.use(
    cors({
      origin: [
        'http://localhost:3000',
        'https://www.wikea.site',
        'https://wikea.site',
        'https://wikea.netlify.app',
      ],
      credentials: true,
    })
  );
  CookieConf = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    domain: '.wikea.site',
  };
} else {
  morgan('dev');
  app.use(cors({ origin: true, credentials: true }));
  CookieConf = {
    httpOnly: true,
    secure: false,
    path: '/',
    domain: undefined,
  };
}
app.use('/u/r', express.static(path.join(__dirname, 'uploads/reviews')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_KEY));
app.set('trust proxy', 1);
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_KEY as string,
    proxy: true,
    cookie: CookieConf,
    name: 'develuth',
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
  res.send('이케아 클론 프로젝트 백앤드 서버');
});

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`${PORT}번 포트에서 서버실행`);
});

export default app;
