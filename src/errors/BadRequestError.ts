import { CustomError } from './CustomError';

export class BadRequestError extends CustomError {
    statusCode = 400;

    constructor(public reason: string) {
        super(reason);

        // Only when extending a built-in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    SerializeErrors() {
        return [{ message: this.reason }]
    }
}