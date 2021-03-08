import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Youch from 'youch';
import 'express-async-errors';
import helmet from 'helmet';

import routes from './routes';

import './database';

const app = express();
// Make server recognize the requests as JSON objects
app.use(express.json());

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

// Express exception handler
app.use(async (err, req, res, _next) => {
  if (process.env.NODE_ENV === 'development') {
    const errors = await new Youch(err, req).toJSON();
    return res.status(500).json(errors);
  }

  return res.status(500);
});

export default app;
