import express, { urlencoded } from 'express';
import expressSession from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv-flow';
import router from './routes';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();
const prod = process.env.NODE_ENV === 'production';
const PORT = prod ? process.env.PROD_PORT : process.env.DEV_PORT;

const app = express();

if (prod) {
  morgan('combined');
  app.use(cors({ origin: '도메인', credentials: true }));
} else {
  morgan('dev');
  app.use(cors({ origin: true, credentials: true }));
}
app.use(express.json());
app.use(urlencoded({ extended: true }));
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

app.use('/', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
  res.send('이케아 클론 프로젝트 백앤드 서버');
});

app.use('/api', router);
app.listen(PORT, () => {
  console.log(`${PORT}번 포트에서 서버실행`);
});
