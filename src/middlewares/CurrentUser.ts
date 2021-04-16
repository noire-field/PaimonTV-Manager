import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/BadRequestError';
import firebase from 'firebase';

interface IUserPayload {
    id: string,
    email: string
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: IUserPayload;
            userFirebaseRef: firebase.database.Reference;
            headers: {
                JWT: string
            }
        }
    }
}

export const CurrentUser = (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization)
        return next();

    try {
        const token = req.headers.authorization.split(' ')[1];
        const payload = jwt.verify(token as string, process.env.JWT_KEY!) as IUserPayload;
        
        req.currentUser = payload;
        req.userFirebaseRef = firebase.database().ref(`users/${payload!.id}`);
    } catch(err) {
        throw new BadRequestError('Bad authorization token');
    }

    next();
}