import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { InternalServerError } from '../errors/InternalServerError';
import { NotFoundError } from '../errors/NotFoundError';
import { CurrentUser } from '../middlewares/CurrentUser';
import { ValidateRequest } from '../middlewares/ValidateRequest';
import { RequireAuth } from './../middlewares/RequireAuth';

const router = express.Router();

// Get list
router.get('/', CurrentUser, RequireAuth, async (req: Request, res: Response) => {
    var seriesRef = req.userFirebaseRef.child('series');
    var series = await seriesRef.get();

    var data: any = [];

    if(series.exists()) {
        data = series;
    }
    
    res.status(200).send({
        success: true,
        series: data
    });
});

export default router;