import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../db/models/user';

export default (): void => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ where: { email } });
          if (!user)
            return done(null, false, {
              message: '존재하지 않는 이메일입니다.',
            });
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, false, {
              message: '비밀번호가 올바르지 않습니다.',
            });
          }

          return done(null, user);
        } catch (e) {
          console.error(e);
          done(e);
        }
      }
    )
  );
};
