import 'dotenv/config';
import app from './app';

app.listen(process.env.PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`Listen on ${process.env.PORT}`)
);
