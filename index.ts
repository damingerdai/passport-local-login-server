import * as dotenv from 'dotenv';
// initialize configuration
dotenv.config();

import * as signature from 'cookie-signature';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import * as http from 'http';
import * as path from 'path';
import { getEnvVars } from './config/envVars';
import { sessionStore } from './middleware/sessionStorage';
import { initPassportMiddleware } from './middleware/passport';

const envVars = getEnvVars();

const app = express();
app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));
app.use(
    session({
        name: 'loginSession',
        secret: envVars.SESSION_SECRET as string,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: envVars.SESSION_TTL ? (envVars.SESSION_TTL as number) * 1000 : 0,
            secure: true
        }
    })
);

app.use(passport.initialize());
//app.use(passport.session());
initPassportMiddleware();

app.use('/static', express.static(path.join(__dirname, 'static')));

const localLogin = (req, res, next) => {
    return passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res
          .status(5000)
          .json({ message: 'inactive user' });
      }

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        const signed =
          's:' + signature.sign(req.sessionID, envVars.SESSION_SECRET);
  
        const session = info.redirectPath.includes('?')
          ? `&param=${signed}`
          : `?param=${JSON.stringify({
              signed,
              id: user.id,
            })}`;
        // res.redirect(`${info.redirectPath}${session}`);
        res
        .status(200)
        .json({ url: `${info.redirectPath}${session}` });
      });
    })(req, res, next);
};

app.post('/localLogin', localLogin)



app.get('/session', (req, res, next) => {
    console.log(`Session: ${JSON.stringify(req.session)}`);
    console.log(`Session ID: ${JSON.stringify(req.sessionID)}`);

    res.status(200).json({
        id: req.sessionID,
        session: req.session,
    })
});

const server = http.createServer(app);

const instance = server.listen('8080', () => {
    console.log('oauth2 mock login server is now running on http://localhost:8080');
});

instance.setTimeout(3 * 60 * 60 * 1000);


