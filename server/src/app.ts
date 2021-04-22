import express from 'express';
require('express-async-errors');

import { json } from 'body-parser';

import AuthRouter from './routes/Auth';
import SeriesRouter from './routes/Series';
import MoviesRouter from './routes/Movies';
import EpisodesRouter from './routes/Episodes';

import { ErrorHandler } from './middlewares/ErrorHandler';
import { NotFoundError } from './errors/NotFoundError';

const app = express();
app.set('trust proxy', true);

app.use(json());

app.use('/api/auth', AuthRouter);
app.use('/api/series', SeriesRouter);
app.use('/api/movies', MoviesRouter);
app.use('/api/movies', EpisodesRouter);

app.all('*', () => { throw new NotFoundError }); 
app.use(ErrorHandler);

export default app;