import { CustomError } from './CustomError';

export class NotFoundError extends CustomError {
    reason = "Route not found";
    statusCode = 404;

    constructor() {
        super('Route not found');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    SerializeErrors() {
        return [
            {
                message: this.reason
            }
        ]
    }
}