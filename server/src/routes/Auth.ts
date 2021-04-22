import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { BadRequestError } from '../errors/BadRequestError';
import { ValidateRequest } from './../middlewares/ValidateRequest'

const router = express.Router();

router.post('/verify-token', [
    body('token').notEmpty().withMessage('Token must be valid'),
], ValidateRequest, async (req: Request, res: Response) => {
    const { token } = req.body;

    const verification = jwt.verify(token, process.env.JWT_KEY!);

    return res.status(200).send({
        success: true,
        user: verification
    })
});

router.post('/sign-in', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password must be valid')
], ValidateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const definedEmail = process.env.APP_AUTH_EMAIL;
    const definedPass = process.env.APP_AUTH_PASS;

    // I'm sorry but this application is made for myself for now so, this way is the best :)
    if(definedEmail !== email || definedPass !== password) 
        throw new BadRequestError('Email or password does not match our record.');

    const userId = Buffer.from(email).toString('base64');
    
    var token = jwt.sign({ 
        id: userId,
        email
    }, process.env.JWT_KEY!);

    return res.status(200).send({
        success: true,
        user: {
            id: userId,
            email,
            token
        }
    })
});



export default router;