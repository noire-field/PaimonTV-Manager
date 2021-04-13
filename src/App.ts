import express from 'express';
require('express-async-errors');

import { json } from 'body-parser';

import { ErrorHandler } from './middlewares/ErrorHandler';
import { NotFoundError } from './errors/NotFoundError';

const app = express();
app.set('trust proxy', true);

app.use(json());


app.all('*', () => { throw new NotFoundError }); 
app.use(ErrorHandler);

export default app;