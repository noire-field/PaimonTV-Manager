import { ValidationError } from 'express-validator';
import { CustomError } from './CustomError';

export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters');

        // Only when extending a built-in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    SerializeErrors() {
        return this.errors.map((error) => {
            return { message: error.msg, field: error.param };
        })
    }
}