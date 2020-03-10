import * as path from 'path';
import * as bodyParser from 'body-parser';

import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';

import { Helmet } from 'main/modules/helmet';
import { RouterFinder } from 'router/routerFinder';
import { HTTPError } from 'main/HttpError';
import { Nunjucks } from 'main/modules/nunjucks';
import { I18Next } from 'main/modules/i18n';
import { AdoptionApplication } from 'case/index';

const config = require('config');
const { Logger } = require('@hmcts/nodejs-logging');

const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';

export const app = express();
app.locals.ENV = env;

const i18next = I18Next.enableFor(app);
const logger = Logger.getLogger('app');

new Nunjucks(developmentMode, i18next)
  .enableFor(app);
// secure the application by adding various HTTP headers to its responses
new Helmet(config.get('security')).enableFor(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, '/public/img/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

new AdoptionApplication().enableFor(app);

app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')));

// returning "not found" page for requests with paths not resolved by the router
app.use((req, res) => {
  res.status(404);
  res.render('not-found');
});

// error handler
app.use((err: HTTPError, req: express.Request, res: express.Response) => {
  logger.error(`${err.stack || err}`);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = env === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});
