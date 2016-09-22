import express from 'express';
import initializeDb from './db';
import config from './config.json';
import http from 'http';
import routes from './routes';

const app = express();
app.server = http.createServer(app);

// connect to db
initializeDb(db => {

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
