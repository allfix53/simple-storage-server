import express from 'express';
import initializeDb from './db';
import config from './config.json';
import http from 'http';
import routes from './routes';

const app = express();
app.server = http.createServer(app);

const allowCrossDomain = function(req, res, next) {
    if ('OPTIONS' == req.method) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, accesskey, secretkey');
      res.send(200);
    }
    else {
      next();
    }
};

// connect to db
initializeDb(db => {
  app.use(allowCrossDomain);
  // internal middleware
  app.use(routes({
    config,
    db
  }));
  app.set('view engine', 'pug');
  app.server.listen(process.env.PORT || config.port);

  console.log(`Started on port ${app.server.address().port}`);
});

export default app;
