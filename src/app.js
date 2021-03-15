import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import helmet from 'helmet';

import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

const app = express();

// Monitoring errors
Sentry.init(sentryConfig);

app.use(Sentry.Handlers.requestHandler());

// Make server recognize the requests as JSON objects
app.use(express.json());

// Only allow localhost as origin if is in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: 'http://localhost:3000' }));
} else {
  app.use(
    cors({
      origin: [
        'https://agendamento-risj-hodte.ondigitalocean.app',
        'https://agendamento.risaojose.com.br',
      ],
    })
  );
}

// Helmet helps to secure express apps by setting various HTTP headers
app.use(helmet());

// Routes
app.use(routes);

app.use(Sentry.Handlers.errorHandler());

// Express exception handler
app.use(async (err, req, res, _next) => {
  if (process.env.NODE_ENV === 'development') {
    const errors = await new Youch(err, req).toJSON();
    return res.status(500).json(errors);
  }

  return res.status(500);
});

export default app;
