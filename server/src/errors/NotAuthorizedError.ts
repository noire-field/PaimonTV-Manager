import { CustomError } from './CustomError';

export class NotAuthorizedError extends CustomError {
    message = "Not authorized";
    statusCode = 401;

    constructor(message?: string) {
        super(message ? message : 'Not authorized');
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);

        if(message) this.message = message;
    } 

    SerializeErrors() {
        return [
            { message: this.message }
        ]
    }
}