import express, { Request, Response } from 'express';
//import { body } from 'express-validator';
import firebase from 'firebase';
import { CurrentUser } from '../middlewares/CurrentUser';
import { RequireAuth } from './../middlewares/RequireAuth';

const router = express.Router();


router.get('/', CurrentUser, RequireAuth, async (req: Request, res: Response) => {
    var user = req.currentUser;
    var userFirebaseRef = req.userFirebaseRef;

    const data = await userFirebaseRef.get();

    res.status(200).send(data);
});



export default router;