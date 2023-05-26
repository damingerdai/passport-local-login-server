import passport from 'passport';
import LocalStrategy from 'passport-local';

export const localStrategy = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, (username, password, done) => {
  if (username === 'admin' && password === '12345') {
    return done(null, { username, password }, { redirectPath: '/static/index.html' });
  } else {
    return done(null, false, { message: 'Incorrect username.' });
  }
});

export const initPassportMiddleware = () => {
  passport.use('local', localStrategy);
  passport.serializeUser((user, callback) => {
    callback(null, user)
  });
  passport.deserializeUser((user, callback) => {
    callback(null, user as any)
  });
};
