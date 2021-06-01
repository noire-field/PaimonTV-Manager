import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase';
import { InternalServerError } from '../errors/InternalServerError';
import { NotFoundError } from '../errors/NotFoundError';
import { CurrentUser } from '../middlewares/CurrentUser';
import { ValidateRequest } from '../middlewares/ValidateRequest';
import { RequireAuth } from '../middlewares/RequireAuth';

const router = express.Router();

// Get list
router.get('/', CurrentUser, RequireAuth, async (req: Request, res: Response) => {
    var moviesRef = req.userFirebaseRef.child('movies');
    var movies = await moviesRef.get();

    var data: any = [];

    if(movies.exists()) {
        data = movies;
    }

    res.status(200).send({
        success: true,
        movies: data
    });
});

// Add a movie
router.post('/', [
    body('title').isLength({ min: 1, max: 64 }).withMessage('Title must be from 1 to 64 characters'),
    body('subTitle').isLength({ min: 0, max: 64 }).withMessage('Sub title must be from 0 to 64 characters').default(''),
    body('thumbnail').isURL().withMessage('Thumbnail must be an image url'),
    body('year').isLength({ min: 1, max: 32}).withMessage('Year must be from 1 to 32 characters')
],
CurrentUser, RequireAuth, ValidateRequest, 
async (req: Request, res: Response) => {
    const { title, subTitle, thumbnail, year } = req.body;
    const movieId = uuidv4();

    const movieData = {
        title, 
        subTitle, 
        thumbnail, 
        year
    };
    
    try {
        var userFirebaseRef = req.userFirebaseRef;

        await userFirebaseRef.child('movies').child(movieId).set({
            ...movieData,
            createdAt: new Date().getTime()
        });
    } catch(e) {
        console.log(e);
        throw new InternalServerError('Unable to create a movie (Firebase)');
    }

    return res.status(201).send({
        success: true,
        movie: { id: movieId, ...movieData }
    });
});

// Update
router.put('/:id', [
    body('title').isLength({ min: 1, max: 64 }).withMessage('Title must be from 1 to 64 characters'),
    body('subTitle').isLength({ min: 0, max: 64 }).withMessage('Sub title must be from 0 to 64 characters').default(''),
    body('thumbnail').isURL().withMessage('Thumbnail must be an image url'),
    body('year').isLength({ min: 1, max: 32}).withMessage('Year must be from 1 to 32 characters')
],
CurrentUser, RequireAuth, ValidateRequest, 
async (req: Request, res: Response) => {
    const movieId = req.params.id;
    const { title, subTitle, thumbnail, year } = req.body;

    const movieData = {
        title, 
        subTitle, 
        thumbnail, 
        year
    };
    
    var movieRef = req.userFirebaseRef.child('movies').child(movieId);

    const movie = await movieRef.get();
    if(!movie.exists()) throw new NotFoundError();

    await movieRef.update(movieData);

    return res.status(200).send({
        success: true,
        movie: { id: movieId, ...movieData }
    });
});

// Share
router.post('/share/:id', 
CurrentUser, RequireAuth, ValidateRequest, 
async (req: Request, res: Response) => {
    const movieId = req.params.id;
   
    var movieRef = req.userFirebaseRef.child('movies').child(movieId);

    const movie = await movieRef.get();
    if(!movie.exists()) throw new NotFoundError();

    if(movie.child('sharedId').exists()) {
        return res.status(200).send({
            success: true,
            sharedId: movie.child('sharedId').toJSON()
        })
    }

    const sharedId = uuidv4();
    
    await movieRef.update({ sharedId });
    await firebase.database().ref('shared').child(sharedId).set({
        user: req.currentUser?.id,
        movie: movieId
    });

    return res.status(200).send({
        success: true,
        sharedId
    });
});

// Delete
router.delete('/:id', CurrentUser, RequireAuth, async (req: Request, res: Response) => {
    const movieId = req.params.id;
    
    var movieRef = req.userFirebaseRef.child('movies').child(movieId);

    const movie = await movieRef.get();
    if(!movie.exists()) throw new NotFoundError();

    if(movie.hasChild('sharedId')) {
        const movieData: any = movie.toJSON();
        const shared = await firebase.database().ref('shared').child(movieData.sharedId).get()
        if(shared.exists()) await firebase.database().ref('shared').child(movieData.sharedId).set(null);
    }
    
    movieRef.set(null);

    return res.status(200).send({
        success: true
    });
});

export default router;