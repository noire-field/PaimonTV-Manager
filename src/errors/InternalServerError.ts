import { CustomError } from './CustomError';

export class InternalServerError extends CustomError {
    statusCode = 500;

    constructor(public reason: string) {
        super(reason);

        // Only when extending a built-in class
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }

    SerializeErrors() {
        return [{ message: this.reason }]
    }
}