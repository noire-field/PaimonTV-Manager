import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { InternalServerError } from '../errors/InternalServerError';
import { NotFoundError } from '../errors/NotFoundError';
import { CurrentUser } from '../middlewares/CurrentUser';
import { ValidateRequest } from '../middlewares/ValidateRequest';
import { RequireAuth } from '../middlewares/RequireAuth';
import { RequireMovie } from '../middlewares/RequireMovie';

const router = express.Router();

// Get list
router.get('/:movieId/episodes', CurrentUser, RequireAuth, RequireMovie, async (req: Request, res: Response) => {
    var { movieData: rawMovieData } = req;

    var data: any = [];
    var movieData = rawMovieData.val();

    if(movieData.episodes && Object.keys(movieData.episodes).length > 0) {
        data = movieData.episodes;
    }

    res.status(200).send({
        success: true,
        episodes: data
    });
});

// Add an episode
router.post('/:movieId/episodes', [
    body('id').isNumeric().isLength({ min: 1, max: 999 }).withMessage('Id must be from 1 to 999'),
    body('title').isLength({ min: 1, max: 64 }).withMessage('Title must be from 1 to 64 characters'),
    body('duration').isNumeric().isLength({ min: 0, max: 99999 }).withMessage('Duration must be a number in second').default(0),
    body('url').isURL().withMessage('Url must be valid'),
    body('status').isNumeric().isIn([0, 2]).withMessage('Status is invalid')
],
CurrentUser, RequireAuth, RequireMovie, ValidateRequest, 
async (req: Request, res: Response) => {
    const { movieData: rawMovieData, movieRef } = req;
    const { id, title, duration, url, status } = req.body;

    var movieData = rawMovieData.val();
    var episodes = {};

    if(movieData.episodes && Object.keys(movieData.episodes).length > 0) {
        episodes = movieData.episodes;
    }
    
    // Find if the episode is already there?
    
    // Add it to episode list
    const episodeData = { 
        title,
        duration,
        progress: 0,
        url,
        status
    };

    const epId = `ep${id}`;

    try {
        await movieRef!.child('episodes').child(epId).set({
            ...episodeData
        });
    } catch(e) {
        console.log(e);
        throw new InternalServerError('Unable to add episode (Firebase)');
    }

    return res.status(201).send({
        success: true,
        movie: { id: epId, ...episodeData }
    });
});

/*
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

// Delete
router.delete('/:id', CurrentUser, RequireAuth, async (req: Request, res: Response) => {
    const movieId = req.params.id;
    
    var movieRef = req.userFirebaseRef.child('movies').child(movieId);

    const movie = await movieRef.get();
    if(!movie.exists()) throw new NotFoundError();

    movieRef.set(null);

    return res.status(200).send({
        success: true
    });
});*/

export default router;