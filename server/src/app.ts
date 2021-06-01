import express from 'express';
require('express-async-errors');
import https from 'https';

import { json } from 'body-parser';

import AuthRouter from './routes/Auth';
import SeriesRouter from './routes/Series';
import MoviesRouter from './routes/Movies';
import EpisodesRouter from './routes/Episodes';
import QueueRouter from './routes/Queue';
import LogsRouter from './routes/Logs';
import SharedRouter from './routes/Shared';

import { ErrorHandler } from './middlewares/ErrorHandler';
import { NotFoundError } from './errors/NotFoundError';
import { NotAuthorizedError } from './errors/NotAuthorizedError';

import cors from 'cors';
import fs from 'fs';


const app = express();

app.set('trust proxy', true);
app.use(json());

const corsAllowed = process.env.CORS_ALLOW;
const corsOptions = {
    origin: (origin: any, callback: any) => {
        if(corsAllowed === '*') 
            return callback(null, true);
        
        const whitelist = corsAllowed?.split(';');
        if (whitelist!.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new NotAuthorizedError('Your domain is not allowed to perform request'))
        }
    }
}
app.use(cors(corsOptions));

app.use('*/api/auth', AuthRouter);
app.use('*/api/series', SeriesRouter);
app.use('*/api/movies', MoviesRouter);
app.use('*/api/movies', EpisodesRouter);
app.use('*/api/queue', QueueRouter);
app.use('*/api/logs', LogsRouter);
app.use('*/api/shared', SharedRouter);

app.all('*', () => { throw new NotFoundError }); 
app.use(ErrorHandler);

const useSSL = process.env.USE_SSL === 'true';

var sslServer;
if(useSSL) {
    sslServer = https.createServer({
        key: fs.readFileSync(process.env.SSL_KEY!),
        cert: fs.readFileSync(process.env.SSL_CERT!)
    }, app)

    console.log("SSL is enabled");
} else {
    console.log("SSL is disabled");
}

export default useSSL ? sslServer : app;