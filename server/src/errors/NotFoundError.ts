import { CustomError } from './CustomError';

export class NotFoundError extends CustomError {
    reason = "Resource can not be found";
    statusCode = 404;

    constructor(message?: string) {
        super(message ? message : 'Resource can not be found');
        Object.setPrototypeOf(this, NotFoundError.prototype);

        if(message) this.reason = message;
    }

    SerializeErrors() {
        return [
            {
                message: this.reason
            }
        ]
    }
}