import express from 'express';
require('express-async-errors');

import { json } from 'body-parser';

import AuthRouter from './routes/Auth';
import SeriesRouter from './routes/Series';

import { ErrorHandler } from './middlewares/ErrorHandler';
import { NotFoundError } from './errors/NotFoundError';

const app = express();
app.set('trust proxy', true);

app.use(json());

app.use('/auth', AuthRouter);
app.use('/series', SeriesRouter);

app.all('*', () => { throw new NotFoundError }); 
app.use(ErrorHandler);

export default app;