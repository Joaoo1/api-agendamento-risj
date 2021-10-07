import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import helmet from 'helmet';

import './database';
import routes from './app/routes';
import sentryConfig from './config/sentry';
import ExceptionHandler from './app/middlewares/ExceptionHandler';
import NotFoundHandler from './app/middlewares/NotFoundHandler';

const app = express();

// Monitoring errors
Sentry.init(sentryConfig);
app.use(Sentry.Handlers.requestHandler());

app.use(express.json());

const isDevelopmentMode = process.env.NODE_ENV === 'development';
const origin = isDevelopmentMode
  ? `http://localhost:${process.env.PORT}`
  : [
      'https://agendamento-risj-hodte.ondigitalocean.app',
      'https://agendamento.risaojose.com.br',
    ];
app.use(cors({ origin }));

// Helmet helps to secure express apps by setting various HTTP headers
app.use(helmet());

app.use(routes);

app.use(Sentry.Handlers.errorHandler());

app.use(NotFoundHandler);

app.use(ExceptionHandler);

export default app;
