import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';

import { CurrentUser } from '../middlewares/CurrentUser';
import { ValidateRequest } from '../middlewares/ValidateRequest';
import { RequireAuth } from '../middlewares/RequireAuth';
import { RequireMovie } from '../middlewares/RequireMovie';

import { BadRequestError } from '../errors/BadRequestError';
import { InternalServerError } from '../errors/InternalServerError';

import { queue } from './../services/Queue';

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
    const { movieId } = req.params;

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

    if(episodeData.status == 0) { // Put into queue
        queue.Add({
            userId: req.currentUser!.id,
            movieId,
            episodeId: epId,
            status: 0
        })
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
    const movieId = req.params.movieId;
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
    
    const episode = episodes[epId];
    
    // Make the update
    const episodeData = { 
        title,
        duration,
        url,
        status: Number(status)
    };

    // @ts-ignore
    if(episode.status == 1)
        throw new BadRequestError('This episode is being processed');

    // Continue
    try {
        await movieRef!.child('episodes').child(epId).set({
            ...episodeData
        });
    } catch(e) {
        console.log(e);
        throw new InternalServerError('Unable to update episode (Firebase)');
    }

    // @ts-ignore
    if(episodeData.status == 0 && episode.status != 0) { // Need processing and was not in queue already
        queue.Add({
            userId: req.currentUser!.id,
            movieId,
            episodeId: epId,
            status: 0
        })
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

    const episode = episodes[epId];
    
    // @ts-ignore
    if(episode.status == 1)
        throw new BadRequestError('This episode is being processed');
        
    movieRef!.child('episodes').child(epId).set(null);

    return res.status(200).send({
        success: true
    });
});

export default router;