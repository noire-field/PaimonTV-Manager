import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError';
import { JsonWebTokenError } from 'jsonwebtoken';

export const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof CustomError)
        return res.status(err.statusCode).send({ 
            success: false,
            errors: err.SerializeErrors() 
        });
    if(err instanceof SyntaxError) {
        return res.status(400).send({ 
            success: false,
            errors: [{
                message: "Bad Request (SyntaxError)"
            }]
        });
    }
    if(err instanceof JsonWebTokenError) {
        return res.status(400).send({ 
            success: false,
            errors: [{
                message: "Invalid token"
            }]
        });
    }
        
    console.log("Unexpected error");
    console.log(err);

    res.status(400).send({
        success: false,
        errors: [
            {
                message: "Something went wrong"
            }
        ]
    });
}