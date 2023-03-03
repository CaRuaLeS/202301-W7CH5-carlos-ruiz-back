import express from 'express';
import createDebug from 'debug';
import morgan from 'morgan';
import cors from 'cors';

export const app = express();
app.disable('x-powered-by');

// Const debug = createDebug('Fruits');
const corsOptions = {
  origin: '*',
};
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (_req, resp) => {
  resp.json({
    info: '/Esta es una prueba',
    endpoints: {},
  });
});
