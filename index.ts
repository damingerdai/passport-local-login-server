import express from 'express';
import * as http from 'http';

const app = express();
const server = http.createServer(app);

const instance = server.listen('8080', () => {
  console.log('oauth2 mock login server is now running on http://localhost:8080');
});

instance.setTimeout(3 * 60 * 60 * 1000);
