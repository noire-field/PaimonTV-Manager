import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from '../errors/BadRequestError';
import { InternalServerError } from '../errors/InternalServerError';
import { NotFoundError } from '../errors/NotFoundError';
import { CurrentUser } from '../middlewares/CurrentUser';
import { ValidateRequest } from '../middlewares/ValidateRequest';
import { RequireAuth } from './../middlewares/RequireAuth';

const router = express.Router();

// Get list
router.get('/', CurrentUser, RequireAuth, async (req: Request, res: Response) => {
    var firebaseRef = req.userFirebaseRef;

    var seriesRef = await firebaseRef.child('series').get();
    var myListRef = await firebaseRef.child('myList').get();

    var series: any = {};
    var myList: any = {};

    if(seriesRef.exists()) series = seriesRef.val();
    if(myListRef.exists()) myList = myListRef.val();
    
    res.status(200).send({
        success: true,
        series,
        myList
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

// Add a series
router.post('/:seriesId/movies', [
    param('seriesId').not().isEmpty().withMessage('Series ID is invalid'),
    body('movieId').not().isEmpty().withMessage('Movie ID is invalid')
],
CurrentUser, RequireAuth, ValidateRequest, 
async (req: Request, res: Response) => {
    const { seriesId } = req.params;
    const { movieId } = req.body;

    var userFirebaseRef = req.userFirebaseRef;

    var movieRef = await userFirebaseRef.child(`movies/${movieId}`).get();
    if(!movieRef.exists())
        throw new NotFoundError("Unable to find this movie");

    if(seriesId != 'my-list') {
        var seriesRef = await userFirebaseRef.child(`series/${seriesId}`).get();
        
        if(!seriesRef.exists() || !movieRef.exists())
            throw new NotFoundError("Unable to find this series");
        if(seriesRef.child('movies').hasChild(movieId))
            throw new BadRequestError('This movie is already in the series');
            
        await userFirebaseRef.child(`series/${seriesId}/movies/${movieId}`).set(new Date().getTime());
    } else {
        var myListRef = await userFirebaseRef.child(`myList`).get();
        if(myListRef.hasChild(movieId))
            throw new BadRequestError('This movie is already in your list');

        await userFirebaseRef.child(`myList/${movieId}`).set(new Date().getTime());
    }

    return res.status(201).send({
        success: true,
        added: {
            seriesId,
            movieId
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

router.delete('/:seriesId/movies/:movieId', [
    param('seriesId').not().isEmpty().withMessage('Series ID is invalid'),
    param('movieId').not().isEmpty().withMessage('Movie ID is invalid')
],
CurrentUser, RequireAuth, ValidateRequest, 
async (req: Request, res: Response) => {
    const { seriesId } = req.params;
    const { movieId } = req.params;

    var userFirebaseRef = req.userFirebaseRef;

    var movieRef = await userFirebaseRef.child(`movies/${movieId}`).get();
    if(!movieRef.exists())
        throw new NotFoundError("Unable to find this movie");

    if(seriesId != 'my-list') {
        var seriesRef = await userFirebaseRef.child(`series/${seriesId}`).get();
        
        if(!seriesRef.exists() || !movieRef.exists())
            throw new NotFoundError("Unable to find this series");
        if(!seriesRef.child('movies').hasChild(movieId))
            throw new BadRequestError('This movie is not in the series');
            
        await userFirebaseRef.child(`series/${seriesId}/movies/${movieId}`).set(null);
    } else {
        var myListRef = await userFirebaseRef.child(`myList`).get();
        if(!myListRef.hasChild(movieId))
            throw new BadRequestError('This movie is not in your list');

        await userFirebaseRef.child(`myList/${movieId}`).set(null);
    }

    return res.status(200).send({
        success: true
    });
});

export default router;