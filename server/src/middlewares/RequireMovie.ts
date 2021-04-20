import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/BadRequestError';
import firebase from 'firebase';
import { NotAuthorizedError } from '../errors/NotAuthorizedError';
import { NotFoundError } from '../errors/NotFoundError';

declare global {
    namespace Express {
        interface Request {
            movieRef?: firebase.database.Reference;
            movieData: firebase.database.DataSnapshot;
        }
    }
}

export const RequireMovie = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.currentUser || !req.userFirebaseRef)
        throw new NotAuthorizedError();

    const movieId = req.params.movieId || "";

    try {
        var movieRef = req.userFirebaseRef.child('movies').child(movieId);

        const movie = await movieRef.get();
        if(!movie.exists()) throw new NotFoundError('Movie not found');

        req.movieRef = movieRef;
        req.movieData = movie;
    } catch(err) {
        console.log(err);
        throw new BadRequestError('Unable to fetch movie');
    }

    next();
}