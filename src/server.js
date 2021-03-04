import 'dotenv/config';
import app from './app';

app.listen(process.env.PORT, () =>
  console.log(`Listen on ${process.env.PORT}`)
);
