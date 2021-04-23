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

// Add a series
router.post('/', [
    body('title').isLength({ min: 1, max: 64 })
],
CurrentUser, RequireAuth, ValidateRequest, 
async (req: Request, res: Response) => {
    const { title } = req.body;
    const seriesId = uuidv4();
    
    try {
        var userFirebaseRef = req.userFirebaseRef;

        await userFirebaseRef.child('series').child(seriesId).set({
            title,
            createdAt: new Date().getTime()
        });
    } catch(e) {
        throw new InternalServerError('Unable to create a series (Firebase)');
    }

    return res.status(201).send({
        success: true,
        series: {
            id: seriesId,
            title
        }
    });
});

// Update
router.put('/:id', [
    body('title').isLength({ min: 1, max: 64 })
],
CurrentUser, RequireAuth, ValidateRequest, 
async (req: Request, res: Response) => {
    const seriesId = req.params.id;
    const { title } = req.body;
    
    var seriesRef = req.userFirebaseRef.child('series').child(seriesId);

    const series = await seriesRef.get();
    if(!series.exists()) throw new NotFoundError();

    await seriesRef.update({ title });

    return res.status(200).send({
        success: true,
        series: {
            id: seriesId,
            title
        }
    });
});

// Delete
router.delete('/:id', CurrentUser, RequireAuth, async (req: Request, res: Response) => {
    const seriesId = req.params.id;
    
    var seriesRef = req.userFirebaseRef.child('series').child(seriesId);

    const series = await seriesRef.get();
    if(!series.exists()) throw new NotFoundError();

    seriesRef.set(null);

    return res.status(200).send({
        success: true
    });
});

export default router;