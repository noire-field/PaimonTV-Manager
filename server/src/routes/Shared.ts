import express, { Request, Response } from 'express';
import firebase from 'firebase';
import { param } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from '../errors/BadRequestError';
import { InternalServerError } from '../errors/InternalServerError';
import { NotFoundError } from '../errors/NotFoundError';
import { CurrentUser } from '../middlewares/CurrentUser';
import { ValidateRequest } from '../middlewares/ValidateRequest';
import { SharedSeries, SharedEpisode } from './../types/SharedSeries';

const router = express.Router();

// Get a shared series
router.get('/:id', [
    param('id').isString().isLength({ min: 1, max: 64 }).withMessage('Invalid shared id')
], ValidateRequest, async (req: Request, res: Response) => {
    const { id } = req.params;

    // Processing
    try {
        var shared = await firebase.database().ref('shared').child(id).get() as firebase.database.DataSnapshot;
    } catch(e) {
        throw new InternalServerError('Unable to fetch shared series');
    }

    if(!shared.exists()) throw new NotFoundError('This shared series can not be found');

    // @ts-ignore
    var { movie, user } = shared.toJSON();

    try {
        var movieSnapshot = await firebase.database().ref('users').child(`${user}/movies/${movie}`).get() as firebase.database.DataSnapshot;
        if(!movieSnapshot.exists()) throw new Error();
    } catch(e) {
        throw new BadRequestError('This shared series had been removed by the owner');
    }

    var movieData: any = movieSnapshot.toJSON();
    
    var formattedData: SharedSeries = {
        title: movieData.title,
        subTitle: movieData.subTitle,
        year: movieData.year,
        thumbnail: movieData.thumbnail,
        episodes: []
    }

    for(let key in movieData.episodes) {
        let episode = movieData.episodes[key];
        formattedData.episodes.push({
            id: key,
            title: episode.title,
            url: episode.url,
            duration: episode.duration
        });
    }

    formattedData.episodes.sort((a: SharedEpisode, b: SharedEpisode) => { 
        return Number(a.id.substring(2)) - Number(b.id.substring(2))
    });

    res.status(200).send({
        success: true,
        movie: formattedData,
    });
});

export default router;