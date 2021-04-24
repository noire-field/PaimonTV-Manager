import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { InternalServerError } from '../errors/InternalServerError';
import { NotFoundError } from '../errors/NotFoundError';
import { CurrentUser } from '../middlewares/CurrentUser';
import { ValidateRequest } from '../middlewares/ValidateRequest';
import { RequireAuth } from '../middlewares/RequireAuth';
import { RequireMovie } from '../middlewares/RequireMovie';
import { BadRequestError } from '../errors/BadRequestError';

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
    body('id').isNumeric().isFloat({ min: 1, max: 999 }).withMessage('Id must be from 1 to 999'),
    body('title').isLength({ min: 1, max: 64 }).withMessage('Title must be from 1 to 64 characters'),
    body('duration').isNumeric().isFloat({ min: 0, max: 99999 }).withMessage('Duration must be a number in second').default(0),
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
    
    const epId = `ep${id}` as keyof typeof episodes;

    // Find if the episode is already there?
    if(episodes[epId]) {
        throw new BadRequestError('This episode id already exists');
    }
    
    // Add it to episode list
    const episodeData = { 
        title,
        duration: Number(duration),
        progress: 0,
        url,
        status: Number(status)
    };

    
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

// Update
router.put('/:movieId/episodes/:episodeId', [
    param('episodeId').isNumeric().isFloat({ min: 1, max: 999 }).withMessage('Id must be from 1 to 999'),
    body('title').isLength({ min: 1, max: 64 }).withMessage('Title must be from 1 to 64 characters'),
    body('duration').isNumeric().isFloat({ min: 0, max: 99999 }).withMessage('Duration must be a number in second').default(0),
    //body('progress').isNumeric().isFloat({ min: -1, max: 99999 }).withMessage('Progress must be a number in second').default(-1),
    body('url').isURL().withMessage('Url must be valid'),
    body('status').isNumeric().isIn([0, 2]).withMessage('Status is invalid')
],
CurrentUser, RequireAuth, RequireMovie, ValidateRequest, 
async (req: Request, res: Response) => {
    const id = req.params.episodeId;
    const { movieData: rawMovieData, movieRef } = req;
    const { title, duration, /*progress, */url, status } = req.body;

    var movieData = rawMovieData.val();
    var episodes = {};

    if(movieData.episodes && Object.keys(movieData.episodes).length > 0) {
        episodes = movieData.episodes;
    }
    
    const epId = `ep${id}` as keyof typeof episodes;
    
    if(!episodes[epId])
        throw new BadRequestError('This episode id does not exist');
    
    // Make the update
    const episodeData = { 
        title,
        duration,
        url,
        status
    };

    // Is this episode in the progressing list?
    // Todo: If yes, block it.

    // Continue
    try {
        await movieRef!.child('episodes').child(epId).set({
            ...episodeData
        });
    } catch(e) {
        console.log(e);
        throw new InternalServerError('Unable to update episode (Firebase)');
    }

    return res.status(200).send({
        success: true,
        movie: { id: epId, ...episodeData }
    });
});

// Delete
router.delete('/:movieId/episodes/:episodeId', [
    param('episodeId').isNumeric().isFloat({ min: 1, max: 999 }).withMessage('Id must be from 1 to 999'),
],
CurrentUser, RequireAuth, RequireMovie, ValidateRequest,
async (req: Request, res: Response) => {
    const id = req.params.episodeId;
    const { movieData: rawMovieData, movieRef } = req;

    var movieData = rawMovieData.val();
    var episodes = {};

    if(movieData.episodes && Object.keys(movieData.episodes).length > 0) {
        episodes = movieData.episodes;
    }
    
    const epId = `ep${id}` as keyof typeof episodes;
    
    if(!episodes[epId])
        throw new BadRequestError('This episode id does not exist');
    
    // Is this episode in the progressing list?
    // Todo: If yes, block it.

    movieRef!.child('episodes').child(epId).set(null);

    return res.status(200).send({
        success: true
    });
});

export default router;